/* =========================================================================
 *  MONDES DU CŒUR (6/6) — W034 Grenier des jouets · W035 Gare du Bonheur ·
 *  W036 Le Grand Spectacle · W037 Bureau des plaintes · W038 L'Immeuble ·
 *  W039 La Plage grise
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;
  function cookieMark(key) { var t = {}; t[key] = true; var c = {}; c[key] = true; return { id: 'cookie_' + key, type: 'cookie', look: 'cookie', cond: { not: { temp: c } }, use: [{ temp: t }] }; }

  /* ======================= W034 — LE GRENIER DES JOUETS ======================= */
  (function () {
    var g = K.grid(36, 22, ' ');
    g.box(0, 0, 36, 22, '#', '.');
    var r = YN.rng.make(34);
    for (var i = 0; i < 26; i++) { var x = r.int(2, 33), y = r.int(3, 19); if (g.at(x, y) === '.') g.set(x, y, r.chance(0.5) ? '{' : '}'); }
    g.rect(14, 8, 8, 6, ',');
    g.set(18, 21, 'N'); g.set(18, 10, 'B'); g.set(6, 4, 'R'); g.set(30, 4, 'H'); g.set(4, 18, 'T'); g.set(31, 17, 'W'); g.set(10, 12, 'P'); g.set(26, 12, 'Q'); g.set(33, 2, '1'); g.set(18, 0, 'L');
    var plush = function (id, c, ln) { return { id: id, type: 'decor', look: 'plush', lookOpt: { c: [c], dust: true }, lines: [ln] }; };
    YN.defWorld({
      id: 'W034', name: 'The Toy Attic', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true, renderer: 'watercolor' }, music: 'attic', amb: { type: 'wind', vol: 0.03 }, dark: 0.5, weather: { dust: true },
      look: { floor: { p: 'wood', c: ['#7a5a3a', '#5a3e26', '#8a6a48'] }, floor2: { p: 'rug', c: ['#6a5a7a', '#7a6a8a'] }, wall: { p: 'flat', c: ['#2a1e14', '#1e140c'], topColor: '#2a1e14' }, wallface: { p: 'panel', c: ['#6a4a2a', '#5a3a1a', '#3a2410'], skirt: '#2a1a0a' } },
      tall: { '{': { look: 'crate' }, '}': { look: 'toybox', opt: { c: ['#a06040'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'down', type: 'stairs', floor: '#', to: 'W009', arrive: 'stairs', look: 'stairsdown', solid: true, essential: true },
        B: { id: 'bigbox', type: 'decor', look: 'toybox', lookOpt: { c: ['#c03030'] }, lines: [{ if: { noEffect: 'E36' }, t: 'You push the big toy box aside. Underneath, sheltered from the dust, a plush toy, perfectly clean, as good as new. It looks as if it has been waiting for you forever.', do: [{ give: 'E36' }] }, { t: 'The toy box, pushed askew. Underneath, the clean shape of something that is no longer there.' }] },
        R: plush('p1', '#c8a080', 'A bear covered in dust. Its eyes are two different buttons.'),
        H: plush('p2', '#a0b0c8', 'A rabbit grey with dust. One ear sewn back on with red thread.'),
        P: plush('p3', '#e8c0c8', 'A pink cat gone grey. It has lost its tail.'),
        Q: plush('p4', '#b0d0a0', 'A frog. On the label: “happy 6th birthday”. The dust has covered everything.'),
        T: { id: 'train', type: 'decor', look: 'toytrain', lines: ['A wooden train. The engine bears the number 23.'], use: [{ if: { not: { flag: 'got:toytrain' } }, set: { 'got:toytrain': true }, item: { toytrain: 1 } }] },
        W: { id: 'trunk', type: 'decor', look: 'suitcase', lines: ['A trunk. On the lid, in paint: “J.”. It is empty, except for a joke written on a ticket: “Knock knock. — Who’s there? — …” The rest has been torn off.'], use: [{ if: { not: { flag: 'got:jokestub' } }, set: { 'got:jokestub': true }, item: { joke: 1 }, quest: { Q06: 'joke' } }] },
        L: { id: 'skylight', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['The attic skylight. There is moonlight, just a little.'] },
        '1': cookieMark('atticCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'They brought the toys up here the year he left. All of them, in one evening. Nobody played that night.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Dust settles on what nobody touches. One of them was touched every night, in secret, under the heaviest box.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Knock knock. Who’s there? …', lang: 'en' }, { t: 'He always laughed before the end. That’s how you knew it was the end.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'The wooden train only leaves at twenty-three seventy-one. Don’t wait up for it.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N119', at: [24, 16] }, { id: 'N120', at: [8, 9] }],
      info: {
        summary: 'A garret attic cluttered with crates and toy boxes; every plush toy is grey with dust, except one.',
        art: 'Brown watercolour, shafts of moonlight, dust hanging in the air.',
        rules: ['Pushing the big red toy box reveals the only plush toy without dust: the Plushie (E36).'],
        secrets: ['The “J.” trunk keeps the beginning of a joke (Q06).', 'The wooden train, number 23.'],
        role: 'Gives the Plushie.',
        lore: 'The toys you put away when someone leaves. Only one was kept clean.'
      }
    });
  })();

  /* ======================= W035 — LA GARE DU BONHEUR ======================= */
  (function () {
    var g = K.grid(56, 30, ' ');
    g.box(0, 0, 56, 30, '#', '.');
    g.rect(1, 1, 54, 3, ':');                      // mosaïques murales en haut
    for (var x = 5; x < 52; x += 8) { g.set(x, 6, '^'); g.set(x, 14, '^'); }
    g.rect(8, 8, 40, 4, ',');
    g.hline(1, 54, 19, ':'); g.rect(1, 20, 54, 3, 'r'); g.hline(1, 54, 23, ':'); g.rect(1, 24, 54, 5, '.');
    g.set(28, 29, 'U'); g.set(28, 0, 'M'); g.set(12, 0, 'L'); g.set(44, 0, 'Q'); g.set(28, 10, 'C'); g.set(6, 17, 'S'); g.set(28, 21, 'T'); g.set(52, 26, 'D'); g.set(3, 26, '1'); g.set(50, 10, 'P'); g.set(20, 26, 'K');
    YN.defWorld({
      id: 'W035', name: 'Happiness Station', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true }, music: 'happystation', amb: { type: 'anthem', vol: 0.04 },
      look: K.LOOK.nk,
      tall: { '^': { look: 'chandelier', opt: { c: ['#e8d080'] } } },
      map: g.rows(),
      marks: {
        U: { id: 'up', type: 'stairs', floor: '.', to: 'W002', arrive: 'down', look: 'escalator', lookOpt: { up: true }, solid: true, essential: true, label: 'the escalator going back up' },
        M: { id: 'mural', type: 'anchor', floor: '#', look: 'mural', lookOpt: { c: ['#e8a040', '#3060a0', '#c83030'] }, lines: [{ t: 'An immense mosaic: children smiling under a sun, ears of wheat, factories. Nobody has a shadow.' }, { t: '세상에 부럼 없어라', lang: 'ko-n', tr: 'We have nothing in the world to envy.' }] },
        L: { id: 'speaker1', type: 'decor', floor: '#', look: 'loudspeaker', lines: [{ t: '동무들, 오늘도 우리는 행복합니다!', lang: 'ko-n', tr: 'Comrades, today again we are happy!' }] },
        Q: { id: 'speaker2', type: 'decor', floor: '#', look: 'loudspeaker', lines: [{ t: '렬차는 언제나 정시에 도착합니다. 아무도 기다리지 않습니다.', lang: 'ko-n', tr: 'The trains always arrive on time. Nobody waits.' }] },
        C: { id: 'hymn', type: 'sign', look: 'plaque', lines: ['She hums, very low, five notes: sol, sol, la, sol, mi. Then she points to the spot where she floats, in the middle of the red carpet.', { t: '우리 역의 노래입니다. 부르십시오, 동무. 바로 여기서.', lang: 'ko-n', tr: 'This is the song of our station. Sing it, comrade. Right here.' }, { t: '솔, 솔, 라, 솔, 미.', lang: 'ko-n', tr: 'Sol, sol, la, sol, mi.' }] },
        S: { id: 'news', type: 'sign', look: 'newsstand', lines: ['She clutches a newspaper folded in four.', { t: '로동신문입니다. 첫 면에도 웃음, 마지막 면에도 같은 웃음.', lang: 'ko-n', tr: 'This is the Workers’ Newspaper. A smile on the front page, the same smile on the back page.' }, { t: '한 줄을 거꾸로 붙였습니다. 거꾸로 읽으면… “행방불명”.', lang: 'ko-n', tr: 'I pasted one column back upside down. Read it upside down and it says… “missing”.' }], cycle: true },
        T: { id: 'train', type: 'train', floor: 'r', to: 'W037', look: 'train', lookOpt: { c: ['#3a5a3a', '#e8c040'] }, cond: { effect: 'E34' }, lockedText: ['The train waits, doors shut. On every window, an empty frame waits for the print of a travel stamp.', { t: '려행 도장이 없는 동무는 탈 수 없습니다.', lang: 'ko-n', tr: 'Comrades without a travel stamp may not board.' }], label: 'the train to the Office', essential: true },
        D: { id: 'deep', type: 'door', floor: '#', to: 'W071', look: 'door', lookOpt: { style: 'red', c: ['#a02020'], symbol: '★' }, cond: { effect: 'E42' }, label: 'door to the Parade' },
        P: { id: 'portrait', type: 'decor', look: 'portrait', lookOpt: { redacted: true }, lines: ['A large portrait in a gold frame. The face has been covered with a black band. Underneath: “어버이”.'] },
        K: { id: 'bench', type: 'decor', look: 'bench', lines: ['A marble bench. Someone has carved into it, very small: “옥순아”. Then someone tried to scratch it out, and stopped.'] },
        '1': cookieMark('happyCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: '여기서는 이름을 부르지 않습니다. 명단을 부릅니다.', lang: 'ko-n', tr: 'Here, we do not call out names. We call out the list.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '우리는 행복합니다, 우리는 행복합니다… 다음 줄을 잊으면 처음부터 다시 합니다.', lang: 'ko-n', tr: 'We are happy, we are happy… If you forget the next line, you start again from the beginning.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '철이는 이사 갔습니다. 모두 그렇게 말합니다.', lang: 'ko-n', tr: 'Chol-i has moved away. Everyone says so.' }, { t: '철이네 창문에는 아직 불이 켜져 있습니다.', lang: 'ko-n', tr: 'In the window of Chol-i’s home, the light is still on.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '웃는 얼굴은 한 사람에 하나씩 공급됩니다. 잃어버리면 다시 받기 어렵습니다.', lang: 'ko-n', tr: 'Smiling faces are issued, one per person. If you lose yours, it is hard to get another.' }] },
        { type: 'soul', at: 'random-any', lines: ['Her voice is that of an old woman telling a story at a bedside.', { t: '할머니 이야기 해 줄까? 옛날에 신발 한 짝을 잃어버린 여자아이가 있었어. 왼쪽이었어.', lang: 'ko-s', tr: 'Shall Grandma tell you a story? Once upon a time there was a little girl who lost one shoe. The left one.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '엄마는 텔레비전에 이 역이 나오면 채널을 돌렸어요. 그리고 한참 동안 말이 없었어요.', lang: 'ko-s', tr: 'When this station came on the television, Mum changed the channel. And then she said nothing for a long time.' }] }
      ],
      npcs: [{ id: 'N012', at: [28, 25] }, { id: 'N121', at: [40, 9] }, { id: 'N122', at: [16, 9] }, { id: 'N123', at: [10, 26] }, { id: 'N124', at: [46, 26] }],
      mech: [{ type: 'melodyLock', mark: 'hymn', tune: '33432', dist: 5, give: 'E34', winLines: ['You sing the station hymn. The inspector stands to attention, smiling from ear to ear, and hands you his stamp.', { t: '잘했습니다, 동무!', lang: 'ko-n', tr: 'Well done, comrade!', who: 'The Smiling Inspector' }] }],
      info: {
        summary: 'An underground metro station of marble and chandeliers: giant mosaics, loudspeakers, identical newspapers, a masked portrait.',
        art: 'Cream marble, red carpet, gilded chandeliers, mosaics; everything shines, nothing moves.',
        rules: ['Singing the station hymn (Melody: sol sol la sol mi) near the plaque gives the Stamp (E34). Alternative: show the Painted Smile.', 'With the Stamp, the train leads to The Complaints Office (W037).'],
        secrets: ['“옥순아” carved on a bench.', 'With the Painted Smile: the door to The Parade (W071).'],
        role: 'Gives the Stamp. Where 리명희 동무 can be found (Q10).',
        lore: 'Grandmother’s country as the television shows it, and the rule of the house: all is well.'
      }
    });
  })();

  /* ======================= W036 — LE GRAND SPECTACLE ======================= */
  (function () {
    var g = K.grid(40, 28, ' ');
    g.box(0, 0, 40, 28, '#', '.');
    g.rect(6, 2, 28, 7, ','); g.hline(6, 33, 9, '%');                 // la scène
    for (var y = 13; y < 24; y += 2) for (var x = 6; x < 34; x += 2) g.set(x, y, '{');
    g.vline(20, 10, 26, '.'); g.vline(19, 10, 26, '.');
    g.set(20, 27, 'N'); g.set(20, 5, 'S'); g.set(20, 24, 'V'); g.set(34, 4, 'C'); g.set(6, 4, 'D'); g.set(37, 25, '1');
    YN.defWorld({
      id: 'W036', name: 'The Grand Show', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true }, music: 'circus', amb: { type: 'crowd', vol: 0.02 }, dark: 0.6,
      look: { floor: { p: 'wood', c: ['#5a2a2a', '#4a1a1a', '#6a3a3a'] }, floor2: { p: 'wood', c: ['#a07040', '#7a5030', '#b08050'] }, wall: { p: 'flat', c: ['#2a0a10', '#1a0608'], topColor: '#2a0a10' }, wallface: { p: 'panel', c: ['#8a1a2a', '#6a0a1a', '#c8a040'], skirt: '#c8a040' }, wall2: { p: 'flat', c: ['#3a1a10', '#2a1008'] } },
      tall: { '{': { look: 'chair', opt: { c: ['#8a2a3a'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'out', type: 'door', floor: '#', to: 'W020', arrive: 'tent', look: 'tent', essential: true, exitDir: 'up' },
        S: { id: 'stage', type: 'decor', look: 'spotlight', light: 3, lines: ['The centre of the stage, under the spotlight. Knock-Knock does his acts here, when he has an audience.'] },
        V: { id: 'seat', type: 'decor', look: 'chair', lookOpt: { c: ['#c8a040'] }, lines: [{ if: { quest: { Q06: 'show' } }, t: 'The Spectator’s seat. Empty. The velvet is still warm.' }, { t: 'A golden seat in the middle of the hall. A label: “RESERVED — THE SPECTATOR”.' }] },
        C: { id: 'curtain', type: 'decor', look: 'curtain', lookOpt: { c: ['#a01020'] }, lines: ['The curtain. Behind it, props: a suitcase, a red nose, an endless joke written on a slate.'] },
        D: { id: 'poster', type: 'sign', look: 'poster', lookOpt: { c: ['#e8d040', '#c02030'] }, lines: ['She has the hoarse voice of a fairground barker.', { t: 'Tonight! Knock-Knock and the Last Joke! Tonight!', lang: 'en' }, { t: '…Well. Soon.', lang: 'en' }] },
        '1': cookieMark('showCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'He did a voice for every knock. The door, the wolf, the postman. Never his own.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'An empty seat is still an audience. That’s what clowns tell themselves at night.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Someone has to laugh at the end. Even if it isn’t funny. Especially then.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'The suitcase on the stage is a prop. The one by the front door was not.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N007', at: [20, 6] }, { id: 'N125', at: [24, 15] }, { id: 'N126', at: [12, 19] }],
      info: {
        summary: 'The funfair’s big top seen from inside: a stage, rows of chairs, a golden seat reserved for “the Spectator”.',
        art: 'Red velvet, gilding, spotlight.',
        rules: ['Knock-Knock performs his Grand Show here once you bring him the end of his joke (Q06); laughing at the end gives the Laughter (E39).'],
        role: 'Knock-Knock’s quest (Q06).',
        lore: 'The father used to tell jokes. The last one never had a punchline.'
      }
    });
  })();

  /* ======================= W037 — LE BUREAU DES PLAINTES ======================= */
  (function () {
    var g = K.grid(44, 28, ' ');
    g.box(0, 0, 44, 28, '#', '.');
    for (var y = 4; y < 22; y += 3) for (var x = 4; x < 40; x += 6) g.set(x, y, '{');
    g.rect(16, 22, 12, 4, ',');
    g.set(22, 27, 'N'); g.set(22, 23, 'C'); g.set(26, 23, 'I'); g.set(2, 2, 'A'); g.set(41, 2, 'B'); g.set(41, 24, 'F'); g.set(2, 24, '1'); g.set(22, 0, 'P');
    YN.defWorld({
      id: 'W037', name: 'The Complaints Office', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true, renderer: 'engraving' }, music: 'office', amb: { type: 'typewriter', vol: 0.06 },
      look: { floor: { p: 'tile', c: ['#b8b0a0', '#908878'] }, floor2: { p: 'carpet', c: ['#4a4038', '#3a3028'] }, wall: { p: 'flat', c: ['#2a2622', '#1a1612'], topColor: '#2a2622' }, wallface: { p: 'panel', c: ['#a09880', '#888068', '#5a5440'], skirt: '#3a3020' } },
      tall: { '{': { look: 'desk', opt: { c: ['#6a5a40'], book: true } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'train', floor: '#', to: 'W035', arrive: 'train', look: 'door', lookOpt: { style: 'metal' }, essential: true, exitDir: 'up' },
        C: { id: 'counter', type: 'decor', look: 'desk', lookOpt: { c: ['#4a3a2a'] }, lines: ['The complaints counter. A form: “Reason for complaint: ____”. Everything else is already crossed out.'] },
        I: { id: 'ink', type: 'effect', give: 'E24', look: 'inkwell', cond: { temp: { censorBusy: true } }, getLines: ['While the censor blacks out your sentence, you take the inkwell. The ink is thick, and under it there are words.'], lines: ['The censor’s inkwell. He never takes his eyes off it.'] },
        A: { id: 'files', type: 'decor', look: 'locker', lookOpt: { c: ['#5a5a5a'] }, lines: ['Files. “Complaints closed”: all empty. “Complaints to be filed”: just one, in a child’s handwriting, entirely crossed out.'] },
        B: { id: 'stamp', type: 'sign', look: 'plaque', lines: [{ t: '모든 신소는 오해입니다.', lang: 'ko-n', tr: 'Every complaint is a misunderstanding.' }, { t: '오해는 바로잡힙니다. 바로잡힌 것은 없어집니다.', lang: 'ko-n', tr: 'Misunderstandings are corrected. What is corrected disappears.' }] },
        F: { id: 'archive', type: 'door', floor: '#', to: 'W103', look: 'door', lookOpt: { style: 'metal', c: ['#202020'], symbol: '█' }, cond: { effect: 'E24' }, label: 'archives', exitDir: 'left' },
        P: { id: 'portrait', type: 'decor', floor: '#', look: 'portrait', lookOpt: { redacted: true }, lines: ['A portrait under a black band. The crossed-out closed eye is painted in one corner.'] },
        '1': cookieMark('complaintCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: ['She mimes someone talking, then someone writing very fast, head down, back turned to the inkwell.', { t: '말을 걸면 그분은 바빠집니다. 바쁜 사람은 잉크병을 보지 않습니다.', lang: 'ko-n', tr: 'When you speak to him, he gets busy. A busy man does not look at his inkwell.' }] },
        { type: 'soul', at: 'random-any', lines: ['She holds out a page from a school exercise book where a single sentence is crossed out: [[at school, nobody talks to me]].', { t: '아이의 신소였습니다. 오해로 처리되었습니다.', lang: 'ko-n', tr: 'It was a child’s complaint. It was dealt with as a misunderstanding.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '신소를 내러 왔다가 직원이 된 사람도 있습니다. 저처럼요.', lang: 'ko-n', tr: 'Some people came to make a complaint and became employees. Like me.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '여기서는 아무도 소리를 지르지 않습니다. 소리는 서류로 냅니다. 서류는 서랍으로 갑니다.', lang: 'ko-n', tr: 'Here, nobody shouts. You shout on a form. The forms go into drawers.' }] }
      ],
      npcs: [{ id: 'N127', at: [22, 22] }, { id: 'N128', at: [10, 10] }, { id: 'N129', at: [34, 16] }],
      info: {
        summary: 'An endless administrative office, rows of desks, a complaints counter; a censor blacks out everything you say.',
        art: 'Engraving, sepia, lines; the sound of typewriters.',
        rules: ['Saying (T) a sentence near the censor keeps him busy redacting it: meanwhile, the inkwell can be taken (Ink, E24).', 'The Ink reveals crossed-out text everywhere.', 'With the Ink, a door marked archives leads to The Museum of Forbidden Feelings (W103).'],
        role: 'Gives the Ink.',
        lore: 'Censorship: a complaint becomes a misunderstanding, then nothing.'
      }
    });
  })();

  /* ======================= W038 — L'IMMEUBLE ======================= */
  (function () {
    var g = K.grid(40, 30, ' ');
    g.box(0, 0, 40, 30, '#', ',');
    for (var f = 0; f < 3; f++) { var y0 = 2 + f * 9; g.box(1, y0, 38, 8, '#', '.'); g.set(20, y0 + 7, '.'); g.set(20, y0, f ? '.' : '#'); for (var d = 0; d < 4; d++) g.set(5 + d * 10, y0, 'ABCDEFHIJLMO'[f * 4 + d]); }
    g.vline(20, 1, 28, ','); g.set(20, 29, 'N'); g.set(36, 26, 'K'); g.set(3, 26, 'X'); g.set(36, 8, '1'); g.set(20, 20, 'S');
    var flats = ['1201', '1202', '1203', '1204', '1101', '1102', '1103', '1104', '1001', '1002', '1003', '1004'];
    var marks = {
      N: { id: 'out', type: 'door', floor: '#', to: 'W003', arrive: 'toBuilding', look: 'door', lookOpt: { style: 'wood', c: ['#3a4a5a'] }, essential: true, exitDir: 'up' },
      K: { id: 'mailbox', type: 'decor', look: 'mailbox', lines: ['The letterboxes. The one for 1204 is overflowing with adverts and a letter with a Seoul postmark.'], use: [{ if: { not: { flag: 'got:letterM' } }, set: { 'got:letterM': true }, item: { letter: 1 }, quest: { Q03: 'letter' } }] },
      X: { id: 'basement', type: 'stairs', floor: ',', to: 'W182', look: 'stairsdown', solid: false, cond: { all: [{ deepVisited: true }, { pill: true }] }, label: 'cellar stairs' },
      S: { id: 'board', type: 'sign', look: 'sign', lines: ['She speaks in the polite voice of the notices in the entrance hall.', { t: 'Residents are kindly asked not to leave children alone in the lift.', lang: 'en' }, { t: 'There is no lift. There never was. Only the stairs, and the key around your neck.', lang: 'en' }] },
      '1': cookieMark('buildingCookie')
    };
    'ABCDEFHIJLMO'.split('').forEach(function (k, i) {
      var n = flats[i];
      if (n === '1204') marks[k] = { id: 'flat1204', type: 'decor', floor: '#', look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: n }, lines: ['1204. Home. The door is locked from the inside. Behind it, a television left on for nobody.', 'On the doormat, a pair of women’s slippers, set facing the way out.'], cycle: true };
      else marks[k] = { id: 'flat' + n, type: 'decor', floor: '#', look: 'door', lookOpt: { style: 'wood', c: [['#5a4a3a', '#4a3a3a', '#3a4a3a', '#4a4a5a'][i % 4]], symbol: n }, lines: [['Door ' + n + '. You can hear a washing machine spinning with nothing in it.'], ['Door ' + n + '. Behind it, a voice talks to someone who does not answer:', { t: 'I’ll be home late. Don’t wait up.', lang: 'en' }], ['Door ' + n + '. Silence. A child presses an ear to the other side, like you.'], ['Door ' + n + '. Nothing.']][i % 4] };
    });
    YN.defWorld({
      id: 'W038', name: 'The Apartment Block', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'building', amb: { type: 'hum', vol: 0.05 }, dark: 0.4,
      look: { floor: { p: 'tile', c: ['#a8a090', '#888070'] }, floor2: { p: 'concrete', c: ['#8a8680'] }, wall: { p: 'flat', c: ['#2a2826', '#1a1816'], topColor: '#2a2826' }, wallface: { p: 'panel', c: ['#c8c0b0', '#a8a090', '#7a7468'], skirt: '#5a5040' } },
      map: g.rows(), marks: marks,
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: '열쇠 잃어버리지 마. 할머니가 끈에 꿰어 줄게. 목에 걸고 다녀.', lang: 'ko-s', tr: 'Don’t lose your key. Grandma will thread it on a string for you. Wear it round your neck.' }] },
        { type: 'soul', at: 'random-any', lines: ['She whispers through a door, pulling on a coat.', { t: '괜찮아. 엄마 일곱 시에 와. 불 켜 놓고 자.', lang: 'ko-s', tr: 'It’s all right. Mum will be back at seven. Leave the light on when you go to sleep.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '현관에 할머니 슬리퍼가 아직 있어요. 아무도 못 치워요.', lang: 'ko-s', tr: 'Grandma’s slippers are still by the front door. Nobody can bring themselves to put them away.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Twelfth floor, the door at the end. The light stays on all night in there. Nobody ever switches it off.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'A man went down these stairs with a suitcase. A J. on the handle. The step still creaks where he stopped, halfway down.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Letters from Seoul come slowly. By the time they arrive, the one who wrote them has become someone else.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N022', at: [20, 14] }, { id: 'N130', at: [30, 5] }, { id: 'N131', at: [10, 23] }],
      info: {
        summary: 'The stairwell of an apartment block: three landings, twelve numbered doors, the letterboxes downstairs. Door 1204 is her home.',
        art: 'Beige tiles, corridor neon, brown doors.',
        rules: ['The letterbox for 1204 holds a letter from Seoul (Q03).', 'After a visit to P3 and a Blue Pill, the cellar stairs go down (W182).'],
        role: 'Where the impossible correspondence takes place (Q03). A way through to The Room Below.',
        lore: 'Coming home alone, the key around your neck, and listening at other people’s doors.'
      }
    });
  })();

  /* ======================= W039 — LA PLAGE GRISE ======================= */
  (function () {
    var g = K.grid(62, 34, '.');
    g.rect(0, 0, 62, 10, '~'); g.rect(0, 10, 62, 3, 'w');
    var r = YN.rng.make(39);
    for (var x = 0; x < 62; x++) { var d = Math.round(Math.sin(x * 0.3) * 1.2); g.set(x, 12 + d, 'w'); g.set(x, 13 + d, r.chance(0.3) ? ',' : '.'); }
    for (var i = 0; i < 20; i++) { var px = r.int(1, 60), py = r.int(15, 32); if (g.at(px, py) === '.') g.set(px, py, r.chance(0.5) ? 'o' : '}'); }
    g.border('#'); for (var xx = 1; xx < 61; xx++) g.set(xx, 0, '~');
    g.set(30, 33, 'U'); g.set(52, 18, 'H'); g.set(14, 22, 'B'); g.set(40, 26, 'C'); g.set(6, 30, '1'); g.set(24, 16, 'S'); g.set(30, 3, 'Z');
    YN.defWorld({
      id: 'W039', name: 'The Grey Beach', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2', outdoor: true,
      style: { view: 'top', renderer: 'mono' }, music: 'greybeach', amb: { type: 'sea', vol: 0.1 }, weather: { ash: true },
      look: { floor: { p: 'sand', c: ['#9a9a96', '#86867e'] }, floor2: { p: 'cobble', c: ['#6a6a66'] }, water: { p: 'water', c: ['#5a5e64', '#4a4e54', '#6a6e74', '#c8ccd0'] }, shallow: { p: 'water', c: ['#6a6e74', '#5a5e64', '#7a7e84', '#d8dce0'] }, wall: { p: 'rock', c: ['#4a4a48', '#3a3a38', '#5a5a58'] } },
      tall: { 'o': { look: 'rock', opt: { c: ['#5a5a58'] } }, '}': { look: 'bones' } },
      map: g.rows(),
      marks: {
        U: { id: 'up', type: 'stairs', to: 'W006', arrive: 'well', look: 'ladder', solid: true, essential: true, label: 'the well ladder' },
        H: { id: 'lighthouse', type: 'door', to: 'W029', look: 'lighthouse', label: 'the lighthouse', essential: true },
        B: { id: 'boat', type: 'decor', look: 'boat', lines: ['A stranded rowing boat. On its side, a name worn away by the salt. Inside, an oar and a child’s shoe.'], use: [{ if: { not: { flag: 'got:shoe' } }, set: { 'got:shoe': true }, item: { shoe: 1 }, quest: { Q01: 'shoeFound' } }] },
        C: { id: 'whale', type: 'decor', look: 'bones', lookOpt: { big: true }, lines: ['The ribs of a whale, bleached white. The wind passes between them, whistling a low note.'] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'the sea gives back only what you give it', lines: [{ t: '…다 줬는데. 아무것도 안 돌아왔어.', lang: 'ko-s', tr: '…I gave it everything, though. Nothing came back.' }] },
        Z: { id: 'wreck', type: 'door', floor: '~', to: 'W091', look: 'buoy', cond: { equipped: 'E04' }, unreachOk: 'by swimming', label: 'a buoy, out at sea', lockedText: 'A buoy, out at sea. Too far to swim, for a girl.' },
        '1': cookieMark('beachCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: '자장자장… 바다 건너 누가 오면 깨워 줄게.', lang: 'ko-s', tr: 'Hush, hush… if someone comes from across the sea, I’ll wake you.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Nobody rows back. Here, the oars only work one way.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '배에 신발 한 짝이 있었어요. 왼쪽이요. 주인은 맨발로 갔대요.', lang: 'ko-s', tr: 'There was one shoe in the boat. The left one. They say its owner went away barefoot.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'The ash is only paper. Old letters, burned so they would stop waiting for an answer.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: ['She kneels in the sand, facing the water.', { t: '엄마, 미안해. 그날 밤에도 일하고 있었어.', lang: 'ko-s', tr: 'Mum, I’m sorry. That night too, I was at work.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Three lighthouses, and only one on this shore. Light it, and the sea remembers it has a bottom.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N132', at: [36, 20] }, { id: 'N133', at: [10, 18] }],
      info: {
        summary: 'A beach of grey sand at the bottom of the Orchard’s well, under a rain of ash: a sea without a far shore, a lighthouse, a rowing boat, whale bones.',
        art: 'Grey monochrome, falling ash, slow sea.',
        rules: ['The Lighthouse (W029) stands on the beach.', 'With the Fish, you can swim out to the buoy (W091).'],
        secrets: ['The rowing boat keeps a child’s shoe (Q01).'],
        role: 'Leads to The Lighthouse; Mr. Ahn’s quest (the shoe).',
        lore: 'The sea that separates, the one nobody crosses back.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
