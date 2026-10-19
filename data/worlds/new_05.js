/* =========================================================================
 *  NOUVEAUX MONDES (5) — W281 à W300 : « The Night Shift »
 *  Les lieux où la mère travaille et passe la nuit, rêvés par sa fille :
 *  l'hôpital (aile, salle, vestiaire, casier, placard-cathédrale, relève),
 *  la pointeuse, le bus de nuit N21 et ses arrêts (laverie, centre d'appels,
 *  usine, supérette, marché de l'aube, terminus), le passage souterrain,
 *  le passage piéton, la façade vue du dehors et le banc sous la fenêtre.
 *  Méta-énigme : la carte de pointage (E229) a cinq cases ; cinq énigmes
 *  (W282, W290, W291, W292, W293) les poinçonnent ; carte pleine et portée,
 *  l'arrêt « Home » du bus et la grille du passage piéton mènent au banc (W300).
 *  Fil : chaque lieu a son heure (21:00 → 07:05) ; la femme en blouse est
 *  toujours de dos, un peu plus loin.
 *  Parents : W054, W118, W064, W063. Habitants N1500–N1555, effets E225–E230.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t) { return { t: t, lang: 'en' }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* une âme qui sert d'indice : elle revient chaque nuit */
  function SOULK(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines, keepSoul: true }; }
  /* un décor posé à un endroit précis */
  function D(id, look, at, lines, o) { return Object.assign({ id: id, type: 'decor', look: look, at: at, lines: lines }, o || {}); }
  /* ajoute une porte dans un monde déjà défini (placée au hasard, puis rendue joignable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  /* la femme en blouse : toujours de dos, toujours un peu plus loin */
  function MUM(o) { return H(Object.assign({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e8e4', '#b0c8c4', '#e0c8b0', '#2a1a10'], eyes: 'closed', alpha: 0.82 }, o || {})); }
  var MUMNAME = 'The Woman in the Tunic';

  /* la carte de pointage : cinq cases */
  var PUNCH = ['ns_punch_ward', 'ns_punch_laundry', 'ns_punch_calls', 'ns_punch_line', 'ns_punch_store'];
  var CARD_FULL = { flag: PUNCH, equipped: 'E229' };
  function punched() { return PUNCH.filter(function (f) { return !!YN.save.flag(f); }).length; }
  var KACHUNK = { t: function () { var n = punched(); return 'Far away, a punch clock goes ka-chunk. ' + (n >= 5 ? 'Five boxes out of five.' : n + (n === 1 ? ' box' : ' boxes') + ' out of five.'); } };

  /* ---------------------------------------------------------------
   *  Effets E225–E230
   * --------------------------------------------------------------- */
  var EF = YN.data.effects;
  EF.push({ id: 'E225', name: 'Night Tunic', fam: 'night shift', world: 'W284', icon: { glyph: '⊓', c: '#cfe4dc' }, action: 'hug', ground: false, core: false,
    desc: 'Her spare tunic. It comes down to your knees and smells of other people’s nights.',
    use: 'Hug yourself inside it (F). Curtains and doors marked STAFF ONLY take you for one of them.',
    get: 'Inside the Humming Locker: stand still for a long time in the warm corner, under her coat.' });
  EF.push({ id: 'E226', name: 'Rubber Gloves', fam: 'night shift', world: 'W286', icon: { glyph: 'ψ', c: '#f0a0b8' }, action: 'erase', ground: false, core: false,
    desc: 'Pink, a size too big, still warm inside.',
    use: 'Scrub away what is pasted or written in front of you (F). Worn, they reach where nobody would touch.',
    get: 'The Cupboard Cathedral: light every bare bulb before the first one goes out.' });
  EF.push({ id: 'E227', name: 'Stop Button', fam: 'night shift', world: 'W289', icon: { glyph: '⊙', c: '#e04848' }, action: 'ring', ground: false, core: false,
    desc: 'STOP. It came away in your hand, still ringing.',
    use: 'Ding (F): whoever is near turns towards you, and drivers wake up.',
    get: 'The N21 Night Bus: press the bell when the window shows your own window.' });
  EF.push({ id: 'E228', name: 'Warm Sweet Potato', fam: 'night shift', world: 'W295', icon: { glyph: '◒', c: '#c87040' }, action: 'glow', light: 1.8, ground: false, core: false,
    desc: 'Wrapped in newspaper. “For your mum,” said the grandmother.',
    use: 'Hold it close (F): a small orange warmth. With warm hands, some painted doors can be seen.',
    get: 'The Dawn Market: find everything on the crumpled shopping list.' });
  EF.push({ id: 'E229', name: 'Timecard', fam: 'night shift', world: 'W288', icon: { glyph: '▥', c: '#e8e0c8' }, action: 'stamp', ground: false, core: false,
    desc: 'KIM M. — NIGHTS. Five boxes, one for each place before morning.',
    use: 'Punch (F). Worn, with all five boxes punched, it lets you clock out and go home.',
    get: 'The Punch Clock: say whose card you are looking for, near the rack.' });
  EF.push({ id: 'E230', name: 'Pager', fam: 'night shift', world: 'W285', icon: { glyph: '▭', c: '#a8b8a8' }, action: 'sense', ground: false, core: false,
    desc: 'It went off forty minutes too early. It always does.',
    use: 'It beeps towards the nearest thing still hidden here (F). Some lost things beep back.',
    get: 'Forty Minutes of Sleep: reach the lit window without looking at it.' });

  var HOSP = Object.assign({}, K.LOOK.hospital, { floor: { p: 'tile', c: ['#9aaeac', '#7a8e8c'] }, thin: { p: 'stripes', c: ['#a8c8c0', '#d8e8e4'] } });

  /* ---------------------------------------------------------------
   *  W281 — L'Autre aile, trois heures du matin (P3)
   *  Des traces de pas mouillées traversent toute l'aile : les suivre
   *  sans s'en écarter fait apparaître le placard à balais (W286).
   * --------------------------------------------------------------- */
  S({ id: 'W281', name: 'The Other Wing at 3 A.M.', depth: 3, tier: 'hard', secretLevel: 3, back: 'W054', backLook: 'door', backOpt: { style: 'metal', c: ['#8a9a98'] }, backLabel: 'back to the waiting room', backAt: [1, 16],
    map: (function () {
      var g = K.grid(60, 34, ' '); g.box(0, 0, 60, 34, '#', '.');
      g.hline(1, 58, 11, '#'); g.hline(1, 58, 22, '#'); g.vline(15, 1, 32, '#'); g.vline(30, 1, 32, '#'); g.vline(45, 1, 32, '#');
      [[7, 11], [22, 11], [37, 11], [52, 11], [8, 22], [23, 22], [38, 22], [51, 22]].forEach(function (p) { g.set(p[0], p[1], '.'); g.set(p[0] + 1, p[1], '.'); });
      [[15, 5], [15, 16], [15, 27], [30, 6], [30, 16], [30, 26], [45, 4], [45, 16], [45, 28]].forEach(function (p) { g.set(p[0], p[1], '.'); g.set(p[0], p[1] + 1, '.'); });
      g.vline(20, 2, 7, '|'); g.vline(25, 4, 9, '|'); g.vline(35, 13, 18, '|'); g.vline(40, 15, 20, '|'); g.vline(50, 3, 8, '|');
      return g.rows();
    })(),
    look: HOSP, style: { tallWalls: true }, music: 'otherwing', amb: { type: 'beep', vol: 0.04 }, dark: 0.55,
    doors: [{ to: 'W282', at: [22, 1], look: 'door', opt: { style: 'glass', symbol: '4' }, label: 'ward 4' },
      { to: 'W283', at: [37, 32], look: 'door', opt: { style: 'wood', c: ['#6a7a78'] }, label: 'STAFF ONLY' },
      { to: 'W288', at: [58, 27], look: 'door', opt: { style: 'metal', c: ['#7a7a6a'] }, label: 'the staff entrance' },
      { to: 'W286', at: [56, 1], look: 'door', opt: { style: 'metal', c: ['#9aaaa8'] }, cond: { flag: 'ns_cupboard' }, label: 'the cleaning cupboard' }],
    decor: [{ look: 'bed', n: 5, opt: { c: ['#e0e8e8', '#a8b8b8'] }, lines: ['An empty bed in the corridor, made with hospital corners.', 'A bed parked against the wall. The pillow still has a dent in it.'] },
      { look: 'chair', n: 3, lines: ['A folded wheelchair, waiting for someone to need it.'] },
      { look: 'pills', n: 2, lines: ['A medicine trolley. The drawers are labelled with bed numbers. Drawer 12 is empty.'] },
      { look: 'wallclock', n: 1, lines: ['A wall clock. Three o’clock. It has been three o’clock for a long time, the way it is at three.'] },
      { look: 'drawing', n: 1, lines: ['A child’s drawing taped by the lift: a woman in white with a clock instead of a face.'] },
      { look: 'scuff', n: 6, solid: false, lines: ['A wet footprint, a woman’s work shoe. Already drying at the edges.'] }],
    place: [D('fp_from', 'scuff', [3, 16], ['Wet footprints, starting here. Small, quick, a little uneven, like someone at the end of a long night.'], { solid: false }),
      D('fp_to', 'scuff', [56, 3], ['The last footprint. It faces the wall.'], { solid: false }),
      SOUL([KS('그날 밤에 엄마는 다른 병동에 있었어. 같은 병원, 반대쪽.', 'That night Mum was in the other wing. Same hospital, the other side.')])],
    npcs: [{ id: 'N1500', name: MUMNAME, look: MUM({ acc: 'broom' }), behavior: 'turnaway', solid: true, at: [53, 8],
        lines: ['She has her back to you. She is wringing out a mop, slowly, as if it were someone’s hand.', KS('…괜찮아. 엄마 일해. 먼저 자.', '…It’s all right. Mum’s working. Go to sleep without me.'), 'She doesn’t turn round. Her shoes leave wet prints, smaller than you thought.'] },
      { id: 'N1501', name: 'The Night Porter', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#4a6a7a', '#3a5a6a', '#e0c0a0', '#1a1a1a'] }), behavior: 'patrol', path: [[18, 14], [27, 14], [27, 19], [18, 19]], speed: 0.6, solid: true,
        lines: [KS('삼 층 끝. 사 층 가요.', 'Third floor, done. Off to the fourth.'), { seq: [KS('바닥 젖었어요. 발자국 따라가면 안 미끄러져요.', 'The floor’s wet. Follow the footprints and you won’t slip.'), 'He points at the wet prints, then traces their way with one finger, without lifting it.'] }] },
      { id: 'N1502', name: 'A Drip Stand on Its Own', look: H({ t: 'tall', head: 'blank', body: 'stick', c: ['#c8d0d0', '#a0a8a8', '#d8e8f0', '#808888'], eyes: 'none', mouth: 'none' }), behavior: 'wander', radius: 5, speed: 0.6, solid: false,
        lines: ['A drip stand wheeling itself along the corridor. The bag glows faintly, like a night-light.'] }],
    mech: [{ type: 'trail', from: 'fp_from', to: 'fp_to', slack: 1, flag: 'ns_cupboard', reward: [{ set: { ns_cupboard: true } }],
      lostLine: 'The footprints dry up behind you. They start again by the waiting-room door.',
      winLines: ['The footprints stop in front of a bare wall that smells of bleach.', 'There was always a door here. A small one, for buckets.'] }],
    info: { summary: 'A dark hospital wing at three in the morning, its floors freshly mopped.',
      rules: ['Wet footprints lead from the waiting-room door right across the wing: follow them to where they stop.', 'There, the cleaning cupboard appears: the Cupboard Cathedral.', 'Straying more than a step from the footprints sends them back to the start.'],
      lore: '03:00. The other wing, where Mum was working the night her daughter waited in A&E.' } });
  link('W054', { to: 'W281', look: 'door', lookOpt: { style: 'metal', c: ['#8a9a98'] }, label: 'a corridor to the other wing' });

  /* ---------------------------------------------------------------
   *  W282 — La Salle des rondes (P3)
   *  Cinq moniteurs bipent l'un après l'autre, en canon : leur répondre
   *  dans l'ordre poinçonne la première case. Le rideau du lit 12 ne
   *  s'ouvre qu'en blouse (E225).
   * --------------------------------------------------------------- */
  var wardPlace = [];
  [4, 9, 14, 19, 24, 29].forEach(function (x, i) {
    wardPlace.push(D('bedt' + i, 'bed', [x, 2], ['A patient asleep, the blanket rising and falling.', 'An empty bed, still warm.'], { lookOpt: { c: ['#e8f0f0', '#9ab0b0'] } }));
    wardPlace.push(D('bedb' + i, 'bed', [x, 17], [i === 5 ? 'Bed twelve, curtained off. A lamp is on behind the curtain.' : 'A patient asleep, one hand outside the blanket.'], { lookOpt: { c: ['#e8f0f0', '#9ab0b0'] } }));
  });
  [[6, 2], [16, 2], [26, 2], [11, 17], [21, 17]].forEach(function (p, i) { wardPlace.push(D('mon' + i, 'monitor', p, ['A heart monitor, a green line rising and falling.'], { lookOpt: { c: ['#203028'] }, light: 0.8 })); });
  S({ id: 'W282', name: 'The Ward of Rounds', depth: 3, tier: 'hard', secretLevel: 3, back: 'W118', backLook: 'door', backOpt: { style: 'glass', symbol: '4' }, backLabel: 'back down to the hospital beneath', backAt: [34, 9],
    map: (function () { var g = K.grid(36, 20, ' '); g.box(0, 0, 36, 20, '#', '.'); g.rect(14, 8, 8, 2, 'u'); return g.rows(); })(),
    look: Object.assign({}, HOSP, { counter: { p: 'wood', c: ['#b8c8c4', '#98a8a4', '#d0e0dc'] } }), style: { tallWalls: true }, music: 'wardrounds', amb: { type: 'beep', vol: 0.05 }, dark: 0.5,
    doors: [{ to: 'W281', at: [1, 9], look: 'door', opt: { style: 'metal', c: ['#8a9a98'] }, label: 'the corridor of the other wing' },
      { to: 'W287', at: [32, 17], look: 'curtain', cond: { equipped: 'E225' }, label: 'the curtain round bed twelve', locked: 'A curtain drawn round bed twelve. A laminated card is pinned to it: “STAFF ONLY — HANDOVER”.' }],
    decor: [{ look: 'chair', n: 3, lines: ['A visitor’s chair. Nobody visits at this hour.'] }, { look: 'pills', n: 1, lines: ['The drug round trolley. Little paper cups, one for each bed, each with a name.'] }],
    place: wardPlace.concat([
      D('obs', 'clipboard', [17, 7], ['An observation chart. Across it, in biro: “they never beep together — answer each one in its turn”.']),
      D('win1', 'window', [12, 1], ['A window onto the city. Far away, an apartment block with one window lit on the twelfth floor.']),
      D('win2', 'window', [22, 1], ['A window. Your reflection, and behind it, a nurse walking past without stopping.']),
      SOUL([KS('간호조무사는 환자 이름을 다 외워. 자기 딸 학교 이름은 가끔 까먹어.', 'A care assistant knows every patient’s name. Sometimes she forgets her daughter’s school.')])]),
    npcs: [{ id: 'N1503', name: 'A Nurse on Her Rounds', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#e8f0f0', '#c8d8d8', '#e0c8b0', '#2a2a2a'], alpha: 0.75 }), behavior: 'patrol', path: [[3, 5], [32, 5], [32, 13], [3, 13]], speed: 0.5, solid: false, talkable: true,
        lines: [KS('열두 침대. 열두 번 괜찮다고 해요.', 'Twelve beds. Twelve times, I say it’s all right.'), { seq: [KS('모니터는 같이 안 울어요. 차례대로 불러요. 차례대로 대답해 주세요.', 'The monitors never beep together. They call one after another. Answer them in turn.'), 'She points at the monitors one after the other, never two at once.'] }] },
      { id: 'N1504', name: 'A Patient Talking in Her Sleep', count: 2, look: H({ t: 'old', body: 'robe', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#c8c8c8'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [KS('…우리 딸 밥 먹었나…', '…has my daughter eaten…'), KS('…불 꺼야 하는데…', '…I should turn the light off…')] },
      { id: 'N1505', name: 'The Ward at Night', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 17,
        ambientLines: ['Somewhere a monitor beeps. Then another, a little later, a little higher.', 'A trolley wheel squeaks, three rooms away.'] }],
    mech: [{ type: 'sequence', order: ['mon2', 'mon0', 'mon4', 'mon1', 'mon3'], ring: { every: 1.3, pause: 3.6, sfx: 'chime', hear: 18, glyph: '♪', color: '#a0ffc0' }, flag: 'ns_punch_ward',
      reward: [{ set: { ns_punch_ward: true } }, { secret: 'ns_ward_canon' }], okSfx: 'blip',
      wrongLine: 'Every monitor beeps at once, out of time. The patients turn over in their sleep.', doneLine: 'The monitors beep in rounds, softly, like a song.',
      winLines: ['You answer each monitor in its turn. The beeps fall into place: one round, five voices, the same song.', 'For a moment every patient on the ward breathes at the same speed.', KACHUNK] }],
    info: { summary: 'A dimmed ward where the heart monitors beep one after another, like a song sung in rounds.',
      rules: ['The five monitors beep in turn, always in the same order: touch each one in the order it beeps.', 'It punches the ward box of the Timecard.', 'The curtain round bed twelve only opens for staff: wear the Night Tunic (E225) to reach the Handover.'],
      lore: '23:00. The start of the shift: the first round.' } });
  link('W118', { to: 'W282', look: 'door', lookOpt: { style: 'glass', symbol: '4' }, label: 'ward 4, lights dimmed' });

  /* ---------------------------------------------------------------
   *  W283 — La Salle de repos, deux heures (P3)
   *  Un casier fredonne : son cadenas à quatre molettes (1204, « chez
   *  nous ») ouvre W284. Télé éteinte, le canapé mène à W285.
   * --------------------------------------------------------------- */
  var staffPlace = [];
  [3, 5, 7, 9, 11, 13, 17, 19, 21].forEach(function (x, i) { staffPlace.push(D('lock' + i, 'locker', [x, 1], ['A locker with a name label. The name has been written over so many times it is only ink now.', 'A locker. Inside, someone is keeping a pair of slippers for the morning.'])); });
  [13, 14, 16, 17].forEach(function (x, i) { staffPlace.push(D('lk' + (i + 1), 'wheel', [x, 3], ['A wheel of the padlock, numbered 0 to 9.'], { lookOpt: { c: ['#c8c0a0'] } })); });
  S({ id: 'W283', name: 'The Staff Room at 2 A.M.', depth: 3, tier: 'hard', secretLevel: 3, back: 'W281', backLook: 'door', backOpt: { style: 'wood', c: ['#6a7a78'] }, backLabel: 'back to the corridor', backAt: [1, 8],
    map: K.hall(26, 16, '#', '.'),
    look: Object.assign({}, K.LOOK.house, { floor: { p: 'tile', c: ['#c8c0a8', '#a8a088'] }, wallface: { p: 'panel', c: ['#c8d0c8', '#a8b0a8', '#7a827a'], skirt: '#5a625a' } }),
    style: { tallWalls: true }, music: 'staffroom', amb: { type: 'fridge', vol: 0.05 }, dark: 0.3,
    doors: [{ to: 'W284', at: [15, 1], look: 'locker', opt: { c: ['#8aa0a0'] }, cond: { flag: 'ns_locker_open' }, label: 'the humming locker' },
      { to: 'W285', at: [6, 12], type: 'bed', look: 'sofa', cond: { temp: { ns_tv_off: true } }, label: 'the staff sofa', locked: 'A sagging sofa. Forty minutes of sleep would just fit on it. Not with the television on.' }],
    place: staffPlace.concat([
      D('humlocker', 'locker', [15, 1], ['A locker that hums. Not a machine hum: a person humming, very softly, a song with no words.', 'A sticky note on its door, in Korean. It says the code is “our home”.', { t: '비번 = 우리 집', lang: 'ko-s', tr: 'Code = our home' }], { cond: { notFlag: 'ns_locker_open' }, lookOpt: { c: ['#8aa0a0'] } }),
      D('microwave', 'clock', [4, 5], ['The microwave clock blinks 12:04. It has blinked 12:04 since the last power cut. Nobody resets it.']),
      D('fridge', 'fridge', [23, 3], ['Notes on the staff fridge.', { t: '김 — 내 요구르트 먹지 마세요!!', lang: 'ko-s', tr: 'Kim — please don’t eat my yoghurt!!' }, { t: '야간조 수고하셨습니다', lang: 'ko-s', tr: 'Thank you for your hard work, night shift' }]),
      D('table', 'table', [12, 9], ['A table with a ring of cup-ramen lids. Each one is a break nobody finished.']),
      D('kettle', 'coffee', [9, 9], ['A kettle that has boiled four hundred times tonight.']),
      D('tv', 'tv', [20, 9], [{ if: { temp: { ns_tv_off: true } }, t: 'The television is off. In the black screen, the staff room looks like somebody’s home.' }],
        { use: [{ if: { not: { temp: { ns_tv_off: true } } }, temp: { ns_tv_off: true }, sfx: 'switch', msg: 'A shopping channel, sound off. You press the button: it folds into a white dot. The room goes very quiet.' }] }),
      SOUL([KS('휴게실 소파는 사십 분짜리야. 아무도 두 시간을 못 자.', 'The staff-room sofa is a forty-minute sofa. Nobody ever gets two hours on it.')])]),
    npcs: [{ id: 'N1506', name: 'A Colleague with Cup Ramen', look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#a8c0d8', '#88a0b8', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, at: [12, 11],
        lines: [KS('김 선생님은 쉬는 시간에도 안 자요. 휴대폰으로 딸 사진만 봐요.', 'Kim never sleeps on her break. She just looks at photos of her daughter.'), KS('라면 먹을래요? 두 시엔 다 맛있어요.', 'Want some ramen? Everything tastes good at two in the morning.'), KS('저 사물함은 늘 흥얼거려요. 주인 닮아서.', 'That locker always hums. Like its owner.')] },
      { id: 'N1507', name: 'Someone Humming', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 9, ambientEvery: 13, at: [15, 2],
        ambientLines: [KS('흠… 흠흠… 자장… 자장…', 'Hm… hm-hm… hush… hush…'), 'The humming comes from the lockers. From one locker.'] }],
    mech: [{ type: 'dials', marks: ['lk1', 'lk2', 'lk3', 'lk4'], states: 10, values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], start: [3, 9, 9, 1], target: [1, 2, 0, 4], labelText: 'The wheel clicks round to ', sfx: 'clock_tick',
      flag: 'ns_locker_open', reward: [{ set: { ns_locker_open: true } }], doneLine: 'The padlock hangs open. One, two, zero, four.',
      winLines: ['One, two, zero, four. The padlock opens with a sigh.', 'The humming stops. Then it starts again from inside, as if someone had moved over to make room.'] }],
    info: { summary: 'The night staff’s break room at two in the morning: lockers, a microwave, a sofa nobody sleeps on.',
      rules: ['One locker hums. Its padlock has four wheels; the note says the code is “our home”: flat 1204.', 'The microwave blinks 12:04 too. The open locker leads Inside the Humming Locker.', 'Switch off the television and the sofa lets you sleep: Forty Minutes of Sleep.'],
      lore: '02:00. The break.' } });

  /* ---------------------------------------------------------------
   *  W284 — Dans le casier qui fredonne (P4)
   *  Rester immobile sous son manteau : la blouse (E225). Entre deux
   *  manteaux, un passage pour qui est minuscule (E13).
   * --------------------------------------------------------------- */
  S({ id: 'W284', name: 'Inside the Humming Locker', depth: 4, tier: 'hard', secretLevel: 4, back: 'W283', backLook: 'locker', backOpt: { c: ['#8aa0a0'] }, backLabel: 'out of the locker', backAt: [5, 26],
    map: (function () {
      var g = K.grid(13, 28, ' '); g.box(0, 0, 13, 28, '#', '.');
      g.vline(9, 1, 9, '#'); g.hline(10, 11, 9, '#'); g.set(9, 5, '.');
      [[3, 6], [6, 6], [2, 10], [5, 10], [8, 10], [3, 14], [7, 14], [2, 18], [5, 18], [8, 18], [4, 22], [7, 22]].forEach(function (p) { g.set(p[0], p[1], '{'); });
      return g.rows();
    })(),
    look: { floor: { p: 'metal', c: ['#4a5050', '#3a4040', '#5a6060'] }, wall: { p: 'metal', c: ['#202828', '#141a1a', '#2a3232'], topColor: '#1a2020' }, wallface: { p: 'metal', c: ['#5a6868', '#4a5858', '#2a3434'], skirt: '#1a2020' } },
    tall: { '{': { look: 'clothesline', opt: { c: ['#d8e8e4', '#8a9a98'] } } }, style: { tallWalls: true }, music: null, amb: { type: 'hum', vol: 0.07 }, dark: 0.8, playerLight: 0.5,
    extra: { noFurnish: true },
    place: [D('clogs', 'shoe', [8, 24], ['Her white work clogs. The left heel is worn down further than the right.']),
      D('towel', 'towel', [2, 24], ['A hospital towel folded into a pillow, for a nap that never happens.']),
      D('mirror', 'mirror', [10, 16], ['A small mirror stuck to the door, too high for you. In it, only the top of your head and a hanger.']),
      D('coat', 'clothesline', [5, 1], ['Her coat, on its hanger, over the spare tunic.', 'Underneath, the floor is warm, as if someone had just stood there.'], { lookOpt: { c: ['#5a5a6a', '#d8e8e4'] } }),
      D('photo', 'photo', [2, 2], ['A baby photo taped to the metal, curling at the corners. The baby is asleep. The lamp behind her is on.'], { lookOpt: { person: true } }),
      D('list', 'letter', [8, 2], ['A list in the tunic pocket, in a hurried hand.', { t: '우유 — 쌀 — 소라 전화 — 잠', lang: 'ko-s', tr: 'milk — rice — call Sora — sleep' }]),
      { id: 'gap', type: 'decor', at: [9, 5], look: 'clothesline', lookOpt: { c: ['#3a3a4a', '#6a6a7a'] }, solid: false, smallOnly: true, lines: ['Between two coats, a gap. Too narrow for anyone but someone very small.'] },
      D('tape', 'drawing', [11, 2], ['Four pieces of tape on the metal, holding nothing. Exactly the size of a child’s drawing.'], { use: [{ secret: 'ns_tape_marks' }] }),
      D('warm', 'scuff', [5, 2], ['The floor is warm here, as if someone had just been standing still for a long time.'], { solid: false }),
      { id: 'keepa', type: 'decor', at: [4, 2], solid: false, noInteract: true }, { id: 'keepb', type: 'decor', at: [6, 2], solid: false, noInteract: true },
      { id: 'keepc', type: 'decor', at: [4, 3], solid: false, noInteract: true }, { id: 'keepd', type: 'decor', at: [5, 3], solid: false, noInteract: true }, { id: 'keepe', type: 'decor', at: [6, 3], solid: false, noInteract: true },
      SOUL([EN('A locker is the size of a person standing up. That is why it hums.')])],
    npcs: [{ id: 'N1508', name: 'The Hum', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 14, at: [5, 2],
        ambientLines: [KS('자장자장 우리 아기…', 'Hush-a-bye, my little one…'), KS('잘도 잔다…', 'Sleeping so soundly…'), 'The humming is very close now. It smells of hand cream.'] },
      { id: 'N1509', name: 'A Moth in the Pocket', look: { t: 'moth', c: ['#c8c0a8'], h: 7 }, behavior: 'fly', radius: 4, speed: 0.8, solid: false,
        lines: ['A moth that lives in the tunic pocket. It has eaten nothing but the corner of a shopping list.'] }],
    effect: { id: 'E225', how: 'mech', mech: { type: 'standStill', zone: [4, 2, 6, 3], secs: 20, breakLine: 'The humming stops when you move.',
      winLines: ['You stand still under her coat for a long time. The humming comes closer, as if it had found you.', 'The spare tunic slides off its hanger and onto your shoulders. It comes down to your knees.'] } },
    info: { summary: 'The inside of a hospital locker, far taller than a locker: coats hang like trees in the dark.',
      rules: ['Stand still for a long time in the warm corner under her coat (top of the locker): the Night Tunic (E225).', 'A gap between two coats only lets someone tiny through (Tiny, E13).', 'Behind it, four pieces of tape holding nothing.'],
      lore: 'Where she leaves the half of herself she does not take home.' } });

  /* ---------------------------------------------------------------
   *  W285 — Quarante minutes de sommeil (P4)
   *  La sieste de la mère, rêvée par sa fille. La fenêtre allumée
   *  recule quand on la regarde : y aller à reculons (E230). Lui dire
   *  de dormir ouvre une vraie fenêtre (W299).
   * --------------------------------------------------------------- */
  var SAY_SLEEP = { any: [{ said: 'sleep' }, { said: '자요' }, { said: '주무세요' }, { said: '잘 자' }, { said: '잘자' }] };
  S({ id: 'W285', name: 'Forty Minutes of Sleep', depth: 4, tier: 'hard', secretLevel: 4, back: 'W283', backType: 'bed', backLook: 'sofa', backLabel: 'wake up on the staff sofa', backAt: [25, 33], outdoor: true,
    map: (function () {
      var g = K.grid(50, 36, '.'); g.scatter('o', '.', 0.035, 2851);
      for (var y = 2; y <= 7; y++) for (var x = 22; x <= 28; x++) g.set(x, y, '.');
      for (var y2 = 30; y2 <= 35; y2++) for (var x2 = 21; x2 <= 29; x2++) g.set(x2, y2, '.');
      [[6, 30], [7, 30], [6, 31], [22, 29], [44, 18], [43, 18], [44, 19]].forEach(function (p) { g.set(p[0], p[1], '.'); });
      return g.rows();
    })(),
    look: { floor: { p: 'cloud', c: ['#e4e4f2', '#d0d4e8', '#f0f0f8'] }, rock: { p: 'flat', c: ['#f0f0f8', '#c8d0e0'] } }, tall: { o: { look: 'bed', opt: { c: ['#f4f4fa', '#c8d0e0'] } } },
    style: { renderer: 'watercolor', sky: ['#b8b8dc', '#f0e8f0'] }, music: 'fortyminutes', amb: { type: 'clock', vol: 0.04 }, weather: { dust: true },
    doors: [{ to: 'W299', at: [44, 18], look: 'window', cond: SAY_SLEEP, label: 'a window that is really a window' },
      { to: 'W300', at: [6, 30], look: 'bench', cond: { visited: 'W300' }, label: 'back to the bench, at seven' }],
    place: [D('homewin', 'window', [25, 4], ['A lit window, small and very far away. A twelfth-floor window.'], { light: 3 }),
      SOUL([KS('꿈에서도 호출기가 울려. 꿈에서도 일어나.', 'Even in my dreams the pager goes off. Even in my dreams, I get up.')])],
    npcs: [{ id: 'N1510', name: 'A Colleague Asleep Sitting Up', count: 3, look: ghost('rgba(230,236,250,0.55)', 21), behavior: 'static', solid: false, talkable: true,
        lines: ['She sleeps sitting up, her badge still clipped on. Her hand twitches every time a phone rings somewhere.'] },
      { id: 'N1511', name: 'A Voice Counting Down', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 70, ambientEvery: 16,
        ambientLines: [KS('삼십구 분…', 'Thirty-nine minutes…'), KS('이십 분… 아직 이십 분…', 'Twenty minutes… still twenty…'), KS('오 분만 더.', 'Five more minutes.')] },
      { id: 'N1512', name: 'The Clock with Its Eyes Shut', look: H({ t: 'tall', head: 'clock', body: 'robe', c: ['#c8c8e0', '#a8a8c8', '#f0f0f8', '#3a3a4a'], eyes: 'closed' }), behavior: 'static', solid: true, at: [22, 29],
        lines: [{ seq: [KS('집을 쳐다보면 집이 멀어져. 뒤로 걸어가.', 'If you stare at home, home moves away. Walk there backwards.'), 'It turns its back on the window and walks backwards, very slowly, to show you.'] },
          KS('여기선 아무도 푹 못 자. 누가 자라고 말해 주기 전까지는.', 'Nobody sleeps properly here. Not until somebody tells them to.')] }],
    effect: { id: 'E230', how: 'mech', mech: { type: 'recede', mark: 'homewin', dist: 9,
      winLines: ['You reach the window backwards, without looking. It doesn’t run away.', 'For a second, in her sleep, she is home. Somewhere a pager goes off.', 'She wakes. She leaves it behind on the sofa, still beeping.'] } },
    info: { summary: 'The mother’s forty-minute nap, dreamt by her daughter: a pale field of beds and a far-off lit window.',
      rules: ['The lit window moves away whenever you look at it. Walk to it backwards: the Pager (E230).', 'Tell her to sleep (say “sleep”, “자요” or “주무세요”): a real window opens, onto the Window from Outside.'],
      lore: 'She asked for two hours. She dreams of home for forty minutes.' } });

  /* ---------------------------------------------------------------
   *  W286 — La Cathédrale du placard (P4)
   *  Six ampoules nues à allumer avant que la première s'éteigne : les
   *  gants (E226). Gants aux mains, la bonde du siphon : chute vers W294.
   * --------------------------------------------------------------- */
  var BULBS = [[3, 10], [27, 10], [3, 22], [27, 22], [3, 34], [27, 34]];
  S({ id: 'W286', name: 'The Cupboard Cathedral', depth: 4, tier: 'hard', secretLevel: 4, back: 'W281', backLook: 'door', backOpt: { style: 'metal', c: ['#9aaaa8'] }, backLabel: 'out of the cupboard', backAt: [15, 39],
    map: (function () {
      var g = K.grid(31, 41, ' '); g.box(0, 0, 31, 41, '#', '.');
      for (var y = 8; y <= 32; y += 4) { g.set(8, y, '^'); g.set(22, y, '^'); }
      g.rect(11, 1, 9, 5, ',');
      return g.rows();
    })(),
    look: { floor: { p: 'tile', c: ['#8a9a98', '#6a7a78'] }, floor2: { p: 'marble', c: ['#c8d0d0', '#98a8a8'] }, wall: { p: 'stone', c: ['#4a5250', '#3a4240', '#5a6260'], topColor: '#2a3230' }, wallface: { p: 'tile', c: ['#a8b8b4', '#88989a', '#5a6a68'], skirt: '#3a4a48' } },
    tall: { '^': { look: 'pillar', opt: { c: ['#a8b8b4'] } } }, style: { tallWalls: true, renderer: 'engraving' }, music: 'cupboardcathedral', amb: { type: 'choir', vol: 0.04 }, dark: 0.82, playerLight: 0.5,
    doors: [{ to: 'W297', at: [28, 38], look: 'door', opt: { style: 'metal', c: ['#5a6a6a'] }, label: 'a door that smells of outside' }],
    decor: [{ look: 'reeds', n: 4, lines: ['Mops standing upside down along the wall, like organ pipes. When the polisher passes, they sound.'] },
      { look: 'barrel', n: 3, lines: ['A bucket of grey water used as a font. Your face in it looks tired, like hers.'] },
      { look: 'towel', n: 2, lines: ['Cloths drying on a radiator, folded like altar linen.'] }],
    place: BULBS.map(function (p, i) { return D('bulb' + i, 'lamp', p, ['A bare bulb on a cord.'], { lookOpt: { c: ['#e8e0b0'] } }); }).concat([
      D('rose', 'window', [15, 1], ['A rose window made of detergent bottles: blue, green, pink.', 'The saints in it are cleaners, with rubber gloves for haloes.'], { light: 1.6 }),
      D('altar', 'barrel', [15, 3], ['The altar: an upturned mop bucket. On it, a pair of pink rubber gloves, folded like hands at prayer.']),
      { id: 'drain', type: 'hole', at: [15, 20], look: 'drain', solid: true, to: 'W294', arrive: 'landing', label: 'the drain',
        lock: { if: { equipped: 'E226' }, text: 'A drain in the middle of the nave. Deep down, a plug, slimy and cold. Nobody would put a bare hand in there.' } },
      SOUL([KS('청소 아줌마들은 다 성인이야. 아무도 이름을 몰라.', 'The cleaning ladies are all saints. Nobody knows their names.')])]),
    npcs: [{ id: 'N1513', name: 'The Night Cleaner', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#d0a0b0', '#b08090', '#e0c0a0', '#a0a0a0'], acc: 'broom' }), behavior: 'static', solid: true, at: [12, 6],
        lines: [KS('여기 다 닦으면 아침이야. 아침이 오면 또 닦아.', 'When it’s all clean, it’s morning. When morning comes, you clean again.'),
          { seq: [KS('불은 금방 꺼져. 하나 켜는 동안 하나 꺼져. 빨리빨리 해.', 'The bulbs go out fast. Light one and another goes out. Quick, quick.'), 'She runs from one bulb to the next, mimes it going out behind her, and laughs.'] },
          KS('하수구는 맨손으로 만지지 마. 장갑 껴.', 'Never touch the drain bare-handed. Wear gloves.')] },
      { id: 'N1514', name: 'The Floor Polisher', look: { t: 'robot', c: ['#8a9aa0'], h: 13 }, behavior: 'patrol', path: [[15, 36], [15, 24]], speed: 0.4, solid: true,
        lines: ['It hums one long note: the note every corridor makes at four in the morning.'] },
      { id: 'N1515', name: 'A Mop in the Choir', count: 3, look: H({ t: 'tall', head: 'hood', body: 'stick', c: ['#c8c0a8', '#a8a088', '#e0d8c0', '#8a8070'], eyes: 'none', mouth: 'none' }), behavior: 'static', solid: true,
        lines: ['A mop standing on its handle, head up, like a choirboy. It drips in time.'] }],
    effect: { id: 'E226', how: 'mech', mech: { type: 'lampsAll', lamps: ['bulb0', 'bulb1', 'bulb2', 'bulb3', 'bulb4', 'bulb5'], time: 28, light: 2.6,
      litLines: ['A bare bulb flickers on.', 'Another one. Somewhere behind you, the first is already humming lower.'], onLine: 'This one is lit. For now.', doneLine: 'All the bulbs are burning. The vault is full of light and dust.',
      winLines: ['Six bulbs at once. For the first time you can see the whole vault: only a cupboard, and enormous.', 'The gloves on the altar unfold, slowly, and slip onto your hands.'] } },
    info: { summary: 'Behind a small cleaning-cupboard door: a cathedral of mops, buckets and bare bulbs.',
      rules: ['Light all six bare bulbs along the aisles; each goes out after about half a minute, so run.', 'All six lit at once: the Rubber Gloves (E226).', 'With the Rubber Gloves on, pull the plug of the drain in the middle of the nave: you fall into the Drum.', 'A side door leads out to the Underpass at Six.'],
      lore: 'Every cleaning cupboard is the same cupboard, and it is enormous.' } });

  /* ---------------------------------------------------------------
   *  W287 — La Relève (P4)
   *  6 h 55 : l'infirmière de nuit et celle de jour lisent la même liste,
   *  dos à dos. Répondre à la feuille de transmission ouvre la goulotte
   *  à linge (chute vers W294).
   * --------------------------------------------------------------- */
  S({ id: 'W287', name: 'The Handover', depth: 4, tier: 'hard', secretLevel: 4, back: 'W282', backLook: 'curtain', backLabel: 'back through the curtain', backAt: [1, 7],
    map: (function () { var g = K.grid(40, 16, ' '); g.box(0, 0, 40, 16, '#', '.'); g.rect(8, 7, 24, 2, 'u'); g.rect(1, 11, 38, 2, ','); return g.rows(); })(),
    look: { floor: { p: 'paper', c: ['#e8e4d8', '#d0ccc0'] }, floor2: { p: 'lines', c: ['#e0dcd0', '#a8a498'] }, counter: { p: 'wood', c: ['#c8c0b0', '#a8a090', '#d8d0c0'] }, wall: { p: 'flat', c: ['#3a4a4a', '#2a3a3a'], topColor: '#2a3434' }, wallface: { p: 'panel', c: ['#d8e0dc', '#b8c4c0', '#8a9894'], skirt: '#5a8a80' } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: null, amb: { type: 'whispers', vol: 0.06 }, dark: 0.25,
    place: [D('chart3', 'clipboard', [12, 1], ['Bed 3 — Ahn, 84. Will not sleep before the last train. Shoes polished, by the bed, facing the door.']),
      D('chart7', 'clipboard', [20, 1], ['Bed 7 — Kim. Night staff, not a patient. Shift ends at 07:00. Keeps asking what time it is.']),
      D('chart12', 'clipboard', [28, 1], ['Bed 12 — Sora, 12. Does not speak. Sleeps with the light on. Waiting for someone to turn it off.']),
      D('sheet', 'book', [20, 6], ['The handover sheet, held down by a cold cup of coffee.']),
      { id: 'chute', type: 'hole', at: [37, 13], look: 'hatch', solid: true, to: 'W294', arrive: 'landing', cond: { flag: 'ns_handover' }, label: 'the linen chute' },
      SOUL([EN('At seven the night is handed over like a set of keys. Nobody hands over the tiredness.')])],
    npcs: [{ id: 'N1516', name: MUMNAME, look: MUM(), behavior: 'turnaway', solid: true, at: [6, 8],
        lines: ['She reads the list aloud with her back to the day nurse. Her voice is hoarse from the night.', KS('…12번 침대. 말을 안 해요. 불 켜고 자요. 아무도 끄러 안 와요.', '…Bed twelve. Doesn’t speak. Sleeps with the light on. Nobody comes to turn it off.'), KS('제가 끄면 깰까 봐서요.', 'If I turn it off, I’m afraid she’ll wake up.')] },
      { id: 'N1517', name: 'The Day Nurse', look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#f0d8e0', '#d0b8c0', '#e0c0a0', '#2a1a1a'], acc: 'clipboard' }), behavior: 'static', solid: true, at: [33, 8],
        lines: [KS('인수인계 시작할게요. 꼭 알아야 할 거 있어요?', 'Let’s start the handover. Anything I absolutely need to know?'), KS('적어 둘게요. 틀리면 처음부터 다시 들어요.', 'I’ll write it down. If it’s wrong, I hear it all again from the top.')] },
      { id: 'N1518', name: 'Two Voices at Once', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 15,
        ambientLines: [KS('…3번, 밤새 신발 닦음…', '…Bed three, polished his shoes all night…'), KS('…7번, 계속 시간 물어봄…', '…Bed seven, keeps asking the time…'), 'Two voices read the same list at the same time, one a little ahead of the other.'] }],
    mech: [{ type: 'quiz', mark: 'sheet', flag: 'ns_handover', reward: [{ set: { ns_handover: true } }, { secret: 'ns_handover' }],
      intro: [{ t: 'The handover sheet. The day nurse holds out a pen to you.' }, KS('세 명만 확인할게요.', 'Just three to check.')],
      questions: [{ q: 'Bed 3. What is he waiting for?', choices: ['His breakfast', 'A train', 'His daughter'], right: 1 },
        { q: 'Bed 7. When does she get to go home?', choices: ['At seven', 'At midnight', 'Never'], right: 0 },
        { q: 'Bed 12. What does she need tonight?', choices: ['A sleeping pill', 'Someone to turn off the light', 'Silence'], right: 1 }],
      failLine: 'The day nurse frowns and crosses something out. From the top, again.', doneLine: 'At the bottom of the sheet, underlined twice: “turn off the light”.',
      winLines: ['The day nurse writes the last line and underlines it twice: “turn off the light”.', 'Behind the table, the hatch of the linen chute swings open. All the sheets of the night are going down.'] }],
    info: { summary: 'The handover at 06:55: a night nurse and a day nurse reading the same list, back to back.',
      rules: ['Read the three bed charts on the wall, then answer the day nurse at the handover sheet.', 'The answers: a train; at seven; someone to turn off the light.', 'Once the handover is done, the linen chute in the corner opens: it drops into the Drum.'],
      lore: 'What is handed over at seven, and what is not.' } });

  /* ---------------------------------------------------------------
   *  W288 — La Pointeuse (P3)
   *  Dire à qui est la carte : la carte de pointage (E229). Derrière les
   *  casiers à cartes, un labyrinthe de murs invisibles.
   * --------------------------------------------------------------- */
  S({ id: 'W288', name: 'The Punch Clock', depth: 3, tier: 'hard', secretLevel: 3, back: 'W281', backLook: 'door', backOpt: { style: 'metal', c: ['#7a7a6a'] }, backLabel: 'back into the hospital', backAt: [7, 20],
    map: (function () {
      var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.');
      g.vline(15, 1, 20, '#'); g.set(15, 10, '.');
      g.hline(3, 6, 5, '^'); g.hline(9, 12, 5, '^'); g.hline(3, 6, 15, '^'); g.hline(9, 12, 15, '^');
      [[18, 0], [21, 1], [24, 0], [27, 1], [30, 0]].forEach(function (w) { g.vline(w[0], 1, 20, 'x'); if (w[1]) { g.set(w[0], 1, '.'); g.set(w[0], 2, '.'); } else { g.set(w[0], 19, '.'); g.set(w[0], 20, '.'); } });
      return g.rows();
    })(),
    look: { floor: { p: 'concrete', c: ['#8a8a84', '#7a7a74'] }, wall: { p: 'flat', c: ['#3a3a34', '#2a2a24'], topColor: '#2a2a24' }, wallface: { p: 'panel', c: ['#b8b4a0', '#98947e', '#6a6858'], skirt: '#4a4838' } },
    tall: { '^': { look: 'shelf', opt: { c: ['#8a7a5a'] } } }, style: { tallWalls: true }, music: 'punchclock', amb: { type: 'clock', vol: 0.06 }, dark: 0.35,
    doors: [{ to: 'W289', at: [1, 10], look: 'door', opt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, label: 'the staff exit, to the N21 stop' }],
    place: [D('puncher', 'clock', [7, 2], [{ t: function () { var n = punched(); return n >= 5 ? 'The punch clock. Five boxes punched. It is waiting for you to clock out.' : 'The punch clock. ' + n + (n === 1 ? ' box' : ' boxes') + ' punched out of five. The night isn’t over.'; } }]),
      D('rack', 'shelf', [7, 10], ['Hundreds of timecards in their slots. The names have faded; only the initials are left.', 'Row K. One slot is empty: the card was taken out and never put back.'], { lookOpt: { c: ['#8a7a5a'] } }),
      D('oldcards', 'drawer', [32, 2], ['A drawer of old timecards, from long before. Night after night, in faded purple ink.', 'One card, very old: “KIM — 1989 — OVERTIME”. Every box punched, even the Sundays.'], { use: [{ secret: 'ns_old_cards' }] }),
      SOUL([KS('출근 도장은 다 찍는데 퇴근 도장은 아무도 안 찍어. 그냥 가.', 'Everyone punches in. Nobody punches out. They just go.')])],
    npcs: [{ id: 'N1519', name: 'The Night Guard', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#3a4a5a', '#2a3a4a', '#e0c8a8', '#c8c8c8'], acc: 'lantern' }), behavior: 'static', solid: true, at: [10, 18],
        lines: [KS('카드 찾아요? 얼굴로는 못 찾아요. 이름으로 꽂혀 있어요.', 'Looking for a card? You won’t find it by face. They’re filed by name.'),
          { seq: [KS('누구 카드인지 말해 봐요.', 'Tell me whose card it is.'), 'He taps the rack, then his own mouth: say it.'] },
          { if: { effect: 'E229' }, t: '다섯 칸 다 찍히면 퇴근이에요. 집에 가는 버스는 그때만 서요.', lang: 'ko-s', tr: 'When all five boxes are punched, you clock out. The bus home only stops then.' }] },
      { id: 'N1520', name: 'A Worker Clocking In', count: 3, look: ghost('rgba(220,220,200,0.5)', 22), behavior: 'static', solid: false, talkable: true,
        lines: ['She punches in. Ka-chunk. She punches in again. She has been arriving for twenty years.', { t: '삑.', lang: 'ko-s', tr: 'Beep.' }] }],
    effect: { id: 'E229', how: 'mech', mech: { type: 'sayTo', mark: 'rack', dist: 4,
      words: ['mum', 'mom', 'mummy', 'mommy', 'mother', 'mama', '엄마', '어머니', 'miran', 'mi ran', 'kim miran', 'kim mi ran', '미란', '김미란'],
      wrong: 'The cards don’t move. That isn’t a name filed here.', doneLine: 'Row K, one empty slot. The card is with you.',
      winLines: ['Row K. A card slides out of the empty slot by itself, warm, as if someone had just held it.', 'KIM M. — NIGHTS. Five empty boxes, one for each place she works before morning.'] } },
    info: { summary: 'A narrow room of timecard racks by the staff entrance, and a punch clock that counts.',
      rules: ['Near the rack, say whose card you are looking for (“Mum”, “Mi-ran”, “엄마”, “미란”…): the Timecard (E229).', 'Its five boxes: the Ward of Rounds, the Laundromat, the Call Centre, the Packing Line, the Store at four.', 'Each puzzle solved there punches one; the punch clock counts them.', 'A gap in the wall behind the racks leads into a maze of invisible walls; at its far end, the old timecards.'],
      lore: 'Arrivals are recorded. Departures are not.' } });

  /* ---------------------------------------------------------------
   *  W289 — Le Bus de nuit N21 (P3) — le moyeu du rêve
   *  Une porte par arrêt, dans l'ordre de la ligne. Sonner quand la vitre
   *  montre sa propre fenêtre : le bouton (E227). « Home » : carte pleine.
   *  Dans les trois dernières minutes du rêve, le terminus (W296).
   * --------------------------------------------------------------- */
  var busPlace = [];
  [3, 4, 8, 9, 14, 15, 20, 21, 26, 27, 32, 33, 38, 39, 41, 42, 47, 48].forEach(function (x) { busPlace.push(D('seatt' + x, 'trainseat', [x, 1], ['A worn plush seat, still warm from someone who got off.'], { lookOpt: { c: ['#3a6a5a'] } })); });
  [3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 29, 30, 33, 34, 37, 38, 43, 44, 47, 48].forEach(function (x) { busPlace.push(D('seatb' + x, 'trainseat', [x, 5], ['A seat by the window. The window shows the night going past, then your own face.'], { lookOpt: { c: ['#3a6a5a'] } })); });
  var STOP = function (to, x, label) { return { to: to, at: [x, 1], look: 'door', opt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, label: label }; };
  S({ id: 'W289', name: 'The N21 Night Bus', depth: 3, tier: 'hard', secretLevel: 3, back: 'W064', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'get off at the metro', backAt: [1, 3],
    map: K.corridor(52, 5, '#', '.'),
    look: { floor: { p: 'hstripes', c: ['#4a5a5a', '#3a4a4a'] }, wall: { p: 'flat', c: ['#1a2a24', '#10201a'], topColor: '#1a2a24' }, wallface: { p: 'panel', c: ['#c8d0b8', '#a8b098', '#4a6a5a'], skirt: '#2a3a30' } },
    style: { tallWalls: true }, music: 'n21', amb: { type: 'drone', vol: 0.07 }, dark: 0.4, extra: { noFurnish: true },
    doors: [STOP('W288', 6, 'Stop: Hospital (staff entrance)'), STOP('W290', 12, 'Stop: All-Night Laundromat'), STOP('W291', 18, 'Stop: Call Centre'), STOP('W292', 24, 'Stop: Packing Plant'),
      STOP('W293', 30, 'Stop: 24-Hour Store'), STOP('W295', 36, 'Stop: Dawn Market'),
      { to: 'W300', at: [44, 1], look: 'door', opt: { style: 'glass', c: ['#e8d070'], symbol: '1204' }, cond: CARD_FULL, label: 'Stop: Home', locked: 'The last stop: “Home”. The driver shakes his head without turning round. Not until your card is full.' },
      { to: 'W296', at: [50, 3], look: 'door', opt: { style: 'metal', c: ['#5a6a5a'] }, cond: { remainingLt: 180 }, label: 'the end of the line' }],
    place: busPlace.concat([D('stopbell', 'bell', [40, 5], ['A red button on the pole: STOP.'], { lookOpt: { c: ['#e04848'] } }),
      SOUL([KS('밤버스에 타는 사람들은 서로 안 깨워. 다들 얼마나 피곤한지 아니까.', 'People on the night bus don’t wake each other. They all know how tired everyone is.')])]),
    npcs: [{ id: 'N1521', name: 'The N21 Driver', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#2a5a4a', '#1a4a3a', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, at: [2, 5], face: false,
        lines: [KS('N21, 밤 아홉 시부터 아침 일곱 시까지. 매일요.', 'N21, from nine at night to seven in the morning. Every day.'),
          { seq: [KS('내리실 분은 벨 눌러 주세요. 자기 집 창문이 보일 때요.', 'If you’re getting off, press the bell. When you see your own window.'), 'He points at the window, then at the red button, then at the window again.'] },
          KS('“집” 정류장은 카드 다 찍힌 분만 서요.', 'The stop called “Home” is only for passengers whose card is fully punched.'),
          KS('종점까지 가실 거면 그냥 주무세요. 꿈이 거의 끝날 때 도착해요.', 'If you’re going to the terminus, just sleep. We get there when the dream is nearly over.')] },
      { id: 'N1522', name: MUMNAME, look: MUM({ acc: 'bag' }), behavior: 'static', face: false, solid: true, at: [26, 5],
        lines: ['She is asleep against the window, her bag held tight on her knees. Her stop went by long ago.', 'Her phone lights up in her hand: a photo of a sleeping child. Then it goes dark.'],
        onBell: [{ lines: ['Ding. She jolts awake.', KS('어? 여기 어디야… 아, 아직이구나.', 'Huh? Where are we… oh, not yet.'), 'She looks out of the window for a long time, then closes her eyes again.'] }, { secret: 'ns_bus_woke' }] },
      { id: 'N1523', name: 'A Passenger Asleep Upright', count: 3, look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: ['He sleeps sitting bolt upright, swaying with the bends. He has missed three stops and doesn’t mind.'] }],
    effect: { id: 'E227', how: 'mech', mech: { type: 'cycleFrames', mark: 'stopbell', every: 2.4, good: 6,
      frames: ['Outside: the hospital, every window lit, like a ship.', 'Outside: a laundromat glowing like an aquarium.', 'Outside: an office block with one floor lit, full of people whispering into headsets.',
        'Outside: a factory chimney breathing steam into the dark.', 'Outside: a convenience store, the only bright thing in the street.', 'Outside: market stalls under bare bulbs, not open yet.',
        'Outside: an apartment block. Twelfth floor, fourth window: lit.', 'Outside: nothing. The bus goes through a tunnel of night.'],
      doneLine: 'Outside, the stops go by in order, always the same.',
      winLines: ['Ding. The red STOP sign lights up over the driver.', 'The bus doesn’t stop. But the button comes away in your hand, still ringing.'] } },
    info: { summary: 'The N21, the bus that runs from nine at night to seven in the morning, with a door for every place she works.',
      rules: ['Press the stop button when the view shows a lit twelfth-floor window: the Stop Button (E227).', 'The views come round in order, always the same.', 'The stop “Home” needs the Timecard worn, all five boxes punched: the Bench Under the Twelfth Floor.', 'In the last three minutes of the dream, a door opens at the back of the bus: the Terminus.'],
      lore: '21:00–07:00. The stops of her night, in order.' } });
  link('W064', { to: 'W289', look: 'door', lookOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, label: 'the night bus N21' });

  /* ---------------------------------------------------------------
   *  W290 — La Laverie ouverte toute la nuit (P3)
   *  Paires de chaussettes sous les hublots : deuxième case. Le lave-linge
   *  12 bipe : bipeur porté (E230), il s'ouvre sur W294.
   * --------------------------------------------------------------- */
  var laundryPlace = [];
  [4, 7, 10, 13, 16, 19, 22, 25].forEach(function (x, i) { laundryPlace.push(D('wsh' + i, 'washer', [x, 2], ['A washing machine.'])); });
  [4, 8, 12, 16, 20, 24].forEach(function (x, i) { laundryPlace.push(D('dry' + i, 'washer', [x, 15], ['A dryer, tumbling something white. It never quite finishes.'], { lookOpt: { c: ['#e8e8e0'] } })); });
  S({ id: 'W290', name: 'The All-Night Laundromat', depth: 3, tier: 'hard', secretLevel: 3, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'the N21 stop', backAt: [1, 12],
    map: K.hall(32, 18, '#', '.'),
    look: { floor: { p: 'checker', c: ['#c8d0d8', '#9aa4b0'] }, wall: { p: 'flat', c: ['#2a3440', '#1a2430'], topColor: '#2a3440' }, wallface: { p: 'tile', c: ['#d8e4ec', '#b8c8d4', '#7a8a98'], skirt: '#4a5a68' } },
    style: { tallWalls: true }, music: 'laundromat2', amb: { type: 'machine', vol: 0.08 }, dark: 0.2,
    doors: [{ to: 'W294', at: [28, 2], look: 'washer', opt: { c: ['#a8b8c0'] }, cond: { equipped: 'E230' }, label: 'washer 12',
      locked: 'Washer 12, OUT OF ORDER. Inside, something beeps faintly, as if waiting for something like it.' }],
    place: laundryPlace.concat([D('folding', 'table', [15, 9], ['The folding table. A tunic folded in four, and a child’s PE kit folded in eight.']),
      D('bench1', 'bench', [8, 9], ['A plastic bench. Someone has left a magazine open at the horoscopes. Tomorrow: rest.']),
      D('bench2', 'bench', [22, 9], ['A bench facing the machines, like seats in a cinema.']),
      D('tv', 'tv', [29, 8], ['A television bolted to the wall, showing the weather for a city nobody here lives in.']),
      D('soap', 'vending', [2, 5], ['A machine selling single doses of washing powder. One button says “NIGHT”.']),
      SOUL([KS('엄마 유니폼이랑 내 체육복이 같은 기계에서 돌아. 그때만 같이 있어.', 'Mum’s uniform and my PE kit go round in the same machine. That’s the only time they’re together.')])]),
    npcs: [{ id: 'N1524', name: 'A Woman Folding Tunics', look: H({ t: 'adult', hairStyle: 'long', body: 'apron', c: ['#c8b8d0', '#a898b0', '#e0c0a0', '#2a1a1a'] }), behavior: 'static', solid: true, at: [15, 11],
        lines: [KS('병원 시트 한 동 전부예요. 아침까지 다 개야 돼요.', 'A whole wing’s worth of hospital sheets. They have to be folded by morning.'),
          { seq: [KS('양말은 꼭 다른 기계에서 짝을 찾아요.', 'A sock always finds its partner in another machine.'), 'She holds up two odd socks, one in each hand, and shakes her head.'] },
          KS('12번 세탁기는 고장이에요. 안에서 뭐가 자꾸 삐삐거려요.', 'Machine twelve is broken. Something inside keeps beeping.')] },
      { id: 'N1525', name: 'An Odd Sock', count: 2, look: { t: 'worm', c: ['#f0f0f0'], h: 8 }, behavior: 'wander', radius: 4, speed: 1, solid: false,
        lines: ['An odd sock hopping from machine to machine, looking.'] },
      { id: 'N1526', name: 'The Machines', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 18,
        ambientLines: ['Forty machines turning in the dark. It sounds like breathing.', KS('헹굼… 탈수… 헹굼…', 'Rinse… spin… rinse…')] }],
    mech: [{ type: 'pairs', tiles: ['wsh0', 'wsh1', 'wsh2', 'wsh3', 'wsh4', 'wsh5', 'wsh6', 'wsh7'], flag: 'ns_punch_laundry', reward: [{ set: { ns_punch_laundry: true } }],
      wrongLine: 'Two socks that don’t match. They go back in, sulking.', doneLine: 'Every sock has its pair. The machines spin in time.',
      winLines: ['The last pair finds each other. All the machines start spinning at once, one long sigh.', KACHUNK] }],
    info: { summary: 'A launderette open all night, where hospital sheets and odd socks go round under the strip lights.',
      rules: ['Each of the eight washers in the top row hides a sock: open two at a time, match all four pairs.', 'It punches the laundromat box of the Timecard.', 'Washer 12 beeps: wear the Pager (E230) and it opens onto the Drum.'],
      lore: '01:00. Everything that is washed comes back.' } });

  /* ---------------------------------------------------------------
   *  W291 — Le Centre d'appels des excuses chuchotées (P3)
   *  Ligne 7 : une petite voix s'excuse depuis une heure. Lui dire que ce
   *  n'est rien : troisième case. Un mur d'affiches cache la salle calme.
   * --------------------------------------------------------------- */
  var OK_WORDS = ['괜찮아', '괜찮아요', '괜찮다', '괜찮을 거야', 'it s okay', 'it s ok', 'its okay', 'its ok', 'it s all right', 'its all right', 'it s alright', 'its alright', 'that s okay', 'that s all right',
    'not your fault', 'don t be sorry', 'no need to be sorry', 'you don t have to be sorry', '네 잘못 아니야', '니 잘못 아니야', '미안해하지 마'];
  S({ id: 'W291', name: 'The Call Centre of Whispered Apologies', depth: 3, tier: 'hard', secretLevel: 3, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'the N21 stop', backAt: [1, 15],
    map: (function () {
      var g = K.grid(44, 30, ' '); g.box(0, 0, 44, 30, '#', '.');
      for (var y = 5; y <= 21; y += 4) for (var x = 4; x <= 34; x += 3) g.set(x, y, '{');
      g.hline(36, 42, 23, '#'); g.vline(36, 23, 28, '#'); g.set(36, 26, 'p');
      return g.rows();
    })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'carpet', c: ['#3a4048', '#30363e'] }, paper: { p: 'paper', c: ['#e8e0c0', '#c8b890'] } }), tall: { '{': { look: 'desk', opt: { c: ['#7a7a80'] } } },
    style: { tallWalls: true }, music: 'apologies', amb: { type: 'whispers', vol: 0.07 }, dark: 0.45,
    place: [D('line7', 'phone', [22, 15], ['A phone with a blinking light: LINE 7. A small voice on it, saying sorry, over and over.'], { light: 1.2 }),
      D('poster1', 'poster', [8, 1], ['A poster: NEVER SAY “IT’S OKAY”. SAY “WE APOLOGISE FOR THE INCONVENIENCE”.', 'Someone has underlined NEVER three times.']),
      D('poster2', 'poster', [30, 1], ['A poster: SMILE — THEY CAN HEAR IT.']),
      D('qclock', 'clock', [40, 25], ['A kitchen timer on the wall of the little room, set to three minutes.'], { use: [{ secret: 'ns_quiet_room' }] }),
      D('qchair', 'chair', [39, 27], ['A single chair facing the wall. A box of tissues under it, almost empty.']),
      SOULK([KS('여기선 삼 분 울 수 있어. 타이머 맞춰 놓고.', 'In here you can cry for three minutes. You set a timer.')], [41, 27])],
    npcs: [{ id: 'N1527', name: 'The Supervisor', look: H({ t: 'adult', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#e0c0a0', '#1a1a1a'], acc: 'headphones' }), behavior: 'patrol', path: [[3, 3], [40, 3]], speed: 0.5, solid: true,
        lines: [KS('사과하세요. 고객님이 우세요.', 'Apologise. The customer is crying.'), KS('7번 회선은 한 시간째 사과만 해요. 다들 뭐라고 대답할지 몰라요.', 'Line seven has been apologising for an hour. Nobody knows what to answer.')] },
      { id: 'N1528', name: 'An Operator', count: 6, look: H({ t: 'adult', hairStyle: 'short', body: 'shirt', c: ['#c8c8d0', '#a8a8b0', '#e0c0a0', '#1a1a1a'], acc: 'headphones', eyes: 'line' }), behavior: 'static', solid: true,
        lines: [KS('죄송합니다… 정말 죄송합니다…', 'I’m so sorry… I’m truly sorry…'), KS('불편을 드려 죄송합니다.', 'We apologise for the inconvenience.'), 'She whispers sorry into the headset, again and again, until the word wears smooth.'] },
      { id: 'N1529', name: 'Line Seven', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 6, ambientEvery: 10, at: [23, 15],
        ambientLines: [KS('…죄송해요. 제가 잘못했어요.', '…I’m sorry. It was my fault.'), KS('…다 저 때문이에요. 죄송해요.', '…It’s all because of me. I’m sorry.'), KS('…말 안 해서 죄송해요.', '…I’m sorry for not talking.')] }],
    mech: [{ type: 'sayTo', mark: 'line7', dist: 3, words: OK_WORDS, flag: 'ns_punch_calls', reward: [{ set: { ns_punch_calls: true } }],
      wrong: 'The small voice keeps saying sorry. Whatever you said, it wasn’t what it was waiting for.', doneLine: 'Line seven is quiet. Someone is breathing slowly on the other end.',
      winLines: ['A silence on the line. Then a very small breath, as if someone had put something heavy down.', KS('…괜찮아요? 진짜요?', '…It’s okay? Really?'), 'Every headset in the room goes quiet at once.', KACHUNK] }],
    info: { summary: 'An open-plan call centre at night where everyone whispers sorry into a headset.',
      rules: ['On line seven, a small voice has been apologising for an hour. Stand by the blinking phone.', 'Tell it it’s okay (“it’s okay”, “not your fault”, “괜찮아”…): it punches the call-centre box.', 'In the bottom-right corner, a wall of posters can be scrubbed away (Rubber Gloves, Eraser…).', 'Behind it, the Quiet Room.'],
      lore: '00:30. Apologies, on a rota.' } });

  /* ---------------------------------------------------------------
   *  W292 — La Chaîne d'emballage (P3)
   *  Traverser l'atelier en ne bougeant qu'au coup de presse : quatrième
   *  case. Les quinze dernières secondes de chaque minute, la goulotte des
   *  rebuts s'ouvre (chute vers la réserve de W293).
   * --------------------------------------------------------------- */
  S({ id: 'W292', name: 'The Packing Line', depth: 3, tier: 'hard', secretLevel: 3, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'the N21 stop', backAt: [20, 28],
    map: (function () { var g = K.grid(40, 30, ' '); g.box(0, 0, 40, 30, '#', '.'); [4, 8, 12, 16, 20, 24].forEach(function (y) { g.hline(2, 15, y, 'u'); g.hline(24, 37, y, 'u'); }); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#6a6a64', '#5a5a54'] }, counter: { p: 'hstripes', c: ['#3a3a3a', '#5a5a52'] }, wall: { p: 'metal', c: ['#3a3a3a', '#2a2a2a', '#4a4a4a'], topColor: '#2a2a2a' }, wallface: { p: 'metal', c: ['#7a7a70', '#5a5a52', '#3a3a34'], skirt: '#2a2a24' } },
    style: { tallWalls: true }, music: 'packingline', amb: { type: 'machine', vol: 0.1 }, dark: 0.35,
    decor: [{ look: 'crate', n: 5, lines: ['A box sealed with brown tape. The label says: FRAGILE — NIGHTS.'] }, { look: 'clipboard', n: 1, lines: ['The quota sheet: 8,000. Someone has written underneath, very small: “and then home”.'] }],
    place: [D('speaker', 'loudspeaker', [12, 1], ['A loudspeaker. It crackles every minute, just before the end of the minute.']),
      D('clock', 'wallclock', [27, 1], ['A clock over the line. Half past four. Two and a half hours to go.']),
      { id: 'rejects', type: 'hole', at: [3, 2], look: 'hatch', solid: true, to: 'W293', arrive: 'toW292', cond: { remainingMod: { every: 60, under: 15 } }, label: 'the rejects chute' },
      SOUL([KS('공장 사람들은 박자에 맞춰 늙어.', 'People at the plant grow old in time with the machine.')])],
    npcs: [{ id: 'N1530', name: 'A Packer', count: 6, look: H({ t: 'adult', head: 'cap', body: 'apron', c: ['#4a6a8a', '#3a5a7a', '#e0c0a0', '#1a1a1a'], eyes: 'line' }), behavior: 'static', solid: true,
        lines: [KS('하나, 둘, 셋, 상자. 하나, 둘, 셋, 상자.', 'One, two, three, box. One, two, three, box.'), 'He packs the same thing again and again: a small box with nothing in it, very carefully.',
          { seq: [KS('기계가 쉴 때 움직이면 안 돼요. 기계가 봐요.', 'Don’t move when the machine rests. The machine sees.'), 'He freezes every time the press goes quiet, and moves only when it stamps.'] }] },
      { id: 'N1531', name: 'The Foreman’s Loudspeaker', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 15,
        ambientLines: [KS('라인 멈추지 마세요.', 'Do not stop the line.'), KS('불량품은 매 분 끝에 버립니다.', 'Rejects are dumped at the end of every minute.'), KS('네 시 반. 앞으로 두 시간 반.', 'Half past four. Two and a half hours to go.')] },
      { id: 'N1532', name: 'A Box That Breathes', look: { t: 'blob', c: ['#b89060'], h: 10 }, behavior: 'static', solid: true,
        lines: ['A cardboard box that rises and falls very gently, as if something inside were asleep.'] }],
    mech: [{ type: 'rhythmWalk', period: 1.5, window: 0.55, zone: [17, 1, 22, 2], start: [20, 27], lineY: 26, flag: 'ns_punch_line', reward: [{ set: { ns_punch_line: true } }],
      failText: 'The press goes still. So should you. Back to the start of the line.',
      winLines: ['You reach the end of the line in time with the press.', 'The machine doesn’t notice you; it never notices anyone.', KACHUNK] }],
    info: { summary: 'A packing plant at half past four: belts, a press, and packers who never look up.',
      rules: ['Cross to the end of the line (top centre) moving only while the press stamps.', 'Moving in the silence sends you back. It punches the packing-line box of the Timecard.', 'In the last fifteen seconds of each minute, the rejects chute opens in the top-left corner.', 'It drops into the stockroom of the Store at four.'],
      lore: '04:30. The same gesture, eight thousand times.' } });

  /* ---------------------------------------------------------------
   *  W293 — Quatre heures à la supérette (P3)
   *  Pousser les trois cartons de livraison sur leurs marques : cinquième
   *  case. La chambre froide ne laisse entrer qu'avec le café glacé (E60).
   * --------------------------------------------------------------- */
  /* cases réservées (invisibles) : rien ne doit s'y poser, les cartons doivent pouvoir y passer */
  var KEEP293 = [[24, 7], [24, 8], [24, 10], [26, 7], [26, 8], [26, 9], [26, 10], [28, 7], [28, 8], [28, 9], [28, 10], [29, 9], [31, 9]].map(function (p) { return { id: 'keep' + p[0] + '_' + p[1], type: 'decor', at: p, solid: false, noInteract: true }; });
  S({ id: 'W293', name: 'Four O’Clock at the Store', depth: 3, tier: 'hard', secretLevel: 3, back: 'W063', backLook: 'door', backOpt: { style: 'metal', c: ['#6a7a6a'] }, backLabel: 'back into the other store', backAt: [1, 8],
    map: (function () {
      var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.');
      g.vline(5, 3, 12, '|'); g.vline(9, 3, 12, '|'); g.vline(13, 3, 12, '|'); g.rect(15, 15, 5, 1, 'u');
      g.vline(21, 1, 20, '#'); g.set(21, 6, '.'); g.hline(22, 32, 13, '#'); g.set(27, 13, '.');
      [23, 25, 27, 29].forEach(function (x) { g.vline(x, 2, 6, '#'); });
      return g.rows();
    })(),
    extra: { noFurnish: true },
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'tile', c: ['#e0e0d8', '#b8b8b0'] }, thin: { p: 'stripes', c: ['#e0e0e0', '#30a060'] }, counter: { p: 'wood', c: ['#30a060', '#208040', '#40b070'] } }),
    style: { tallWalls: true }, music: 'store4am', amb: { type: 'fridge', vol: 0.07 }, dark: 0.15,
    doors: [{ to: 'W289', at: [10, 20], look: 'door', opt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, label: 'the N21 stop outside' },
      { to: 'W292', at: [32, 10], look: 'ladder', label: 'the delivery hatch, up to the packing plant' }],
    place: [D('fridge0', 'fridge', [24, 1], ['A drinks fridge. Behind the glass, cans standing to attention.'], { lookOpt: { c: ['#c0e0f0'] } }),
      D('fridge1', 'fridge', [26, 1], ['A fridge of banana milk, all facing the same way.'], { lookOpt: { c: ['#c0e0f0'] } }),
      D('fridge2', 'fridge', [28, 1], ['A fridge of rice triangles, tuna and kimchi.'], { lookOpt: { c: ['#c0e0f0'] } }),
      D('plate0', 'chalkmark', [24, 2], ['A taped square on the floor: DELIVERY.'], { solid: false }),
      D('plate1', 'chalkmark', [26, 2], ['A taped square on the floor: DELIVERY.'], { solid: false }),
      D('plate2', 'chalkmark', [28, 2], ['A taped square on the floor: DELIVERY.'], { solid: false }),
      D('crate0', 'crate', [24, 9], ['A delivery box. Heavy. It slides, if you push.']),
      D('crate1', 'crate', [27, 9], ['A delivery box. It smells of cold cardboard.']),
      D('crate2', 'crate', [30, 9], ['A delivery box. 04:00, it says, as if boxes knew the time.']),
      { id: 'walkin', type: 'decor', at: [27, 13], look: 'fridge', lookOpt: { c: ['#e0f0f8'] }, solid: false, block: { unless: { equipped: 'E60' } },
        lines: ['The door of the walk-in fridge, frosted shut. Something very cold in your hand might know the way in.'] },
      D('expired', 'fridge', [24, 17], ['Crates of rice triangles past their date. The night clerk’s dinners, for the next ten years.']),
      D('note', 'coffee', [29, 15], ['A carton of banana milk set aside, with a sticky note: “for the nurse at four”.'], { use: [{ secret: 'ns_cold_room' }] }),
      D('cchair', 'chair', [30, 18], ['A crate turned into a chair, in the cold. Somebody eats here, alone, wearing gloves.']),
      D('wclock', 'wallclock', [18, 1], ['04:00. The hour of deliveries, and of people who can’t sleep.']),
      D('coffee', 'coffee', [2, 3], ['A coffee machine. Iced Americano, 1,500 won. Hot, the same price.']),
      D('bin', 'trash', [19, 19], ['A bin by the door, full of straws and receipts.']),
      SOUL([KS('유통기한 지난 삼각김밥은 알바 저녁이야. 버리는 척하고 먹어.', 'Rice triangles past their date are the clerk’s dinner. You pretend to bin them, and eat them.')], [26, 19])].concat(KEEP293),
    npcs: [{ id: 'N1533', name: 'The Night Clerk at Four', look: H({ t: 'adult', head: 'cap', body: 'apron', c: ['#30a060', '#208040', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, at: [17, 16],
        lines: [KS('네 시에 물건 들어와요. 상자는 냉장고 앞 표시에 놓으면 돼요.', 'Deliveries come at four. The boxes go on the marks in front of the fridges.'),
          { seq: [KS('밀기만 할 수 있어요. 당기는 건 안 돼요. 저도 그래요.', 'You can only push them. Never pull. Same as me.'), 'He mimes pushing a box with both hands, then mimes pulling, and shakes his head.'] },
          KS('상자가 끼면 나갔다가 다시 들어와요. 물건은 또 와요.', 'If a box gets stuck, go out and come back in. The delivery comes again.'),
          KS('저 간호사님은 매일 네 시에 와요. 바나나우유 하나, 삼각김밥 하나.', 'That nurse comes in at four every day. One banana milk, one rice triangle.')] },
      { id: 'N1534', name: MUMNAME, look: MUM({ acc: 'bag' }), behavior: 'turnaway', solid: true, at: [12, 14],
        lines: [{ seq: ['She counts the coins in her palm, twice.', 'One banana milk, one rice triangle: tomorrow’s breakfast, for someone else.'] }, 'She has her back to you. In the dark shop window, her reflection has its eyes closed.'] },
      { id: 'N1535', name: 'A Cat on the Freezer', look: { t: 'cat', c: ['#c8a070'], h: 9 }, behavior: 'static', solid: true, at: [3, 16],
        lines: ['A cat asleep on the ice-cream freezer, for the warmth of the motor.'] }],
    mech: [{ type: 'push', blocks: ['crate0', 'crate1', 'crate2'], plates: ['plate0', 'plate1', 'plate2'], flag: 'ns_punch_store', reward: [{ set: { ns_punch_store: true } }],
      winLines: ['The three boxes sit on their marks in front of the fridges. Four o’clock. Delivery done.', KS('수고하셨습니다.', 'Thank you for your hard work.'), KACHUNK] }],
    info: { summary: 'The stockroom of a convenience store at four in the morning, when the deliveries come.',
      rules: ['Push the three delivery boxes up the three narrow bays, onto the taped marks by the fridges.', 'You can only push; leave and come back if one gets stuck. It punches the store box of the Timecard.', 'The walk-in fridge at the bottom of the stockroom only lets in someone holding the Iced Coffee (E60).', 'A delivery hatch leads up to the Packing Line; the rejects chute up there falls back down here.'],
      lore: '04:00. One banana milk, one rice triangle.' } });
  link('W063', { to: 'W293', look: 'door', lookOpt: { style: 'metal', c: ['#6a7a6a'] }, label: 'the stockroom door, at four' });

  /* ---------------------------------------------------------------
   *  W294 — Dans le tambour (P4)
   *  Un anneau d'acier qui tourne : trois tours complets ouvrent le hublot
   *  (W299). On y tombe aussi par la goulotte (W287) et le siphon (W286).
   * --------------------------------------------------------------- */
  S({ id: 'W294', name: 'Inside the Drum', depth: 4, tier: 'hard', secretLevel: 4, back: 'W290', backLook: 'washer', backOpt: { c: ['#a8b8c0'] }, backLabel: 'the door of washer 12', backAt: [15, 28],
    map: K.ring(31, 31, '#', '.', 'o'),
    look: { floor: { p: 'dots', c: ['#8a9aa8', '#6a7a88'] }, rock: { p: 'metal', c: ['#a8b8c8', '#8898a8', '#c8d8e8'] } },
    style: { renderer: 'psychedelic', cliffH: 0.6, cliff: '#2a3a48', sky: ['#1a2a38', '#3a5a70'] }, music: 'spincycle', amb: { type: 'machine', vol: 0.09 }, dark: 0.35, weather: { dust: true },
    doors: [{ to: 'W299', at: [15, 2], look: 'window', opt: { c: ['#c8e0f0'] }, cond: { tempGte: { ns_drum_laps: 12 } }, label: 'the porthole' }],
    place: [D('landing', 'towel', [15, 25], ['A heap of warm towels. You landed on it. Someone always leaves one there.'], { solid: false }),
      D('tangle', 'clothesline', [6, 15], ['Her tunic and your school uniform, knotted together by the sleeves. They have gone round like this for years.'], { use: [{ secret: 'ns_tangled' }], lookOpt: { c: ['#d8e8e4', '#2a3458'] } }),
      SOULK([EN('Three turns and everything comes clean. Even the night. Even you.')])],
    npcs: [{ id: 'N1536', name: 'Floating Clothes', count: 4, look: ghost('rgba(230,240,250,0.5)', 16), behavior: 'wander', radius: 5, speed: 1.6, solid: false, talkable: true,
        lines: ['A shirt drifts past, arms open, as if it wanted to hold something.', 'A sock goes by, still looking for its pair.'] },
      { id: 'N1537', name: 'A Soap Bubble', count: 3, look: { t: 'jelly', c: ['rgba(220,240,255,0.6)'], h: 9, glow: '#d0f0ff' }, light: 1, behavior: 'fly', radius: 6, speed: 0.6, solid: false,
        lines: ['A soap bubble. Inside, the reflection of a lit window.'] },
      { id: 'N1538', name: 'The Spin', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 14,
        ambientLines: [KS('돌고… 돌고… 또 돌고…', 'Round… and round… and round again…'), 'The drum turns. If you turn with it, it goes faster.'] }],
    mech: [{ type: 'laps', center: [15, 15], key: 'ns_drum_laps' }],
    info: { summary: 'The inside of washer 12: a steel ring turning around its own centre, full of floating clothes.',
      rules: ['Run three full laps around the centre: the porthole at the top opens onto the Window from Outside.', 'On the floor, her tunic and a school uniform are knotted together.', 'Ways in: washer 12 (with the Pager), the Handover’s linen chute, the Cupboard Cathedral’s drain.'],
      lore: 'Everything that is washed at night ends up turning together.' } });

  /* ---------------------------------------------------------------
   *  W295 — Le Marché de l'aube (P3)
   *  La liste froissée : lait, riz, appeler Sora, dormir. Tout trouver :
   *  la patate douce chaude (E228). Un faux mur cache l'étal de grand-mère.
   * --------------------------------------------------------------- */
  S({ id: 'W295', name: 'The Dawn Market', depth: 3, tier: 'hard', secretLevel: 3, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'the N21 stop', backAt: [1, 16],
    map: (function () {
      var g = K.grid(50, 32, ' '); g.box(0, 0, 50, 32, '#', '.');
      [6, 12, 18, 24].forEach(function (y) { g.hline(6, 44, y, '{'); [14, 15, 29, 30].forEach(function (x) { g.set(x, y, '.'); }); });
      g.vline(4, 1, 4, '#'); g.hline(1, 4, 4, '#'); g.set(4, 2, '?');
      return g.rows();
    })(),
    look: { floor: { p: 'concrete', c: ['#6a6460', '#5a5450'] }, wall: { p: 'brick', c: ['#5a4038', '#4a3028', '#3a2420'] }, secret: { p: 'brick', c: ['#5a4038', '#4a3028', '#3a2420'] } },
    tall: { '{': { look: 'stall', opt: { c: ['#3a6a9a', '#e8e0d0'] } } }, outdoor: true, style: { sky: ['#1a1830', '#6a5070'] }, music: 'dawnmarket', amb: { type: 'crowd', vol: 0.04 }, dark: 0.4,
    doors: [{ to: 'W296', at: [48, 2], look: 'door', opt: { style: 'metal', c: ['#5a6a5a'] }, label: 'behind the bus depot' },
      { to: 'W297', at: [48, 29], look: 'stairsdown', label: 'the underpass towards the flats' }],
    decor: [{ look: 'lamp', n: 5, lines: ['A bare bulb on a wire. The moths have already found it.'] }, { look: 'fruit', n: 3, lines: ['Tangerines in a pyramid. The one at the top is the best and nobody will buy it.'] }],
    place: [D('milk', 'fridge', [10, 8], ['An ice box full of milk cartons, sweating in the cold.']),
      D('rice', 'barrel', [36, 14], ['Sacks of rice, open at the top, with a tin scoop.']),
      D('phone', 'payphone', [46, 28], ['A payphone by the market gate. You lift the receiver: the dial tone sounds like a held breath.']),
      D('stool', 'stool', [22, 26], ['A plastic stool behind a stall. Someone has slept on it, sitting up, between two customers.']),
      D('list', 'letter', [3, 14], ['A crumpled shopping list, in a hurried hand. Milk. Rice.', 'A name with a little telephone drawn beside it. Then a word that means sleep.', { t: '우유 — 쌀 — 소라 전화 — 잠', lang: 'ko-s', tr: 'milk — rice — call Sora — sleep' }], { solid: false }),
      D('can', 'wateringcan', [2, 2], ['A watering can, far too big, on an empty stall.', 'The stall has been closed since 2023. Nobody has taken the spot.'], { use: [{ secret: 'ns_grandma_stall' }] }),
      D('gstool', 'stool', [1, 1], ['A folding stool with a cushion sewn from an old jumper.']),
      SOULK([KS('할머니 자리야. 아직 아무도 안 앉아.', 'That’s Grandma’s spot. Nobody has sat there yet.')], [2, 3])],
    npcs: [{ id: 'N1539', name: 'The Fishmonger', look: H({ t: 'adult', hairStyle: 'short', body: 'apron', c: ['#3a5a7a', '#2a4a6a', '#e0b890', '#1a1a1a'] }), behavior: 'static', solid: true, at: [20, 9],
        lines: [KS('다섯 시 반. 생선은 지금이 제일 싸.', 'Half past five. Fish is cheapest now.'), KS('밤일 하는 사람들은 이 시간에 장 봐. 집에 가기 전에.', 'People who work nights do their shopping at this hour. Before going home.')] },
      { id: 'N1540', name: 'The Vegetable Grandmother', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#8a6a8a', '#6a4a6a', '#e0c0a0', '#d0d0d0'], eyes: 'closed' }), behavior: 'static', solid: true, at: [40, 21],
        lines: ['She dozes on her stool between two customers, a knife still in her hand, peeling something in her sleep.',
          { seq: [KS('파 한 단 천 원. 목록에 있는 거 다 사면 고구마 줄게.', 'Spring onions, a thousand won a bunch. Get everything on your list and I’ll give you a sweet potato.'), 'She taps the pocket where a shopping list would be, then points all around the market.'] }] },
      { id: 'N1541', name: MUMNAME, look: MUM({ acc: 'bag' }), behavior: 'turnaway', solid: true, at: [26, 15],
        lines: ['She stands in front of the fruit for a long time, then buys nothing but a single tangerine.', 'Her tunic is under her coat. You can see its hem.'] }],
    effect: { id: 'E228', how: 'mech', mech: { type: 'visitAll', marks: ['milk', 'rice', 'phone', 'stool'], countText: 'The list: # / %',
      winLines: ['Milk, rice, a phone call, a stool to sleep on. Everything on the list.', 'The grandmother at the vegetable stall presses something warm into your hands, wrapped in newspaper.', KS('엄마 갖다 줘. 따뜻할 때.', 'Take it to your mum. While it’s warm.')] } },
    info: { summary: 'A market at half past five, before opening, under bare bulbs: fish, rice, people coming off nights.',
      rules: ['A crumpled list by the entrance: milk, rice, call Sora, sleep.', 'Find the milk box, the rice sacks, the payphone and the sleeping stool: the Warm Sweet Potato (E228).', 'In the top-left corner, an empty stall hides behind a wall that isn’t one (Glasses, or similar).'],
      lore: '05:30. Shopping before sleep.' } });

  /* ---------------------------------------------------------------
   *  W296 — Le Terminus où dorment les bus (P3)
   *  Marcher sur les six baies dans l'ordre de la ligne. Sonner (E227)
   *  près du chauffeur endormi : il ouvre la cage des objets trouvés.
   * --------------------------------------------------------------- */
  var BAYS = [[6, 'STORE', '편의점'], [12, 'HOSPITAL', '병원'], [18, 'MARKET', '시장'], [24, 'LAUNDROMAT', '빨래방'], [30, 'PACKING PLANT', '공장'], [36, 'CALL CENTRE', '콜센터']];
  var termPlace = [];
  BAYS.forEach(function (b, i) {
    termPlace.push(D('bus' + i, 'train', [b[0], 10], ['A night bus asleep in its bay, its engine ticking as it cools.'], { lookOpt: { c: ['#2a6a4a', '#e8d040'] } }));
    termPlace.push(D('bay' + i, 'chalkmark', [b[0], 13], ['Painted on the tarmac in front of the bus: “' + b[1] + '”.', { t: b[2], lang: 'ko-s', tr: b[1].charAt(0) + b[1].slice(1).toLowerCase() }], { solid: false }));
  });
  S({ id: 'W296', name: 'The Terminus Where Buses Sleep', depth: 3, tier: 'hard', secretLevel: 3, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#3a8a5a'], symbol: 'N21' }, backLabel: 'the N21, back into service', backAt: [1, 20],
    map: (function () { var g = K.grid(44, 28, ' '); g.box(0, 0, 44, 28, '#', '.'); g.rect(2, 12, 38, 3, ','); g.vline(37, 1, 6, '#'); g.hline(37, 42, 6, '#'); g.set(37, 3, '.'); return g.rows(); })(),
    look: { floor: { p: 'asphalt', c: ['#3a3a40'] }, floor2: { p: 'lines', c: ['#3a3a40', '#c8c060'] }, wall: { p: 'concrete', c: ['#5a5a5a', '#4a4a4a', '#3a3a3a'] } },
    outdoor: true, style: { sky: ['#1a2040', '#8a7090'] }, music: 'terminus', amb: { type: 'birds', vol: 0.03 }, dark: 0.35,
    doors: [{ to: 'W295', at: [22, 26], look: 'gate', label: 'the market behind the depot' }],
    place: termPlace.concat([D('hut', 'hut', [33, 2], ['The drivers’ hut. Through the window, a kettle and a calendar stuck on a month long gone.']),
      { id: 'cage', type: 'decor', at: [37, 3], look: 'fence', solid: true, cond: { notFlag: 'ns_depot_open' }, lines: ['A wire cage: LOST PROPERTY — N21. Padlocked. The key hangs on the belt of the sleeping driver.'] },
      D('shoe', 'shoe', [40, 2], ['A child’s left shoe, very old, in a plastic bag with a label: “found on a platform”.']),
      D('case', 'suitcase', [41, 4], ['A small suitcase marked “J.”. It has been here for years. Nobody has come to claim it.']),
      D('pass', 'book', [39, 4], ['A monthly bus pass from 2008. The photo of a young woman who has just arrived, trying to smile.'], { use: [{ secret: 'ns_lost_property' }] }),
      SOUL([KS('첫차는 다섯 시 반. 밤차가 자야 첫차가 깨.', 'The first bus leaves at half five. The night buses have to sleep for it to wake.')])]),
    npcs: [{ id: 'N1543', name: 'The Sleeping Driver', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#2a5a4a', '#1a4a3a', '#e0c0a0', '#1a1a1a'], eyes: 'closed', acc: 'keys' }), behavior: 'static', face: false, solid: true, at: [34, 4],
        lines: ['The driver of the N21, asleep outside the hut with his cap over his eyes. A bunch of keys on his belt.', 'He doesn’t wake when you talk. Drivers only wake to a bell.'],
        onBell: [{ lines: ['Ding. The driver sits up at once, the way drivers do.', KS('네, 내리세요! …아, 종점이구나.', 'Yes, getting off! …Ah, it’s the terminus.'), 'Without really waking, he unhooks his keys, opens the lost-property cage, and goes back to sleep.'] }, { set: { ns_depot_open: true } }, { reeval: true }] },
      { id: 'N1544', name: 'The Dispatcher’s Radio', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 16,
        ambientLines: [KS('노선 순서대로 깨우세요. 병원부터.', 'Wake them in the order of the line. Hospital first.'), 'The radio crackles a list of stops, in order, then switches itself off.'] },
      { id: 'N1545', name: 'A Pigeon', count: 2, look: { t: 'bird', c: ['#8a8a9a'], h: 7 }, behavior: 'wander', radius: 5, speed: 1.2, solid: false,
        lines: ['A pigeon walking the bays as if it were checking the timetable.'] }],
    mech: [{ type: 'stepOrder', plates: { '12,13': 0, '24,13': 1, '36,13': 2, '30,13': 3, '6,13': 4, '18,13': 5 }, count: 6, flag: 'ns_terminus_order',
      reward: [{ set: { ns_terminus_order: true } }, { cookie: 1 }, { secret: 'ns_buses_woke' }],
      winLines: ['You walk the bays in the order of the night: hospital, laundromat, calls, the plant, the store, the market.', 'The buses wake one after another, headlights on, in the order of the line.'] }],
    info: { summary: 'The N21 terminus at dawn: night buses asleep in their bays, a driver asleep outside his hut.',
      rules: ['Step on the six painted bays in the order of the N21’s stops: the buses wake, and a biscuit.', 'The order: hospital, laundromat, call centre, packing plant, store, market.', 'Ring the Stop Button (E227) near the sleeping driver: he opens the lost-property cage.'],
      lore: '06:10. The end of the line.' } });

  /* ---------------------------------------------------------------
   *  W297 — Le Passage souterrain, six heures (P3)
   *  L'écho rend un autre mot : le lui rendre libère l'escalier (W298).
   *  Mains chaudes (E228), une porte peinte sur le carrelage (W286).
   * --------------------------------------------------------------- */
  S({ id: 'W297', name: 'The Underpass at Six', depth: 3, tier: 'hard', secretLevel: 3, back: 'W295', backLook: 'stairs', backLabel: 'back up to the market', backAt: [1, 4],
    map: K.hall(64, 9, '#', '.'),
    look: { floor: { p: 'tile', c: ['#5a6068', '#4a5058'] }, wall: { p: 'tile', c: ['#7a8288', '#5a6268', '#3a4248'], topColor: '#2a3038' }, wallface: { p: 'tile', c: ['#8a9298', '#6a7278', '#3a4248'], skirt: '#2a3038' } },
    style: { tallWalls: true }, music: 'underpass', amb: { type: 'drip', vol: 0.06 }, dark: 0.9, playerLight: 0.4,
    doors: [{ to: 'W298', at: [62, 4], look: 'stairs', cond: { flag: 'ns_echo' }, label: 'the stairs up to the crossing', locked: 'Stairs going up. You climb them and come out at the bottom again. The tunnel wants an answer.' },
      { to: 'W286', at: [45, 1], look: 'door', opt: { style: 'metal', c: ['#5a6a6a'] }, cond: { equipped: 'E228' }, label: 'a cleaning-cupboard door, painted on the tiles' }],
    decor: [{ look: 'poster', n: 3, lines: ['A poster for a missing cat. Underneath, in biro: “found”.', 'A poster for evening classes. Someone has written across it: “when?”', 'A faded poster: 24 HOURS. The rest has peeled off.'] },
      { look: 'puddle', n: 3, solid: false, lines: ['A puddle with the strip light in it, flickering.'] },
      { look: 'streetlamp', n: 2, lines: ['A strip light in a cage. It flickers whenever someone walks under it, as if it were counting them.'] }],
    place: [SOUL([KS('엄마는 여기를 지나갈 때 노래를 불러. 메아리가 대답해 주니까.', 'Mum sings when she goes through here. Because the echo answers.')])],
    npcs: [{ id: 'N1546', name: 'A Man Asleep on Cardboard', look: H({ t: 'adult', body: 'coat', c: ['#5a5040', '#4a4030', '#d0b090', '#3a3a3a'], eyes: 'closed' }), behavior: 'static', solid: true, at: [12, 6],
        lines: ['He sleeps on flattened boxes from the packing plant. FRAGILE — NIGHTS, upside down, under his cheek.',
          { seq: [KS('여기서 말하면 다른 말이 돌아와요. 그 말을 돌려줘요.', 'Say something in here and a different word comes back. Give that word back.'), 'He mimes calling into the tunnel, then cups his ear.'] },
          { seq: [KS('밤에는 벽에 문이 그려져 있어요. 손이 따뜻해야 보여요.', 'At night there’s a door painted on the wall. You only see it with warm hands.'), 'He holds his hands up to his mouth and breathes on them.'] }] },
      { id: 'N1547', name: 'Footsteps Overhead', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 19,
        ambientLines: ['Overhead, the first cars. The tunnel hums like a held note.', 'Footsteps behind you. When you turn round, only the echo.'] },
      { id: 'N1548', name: 'A Pigeon Under the Road', count: 2, look: { t: 'bird', c: ['#7a7a8a'], h: 7 }, behavior: 'wander', radius: 6, speed: 1.2, solid: false,
        lines: ['A pigeon that has lived its whole life under the road and has never seen the sky. It seems all right.'] }],
    mech: [{ type: 'echo', zone: [26, 1, 38, 7], words: ['later', 'sorry', 'tomorrow', 'soon', 'tired', 'home'], flag: 'ns_echo', reward: [{ set: { ns_echo: true } }],
      winLines: ['You give the echo its word back. This time it doesn’t answer.', 'At the far end of the tunnel, the stairs up stop repeating themselves.'] }],
    info: { summary: 'A long tiled underpass beneath the ring road, almost dark, between the market and the flats.',
      rules: ['Speak in the middle of the tunnel: the echo answers with another word.', 'Say that word back and the stairs up to the Crossing stop repeating themselves.', 'Holding the Warm Sweet Potato (E228), a door painted on the tiles appears: the Cupboard Cathedral.'],
      lore: '06:40. The walk home.' } });

  /* ---------------------------------------------------------------
   *  W298 — Le Passage piéton qui reste rouge (P3)
   *  Traverser pendant le vert (quelques secondes toutes les quarante) ;
   *  la grille de la cour ne s'ouvre qu'avec la carte pleine.
   * --------------------------------------------------------------- */
  var GREEN = { remainingMod: { every: 40, under: 9 } };
  var LIGHTLINE = { t: function () { return YN.cond.check(GREEN) ? 'The little man is green. Go.' : 'The little man is red. He has been red for a very long time.'; } };
  S({ id: 'W298', name: 'The Crossing That Stays Red', depth: 3, tier: 'hard', secretLevel: 3, back: 'W297', backLook: 'stairsdown', backLabel: 'back down into the underpass', backAt: [3, 2], outdoor: true,
    map: (function () { var g = K.grid(32, 24, ' '); g.box(0, 0, 32, 24, '#', '.'); g.rect(1, 8, 30, 8, ','); g.rect(13, 8, 5, 8, ':'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#8a8a88', '#6a6a68'] }, floor2: { p: 'asphalt', c: ['#34343c'] }, floor3: { p: 'stripes', c: ['#34343c', '#e8e8e0'] }, wall: { p: 'hedge', c: ['#2a4a30', '#1a3a20', '#3a5a3a', '#0c2410'] } },
    style: { sky: ['#2a3460', '#e8b890'] }, music: 'crossing', amb: { type: 'city', vol: 0.05 }, dark: 0.25, extra: { noExpand: true },
    decor: [{ look: 'bush', n: 3, lines: ['A municipal bush, trimmed square, waiting for spring.'] }, { look: 'telepole', n: 1, lines: ['A pole wrapped in old flyers: NIGHT WORK — GOOD PAY — NO EXPERIENCE NEEDED.'] }, { look: 'trash', n: 1, lines: ['A bin. On top, an empty coffee cup with a lipstick mark.'] }],
    place: [D('light1', 'streetlamp', [12, 7], [LIGHTLINE], { lookOpt: { c: ['#e04040'] }, lookIf: [{ cond: GREEN, lookOpt: { c: ['#40e070'] } }], light: 1 }),
      D('light2', 'streetlamp', [18, 16], [LIGHTLINE], { lookOpt: { c: ['#e04040'] }, lookIf: [{ cond: GREEN, lookOpt: { c: ['#40e070'] } }], light: 1 }),
      { id: 'tobench', type: 'door', at: [15, 21], look: 'gate', lookOpt: { c: ['#6a5a3a'] }, to: 'W300', label: 'the gate to the courtyard', cond: { flag: 'ns_green' },
        lock: { if: CARD_FULL, text: 'The gate to the courtyard: a bench, the block. Not yet. Her card isn’t full; the night isn’t over.' } },
      SOUL([KS('빨간불 앞에서 자는 건 위험해. 근데 집까지 오 분이면 다 참을 수 있어.', 'Sleeping at a red light is dangerous. But with home five minutes away, you can put up with anything.')])],
    npcs: [{ id: 'N1549', name: MUMNAME, look: MUM({ acc: 'bag' }), behavior: 'turnaway', solid: true, at: [17, 6],
        lines: ['She has fallen asleep standing up at the kerb, waiting for the green. Her shopping hangs from two fingers.', 'Every time the little man turns green, she is asleep. Every time she wakes, it is red.'] },
      { id: 'N1550', name: 'Cars Nobody Drives', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 14,
        ambientLines: ['A car goes past with nobody inside, very slowly, headlights on.', 'A bus goes by the other way: N21, NOT IN SERVICE.'] },
      { id: 'N1551', name: 'A Street Sweeper', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#e08020', '#c06010', '#d0a080', '#2a2a2a'], acc: 'broom' }), behavior: 'wander', radius: 4, speed: 0.8, solid: true, at: [22, 19],
        lines: [KS('여기 신호 기다리다 잠드는 사람 많아요. 깨우면 화내요.', 'Lots of people fall asleep here waiting for the lights. Wake them and they get cross.'),
          { seq: [KS('초록불은 사십 초에 한 번. 아주 짧게.', 'Green comes once every forty seconds. Very briefly.'), 'He counts on his fingers, slowly, up to forty, then snaps them.'] }] }],
    mech: [{ type: 'reach', zone: [11, 16, 19, 17], cond: GREEN, flag: 'ns_green', reward: [{ set: { ns_green: true } }],
      failLine: 'Red. The little man is red. You are on the other side, but nobody crossed.',
      winLines: ['You cross on the green, the only time it has ever been green.', 'Behind you the road folds up like a sheet. On this side, a gate to the courtyard.'] }],
    info: { summary: 'A pedestrian crossing at 06:55 whose little man is always red, and a woman asleep on her feet at the kerb.',
      rules: ['The light turns green for a few seconds every forty seconds of dream: cross then and reach the far kerb.', 'The gate to the courtyard then appears.', 'It only opens with the Timecard worn and all five boxes punched: the Bench Under the Twelfth Floor.'],
      lore: '06:55. Five minutes from home.' } });

  /* ---------------------------------------------------------------
   *  W299 — La Fenêtre vue du dehors (P4)
   *  La façade, la nuit : frapper trois fois à la quatrième fenêtre du
   *  douzième étage (1204). Un chemin d'ombre sur le vide mène au coin.
   * --------------------------------------------------------------- */
  var FLOORS = { 3: 13, 9: 12, 15: 11, 21: 10 };
  var WINLINES = {
    13: ['A man asleep on a sofa, the television still talking to him.', 'A child doing homework at three in the morning, a clock on the desk.', 'Nobody. A plate of rice under another plate.',
      'An old man watering a plant by lamplight.', 'Curtains drawn, and a line of blue light underneath: a screen.', 'Two people eating in silence, each with a phone.'],
    12: ['An empty cot. A mobile turning by itself.', 'A man ironing a shirt for tomorrow. It is already tomorrow.', 'An old woman asleep in a chair with the light on, so the girl next door won’t be the only one.',
      'A girl asleep with the lamp on. The lamp has been on for years.', 'Dark. Someone has just come home.', 'A dog waiting by the door, ears up.'],
    11: ['A woman practising a smile in a mirror for tomorrow’s meeting.', 'A teenager awake, headphones on, mouthing the words.', 'Dark.', 'A fish tank glowing in an empty room.', 'A man writing a letter, crossing it out.', 'Dark.'],
    10: ['Dark.', 'A grandmother folding laundry for a whole family.', 'A light left on in a kitchen for someone who is late.', 'Dark.', 'A child asleep on the floor in front of a cartoon.', 'A cat on the windowsill, looking at you.']
  };
  var facPlace = [];
  Object.keys(FLOORS).forEach(function (y) {
    var fl = FLOORS[y];
    facPlace.push(D('num' + fl, 'plaque', [4, +y], ['A number painted on the concrete by the fire escape: ' + fl + '.']));
    [8, 14, 20, 26, 32, 38].forEach(function (x, i) { var lit = !/^Dark/.test(WINLINES[fl][i]); facPlace.push(D('win' + fl + '0' + (i + 1), 'window', [x, +y], [WINLINES[fl][i]], { light: lit ? (fl === 12 && i === 3 ? 3 : 1.4) : 0 })); });
  });
  S({ id: 'W299', name: 'The Window from Outside', depth: 4, tier: 'hard', secretLevel: 4, back: 'W300', backLook: 'ladder', backLabel: 'down the fire escape to the bench', backAt: [2, 22], outdoor: true,
    map: (function () {
      var g = K.grid(48, 26, ' '); g.rect(1, 1, 42, 23, '#');
      [3, 9, 15, 21].forEach(function (y) { g.rect(2, y, 40, 2, '.'); });
      g.rect(2, 3, 2, 20, '.');
      g.hline(42, 45, 10, 'k'); g.vline(45, 6, 10, 'k'); g.rect(44, 4, 3, 2, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'concrete', c: ['#5a5a64', '#4a4a54'] }, wall: { p: 'concrete', c: ['#3a3a48', '#2a2a38', '#4a4a58'], topColor: '#2a2a38' }, wallface: { p: 'concrete', c: ['#6a6a7a', '#5a5a6a', '#3a3a48'], skirt: '#2a2a38' }, dark: { p: 'void', c: ['#06060e'] } },
    style: { tallWalls: true, stars: true, renderer: 'watercolor', sky: ['#04051a', '#1a2040'], cliffH: 1, cliff: '#0a0a18' }, music: 'windowoutside', amb: { type: 'wind', vol: 0.05 }, dark: 0.45, extra: { noExpand: true },
    doors: [{ to: 'W285', at: [40, 22], look: 'window', cond: { visited: 'W285' }, label: 'back into the forty minutes' },
      { to: 'W294', at: [40, 16], look: 'washer', opt: { c: ['#a8b8c0'] }, cond: { visited: 'W294' }, label: 'the porthole, from this side' }],
    place: facPlace.concat([D('corner', 'window', [45, 4], ['The window round the corner, that nobody can see from the courtyard.', 'On the steamed-up glass, drawn with a finger: a woman, a girl, and a lamp, switched off.'], { light: 1, use: [{ secret: 'ns_corner_window' }] }),
      SOULK([EN('Twelfth floor. Fourth window. Twelve-oh-four.')], [6, 10])]),
    npcs: [{ id: 'N1552', name: 'The Other Windows', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 17,
        ambientLines: ['Somewhere below, a window lights up. Someone else isn’t sleeping either.', 'A window goes dark. Someone has come home.'] },
      { id: 'N1553', name: 'A Moth at the Glass', count: 2, look: { t: 'moth', c: ['#e0d8b0'], h: 7, glow: '#fff0b0' }, behavior: 'fly', radius: 6, speed: 0.8, solid: false,
        lines: ['A moth beating against a lit window, very gently, as if knocking.'] }],
    mech: [{ type: 'knock', mark: 'win1204', n: 3, within: 2.5, flag: 'ns_window_knocked', reward: [{ set: { ns_window_knocked: true } }, { secret: 'ns_window_knocked' }],
      firstLine: 'Knock.', doneLine: 'The fourth window on the twelfth floor is dark. Behind the glass, someone is sleeping properly.',
      winLines: ['Knock, knock, knock.', 'Inside, the bedroom door opens a crack. A hand in a white sleeve finds the switch.', 'Click. The window goes dark.', 'For the first time you watch, from outside, someone turn the light off for her.'] }],
    info: { summary: 'The façade of the apartment block at night, seen from outside: ledges, a fire escape and rows of lit windows.',
      rules: ['Find the fourth window on the twelfth floor (1204) and knock three times, quickly.', 'At the right-hand end of the twelfth floor, a strip of shadow over the void holds your weight.', 'Round the corner: a window nobody can see from below.'],
      lore: 'Every lit window is someone waiting. Hers is the fourth on the twelfth floor.' } });

  /* ---------------------------------------------------------------
   *  W300 — Le Banc sous le douzième étage (P4) — la fin de la nuit
   *  S'asseoir à côté d'elle : on lève les yeux ensemble (W299).
   *  Lui dire bonne nuit : un lit derrière la haie (W285).
   * --------------------------------------------------------------- */
  var SAY_GOODNIGHT = { any: [{ said: 'good night' }, { said: 'goodnight' }, { said: 'night night' }, { said: 'sleep well' }, { said: '잘 자' }, { said: '잘자' }, { said: '안녕히 주무세요' }] };
  var benchPlace = [];
  [4, 8, 12, 16, 20, 24, 28, 32].forEach(function (x, i) { benchPlace.push(D('bw' + i, 'window', [x, 5], [i === 3 ? 'The fourth window, twelve floors up. Lit.' : 'A window, twelve floors up. Dark, or almost.'], { light: i === 3 ? 2.5 : 0 })); });
  S({ id: 'W300', name: 'The Bench Under the Twelfth Floor', depth: 4, tier: 'hard', secretLevel: 4, back: 'W289', backLook: 'door', backOpt: { style: 'glass', c: ['#e8d070'], symbol: '1204' }, backLabel: 'the N21 stop', backAt: [1, 22], outdoor: true,
    map: (function () { var g = K.grid(36, 26, ' '); g.box(0, 0, 36, 26, '#', '.'); g.rect(1, 1, 34, 4, '#'); g.rect(4, 8, 28, 12, ','); return g.rows(); })(),
    look: { floor: { p: 'path', c: ['#8a8070', '#7a7060'] }, floor2: { p: 'grass', c: ['#3a5a3a', '#345434', '#4a6a40', '#2a4a2a'] }, wall: { p: 'concrete', c: ['#4a4a58', '#3a3a48', '#5a5a68'], topColor: '#3a3a48' }, wallface: { p: 'concrete', c: ['#7a7a88', '#6a6a78', '#4a4a58'], skirt: '#3a3a48' } },
    style: { tallWalls: true, renderer: 'watercolor', sky: ['#1a2040', '#f0c8a0'] }, music: 'benchatseven', amb: { type: 'birds', vol: 0.05 }, dark: 0.2, extra: { noExpand: true },
    doors: [{ to: 'W298', at: [34, 22], look: 'gate', opt: { c: ['#6a5a3a'] }, label: 'the crossing' },
      { to: 'W299', at: [16, 6], look: 'ladder', cond: { flag: 'ns_looked_up' }, label: 'the fire escape, up to the lit window' },
      { to: 'W285', at: [32, 20], type: 'bed', look: 'bed', opt: { c: ['#f0f0f8', '#c8d0e0'] }, cond: SAY_GOODNIGHT, label: 'her bed, for the day' }],
    place: benchPlace.concat([[6, 9], [7, 18], [28, 9], [30, 17]].map(function (p, i) { return D('hedge' + i, 'bush', p, ['A hedge clipped by someone from the building, a little crooked.']); }),
      [[12, 16], [25, 16]].map(function (p, i) { return D('border' + i, 'flowers', p, ['Flowers in the border, planted by someone who loved gardening. Somebody still waters them.']); }), [D('bench', 'bench', [18, 13], ['The bench. The paint has worn away in two places: where she sits, and next to it.']),
      D('tin', 'jar', [20, 13], ['An empty coffee tin used as an ashtray, tucked behind the bench leg. Full. Each one is a night.']),
      D('lamp', 'streetlamp', [10, 12], ['A street lamp. It goes off at seven, like everything else.'], { light: 2 }),
      D('worn', 'scuff', [18, 14], ['The gravel in front of the bench is worn into two hollows: one for her feet, one smaller.'], { solid: false }),
      { id: 'keep17', type: 'decor', at: [17, 14], solid: false, noInteract: true }, { id: 'keep19', type: 'decor', at: [19, 14], solid: false, noInteract: true },
      SOUL([KS('집에 들어가기 전에 딱 한 대. 냄새 빠질 때까지 여기 앉아 있어.', 'Just one before going in. She sits here until the smell has gone.')])]),
    npcs: [{ id: 'N1554', name: MUMNAME, look: MUM({ eyes: 'dots', alpha: 0.9 }), behavior: 'static', face: false, solid: true, at: [19, 13],
        lines: ['She is sitting on the bench in her coat, her tunic underneath. A thin line of smoke goes straight up.', 'She stubs the cigarette out when she sees you, quickly, as if you had caught her.',
          KS('…왜 안 자. 엄마 이것만 피우고 올라갈게.', '…Why aren’t you asleep? I’ll come up when I’ve finished this one.'), KS('저기 봐. 우리 집 불 켜져 있다. 또 불 켜고 잤지.', 'Look up there. Our light’s on. You fell asleep with it on again.'),
          'She pats the bench beside her without looking at you.'],
        hears: [{ match: ['good night', 'goodnight', 'night night', 'sleep well', '잘 자', '잘자', '안녕히 주무세요'], lines: ['She laughs, very quietly, through her nose.', KS('그건 엄마가 할 말인데. …그래, 잘 자.', 'That’s my line. …All right. Goodnight.'), 'Behind the hedge, something like a bed, unmade, waiting for the day.'], do: [{ secret: 'ns_goodnight' }] }] },
      { id: 'N1555', name: 'A Blackbird on the Railing', look: { t: 'bird', c: ['#1a1a1a'], h: 8 }, behavior: 'fly', radius: 5, speed: 1, solid: false,
        lines: ['A blackbird, whistling three notes. The same three as in a garden, long ago.'] }],
    mech: [{ type: 'standStill', zone: [17, 14, 19, 14], secs: 24, flag: 'ns_looked_up', reward: [{ set: { ns_looked_up: true } }, { secret: 'ns_looked_up' }], breakLine: 'She glances at you, then back up at the window.',
      winLines: ['You sit beside her. Neither of you says anything. The smoke goes straight up; there is no wind.', 'She looks up. You look up. The fourth window on the twelfth floor is lit.', 'The fire escape, at the foot of the block, is waiting for you.'] }],
    info: { summary: 'The courtyard of the block at 07:05: a bench, a thin line of smoke, a lit window on the twelfth floor.',
      rules: ['Only reachable with the Timecard worn and all five boxes punched (bus stop “Home”, or the Crossing).', 'Stay still in front of the bench beside her: you look up together.', 'The fire escape then climbs to the Window from Outside.', 'Say “goodnight” to her: a bed appears behind the hedge, onto Forty Minutes of Sleep.'],
      lore: '07:05. The shift is over. One cigarette before going up.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
