/* Histoires — childhood, home and school */
(function (root) {
  'use strict';
  var YN = root.YN, S = YN.addStory;
  function EN(t) { return { t: t, lang: 'en' }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }   // South Korean + English translation

  /* ---------------------------------------------------------------- FETCH */

  S({
    id: 'st_hm_01', kind: 'fetch',
    where: { themes: ['school', 'nature'], depth: [1, 2] },
    who: { name: 'The Boy Standing in His Socks', look: { t: 'kid', c: ['#3a4a6a', '#d8d8d8', '#e8c8a8'] }, lang: 'en' },
    intro: [
      'A boy stands very still on wet grass, in grey socks gone dark at the toes.',
      EN('Don’t look at my feet. Look at my face. My face is completely normal.'),
      EN('They threw my shoes. One went that way and one went the other way. They’re really good throwers.'),
      EN('If I go home in socks I’ll have to explain. I’m rubbish at explaining.')
    ],
    again: [EN('Still here. I’m standing on one foot, so only one sock gets wet at a time.')],
    fetch: {
      items: [
        { name: 'a small left shoe with a name written inside', look: 'shoe', color: '#e8e4d8' },
        { name: 'a small right shoe, its lace pulled into a knot', look: 'shoe', color: '#e8e4d8' }
      ],
      found: ['She picks up the shoe. Someone has trodden the heel flat, but it is still, mostly, a shoe.'],
      partial: [EN('One! That’s half of going home.'), EN('I can hop the rest. Not all the way. But a lot of the way.')],
      done: [
        'He pushes his feet in without undoing the laces, squashing the backs down.',
        EN('There. Now nobody has to know anything.'),
        EN('If they throw them again, I’ll look where you found them. That must be where shoes like to go.')
      ]
    },
    reward: 'coin',
    lore: ['Inside the left shoe, in a grown-up hand: his name, and a phone number with the last digit rubbed away.']
  });

  S({
    id: 'st_hm_02', kind: 'fetch',
    where: { themes: ['school', 'home'], depth: [1, 3] },
    who: { name: 'The Girl with a Roll of Tape', look: { t: 'kid', c: ['#c05a7a', '#f0e0a0', '#f0d0b8'] }, lang: 'en' },
    intro: [
      'A girl kneels over a sheet of paper taped together so many times that it shines like a window.',
      EN('It’s my drawing. It keeps getting torn. I keep getting it back. We’re both very stubborn.'),
      EN('Three bits are missing this time. Someone posted them all over the place, like letters.')
    ],
    again: [EN('I’ve got loads of tape. Tape was never the problem.')],
    fetch: {
      items: [
        { name: 'a torn corner with a yellow sun on it', look: 'drawing', color: '#f0d040' },
        { name: 'a torn strip showing half a red house', look: 'drawing', color: '#c04040' },
        { name: 'a torn scrap with a dog that looks a bit like a horse', look: 'drawing', color: '#8a6a4a' }
      ],
      found: ['She smooths the scrap flat against her knee. The crayon was pressed on so hard it has gone glossy.'],
      partial: [
        EN('That’s one. I know exactly where it goes. I always know where they go.'),
        EN('Nearly. It looks worse with one bit missing than with three. That’s just how it is.')
      ],
      done: [
        'The girl tapes in the last piece. The drawing is now more tape than paper, and it crackles when it moves.',
        EN('There. That’s our house, that’s the sun, and that’s our dog. He’s not real yet. He’s for next year.'),
        EN('You can hold it. Hold it like it’s already been torn. Because it has.')
      ]
    },
    reward: 'page',
    lore: ['On the back, someone has written a mean word in pen. Someone smaller has turned every letter into a flower.']
  });

  S({
    id: 'st_hm_03', kind: 'fetch',
    where: { themes: ['home', 'korea', 'city'], depth: [1, 3] },
    who: { name: 'The Boy Who Reads the Fridge', look: { t: 'kid', c: ['#4a5a4a', '#f0f0e0', '#e8c8a0'] }, lang: 'ko-s' },
    intro: [
      'A boy in school uniform stands before a fridge covered in small yellow notes, reading them like the news.',
      KS('엄마는 밤에 일해. 그래서 우리는 쪽지로 얘기해.', 'Mum works nights. So we talk in notes.'),
      KS('창문 열어 놨더니 오늘 거 세 장이 날아갔어. 아직 못 읽었는데.', 'I left the window open and today’s three blew away. I hadn’t read them yet.')
    ],
    again: [KS('냉장고가 좀 허전해 보이지? 쪽지 없으면 그냥 냉장고야.', 'The fridge looks a bit bare, doesn’t it? Without notes it’s just a fridge.')],
    fetch: {
      items: [
        { name: 'a yellow note that has landed in a puddle', look: 'letter', color: '#f0e070' },
        { name: 'a yellow note stuck to the sole of a shoe', look: 'letter', color: '#f0e070' },
        { name: 'a tiny yellow note, folded twice', look: 'letter', color: '#f0d850' }
      ],
      found: ['She peels the note free. The handwriting slopes downhill, as if it was written standing up, in a hurry.'],
      partial: [
        KS('엄마 글씨다. 멀리서 봐도 알아.', 'That’s Mum’s writing. I’d know it from miles away.'),
        KS('마지막 건 보통 제일 짧아. 제일 중요하고.', 'The last one’s usually the shortest. And the most important.')
      ],
      done: [
        'He sticks them back in a row and reads them out, one finger under each word.',
        KS('“밥 데워 먹어.” “두꺼운 양말 신어.” 그리고…', '“Heat up the rice.” “Wear the thick socks.” And…'),
        'He reads the folded one twice without a sound, then puts it in his pocket instead of on the fridge.',
        KS('이건 내 거야. 냉장고 거 말고.', 'This one’s mine. Not the fridge’s.')
      ]
    },
    reward: 'lore',
    lore: [KS('엄마가 오면 나는 자고, 엄마가 나가면 나는 학교에 있어. 그래도 괜찮아. 쪽지가 있잖아.', 'When Mum gets in, I’m asleep. When she goes, I’m at school. It’s fine. We’ve got notes.')]
  });

  S({
    id: 'st_hm_04', kind: 'fetch',
    where: { themes: ['home', 'city'], depth: [2, 3] },
    who: { name: 'The Child Holding Grandad’s Watch', look: { t: 'kid', c: ['#6a5a3a', '#c8a050', '#f0d0b0'] }, lang: 'en' },
    intro: [
      'A child holds an old wristwatch in cupped hands, far too big for any wrist, like a bird that might wake up.',
      EN('It was Grandad’s. He said it would be mine when I was big enough. Then he said I was big enough early.'),
      EN('I opened it to see where it keeps the time. Grandad ran out of time, so I wanted to look.'),
      EN('There was nothing inside but tiny wheels. Then the glass and the little button rolled away.')
    ],
    again: [EN('I hold it to my ear anyway. Grandad said if you can’t hear it, you’re not listening hard enough.')],
    fetch: {
      items: [
        { name: 'a tiny round watch glass', look: 'glass', color: '#d0e0e8' },
        { name: 'a winding button no bigger than a seed', look: 'coin', color: '#c8a050' }
      ],
      found: ['It glints in a crack between two paving stones, exactly where nobody would think to look.'],
      partial: [EN('One bit. Grandad always said: one bit at a time, then a cup of tea.')],
      done: [
        'The child presses the glass back on. It clicks. The button screws in, slightly crooked.',
        EN('It still doesn’t go. That’s all right. It’s whole again. Whole is the main thing.'),
        EN('The hands say ten past four. That’s when he used to collect me. I think I’ll leave it there.')
      ]
    },
    reward: 'photo',
    lore: ['Engraved on the back, worn almost smooth by a thumb: FOR THE NEXT ONE.']
  });

  S({
    id: 'st_hm_05', kind: 'fetch',
    where: { themes: ['home', 'water'], depth: [2, 4] },
    who: { name: 'The Girl in the Cold Bath', look: { t: 'kid', c: ['#5a7a9a', '#e8f0f8', '#f0d8c0'] }, lang: 'en' },
    intro: [
      'A girl sits in a bathtub in her pyjamas, knees up to her chin. The water does not steam.',
      EN('Hot water is a grown-up thing. You have to know which switch, and for how long. Nobody showed me.'),
      EN('So I invented something. If you put enough candles round a bath, it goes warm. Scientifically.'),
      EN('I need three. I’ve got none. That’s the only problem with the invention.')
    ],
    again: [EN('My teeth are doing the clicking thing. Ignore them. They’re very dramatic.')],
    fetch: {
      items: [
        { name: 'a tall white candle', look: 'candle', color: '#f0ece0' },
        { name: 'a stubby candle with a bent wick', look: 'candle', color: '#e0d0a0' },
        { name: 'a little candle in a tin, half used', look: 'candle', color: '#c0c0c8' }
      ],
      found: ['She carries the candle back in both hands, the way you carry a flame, though there isn’t one yet.'],
      partial: [
        EN('Put it on the edge by my feet. Feet always get cold first, so feet go first.'),
        EN('It’s working a tiny bit. Or I’m imagining it. Imagining also counts.')
      ],
      done: [
        'Three small flames stand round the tub. The water is exactly as cold as before.',
        EN('Oh, that’s much better. Don’t put your hand in to check. Just believe me.'),
        'The girl holds her palms over the nearest flame, very seriously, like a grown-up at a bonfire.'
      ]
    },
    reward: 'page',
    lore: [EN('When Mum gets up I’ll ask her about the switch. She gets up in the afternoon. Mostly.')]
  });

  S({
    id: 'st_hm_06', kind: 'fetch',
    where: { themes: ['home'], depth: [1, 2] },
    who: { name: 'The Boy Making Train Noises', look: { t: 'kid', c: ['#3a5a8a', '#c03030', '#e8c8a0'] }, lang: 'en' },
    intro: [
      'A boy sits cross-legged on a carpet, making the sound of a train with his mouth. There is no train.',
      EN('Dad took the box with the tracks in. He said he’d bring it back on Sunday.'),
      EN('There are loads of Sundays. I counted them. Then I stopped, because counting was making me tired.'),
      EN('I lost the engine and the carriage too. So now I’m just doing the noise for nothing.')
    ],
    again: [EN('Choo. That’s the short version. I’m saving the long one for when it’s real.')],
    fetch: {
      items: [
        { name: 'a little red toy engine with a chipped funnel', look: 'toytrain', color: '#c03030' },
        { name: 'a blue toy carriage with one wobbly wheel', look: 'toytrain', color: '#3a5a9a' }
      ],
      found: ['She finds it on its back under a radiator, wheels in the air like a beetle that gave up.'],
      partial: [EN('One! It’s a very short train now. Short trains still count as trains.')],
      done: [
        'He hooks the carriage behind the engine and pushes them over the carpet, slowly, all the way to the door.',
        EN('It doesn’t need tracks. I was wrong about the tracks.'),
        EN('It can go anywhere now. It can go to Dad’s. I don’t know where Dad’s is, but the train might.')
      ]
    },
    reward: 'coin',
    lore: ['A faint groove runs over the carpet from door to window, worn by something small going back and forth.']
  });

  /* --------------------------------------------------------------- FOLLOW */

  S({
    id: 'st_hm_07', kind: 'follow',
    where: { themes: ['home', 'abstract'], depth: [2, 4] },
    who: { name: 'The Girl Who Is Still Hiding', look: { t: 'kid', c: ['#7a5a8a', '#e0c0e0', '#f0d8c0'] }, lang: 'en' },
    intro: [
      'A girl peeks round a doorframe, ducks back, then peeks again, slower.',
      EN('Shh. We’re playing. I’m hiding. I’ve been hiding for ages and ages.'),
      EN('Nobody’s found me. I’m the best hider in my whole family. They didn’t even look, that’s how good I am.')
    ],
    again: [EN('You found me, but it doesn’t count. You weren’t even playing.')],
    follow: {
      start: [
        EN('Do you want to see my spot? You have to promise not to tell the seekers.'),
        'The girl sets off on the very tips of her toes, exaggeratedly, like a cartoon burglar.'
      ],
      wait: [EN('Tiptoes! Seekers can hear normal feet from anywhere.'), EN('Faster. And quieter. Both at the same time.')],
      arrive: [
        'She stops at the back of a wardrobe. Behind the winter coats, the wood is no longer quite wood.',
        EN('This is it. I came in here when they started counting. Then the counting stopped.'),
        EN('You can go through, if you like. I’ll stay. Somebody might still be looking.')
      ],
      to: 'secret'
    },
    reward: 'secret',
    lore: [EN('If they ask, don’t tell them where I am. But do tell them I won. Please tell them I won.')]
  });

  S({
    id: 'st_hm_08', kind: 'follow',
    where: { themes: ['school', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The Dog Who Waits for Three O’Clock', look: { t: 'dog', c: ['#c8a070', '#f0e8d8', '#3a2a1a'] }, lang: 'ko-s' },
    intro: [
      'A sandy dog sits bolt upright, as if somebody told it to and never said it could stop.',
      KS('세 시에 나와. 우리 애. 매일 세 시.', 'He comes out at three. My boy. Every day at three.'),
      KS('지금 몇 시야? 아니, 말하지 마. 곧 세 시겠지.', 'What time is it? No, don’t tell me. It must be nearly three.')
    ],
    again: [KS('냄새 나. 학교 냄새. 분필이랑 우유 냄새.', 'I can smell it. The school smell. Chalk and milk.')],
    follow: {
      start: [
        KS('같이 가자. 교문 앞에서 보면 제일 잘 보여.', 'Come with me. You can see best from right by the gate.'),
        'The dog trots off, looking back every few steps to check that she is still real.'
      ],
      wait: [
        KS('빨리 와. 세 시 놓치면 안 돼.', 'Hurry up. We can’t miss three.'),
        'The dog sits down in the middle of the path and waits, tail sweeping the dust into little fans.'
      ],
      arrive: [
        'They reach a school gate. It is chained shut. Weeds grow up through the playground in tidy rows.',
        KS('봐. 아직 안 나왔어. 오늘은 좀 늦나 봐.', 'See? He’s not out yet. He must be a bit late today.'),
        'The dog lies down, chin on its paws, facing the gate, perfectly content.'
      ],
      to: 'far'
    },
    reward: 'photo',
    lore: [KS('걔 지금쯤 키 엄청 컸을걸. 그래도 나는 알아볼 거야. 냄새로.', 'He’ll be really tall by now. I’ll still know him. By the smell.')]
  });

  S({
    id: 'st_hm_09', kind: 'follow',
    where: { themes: ['school', 'institution'], depth: [1, 2] },
    who: { name: 'The Boy with His Head Tipped Back', look: { t: 'kid', c: ['#4a6a4a', '#e8e0d0', '#f0d0b8', '#b03030'] }, lang: 'en' },
    intro: [
      'A boy walks very carefully with his head tipped right back, a tissue pressed to his nose, eyes on the ceiling.',
      EN('It’s fine. It does this. It does it when I’m nervous, or when it’s a Tuesday.'),
      EN('Nobody hit me. I want to say that first. Nobody did anything. It just started on its own.')
    ],
    again: [EN('I can’t look down. If I look down I’ll see my jumper, and then I’ll know how bad it is.')],
    follow: {
      start: [
        EN('I know the way to the sinks without looking. I’ve done it loads. Come on.'),
        'He sets off, head still tipped back, steering by the ceiling tiles.'
      ],
      wait: [EN('Are you still there? All I can see is the lights.'), EN('Hum or something. So I know you’re behind me.')],
      arrive: [
        'A row of low sinks under a frosted window. He runs the cold tap and holds the tissue under it.',
        EN('See? Stopped. Mostly. It always looks worse than it is.'),
        EN('If anyone asks, I walked into a door. I’m famous for doors. Everybody knows.')
      ],
      to: 'water'
    },
    reward: 'coin',
    lore: ['Down the side of the mirror, in pencil, a column of tiny tally marks. Far too many for one term.']
  });

  S({
    id: 'st_hm_10', kind: 'follow',
    where: { themes: ['home', 'abstract'], depth: [2, 4] },
    who: { name: 'The Night Light That Got Unplugged', look: { t: 'jelly', c: ['#f0d890', '#fff4c0'] }, lang: 'en' },
    intro: [
      'A small round glow drifts at knee height, humming like a fridge, giving just enough light to find a toe by.',
      EN('Oh, hello. I’m a night light. Somebody unplugged me and I’ve been wandering about ever since.'),
      EN('I’m only four watts. Don’t expect miracles. Expect a sort of yellowish confidence.')
    ],
    again: [EN('Is it me, or is it darker over there? It’s not me. I’m very consistent.')],
    follow: {
      start: [
        EN('There’s a room that needs me. Small person, big ceiling. Stay close to my glow.'),
        'The light bobs away down a black corridor, carrying a tiny moving room of yellow around itself.'
      ],
      wait: [EN('Stay in the yellow bit. Outside the yellow bit, I make no promises.'), EN('I can’t go faster. Faster would be five watts.')],
      arrive: [
        'A bedroom, a socket low in the corner, and a bed with someone small lying very still under the covers.',
        'The light settles into the socket with a click. The dark backs off, only a step, but it backs off.',
        EN('There. She can open her eyes now. She’s been squeezing them shut since the door closed.')
      ],
      to: 'corner'
    },
    reward: 'lore',
    lore: [EN('I don’t keep monsters away. Nobody can. I just show her there aren’t any. Mostly that’s enough.')]
  });

  S({
    id: 'st_hm_11', kind: 'follow',
    where: { themes: ['city', 'home'], depth: [1, 3] },
    who: { name: 'The Girl Walking Home from a Sleepover', look: { t: 'kid', c: ['#e0a0c0', '#a0c0e0', '#f0d8c0'] }, lang: 'en' },
    intro: [
      'Midnight. A girl in pyjamas and wellies stands on a pavement, a rolled-up sleeping bag under one arm.',
      EN('I was at a sleepover. It was going really well until about eleven.'),
      EN('Then Amy’s mum came up and kissed everyone goodnight. Me as well. And then I wanted to go home.'),
      EN('She rang my house. Nobody picked up. So I’m walking. It’s only round the corner.')
    ],
    again: [EN('At night, corners are longer. That’s just a fact. Look it up.')],
    follow: {
      start: [
        EN('You can walk me, if you want. Not because I’m scared. Because it’s polite.'),
        'She sets off with huge brave strides, the sleeping bag bumping against her knees.'
      ],
      wait: [
        EN('Keep up. If you’re miles behind, it doesn’t count as walking me.'),
        'She stops under a streetlamp and waits inside its circle, as if the circle were a house.'
      ],
      arrive: [
        'A dark house. Every window black except one, low down at the back: the kitchen.',
        EN('There’s a light on. There’s never a light on.'),
        EN('Maybe someone’s waiting up. Or maybe they just forgot to turn it off. Either one is quite nice.')
      ],
      to: 'far'
    },
    reward: 'page',
    lore: ['On the kitchen table, a mug, still steaming. Whoever made it has only just stepped out of sight.']
  });

  /* --------------------------------------------------------------- CHOICE */

  S({
    id: 'st_hm_12', kind: 'choice',
    where: { themes: ['school', 'nature'], depth: [1, 3] },
    who: { name: 'The Boy Who Is Always Picked Last', look: { t: 'kid', c: ['#6a6a3a', '#d0c890', '#e8c0a0'] }, lang: 'en' },
    intro: [
      'Children stand in a line across a muddy field. One by one they flicker out, as if picked. One boy is left.',
      EN('You’re captain now. The real captain went home for his tea. Don’t worry, it’s easy. You just point.')
    ],
    again: [EN('Take as long as you like. I’m used to waiting. I’m basically a professional.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [EN('So. Who do you pick first?'), 'Behind him, a tall girl and a fast boy flicker in and out like an old film.'],
          choices: [{ label: 'Pick him', to: 'q_him' }, { label: 'The tall girl', to: 'q_tall' }, { label: 'Nobody', to: 'q_nobody' }]
        },
        q_him: {
          say: [EN('Me? First? Are you even allowed to do that?'), 'He looks over his shoulder, in case there is another boy with his name.'],
          choices: [{ label: 'Yes, you', to: 'q_pos' }, { label: 'Changed my mind', to: 'e_changed' }]
        },
        q_pos: {
          say: [EN('Okay. Okay okay okay. Where do I stand? Nobody ever told me where to stand.')],
          choices: [{ label: 'In goal', to: 'e_goal' }, { label: 'Up front', to: 'e_front' }, { label: 'Next to me', to: 'e_next' }]
        },
        q_tall: {
          say: [EN('Right. Course. She’s good.'), EN('Then there’s only me, so you get me anyway. That’s how it works. Nobody actually chooses the last one.')],
          choices: [{ label: 'I choose you', to: 'e_choose' }, { label: 'Play one short', to: 'e_short' }]
        },
        q_nobody: {
          say: [EN('Nobody? Then there isn’t a game.'), 'He thinks about this for a long time, as if it were a sum.'],
          choices: [{ label: 'Let’s just sit', to: 'e_sit' }, { label: 'You be captain', to: 'e_captain' }]
        }
      },
      endings: {
        e_changed: { say: [EN('That happens too. Don’t worry. It happens loads.'), 'He walks back to the end of the line, which is now just him.'], reward: 'none' },
        e_goal: { say: [EN('Goal! I’ll be brilliant. I’ll be so brilliant they’ll have to remember it.'), 'He crouches between two jumpers on the grass, arms wide, ready for absolutely everything.'], reward: 'coin' },
        e_front: { say: [EN('Up front? Where the ball goes? I’ve never even touched the ball.'), EN('I’m going to touch it so much.')], reward: 'photo' },
        e_next: { say: ['He stands next to her. He does not say anything. He does not seem to need to.', EN('This is the best position. I didn’t know it was a position.')], reward: 'coin' },
        e_choose: { say: [EN('You chose. You didn’t have to, but you did the face like you were choosing.'), EN('That’s different. I can tell the difference. I’m an expert.')], reward: 'page' },
        e_short: { say: ['The boy stands very still. Then he laughs, one short surprised bark.', EN('Fine. Good. I didn’t want to play anyway. It’s too muddy.'), 'He walks off the field slowly, in case someone calls him back.'], reward: 'none' },
        e_sit: { say: ['They sit on the wall at the edge of the field. Nobody plays. The ball rolls into the hedge by itself.', EN('This is the best game I’ve ever been in.')], reward: 'lore' },
        e_captain: { say: [EN('Me? Captain?'), 'He points, very slowly, at her. Then at nobody. Then at himself, just to see what it feels like.'], reward: 'page' }
      }
    }
  });

  S({
    id: 'st_hm_13', kind: 'choice',
    where: { themes: ['school', 'institution'], depth: [1, 3] },
    who: { name: 'The Boy in the End Cubicle', look: { t: 'kid', c: ['#5a5a7a', '#c8c8d8', '#e8c8a8'] }, lang: 'en' },
    intro: [
      'The last cubicle door is shut. Beneath it: two small shoes, and a crumb falling, very slowly, onto the tiles.',
      EN('Occupied. Very occupied. Extremely.')
    ],
    again: [EN('Still occupied. It’s a big job. It’s a whole lunchtime of a job.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [EN('Are they still out there by the window? The ones who all laugh at once?')],
          choices: [{ label: 'Yes', to: 'q_still' }, { label: 'They left', to: 'q_left' }, { label: 'Who?', to: 'q_who' }]
        },
        q_still: {
          say: [EN('Then I’ll stay. It’s nice in here, actually. The tiles are cold, which is nice.'), EN('And nobody looks at what you’re eating. That’s the main thing about toilets.')],
          choices: [{ label: 'I’ll keep watch', to: 'e_watch' }, { label: 'What are you eating?', to: 'q_eat' }]
        },
        q_left: {
          say: ['The lock slides back a few millimetres, then stops.', EN('You’re sure? You’d say if you weren’t sure?')],
          choices: [{ label: 'I’m sure', to: 'e_out' }, { label: 'Not really', to: 'e_honest' }]
        },
        q_who: {
          say: [EN('Nobody. Forget it. I just like the echo in here.'), 'He hums one note to prove it. It bounces off every tile at once.'],
          choices: [{ label: 'Hum back', to: 'e_hum' }, { label: 'What are you eating?', to: 'q_eat' }]
        },
        q_eat: {
          say: [EN('Kimbap. My gran rolls it every morning. Apparently it smells. Everyone says it smells.'), EN('Do you think it smells?')],
          choices: [{ label: 'It smells good', to: 'e_good' }, { label: 'Everything smells', to: 'e_every' }, { label: 'Can I try some?', to: 'e_try' }]
        }
      },
      endings: {
        e_watch: { say: ['She stands with her back to the cubicle, arms folded, like a very small bouncer.', EN('Nobody’s ever kept watch before. I didn’t know you could get that. Like a service.')], reward: 'coin' },
        e_out: { say: ['The door opens. The boy steps out blinking, holding a foil parcel like something smuggled.', EN('Oh. It’s bright out here. I forgot about the bright.')], reward: 'photo' },
        e_honest: { say: ['The lock slides shut again, gently.', EN('Thanks for not lying. People always lie about that. Then I come out and they’re there.')], reward: 'lore' },
        e_hum: { say: ['He hums. She hums the same note. For a while the toilets are a sort of choir.', EN('That was good. Don’t tell anyone. Actually, do. I don’t know. Both.')], reward: 'page' },
        e_good: { say: ['A silence, then a sound that might be a laugh or might be a sniff.', EN('That’s what Gran says. You sound like my gran. That’s a compliment, she’s the best person alive.')], reward: 'coin' },
        e_every: { say: [EN('Ha. Yeah. They smell like crisps and feet. That’s worse, if you think about it.'), 'The crumbs stop falling for a moment, as if somebody is thinking about it.'], reward: 'none' },
        e_try: { say: ['A hand comes out under the door holding one round slice, very carefully, like a coin through a slot.', EN('Don’t say anything about it. Just eat it. That’s how Gran likes to be reviewed.')], reward: 'photo' }
      }
    }
  });

  S({
    id: 'st_hm_14', kind: 'choice',
    where: { themes: ['school', 'institution'], depth: [2, 4] },
    who: { name: 'The Teacher Under the Last Lamp', look: { t: 'adult', c: ['#4a3a5a', '#d8c8a0', '#e8c8a8'] }, lang: 'en' },
    intro: [
      'An empty classroom. One lamp on, over a desk piled with exercise books. A teacher looks up, pen still moving.',
      EN('You’re early. Or late. I can never tell with you. I don’t think you can either.')
    ],
    again: [EN('Sit wherever you like. The chairs don’t mind. I’ve asked them.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [EN('Is somebody coming to collect you today?')],
          choices: [{ label: 'Yes', to: 'q_who' }, { label: 'No', to: 'q_jumper' }, { label: 'Sometimes', to: 'q_some' }]
        },
        q_who: {
          say: [EN('Lovely. And who is it today?'), 'The teacher keeps marking, but the pen has stopped leaving any marks.'],
          choices: [{ label: 'My mum', to: 'e_mum' }, { label: 'I forget', to: 'q_jumper' }]
        },
        q_some: {
          say: [EN('Sometimes. That’s a very big word for somebody your size.')],
          choices: [{ label: 'It’s fine', to: 'e_fine' }, { label: 'Can I stay here?', to: 'e_stay' }]
        },
        q_jumper: {
          say: ['The teacher caps the pen and looks, quite kindly, at a sleeve.', EN('Your jumper’s on inside out. Did you get dressed in the dark this morning?')],
          choices: [{ label: 'Yes', to: 'e_dark' }, { label: 'I like it like this', to: 'e_like' }, { label: 'The bulb’s gone', to: 'e_bulb' }]
        }
      },
      endings: {
        e_mum: { say: [EN('Good. Off you go, then. Mind the big puddle by the gate.'), 'Looking back, she sees the teacher at the window, watching the gate long after it is empty.'], reward: 'none' },
        e_fine: { say: [EN('Is it? All right. I’ll believe you today.'), EN('Tomorrow I’ll ask again. That isn’t a threat. It’s more of a hobby.')], reward: 'lore' },
        e_stay: { say: [EN('Until the caretaker throws us both out. He’s very slow at throwing. We’ve got ages.'), 'The teacher pulls up a second chair and hands over a red pen. Together they mark everything right.'], reward: 'page' },
        e_dark: { say: [EN('Ah. The dark is a terrible dresser. I’ve had words with it.'), 'The teacher writes something in a small notebook that is not the register, and puts it away.'], reward: 'coin' },
        e_like: { say: [EN('Fair enough. Inside out is very fashionable, in certain dreams.'), EN('If you ever stop liking it, there’s a spare jumper in the cupboard. It’s nobody’s. It could be yours.')], reward: 'photo' },
        e_bulb: { say: ['The teacher opens a drawer. Inside, in neat rows, far more light bulbs than one classroom could ever need.', EN('Funny. I always seem to have spares. Take two, in case the first one gets ideas.')], reward: 'cookie' }
      }
    }
  });

  S({
    id: 'st_hm_15', kind: 'choice',
    where: { themes: ['school', 'nature'], depth: [1, 2] },
    who: { name: 'The Girl with the Shiny Lunchbox', look: { t: 'kid', c: ['#d07040', '#f0e8c0', '#f0d0b0'] }, lang: 'en' },
    intro: [
      'A girl sits on a bench with a beautiful tin lunchbox on her knees, lid shut, both hands flat on top of it.',
      EN('Guess what’s in it. Go on. Most people get it wrong.')
    ],
    again: [EN('The lid stays shut until you guess. That’s the rule of my lunchbox.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [EN('One guess. Well, one and a bit.')],
          choices: [{ label: 'Sandwiches', to: 'q_sand' }, { label: 'Something amazing', to: 'q_amazing' }, { label: 'Nothing', to: 'e_nothing' }]
        },
        q_sand: {
          say: [EN('Sandwiches? Boring. Wrong. Everybody says sandwiches.'), EN('Clue: it’s better than sandwiches. Much, much better.')],
          choices: [{ label: 'Something amazing', to: 'q_amazing' }, { label: 'Cake?', to: 'e_cake' }]
        },
        q_amazing: {
          say: [
            'The girl lifts the lid a crack, peers inside, and smiles a very private smile.',
            EN('Correct. Octopus sausages, rice in the shape of a bear, and an apple cut like a rabbit.'),
            EN('You can have one thing. Which?')
          ],
          choices: [{ label: 'The octopus', to: 'e_octopus' }, { label: 'The rabbit apple', to: 'e_rabbit' }, { label: 'Keep them all', to: 'e_keep' }]
        }
      },
      endings: {
        e_nothing: { say: ['Her hands press down on the lid, a little harder.', EN('Nobody ever gets it right. You’re the first one.'), EN('Don’t tell. I like it better when they guess.')], reward: 'lore' },
        e_cake: { say: [EN('Cake! Yes! A whole one, with my name on in icing!'), 'The girl does not open the lid. She describes the icing in such detail that she can nearly taste it.'], reward: 'coin' },
        e_octopus: { say: ['The girl takes something out of the empty tin between finger and thumb and sets it on a palm.', EN('Careful. Eight legs. Well, six. I ate two on the way here.')], reward: 'photo' },
        e_rabbit: { say: ['The girl lifts out nothing, very gently, by its ears.', EN('Good choice. The rabbit was always going to be for someone else anyway.')], reward: 'page' },
        e_keep: { say: [EN('All of them? For me?'), 'The girl shuts the lid with a click and hugs the tin to her chest. For a moment it really does look full.'], reward: 'none' }
      }
    }
  });

  S({
    id: 'st_hm_16', kind: 'choice',
    where: { themes: ['city', 'korea', 'school'], depth: [2, 4] },
    who: { name: 'The Boy Doing Sums at the Bus Stop', look: { t: 'kid', c: ['#2a3a5a', '#e0e0e8', '#e8c8a0'] }, lang: 'ko-s' },
    intro: [
      'Ten at night. A boy in a padded coat does sums on his knee at a bus stop, under a sign that buzzes.',
      KS('학원 끝났어. 이제 독서실 가야 돼.', 'Cram school’s finished. Now I’ve got to go to the study room.'),
      KS('하나만 물어봐도 돼? 머리가 좀 멈춘 것 같아.', 'Can I ask you something? I think my head’s sort of stopped.')
    ],
    again: [KS('버스 세 대 보냈어. 숙제가 안 끝나서.', 'I’ve let three buses go. The homework won’t finish.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('수학이 좋아, 영어가 좋아?', 'Do you prefer maths or English?')],
          choices: [{ label: 'Maths', to: 'q_maths' }, { label: 'English', to: 'q_english' }, { label: 'Neither', to: 'q_neither' }]
        },
        q_maths: {
          say: [KS('진짜? 그럼 이것 좀 봐 줘. 답이 계속 7이 나와. 7이면 안 되는데.', 'Really? Then look at this. I keep getting seven. It can’t be seven.')],
          choices: [{ label: 'Seven is fine', to: 'e_seven' }, { label: 'Try again', to: 'e_again' }]
        },
        q_english: {
          say: [KS('그럼 영어로 해 봐. 너 꿈이 뭐야? 단어 말고. 진짜 꿈.', 'Then say it in English. What’s your dream? Not the word. Your actual dream.')],
          choices: [{ label: 'Sleeping', to: 'e_sleep' }, { label: 'I don’t know', to: 'e_dontknow' }, { label: 'What’s yours?', to: 'q_yours' }]
        },
        q_yours: {
          say: [
            KS('내 꿈? 엄마 꿈은 의사야. 내 꿈은…', 'My dream? Mum’s dream is doctor. My dream is…'),
            'He looks at the bus timetable for a long time, as though the answer might be printed on it.'
          ],
          choices: [{ label: 'Bus driver?', to: 'e_bus' }, { label: 'Take your time', to: 'e_time' }]
        },
        q_neither: {
          say: [KS('둘 다 싫어? 그래도 돼?', 'You don’t like either? Is that allowed?')],
          choices: [{ label: 'Yes', to: 'e_allowed' }, { label: 'Only in dreams', to: 'e_dreams' }]
        }
      },
      endings: {
        e_seven: { say: [KS('7이어도 돼? 그럼… 그냥 7 쓸게.', 'Seven’s all right? Then… I’ll just put seven.'), 'He writes it very small, then stares at it as if it might be a trick.'], reward: 'coin' },
        e_again: { say: ['He bends over the page again. When the bus comes, he lets it go.', KS('또 7이야. 7이 나를 좋아하나 봐.', 'Seven again. I think seven likes me.')], reward: 'none' },
        e_sleep: { say: [KS('하하. 나도. 그거 영어로 쓰면 선생님이 난리 날걸.', 'Ha. Me too. If I wrote that in English, the teacher would go mad.'), 'He shuts his eyes, just for the length of one red light.'], reward: 'lore' },
        e_dontknow: { say: [KS('다행이다. 나만 모르는 줄 알았어.', 'What a relief. I thought I was the only one who didn’t know.')], reward: 'page' },
        e_bus: { say: [KS('버스 기사? 매일 밤 이 길로 다니고…', 'A bus driver? Coming down this road every night…'), KS('정류장에 애가 있으면 좀 기다려 주고. 응. 그거 괜찮다.', 'Waiting a bit if there’s a kid at the stop. Yeah. That’s not bad.')], reward: 'photo' },
        e_time: { say: [KS('시간? 시간은 없는데.', 'Time? I haven’t got any time.'), 'But he puts the pencil down, and for a while the two of them just watch the sign buzz.'], reward: 'coin' },
        e_allowed: { say: [KS('그런 거 아무도 안 알려 줬어.', 'Nobody ever told me that.'), 'He tears the page out and folds it into a paper plane. He does not throw it. Not yet.'], reward: 'page' },
        e_dreams: { say: [KS('그럼 여기 꿈이야? 그럼 나 조금만 더 있어도 되겠다.', 'So this is a dream? Then I can stay a little bit longer.')], reward: 'lore' }
      }
    }
  });

  S({
    id: 'st_hm_17', kind: 'choice',
    where: { themes: ['nature', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The Girl on the Swing Who Plays Balance Game', look: { t: 'kid', c: ['#8a4a6a', '#f0c0a0', '#f0d8c0'] }, lang: 'ko-s' },
    intro: [
      'A girl swings very high in an empty playground, shouting half a word at the top of every swing.',
      KS('밸런스— 게임— 잠깐, 내려갈게. 들려야 재밌지.', 'Balance— game— hang on, I’ll come down. It’s only fun if you can hear.')
    ],
    again: [KS('질문 엄청 많이 생각해 놨어. 밤에 너무 조용하면 생각나.', 'I’ve thought of loads more questions. They come at night, when it’s too quiet.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('하늘 날기 vs 투명 인간. 뭐 할래?', 'Flying, or being invisible. Which one?')],
          choices: [{ label: 'Flying', to: 'q_fly' }, { label: 'Invisible', to: 'q_inv' }, { label: 'Neither', to: 'q_neither' }]
        },
        q_fly: {
          say: [KS('좋아. 어디로 날아갈 건데? 위로, 아니면 멀리?', 'Good. Where would you fly to? Up, or away?')],
          choices: [{ label: 'Up', to: 'e_up' }, { label: 'Away', to: 'e_away' }]
        },
        q_inv: {
          say: [
            KS('나도! 연습하고 있어. 봐 봐.', 'Me too! I’ve been practising. Watch.'),
            'The girl screws her eyes shut and holds her breath until her cheeks go pink.',
            KS('나 보여?', 'Can you see me?')
          ],
          choices: [{ label: 'Yes', to: 'e_seen' }, { label: 'No', to: 'e_unseen' }]
        },
        q_neither: {
          say: [
            KS('골라야지! 그게 규칙이야. 그럼 쉬운 거.', 'You have to pick! That’s the rule. Fine, an easy one.'),
            KS('언니 생기기 vs 강아지 생기기.', 'Getting a big sister, or getting a puppy.')
          ],
          choices: [{ label: 'A sister', to: 'e_sister' }, { label: 'A puppy', to: 'e_dog' }, { label: 'Both', to: 'e_both' }]
        }
      },
      endings: {
        e_up: { say: [KS('위로 가면 지붕이 다 보여. 누가 누구 기다리느라 불 켜 놨는지도 보여.', 'Up high you can see every roof. You can see who left a light on, waiting for who.')], reward: 'photo' },
        e_away: { say: ['The girl stops swinging.', KS('멀리. 응. 나도 멀리 갈 거야. 조금만. 저녁 먹을 때는 올 거야.', 'Away. Yeah. I’d go away too. Just for a bit. I’d be back for dinner.')], reward: 'lore' },
        e_seen: { say: ['The girl lets all her breath out at once and grins.', KS('아, 다행이다. 가끔 진짜 될까 봐 걱정돼.', 'Oh, good. Sometimes I worry it’s actually working.')], reward: 'coin' },
        e_unseen: { say: [KS('진짜? 진짜 진짜?', 'Really? Really really?'), 'Her grin wobbles, goes, and comes back smaller.', KS('그럼 집에서도 되는 거네. 그럴 줄 알았어.', 'So it works at home too. I thought it might.')], reward: 'none' },
        e_sister: { say: [KS('언니가 있으면 머리도 땋아 주고, 어떤 선생님이 무서운지도 알려 줄 텐데.', 'A big sister would plait your hair, and tell you which teachers shout.')], reward: 'page' },
        e_dog: { say: [KS('강아지는 집에 올 때마다 좋아해 줘. 매번. 늦게 와도.', 'A puppy is happy every single time you come home. Every time. Even when you’re late.')], reward: 'coin' },
        e_both: { say: [KS('둘 다? 그건 반칙이야. 완전 멋진 반칙.', 'Both? That’s cheating. That’s brilliant cheating.'), 'The girl swings so high that, for one moment, the chains go slack.'], reward: 'photo' }
      }
    }
  });

  /* ----------------------------------------------------------------- WORD */

  S({
    id: 'st_hm_18', kind: 'word',
    where: { themes: ['home', 'korea', 'city'], depth: [1, 3] },
    who: { name: 'The Girl on the Roof with a Tooth', look: { t: 'kid', c: ['#3a3a4a', '#f0f0f0', '#f0d0b0'] }, lang: 'ko-s' },
    intro: [
      'A girl crouches on a low tiled roof, holding something tiny and white between finger and thumb.',
      KS('이 빠졌어! 봐 봐. 아니, 입 말고 이.', 'My tooth came out! Look. Not my mouth, the tooth.'),
      KS('지붕에 던지면서 노래 불러야 되는데, 새 이름이 생각이 안 나.', 'You throw it on the roof and sing. But I can’t remember the bird’s name.')
    ],
    again: [KS('“…야, …야, 헌 이 줄게 새 이 다오.” 앞에가 비어 있어.', '“…, …, take my old tooth, bring me a new one.” The beginning’s missing.')],
    word: {
      words: ['kkachi', 'kachi', 'ggachi', 'magpie'],
      hint: [
        'On the gutter sits a black-and-white bird with a long tail. It tilts its head and chatters like a rattle.',
        KS('할머니가 그 새가 아침에 울면 반가운 손님이 온댔어.', 'Gran says when that bird calls in the morning, a welcome visitor is coming.'),
        KS('검은색이랑 흰색. 꼬리 길고. 이름이 두 글자였는데…', 'Black and white. Long tail. Its name was two syllables…')
      ],
      heard: [
        KS('맞다! 까치야, 까치야, 헌 이 줄게 새 이 다오!', 'That’s it! Magpie, magpie, take my old tooth, bring me a new one!'),
        'The girl throws. The tooth skitters up the tiles and stops right at the top, as if someone caught it.',
        KS('이제 새 이가 나겠다. 나면 너도 와서 봐.', 'Now the new one will grow. Come and see it when it does.')
      ],
      wrong: [
        KS('그 새 아니야. 그 새는 너무 조용해.', 'Not that bird. That one’s far too quiet.'),
        KS('음… 아닌 것 같아. 할머니한테 물어볼걸.', 'Hmm… I don’t think so. I should have asked Gran.')
      ]
    },
    reward: 'coin',
    lore: [KS('엄마는 바빠서 이런 거 몰라. 할머니가 알려 준 거야. 할머니는 시골에 살아.', 'Mum’s too busy to know things like this. Gran taught me. Gran lives in the countryside.')]
  });

  S({
    id: 'st_hm_19', kind: 'word',
    where: { themes: ['home', 'school'], depth: [1, 3] },
    who: { name: 'The Girl in the Paper Crown', look: { t: 'kid', c: ['#e0b040', '#f0e0a0', '#f0d0b8'] }, lang: 'en' },
    intro: [
      'A girl sits at a kitchen table in a cardboard crown. In front of her: one cupcake, one unlit candle.',
      EN('Today’s a special day. I’m not saying why. You’re supposed to just know.'),
      EN('Nobody’s said it yet. Not at breakfast. Not at school. Not even the dinner lady, and she says it to everyone.')
    ],
    again: [EN('It’s nearly over. Days like this are only one day long. That’s the whole problem with them.')],
    word: {
      words: ['birthday', 'many happy returns', 'saengil'],
      hint: [
        'The candle is a little wax seven. On the calendar, today is circled in crayon, with balloons drawn round it.',
        EN('I made the crown myself. You’re meant to get a song as well, but singing it to yourself is weird.'),
        EN('It’s two words. The first one is “happy”. I’ll give you that one for free.')
      ],
      heard: [
        'The girl goes very still. Then she takes the crown off, looks at it, and puts it back on properly.',
        EN('You said it. Somebody actually said it.'),
        EN('Now it counts. Now I’m really seven, not just practising.')
      ],
      wrong: [EN('No. That’s a normal-day word.'), EN('Not that. Think about the candle. Think about the crown.')]
    },
    reward: 'cookie',
    lore: ['The girl cuts the cupcake into two very unequal halves, and pushes the bigger one across the table.']
  });

  S({
    id: 'st_hm_20', kind: 'word',
    where: { themes: ['home', 'city'], depth: [2, 4] },
    who: { name: 'The Boy Behind the Front Door', look: { t: 'kid', c: ['#3a6a7a', '#e0e8f0', '#e8c8a8'] }, lang: 'en' },
    intro: [
      'A front door. As she comes near, the letterbox flap lifts, and two eyes look out through the slot.',
      EN('Are you the babysitter? Mum said the babysitter’s coming at six. Mum said that, and then Mum went.'),
      EN('I’m not allowed to open the door unless you say the password. Mum made it up. It’s a really good one.')
    ],
    again: [EN('It’s quite a lot after six now. I’ve been good the whole time. You can ask the door.')],
    word: {
      words: ['biscuit'],
      hint: [
        EN('It’s the dog’s name. We haven’t got a dog. Mum says that’s what makes it a good password.'),
        'Beside the doormat sits a dog bowl that has never been used. Painted on its side, in wobbly letters: BISCUIT.',
        EN('If you were really the babysitter you’d know it. Babysitters know everything. That’s their whole job.')
      ],
      heard: [
        'A long pause. Then the chain rattles, and a bolt, and another bolt, and the door opens a little way.',
        EN('You’re not the babysitter. But you know the password, so you’re allowed. That’s the rule.'),
        EN('She’s not coming, is she. That’s okay. I already brushed my teeth. I did them twice, to make up.')
      ],
      wrong: [EN('Wrong. You might be a stranger. You sound a bit like a stranger.'), EN('No. Think about the dog. The one we haven’t got.')]
    },
    reward: 'page',
    lore: ['In the hall, on the bottom stair, a pillow and a blanket, arranged so that they face the door.']
  });

  S({
    id: 'st_hm_21', kind: 'word',
    where: { themes: ['home', 'abstract'], depth: [2, 4] },
    who: { name: 'The Friend Only One Girl Could See', look: { t: 'tall', c: ['#8a8ab0', '#d0d0f0'] }, lang: 'en' },
    intro: [
      'A very tall shape sits folded on a tiny chair, knees past its ears, so faint the wallpaper shows through.',
      EN('I was somebody’s friend. Her best one. The sort only she could see. I was very good at it.'),
      EN('She’s eleven now. I’m getting tired. Not sad. Just thin. I think she’s forgotten my name.')
    ],
    again: [EN('If someone says it, I’ll be solid for a bit. Long enough to say goodbye properly.')],
    word: {
      words: ['thunder'],
      hint: [
        EN('She named me after the thing that frightened her most. So it would be on her side.'),
        EN('Big storms. The sky going boom over the roof. She’d whisper my name under the duvet, and I’d come.'),
        'Far off, beyond the window, something rumbles, low and long, as if trying to help.'
      ],
      heard: [
        'The shape sharpens. For a moment it has edges, colours, and a quite ridiculous cape.',
        EN('That’s me. That’s who I was. Goodness, I was loud.'),
        EN('If she’s ever scared again, she can borrow my name. It still works. It always worked.')
      ],
      wrong: [EN('No, that was the cat. The cat was never on her side.'), EN('Not that. Something louder. Much, much louder.')]
    },
    reward: 'lore',
    lore: ['Where the shape sat, the tiny chair is warm, and smells faintly of rain on a hot pavement.']
  });

  S({
    id: 'st_hm_22', kind: 'word',
    where: { themes: ['school', 'institution'], depth: [1, 4] },
    who: { name: 'The Girl in the Lost Property Box', look: { t: 'kid', c: ['#7a6a5a', '#d0b090', '#f0d0b8'] }, lang: 'en' },
    intro: [
      'A big box of odd jumpers, single gloves and lonely water bottles. A girl sits in the middle, quite at home.',
      EN('This is lost property. Everything in here is waiting for someone to come and say the word.'),
      EN('I got put in on Tuesday. Or I put myself in. It’s hard to remember which. It was a long Tuesday.')
    ],
    again: [EN('A glove got claimed this morning. The glove was so happy. Gloves don’t usually show it.')],
    word: {
      words: ['mine'],
      hint: [
        'A label is pinned to her cardigan, like the ones on all the jumpers: FOUND IN THE HALL. UNCLAIMED.',
        EN('When the caretaker holds something up, somebody shouts the word, and then they get to take it home.'),
        EN('It’s only one word. Babies learn it before nearly anything. They shout it about toys.')
      ],
      heard: [
        'The girl stands up, slowly, among the jumpers. A single sock slides off her shoulder.',
        EN('Really? You can’t give me back now. That’s the rule of the box.'),
        EN('Okay. I’m claimed. Can we go the long way? I haven’t been outside since Tuesday.')
      ],
      wrong: [EN('No, that’s not it. The caretaker would just put me back.'), EN('Shorter. It’s a really short word. A grabby sort of word.')]
    },
    reward: 'photo',
    lore: ['On the inside of the box lid, in felt-tip, a list of everything ever claimed. The last line is still blank.']
  });

})(typeof window !== 'undefined' ? window : globalThis);
