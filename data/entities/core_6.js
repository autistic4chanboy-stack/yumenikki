/* =========================================================================
 *  Habitants du Grenier, de la Gare du Bonheur, du Grand Spectacle, du
 *  Bureau des plaintes, de l'Immeuble et de la Plage grise ;
 *  리명희 동무 (Ri Myong-hui).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var V_RI = { wave: 'sine', pitch: 410, vary: 1, len: 34, vol: 0.05 };

  YN.defEntities([
    /* ---- Grenier ---- */
    { id: 'N119', name: 'The Dust Bunny', world: 'W034', kind: 'creature', behavior: 'wander', radius: 4, speed: 0.6,
      look: { t: 'blob', c: ['#9a9088'], h: 10 }, lines: ['A ball of dust that rolls along by itself. It stops in front of the red box, every time.'] },
    { id: 'N120', name: 'The Jack-in-the-Box', world: 'W034', kind: 'creature', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'round', body: 'box', c: ['#c04040', '#a02020', '#f0d0b0', '#40a040'], eyes: 'spiral', mouth: 'grin', h: 18 },
      lines: [{ seq: [{ t: 'BOING!', lang: 'en' }, 'He drops back into his box. Then, very quietly:', { t: 'The only clean one is underneath. Under the big red one.', lang: 'en' }] }, 'He only pops out every other time. He has learnt to frighten more gently.'] },

    /* ---- Gare du Bonheur ---- */
    { id: 'N012', name: '리명희 동무', world: 'W035', kind: 'human', role: 'major', major: true, behavior: 'static', solid: true, lang: 'ko-n', dialog: 'ri', voice: V_RI,
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', hairStyle: 'short', body: 'uniform', c: ['#3a5a3a', '#2a4a2a', '#e8c8b0', '#1a1a1a'], eyes: 'closed', mouth: 'painted', acc: 'newspaper', h: 23 },
      reacts: { E42: { lines: [{ t: '…그 미소. 제 거예요.', lang: 'ko-n', tr: '…That smile. It’s mine.' }] } },
      info: { personality: 'Polite, smiling, stock phrases; glues the newspapers back together.', flaw: 'Informs on people, and smiles.', wants: 'To cry; to find 철이 again.', arc: 'Q10 The Painted Smile', belief: 'Believes, or says she believes, that nobody has ever disappeared.', relations: 'Knows Mr. Ahn’s name; he does not recognise her.' } },
    { id: 'N121', name: 'The Smiling Inspector', world: 'W035', kind: 'human', behavior: 'static', solid: true, lang: 'ko-n',
      look: { t: 'adult', head: 'cap', body: 'uniform', c: ['#2a3a6a', '#1a2a5a', '#e0c0a0', '#c83030'], eyes: 'closed', mouth: 'painted', acc: 'stamp', h: 24 },
      lines: [{ seq: [{ t: '동무, 우리 역의 노래를 부를 줄 압니까?', lang: 'ko-n', tr: 'Comrade, do you know how to sing our station’s song?' }, 'He hums five notes, pointing at the middle of the red carpet, where a copper plaque used to shine.'] },
        { seq: [{ t: '노래하는 사람에게는 도장을 빌려 줍니다. 웃는 사람에게도.', lang: 'ko-n', tr: 'I lend the stamp to whoever sings. To whoever smiles, too.' }, 'He taps his stamp, then points to his singing mouth, then to his painted smile.'] }],
      info: { role: 'Stamp puzzle (P034).' } },
    { id: 'N122', name: 'The Woman with the Bouquet', world: 'W035', kind: 'human', behavior: 'static', solid: true, lang: 'ko-n',
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', hairStyle: 'bun', body: 'hanbok', c: ['#e8e0f0', '#c03050', '#e8c8b0', '#1a1a1a'], eyes: 'closed', mouth: 'smile', acc: 'flower', h: 23 },
      lines: [{ t: '일없습니다. 다 일없습니다.', lang: 'ko-n', tr: 'Never mind. None of it matters at all.' }, { t: '우리는 행복합니다. 행복합니다. 행…', lang: 'ko-n', tr: 'We are happy. Happy. Hap…' }, 'She holds plastic flowers. She waters them anyway.'] },
    { id: 'N123', name: 'The Child in the Red Scarf', world: 'W035', kind: 'kid', behavior: 'static', solid: true, lang: 'ko-n',
      look: { t: 'kid', head: 'round', hair: '#1a1a1a', body: 'uniform', c: ['#f0f0f0', '#c8c8c8', '#f0c8a0', '#1a1a1a'], eyes: 'closed', mouth: 'painted', acc: 'flag', h: 17 },
      lines: [{ t: '저는 세상에서 제일 행복한 아이입니다!', lang: 'ko-n', tr: 'I am the happiest child in the world!' }, { t: '…엄마는 어디 갔는지 몰라요. 물어보면 안 돼요.', lang: 'ko-n', tr: '…I don’t know where Mum went. You mustn’t ask.' }] },
    { id: 'N124', name: 'The Old Traveller', world: 'W035', kind: 'human', behavior: 'static', solid: true, lang: 'ko-n',
      look: { t: 'old', head: 'round', hair: '#d8d8d8', body: 'coat', c: ['#5a5040', '#3a3020', '#d8b898', '#d8d8d8'], eyes: 'sad', mouth: 'line', acc: 'suitcase', h: 22 },
      lines: [{ t: '남쪽으로 가는 렬차는 없습니다. 원래 없었습니다.', lang: 'ko-n', tr: 'There is no train to the South. There never was.' }, { t: '안재식이라는 사람을 아십니까? …아닙니다. 잊으십시오.', lang: 'ko-n', tr: 'Do you know a man called Ahn Jae-sik? …No. Forget it.' }] },

    /* ---- Grand Spectacle ---- */
    { id: 'N125', name: 'A Paper Spectator', world: 'W036', kind: 'ghost', behavior: 'static', alpha: 0.5, solid: false, talkable: true,
      look: { t: 'ghost', c: ['rgba(240,230,220,0.5)'], h: 20 }, lines: [{ seq: ['He claps without hands.', { t: 'The ending. We’re all waiting for the ending.', lang: 'en' }] }] },
    { id: 'N126', name: 'The Usherette', world: 'W036', kind: 'human', behavior: 'patrol', path: [[8, 12], [32, 12]], speed: 1,
      look: { t: 'adult', head: 'round', hair: '#3a1a1a', hairStyle: 'bun', body: 'uniform', c: ['#8a1a2a', '#6a0a1a', '#e0c0a0', '#3a1a1a'], eyes: 'dots', mouth: 'line', acc: 'lantern', h: 23 },
      lines: [{ t: 'The golden seat is reserved. She always comes, the Spectator. She always leaves before the end.', lang: 'en' }, { t: 'Knock-Knock lost the end of his joke in a trunk, somewhere, under a roof.', lang: 'en' }] },

    /* ---- Bureau des plaintes ---- */
    { id: 'N127', name: 'The Censor', world: 'W037', kind: 'human', behavior: 'static', solid: true, hearDist: 5,
      look: { t: 'tall', head: 'veil', body: 'suit', c: ['#1a1a1a', '#0a0a0a', '#e0d0c0', '#000000'], h: 28, acc: 'stamp' },
      hears: [{ any: true, lines: ['The censor takes up his pen and blacks out your sentence in the air, letter by letter, with great care. He is no longer watching his inkwell.'], do: [{ temp: { censorBusy: true } }, { reeval: true }, { fn: function () { setTimeout(function () { YN.save.temp('censorBusy', false); if (YN.game.rt) YN.world.reeval(YN.game.rt); }, 14000); } }] }],
      lines: [{ seq: ['He does not look up.', { t: '말하십시오. 제가 고칩니다.', lang: 'ko-n', tr: 'Speak. I will correct it.' }, 'He points his pen at your mouth and waits for you to say something, anything, so that he can black it out.'] },
        { t: '말한 것은 모두 더 잘 말할 수 있습니다. 아니면 아예 말하지 않을 수도 있습니다.', lang: 'ko-n', tr: 'Everything that is said can be said better. Or not said at all.' }, { t: '███ ████ ███ █████.' }],
      info: { role: 'Ink puzzle (P024): say a sentence to him to keep him busy.' } },
    { id: 'N128', name: 'The Clerk with the Stamps', world: 'W037', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#4a4a4a', hairStyle: 'bun', body: 'shirt', c: ['#c8c0b0', '#a8a090', '#d8b898', '#4a4a4a'], eyes: 'line', mouth: 'line', acc: 'stamp', h: 23 },
      lines: [{ t: '종결. 종결. 종결.', lang: 'ko-n', tr: 'CLOSED. CLOSED. CLOSED.' }, { t: '아이의 신소입니까? 그런 건 저절로 종결됩니다. 아이들은 과장합니다.', lang: 'ko-n', tr: 'A child’s complaint? Those close themselves. Children exaggerate.' }] },
    { id: 'N129', name: 'The Complainant', world: 'W037', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#6a4a2a', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#d8b898', '#6a4a2a'], eyes: 'sad', mouth: 'none', h: 23 },
      lines: ['He opens his mouth. There is no mouth.', 'He shows you a sheet of paper. At the top, two words in careful handwriting: my complaint. Below, a large black stain.'] },

    /* ---- Immeuble ---- */
    { id: 'N130', name: 'The Neighbour in 1202', world: 'W038', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'old', head: 'round', hair: '#c8c8c8', hairStyle: 'bun', body: 'dress', c: ['#7a5a6a', '#5a3a4a', '#e0c8b0', '#c8c8c8'], eyes: 'dots', mouth: 'line', h: 21 },
      lines: [{ t: 'Your mum comes home late, doesn’t she. I hear her on the stairs, around seven in the morning.', lang: 'en' }, { t: 'Would you like some cake? … No, you never want any. You never say.', lang: 'en' }, { t: 'Someone put a letter from Korea in your mailbox. It’s overflowing. You should take it.', lang: 'en' }] },
    { id: 'N131', name: 'The Boy in 1003', world: 'W038', kind: 'kid', behavior: 'wander', radius: 3,
      look: { t: 'kid', head: 'round', hair: '#2a1a10', body: 'shirt', c: ['#6a8aa0', '#4a6a80', '#f0c8a0', '#2a1a10'], eyes: 'dots', mouth: 'line', h: 17 },
      lines: [{ t: 'I’ve got the key around my neck too. Look.', lang: 'en' }, { t: 'We’re not allowed in the basement. There’s a room down there, just like yours, but upside down. My brother said so.', lang: 'en' }] },

    /* ---- Plage grise ---- */
    { id: 'N132', name: 'The Woman Waiting for the Tide', world: 'W039', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#3a3a3a', hairStyle: 'long', body: 'hanbok', c: ['#e8e4dc', '#c8c4bc', '#d8c0a8', '#3a3a3a'], eyes: 'closed', mouth: 'line', h: 23 },
      lines: [{ seq: ['She looks at the sea.', { t: '다음 배로 돌아온다고 했어요.', lang: 'ko-s', tr: 'He said he would come back on the next boat.' }] }, { t: '바다는 준 것만 돌려줘요. 그래서 노래를 줘요.', lang: 'ko-s', tr: 'The sea only gives back what you give it. So I give it songs.' }, { t: '자장자장 우리 아가…', lang: 'ko-s', tr: 'Hush, hush, my baby…' }] },
    { id: 'N133', name: 'The Ash Crab', world: 'W039', kind: 'animal', behavior: 'wander', radius: 4, speed: 1.8,
      look: { t: 'ant', c: ['#8a8a86'], h: 10 }, lines: ['It walks sideways, towards the rowing boat. Always towards the boat.'] }
  ]);

  /* ---------------- 리명희 ---------------- */
  YN.defDialogue('ri', {
    who: '리명희', voice: V_RI,
    branches: [
      { once: 'first', lines: [{ t: '어서 오십시오, 동무! 행복의 역에 오신 것을 환영합니다!', lang: 'ko-n', tr: 'Welcome, comrade! Welcome to Happiness Station!' }, { t: 'She glues a newspaper column back together. Her hands tremble a little; her smile, not at all.' }] },
      { if: { priestessHere: true }, lines: [{ t: '모든 것이 다 좋습니다. 모든 것이 다…', lang: 'ko-n', tr: 'Everything is very good. Everything is…' }] },
      { if: { item: { photo: 1 } }, once: 'photo', lines: [{ t: '…철이.', lang: 'ko-n', tr: '…Chol-i.' }, { t: 'She hides the photo against her chest. The painted smile cracks on one side.' }, { t: '아무도 사라지지 않았습니다. 아무도.', lang: 'ko-n', tr: 'Nobody has disappeared. Nobody.' }], do: [{ quest: { Q10: 'photo' } }, { priestess: { attract: true } }] },
      { if: { met: 'N002' }, once: 'ahn', lines: [{ t: '안 선생님을 만나셨습니까? 위의 역에서…', lang: 'ko-n', tr: 'Have you met Mr. Ahn? At the station up above…' }, { t: '그분은 저를 모릅니다. 저는 그분 이름을 압니다. 명단에 있었으니까요.', lang: 'ko-n', tr: 'He does not know me. I know his name. It was on the list.' }], do: [{ quest: { Q10: 'list' } }] },
      { lines: [{ t: function () { return [{ t: '우리는 행복합니다!', lang: 'ko-n', tr: 'We are happy!' }, { t: '오늘도 렬차는 정시에 도착했습니다.', lang: 'ko-n', tr: 'Today again, the train arrived on time.' }, { t: '신문을 다시 붙이고 있습니다. 바람이 찢었습니다. 바람이요.', lang: 'ko-n', tr: 'I am gluing the newspapers back. It was the wind that tore them. The wind.' }, { t: '울면 안 됩니다. 여기서는 아무도 울지 않습니다.', lang: 'ko-n', tr: 'You must not cry. Here, nobody cries.' }][Math.floor(Math.random() * 4)]; }, lang: 'ko-n' }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
