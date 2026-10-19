/* =========================================================================
 *  NOUVEAUX MONDES (04) — W261 à W280 : « The Northern Line »
 *  Une ligne de chemin de fer rêvée qui part de Happiness Station (W035)
 *  vers le nord ; chaque monde est un arrêt. Tout le monde dit que tout va
 *  bien ; les fissures se voient.
 *   Ligne : W261 gare à l'heure juste → W262 train arrêté → W263 village aux
 *   lumières minutées → W264 stade → W265 ferme à 300 % → W266 grand magasin
 *   → W268 jardin d'enfants → W272 immeubles sans courant → W273 tunnel →
 *   W274 place du monument la nuit → W275 bureau des laissez-passer →
 *   W276 pont à l'horizon peint (P4) → W278 halte hors carte (P4) → W280
 *   cabane de la lampe (P4).
 *   Branches : W269 hôtel des visiteurs → W270 salle d'écoute ; W267 marché
 *   derrière la gare ; W271 coiffeur ; W279 tirage au sort → W277 salle des
 *   retrouvailles (P4).
 *  Fil rouge : cinq traces de 철이 (W263, W264, W268, W272, W275) ouvrent la
 *  cabane de la lampe (W280) ; le guide Kang (N1400) suit la ligne.
 *  Habitants : coréen du Nord surtout. Effets E219–E224. PNJ N1400–N1499.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* une âme qui porte un indice : elle reste là chaque nuit tant qu'elle n'a pas parlé */
  function HINT(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines, keepSoul: true }; }
  /* ajoute une porte dans un monde déjà défini */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  function VOICE(id, lines, every) { return { id: id, name: 'The Announcer', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 44, ambientEvery: every || 22, ambientLines: lines }; }
  var NK = K.LOOK.nk;
  var LINE = { c: ['#6a2a2a', '#e8d8a0'] };   // la livrée du train de la ligne du Nord
  var CHOL = ['nl_chol1', 'nl_chol2', 'nl_chol3', 'nl_chol4', 'nl_chol5'];

  /* ---------------------------------------------------------------
   *  Effets E219–E224
   * --------------------------------------------------------------- */
  [
    { id: 'E219', name: 'Travel Permit', fam: 'bureaucracy', world: 'W275', icon: { glyph: '▤', c: '#c8b080' }, acc: 'ticket', action: 'stamp', caps: ['ticket'],
      desc: '려행증. Valid for one journey, in one direction. The direction has been left blank.',
      use: 'Shown at doors that ask for papers: the border train, the front doors of the visitors’ hotel. Stamps (F).',
      get: 'The Travel Permit Office: go to the windows in the order the clerks demand.', ground: false, core: false },
    { id: 'E220', name: 'Unsealed Radio', fam: 'sound', world: 'W267', icon: { glyph: '◘', c: '#7a5a3a' }, acc: 'radio', action: 'radio',
      desc: 'The state seal on the dial has been cut, very neatly. The label still says: fixed frequency.',
      use: 'Tune it (F, then left and right): some places broadcast on frequencies nobody admits to.',
      get: 'The Market Behind the Station: walk exactly in the radio man’s footprints.', ground: false, core: false },
    { id: 'E221', name: 'Red Scarf', fam: 'inhabitants', world: 'W268', icon: { glyph: '▼', c: '#d02828' }, acc: 'scarf', action: 'hide', caps: ['scarf'], stealth: 0.3,
      desc: 'Small and warm, as if someone had only just taken it off.',
      use: 'After dark, children in red scarves may go where adults may not. Blend in (F).',
      get: 'The Kindergarten That Sings on Cue: reach the coat hooks without ever moving in the silences.', ground: false, core: false },
    { id: 'E222', name: 'Two-Hour Watch', fam: 'time', world: 'W277', icon: { glyph: '◷', c: '#e0d8c0' }, acc: 'watch', action: 'stopTime',
      desc: 'Its face only goes up to two.',
      use: 'Holds time still for a moment (F). Trains that are late can see it.',
      get: 'The Reunion Hall: say, to the old man at table fifty-one, the name he is waiting for.', ground: false, core: false },
    { id: 'E223', name: 'Glassless Window', fam: 'perception', world: 'W263', icon: { glyph: '⊞', c: '#d8d0b8' }, action: 'reveal', caps: ['reveal'],
      desc: 'A window frame with no glass in it. Light goes straight through, and so does everything else.',
      use: 'Some walls are only painted: with it, you walk through them. F shows what is hidden nearby.',
      get: 'The Village of Timed Lights: light every window before the timers put them out.', ground: false, core: false },
    { id: 'E224', name: 'The Lamp Left On', fam: 'light', world: 'W280', icon: { glyph: '✧', c: '#f0d070' }, acc: 'lantern', action: 'lantern', light: 3.2,
      desc: 'A signal lamp for trains that no longer come.',
      use: 'Light it (F): it shows what the dark keeps, in tunnels and at halts.',
      get: 'The Lamp Hut at the End of the Line: gather the sparks from the stove without running.', ground: false, core: false }
  ].forEach(function (e) { if (!YN.effectById(e.id)) YN.data.effects.push(e); });

  /* ---------------------------------------------------------------
   *  Le guide Kang : il accompagne la ligne, d'arrêt en arrêt
   * --------------------------------------------------------------- */
  YN.defEntity({ id: 'N1400', name: 'Guide Kang', world: 'W261', kind: 'human', behavior: 'static', solid: true,
    look: H({ t: 'adult', hairStyle: 'short', body: 'suit', c: ['#2a2e3a', '#1e222c', '#e0c0a0', '#1a1a1a'], acc: 'clipboard', mouth: 'smile' }),
    lines: [KN('모든 것이 잘 되고 있습니다.', 'Everything is going well.')],
    worlds: {
      W261: { at: [27, 4], lines: [KN('어서 오십시오. 저는 안내원 강입니다. 이 역의 시계는 한 번도 틀린 적이 없습니다.', 'Welcome. I am Guide Kang. The clocks in this station have never once been wrong.'),
        KN('렬차가 늦으면 시간표를 고칩니다. 그래서 렬차는 늦지 않습니다.', 'When a train is late, we correct the timetable. That is why trains are never late.'),
        KN('철이라는 아이를 찾으십니까? 그런 아이는 없습니다. 역마다 물어보셔도 없습니다.', 'Are you looking for a boy called Chol-i? There is no such boy. Ask at every stop: there is none.')] },
      W263: { at: [20, 18], lines: [KN('이 마을 사람들은 모두 행복합니다. 지금은 다들 일하러 나갔습니다.', 'Everyone in this village is happy. Right now they have all gone out to work.'),
        KN('불은 저절로 켜지고 저절로 꺼집니다. 시간이 정해져 있습니다. 사람처럼.', 'The lights come on by themselves and go off by themselves. Their hours are fixed. Like people’s.'),
        KN('마을 뒤 밭에는 아무것도 없습니다. 벽도 없습니다. 들어가지 마십시오.', 'There is nothing in the field behind the village. Not even walls. Do not go in.')] },
      W264: { at: [30, 34], lines: [KN('십만 명이 한 사람처럼 움직입니다. 한 사람이 빠져도 아무도 모릅니다.', 'A hundred thousand people move as one. If one is missing, nobody notices.'),
        KN('저 빈자리 말입니까? 빈자리는 없습니다. 카드가 있습니다.', 'That empty seat? There are no empty seats. There is a card.')] },
      W266: { at: [22, 27], lines: [KN('보십시오, 진렬장이 가득합니다. 사지 마십시오. 보기만 하십시오.', 'Look, the display cases are full. Do not buy. Only look.'),
        KN('사람들이 아무것도 안 사는 것은 필요한 것이 다 있기 때문입니다.', 'People buy nothing because they already have everything they need.'),
        'When he thinks nobody is looking, he presses his nose to a display case, like a child.'] },
      W268: { at: [14, 23], lines: [KN('우리 아이들은 세상에서 제일 행복합니다. 들어 보십시오.', 'Our children are the happiest in the world. Listen.'),
        KN('노래가 멈추면 모두 멈춥니다. 그것이 질서입니다.', 'When the song stops, everyone stops. That is order.'),
        'He counts the coat hooks under his breath, gets to twenty-nine, and starts again.'] },
      W269: { at: [20, 12], lines: [KN('손님들은 이 호텔에서 편히 쉬십니다. 밖은 위험하지 않습니다. 그래서 나가실 필요가 없습니다.', 'Our guests rest comfortably here. Outside is not dangerous. So there is no need to go out.'),
        KN('저도 여기서 잡니다. 집은… 멉니다. 렬차로 하루, 려행증으로 한 달.', 'I sleep here too. Home is… far. One day by train, one month by permit.')] },
      W275: { at: [30, 15], lines: [KN('저도 려행증을 신청하러 왔습니다. 안내원도 신청합니다. 순서대로.', 'I have come to apply for a permit too. Guides apply as well. In the proper order.'),
        KN('양식, 사진, 도장, 서명. 순서를 틀리면 처음부터입니다. 저는 세 번 틀렸습니다.', 'Form, photograph, stamp, signature. Get the order wrong and you start again. I got it wrong three times.')] },
      W277: { at: [8, 25], lines: [KN('저도 신청했습니다. 사십 년 전에. 누나가 남쪽에 있습니다. 아마.', 'I applied too. Forty years ago. My older sister is in the South. Probably.'),
        { seq: ['He sits alone, before a name card he wrote himself. Nobody has drawn his name.', 'He smiles at you anyway: it is his job.'] },
        KN('모든 것이 잘 되고 있습니다. 정말입니다. 오늘은.', 'Everything is going well. Truly. Today.')] }
    },
    reacts: {
      E219: { lines: ['He looks at your permit for a long time.', KN('한 방향이라고 써 있군요. 어느 쪽인지는 안 써 있고. 좋은 려행증입니다.', 'It says one direction. It does not say which. That is a good permit.')] },
      E220: { lines: ['You switch the radio on beside him. He pretends not to hear it. After a moment, he is humming along.'] },
      E221: { lines: ['He straightens your red scarf without thinking, the way he would for his own child.'] }
    },
    info: { role: 'The guide of the Northern Line, met at eight stops. At the Reunion Hall he is waiting for his own sister.' } });

  /* ---------------------------------------------------------------
   *  W261 — La Gare à l'heure juste (premier arrêt)
   * --------------------------------------------------------------- */
  S({ id: 'W261', name: 'The Right-Time Station', depth: 3, tier: 'hard', back: 'W035', backLook: 'escalator', backOpt: { up: true }, backAt: [25, 1], backLabel: 'the escalator back up to Happiness Station',
    map: (function () { var g = K.grid(50, 28, ' '); g.box(0, 0, 50, 28, '#', '.'); g.rect(21, 1, 9, 12, ',');
      [[6, 5], [14, 5], [36, 5], [44, 5], [6, 10], [14, 10], [36, 10], [44, 10]].forEach(function (p) { g.set(p[0], p[1], '^'); });
      g.rect(1, 13, 48, 5, ':'); g.rect(1, 18, 48, 3, 'r'); g.rect(1, 21, 48, 6, ':'); return g.rows(); })(),
    look: Object.assign({}, NK, { floor3: { p: 'stone', c: ['#a8a090', '#8a8478', '#c0b8a8'] } }), tall: { '^': { look: 'pillar' } },
    style: { tallWalls: true }, music: 'rightclock', amb: { type: 'clock', vol: 0.05 },
    doors: [{ to: 'W262', type: 'train', look: 'train', opt: LINE, at: [10, 19], label: 'the northbound train, doors open' },
      { to: 'W269', look: 'door', opt: { style: 'glass', c: ['#c8a050'] }, at: [2, 3], label: 'glass doors marked for visitors' },
      { id: 'late', to: 'W278', look: 'door', opt: { style: 'metal', c: ['#4a4a5a'], symbol: '0' }, at: [47, 25], cond: { equipped: 'E222' }, secret: true, arrive: 'back', label: 'platform zero, for trains that are late' }],
    place: [{ id: 'gap', type: 'hole', to: 'W273', arrive: [34, 3], at: [40, 17], look: 'hole', cond: { flag: 'nl_waited' }, secret: true, label: 'a gap between two slabs at the edge of the platform' },
      { id: 'clock', type: 'decor', at: [25, 7], look: 'poleclock', lookOpt: { hour: 9 }, light: 1.5, lines: ['The great clock. It is exactly right. It has always been exactly right.', 'Under the clock, a brass plate: “corrected daily”.'] },
      { id: 'star', type: 'decor', at: [25, 10], look: 'spotlight', solid: false, lines: ['A brass star set into the carpet under the great clock, worn smooth by people hurrying across it.'] },
      { id: 'route', type: 'decor', at: [10, 1], look: 'board', lookOpt: { lines: ['정시 → 등불마을', '→ 경기장 → 농장 →', '→ …… → 국경'], color: '#f0e070' }, lines: ['The route map of the Northern Line. Each stop is a little lit bulb.', 'The last stops have been painted over. Under the paint, the bulbs are still on.'] },
      { id: 'portrait', type: 'decor', at: [40, 1], look: 'portrait', lookOpt: { redacted: true }, lines: ['A portrait above the platforms. The black band across the eyes was dusted this morning.'] },
      { id: 'bench1', type: 'decor', at: [8, 14], look: 'bench', lines: ['A marble bench. Nobody sits on it: sitting would look like waiting.'] },
      { id: 'bench2', type: 'decor', at: [18, 14], look: 'bench', lines: ['A bench, polished. A pair of gloves has been forgotten on it so long that they have been polished too.'] },
      { id: 'bench3', type: 'decor', at: [32, 14], look: 'bench', lines: ['A bench. Under the seat, where only a child would look, a tally of days is scratched.', 'It stops at a hundred and four.'] },
      { id: 'bench4', type: 'decor', at: [42, 14], look: 'bench', lines: ['A bench facing the rails. From here you can see that the far end of the platform is not quite flush.'] },
      SOUL([KN('여기서 기다리면 시계가 거짓말을 해야 합니다. 그래서 아무도 기다리지 않습니다.', 'If you wait here, the clock has to lie. That is why nobody waits.')])],
    decor: [{ look: 'poleclock', n: 3, lines: ['A platform clock. It agrees with the great clock to the second. They have never once disagreed.', 'A clock whose minute hand jumps, then waits, then jumps. It never waits long.', 'A clock with a little brass plate: “presented for punctuality”.'] },
      { look: 'loudspeaker', n: 2, lines: [KN('늦은 렬차는 없습니다. 늦은 사람만 있습니다.', 'There are no late trains. Only late people.')] }],
    npcs: [{ id: 'N1401', name: 'The Stationmaster', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#e0c8a8', '#c8c8c8'], acc: 'flag' }), behavior: 'patrol', path: [[4, 16], [46, 16]], speed: 0.5, solid: true,
        lines: [KN('기다리는 사람은 없습니다. 모두 제시간에 왔습니다.', 'Nobody is waiting. Everyone came on time.'), 'He checks his watch against the great clock. They agree. He looks relieved, then frightened.',
          { if: { equipped: 'E222' }, seq: ['He sees the watch on your wrist and stops dead.', KN('두 시간짜리 시계군요… 늦은 렬차는 령번 승강장에 섭니다. 저 구석입니다. 저는 아무 말도 안 했습니다.', 'A two-hour watch… Late trains stop at platform zero. In that corner. I said nothing.')] }] },
      VOICE('N1402', [KN('다음 역은 등불마을입니다.', 'The next station is Lamp Village.'), KN('모든 렬차는 정시에 도착합니다. 기다리지 마십시오.', 'All trains arrive on time. Please do not wait.'), KN('승강장 끝의 틈을 조심하십시오. 틈은 없습니다.', 'Mind the gap at the end of the platform. There is no gap.')]),
      { id: 'N1403', name: 'A Traveller Who Is Not Waiting', look: H({ t: 'adult', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#e0c0a0', '#2a2a2a'], acc: 'suitcase' }), behavior: 'wander', radius: 6, speed: 0.6, solid: true,
        lines: [KN('저는 기다리지 않습니다. 그냥 천천히 서 있는 겁니다.', 'I am not waiting. I am just standing slowly.'), 'Each time the minute hand jumps, he takes one step, so that nobody can say he is waiting.'] }],
    mech: [{ type: 'standStill', mark: 'star', secs: 30, flag: 'nl_waited', breakLine: 'You move. The great clock seems relieved.',
      winLines: ['You wait. Nobody is allowed to wait here, and you wait anyway.', 'The great clock shudders. For one second its face shows a time that does not exist: 23:71.', 'At the far end of the platform, two slabs move apart, very quietly, as if they had been waiting too.'],
      reward: [{ set: { nl_waited: true } }] }],
    info: { summary: 'A marble station where every clock is right to the second: the timetable is corrected when trains are late.',
      rules: ['Stand still for thirty seconds on the brass star under the great clock.', 'A gap then opens at the end of the first platform: it drops into the Unlit Tunnel (W273).',
        'With the Two-Hour Watch (E222) equipped, platform zero appears in the far corner (to W278).', 'The train goes on to the Stopped Train (W262); the glass doors lead to the Hotel for Visitors (W269).',
        'From Happiness Station, the northbound train only runs for those who carry the Stamp (E34).'],
      secrets: ['The gap at the platform edge.', 'Platform zero.'],
      lore: 'The first stop of the Northern Line, where nobody is ever late, because lateness is never written down.' } });
  link('W035', { to: 'W261', type: 'train', look: 'train', lookOpt: LINE, at: [12, 21], cond: { effect: 'E34' }, label: 'the northbound train',
    locked: [{ t: 'A dark red train, northbound. Its doors stay shut.' }, { t: 'A conductor taps his palm, where a travel stamp should be.' }] });

  /* ---------------------------------------------------------------
   *  W262 — Le Train arrêté
   * --------------------------------------------------------------- */
  S({ id: 'W262', name: 'The Stopped Train', depth: 3, tier: 'hard', back: 'W261', backOpt: { style: 'metal', c: ['#6a2a2a'] }, backAt: [1, 2], backLabel: 'the door back onto the platform of Right-Time Station',
    map: K.corridor(66, 3, '#', '.'),
    look: { floor: { p: 'hstripes', c: ['#4a3a2a', '#3a2a1a'] }, wall: { p: 'flat', c: ['#14100c', '#0a0806'], topColor: '#14100c' }, wallface: { p: 'panel', c: ['#5a6a5a', '#4a5a4a', '#2a3a2a'], skirt: '#1a2a1a' } },
    style: { tallWalls: true }, music: null, amb: { type: 'wind', vol: 0.04 }, dark: 0.5,
    doors: [{ to: 'W263', look: 'door', opt: { style: 'metal', c: ['#6a2a2a'] }, at: [64, 2], label: 'the far gangway, and the steps down at Lamp Village' },
      { to: 'W267', look: 'door', opt: { style: 'metal', c: ['#3a3a3a'] }, at: [33, 3], cond: { flag: 'nl_form262' }, secret: true, label: 'a side door, onto the embankment' }],
    place: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59].map(function (x, i) { return { type: 'decor', at: [x, 1], look: 'trainseat', lookOpt: { c: ['#5a3a3a'] }, lines: [['A seat with a coat folded on it. Its owner went out to look for water two days ago.', 'A seat. Someone has slept on it sitting up, for several nights, without creasing the cover.', 'A seat with a lunch tin under it. Empty, and washed.'][i % 3]] }; }).concat([
      { id: 'form', type: 'decor', at: [20, 3], look: 'clipboard', lines: ['A passenger satisfaction form, left on a seat.'] },
      { id: 'lamp', type: 'decor', at: [12, 3], look: 'lamp', lookOpt: { off: true }, lines: ['The carriage lamp is off. The bulb has been taken out and put away somewhere safe.'] },
      SOUL([KN('정전이 되면 렬차는 들판에 섭니다. 우리는 그것을 휴식이라고 부릅니다.', 'When the power goes, the train stops in the fields. We call it a rest.')])]),
    decor: [{ look: 'window', n: 4, lines: ['Outside: a field, a cow, a pylon with no wires. None of them has moved since you got on.', 'Outside, a boy walks beside the train, faster than it. He waves. Nobody waves back.', 'Outside, the same field. Someone has started a little vegetable patch next to the rails.'] }],
    npcs: [{ id: 'N1405', name: 'The Egg Seller', at: [40, 3], look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#7a6a5a', '#5a4a3a', '#e0c0a0', '#2a2a2a'], eyes: 'down' }), behavior: 'static', solid: true,
        lines: [KN('계란 사십시오… 아니, 계란은 없습니다. 아무것도 팔지 않습니다.', 'Buy an egg… no, there are no eggs. I am not selling anything.'), KN('렬차가 선 지 나흘째입니다. 그래도 곧 갑니다. 늘 곧 갑니다.', 'This is the fourth day the train has stood here. We leave soon. We always leave soon.'), 'She hides a basket under her coat. Something in it is warm.'] },
      { id: 'N1406', name: 'The Inspector', look: H({ t: 'tall', head: 'cap', body: 'uniform', c: ['#3a3a4a', '#2a2a3a', '#d8c8b0', '#1a1a1a'], acc: 'ticket' }), behavior: 'patrol', path: [[6, 2], [58, 2]], speed: 0.5, solid: true,
        lines: [KN('표를 보여 주십시오. …렬차는 달리고 있습니다. 창밖이 안 움직이는 것은 창문 탓입니다.', 'Tickets, please. …The train is moving. If the view does not move, that is the window’s fault.'), KN('설문지는 솔직하게 쓰십시오. 아무도 읽지 않으니까.', 'Fill in the form honestly. Nobody reads it.')],
        reacts: { E219: { lines: ['He holds the permit up to the dark window, as if there were light behind it.', KN('려행증이 있군요. 그럼 이 렬차는 달리고 있는 겁니다.', 'You have a permit. Then this train is moving.')] } } },
      { id: 'N1407', name: 'A Child at the Window', at: [50, 3], look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#c8a0a0', '#a88080', '#f0d0b0', '#1a1010'], eyes: 'wide' }), behavior: 'static', solid: true,
        lines: [KN('밖에 소가 있어요. 사흘 동안 같은 소예요.', 'There is a cow outside. It has been the same cow for three days.'), { seq: ['She breathes on the window and draws a door in the mist, low down, halfway along the carriage.', 'Then she wipes it out, quickly.'] }] }],
    mech: [{ type: 'quiz', mark: 'form', flag: 'nl_form262', intro: ['A passenger satisfaction form. Three questions. A pencil on a string. Nobody is looking.'],
      questions: [{ q: '1. How long has the train been stopped?', choices: ['It is not stopped.', 'Four days.', 'Since 1951.'], right: 1 },
        { q: '2. What do the passengers eat?', choices: ['A banquet, served at their seats.', 'What the egg seller is not selling.', 'Their tickets.'], right: 1 },
        { q: '3. When will the train move again?', choices: ['Exactly on time.', 'Nobody knows.', 'It is moving now.'], right: 1 }],
      failLine: 'You answer like the loudspeakers. The form is delighted. Nothing happens. It never does.',
      winLines: ['You answer the way the passengers would, if anyone ever asked them.', 'Halfway along the carriage, where the child drew in the mist, a door unlatches with a sigh.', 'Someone has been using it to get out.'],
      reward: [{ set: { nl_form262: true } }] }],
    info: { summary: 'A long carriage halted in the middle of the fields for days, while everyone agrees that it is moving.',
      rules: ['Answer the passenger form on the seat truthfully: four days, the egg seller, nobody knows.', 'A side door then opens onto the embankment and the Market Behind the Station (W267).', 'The far gangway leads to the Village of Timed Lights (W263).'],
      secrets: ['The side door the child draws in the mist.'],
      lore: 'When the power fails, the trains stop where they are, and life starts up beside the rails.' } });
  link('W082', { to: 'W262', type: 'train', look: 'train', lookOpt: LINE, arrive: 'back', label: 'a dark red train that has not moved for days' });

  /* ---------------------------------------------------------------
   *  W263 — Le Village aux lumières minutées (le labyrinthe invisible derrière)
   * --------------------------------------------------------------- */
  var VFLOOR = { p: 'dirt', c: ['#7a6a52', '#6a5a44', '#8a7a60'] };
  S({ id: 'W263', name: 'The Village of Timed Lights', depth: 3, tier: 'hard', back: 'W262', backType: 'train', backLook: 'train', backOpt: LINE, backAt: [8, 32], backLabel: 'the stopped train, back the way you came', outdoor: true,
    map: (function () { var g = K.grid(58, 38, '.'); g.border('f');
      g.vline(29, 1, 11, 'f'); g.hline(29, 56, 11, 'f'); g.set(31, 11, '.');      // le champ derrière le village
      g.hline(30, 53, 7, 'x'); g.hline(34, 56, 4, 'x');                          // des murs que personne ne voit
      g.rect(1, 17, 56, 3, ','); g.rect(1, 30, 56, 1, ':'); g.rect(1, 31, 56, 3, 'r'); g.rect(1, 34, 56, 3, ':');
      return g.rows(); })(),
    look: { floor: VFLOOR, invis: VFLOOR, floor2: { p: 'asphalt', c: ['#4a4a50'] }, floor3: { p: 'concrete', c: ['#8a8a84'] }, rail: { p: 'rails', c: ['#3a2a20', '#c8b080'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#6a5a4a'] } },
    tall: { 'f': { look: 'fence' } }, style: { renderer: 'watercolor', sky: ['#2a2440', '#c87a5a'] }, music: 'timedlights', amb: { type: 'loudspeaker', vol: 0.04 }, dark: 0.55,
    doors: [{ to: 'W264', type: 'train', look: 'train', opt: LINE, at: [48, 32], label: 'the train to the Stadium' },
      { to: 'W074', look: 'door', opt: { style: 'wood', c: ['#6a5040'] }, at: [51, 2], arrive: 'back', secret: true, label: 'the shed’s back door, onto the collective fields' }],
    place: [6, 15, 24, 33, 42, 51].map(function (x, i) { return { id: 'h' + (i + 1), type: 'decor', at: [x, 22], look: 'house', lookOpt: { c: ['#f0e8d0', '#c83030'] }, lines: ['A house with lace curtains and no glass in the windows. The light switch is just inside the door.'] }; })
      .concat([6, 15, 24, 33, 42, 51].map(function (x, i) { return { type: 'decor', at: [x, 14], look: 'house', lookOpt: { c: ['#e8e0c8', '#3060a0'] }, lines: [['A façade. Plastic flowers in the window boxes, watered every morning.', 'A façade. The door handle is painted on.', 'A façade with a family painted on the balcony. One of them has been painted over.'][i % 3]] }; }))
      .concat([{ id: 'shed', type: 'decor', at: [54, 2], look: 'hut', use: [{ set: { nl_chol1: true } }],
          lines: ['A shed behind the village: the only window with glass in it.', 'Inside, a mat, a bowl, a boy’s cap.', 'On the window frame, scratched with a nail, very small: 철.',
            'Above it, pencil marks at different heights, as if someone had measured how tall he was getting.'] },
        { id: 'speaker1', type: 'decor', at: [28, 16], look: 'loudspeaker', lines: [KN('저녁 여덟 시, 모든 창문에 동시에 불이 켜집니다. 동시에.', 'At eight in the evening, every window lights up at once. At once.')] },
        { id: 'speaker2', type: 'decor', at: [12, 24], look: 'loudspeaker', lines: [KN('등불마을은 언제나 밝습니다.', 'Lamp Village is always bright.')] },
        HINT([KN('뒤쪽 밭에는 아무것도 없습니다. 벽도 없습니다. 그러니 부딪치지 마십시오.', 'There is nothing in the field behind. Not even walls. So do not bump into them.')], [31, 12]),
        SOUL([KN('창문에 유리가 없으면 바람이 집 안을 지나갑니다. 그래서 아무도 살 수 없습니다.', 'With no glass in the windows, the wind goes straight through the houses. That is why nobody can live in them.')])]),
    decor: [{ look: 'streetlamp', n: 3, opt: { off: true }, lines: ['A street lamp. It is on a timer too. The timer is broken; the lamp waits for orders.'] },
      { look: 'flowers', n: 3, lines: ['A flower bed of plastic tulips. Someone has staked them, in case of wind.'] },
      { look: 'flagpole', n: 1, lines: ['A flagpole by the road, facing the railway.'] }],
    npcs: [{ id: 'N1410', name: 'A Woman Sweeping the Road', at: [12, 18], look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#8a7a6a', '#6a5a4a', '#e0c0a0', '#2a2a2a'], acc: 'broom' }), behavior: 'wander', radius: 4, speed: 0.6, solid: true,
        lines: [KN('이 길은 하루에 세 번 씁니다. 아무도 걷지 않아도.', 'I sweep this road three times a day. Even though nobody walks on it.'), 'She only sweeps the side of the road that can be seen from the train.'] },
      { id: 'N1411', name: 'The Electrician', at: [40, 19], look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#4a5a6a', '#3a4a5a', '#e0c0a0', '#1a1a1a'], acc: 'keys' }), behavior: 'static', solid: true,
        lines: [KN('불은 저녁 여덟 시에 다 같이 켜지고, 열 시에 다 같이 꺼집니다. 한 집씩 켜면 시계가 화를 냅니다.', 'The lights all come on at eight and all go off at ten. Light them one at a time and the timer gets angry.'),
          KN('빨리 켜십시오. 꺼지기 전에, 모두.', 'Light them quickly. All of them, before they go out.')] },
      VOICE('N1412', [KN('등불마을입니다. 마을 사람들은 모두 일터에 있습니다.', 'Lamp Village. All the villagers are at work.'), KN('다음 역은 십만경기장입니다.', 'The next station is the Stadium of a Hundred Thousand.')])],
    mech: [{ type: 'lampsAll', lamps: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], time: 14, light: 2.6, give: 'E223', onLine: 'This window is already lit.', doneLine: 'The windows are dark again. The frame you took weighs nothing.',
      winLines: ['Six windows lit at once. For a moment the village looks lived-in.', 'Then you see it: not one window has glass in it. The light has nowhere to stay.', 'You lift an empty window frame off its hooks. It weighs nothing at all.'] }],
    info: { summary: 'A model village beside the railway: perfect houses whose lights come on by timer, with nobody inside.',
      rules: ['Light the six houses south of the road before their timers put them out: the Glassless Window (E223).', 'Each window stays lit for about fourteen seconds.',
        'Behind the village, invisible walls cross the empty field: go right, then left, then right again.', 'The shed at the end holds a trace of 철이; its back door opens onto the Collective Fields (W074).'],
      secrets: ['The shed behind the invisible maze (first trace of 철이).'],
      lore: 'A village built to be seen from the train window, and lit only for as long as the train takes to pass.' } });

  /* ---------------------------------------------------------------
   *  W264 — Le Stade des cent mille
   * --------------------------------------------------------------- */
  S({ id: 'W264', name: 'The Stadium of a Hundred Thousand', depth: 3, tier: 'hard', back: 'W071', backLook: 'gate', backOpt: { c: ['#a02020'] }, backAt: [30, 2], backLabel: 'back to the Parade square', outdoor: true,
    map: (function () { var g = K.grid(60, 44, ' ');
      g.ellipse(29.5, 21.5, 28, 20, '{'); g.ellipse(29.5, 21.5, 21, 14, ':'); g.ellipse(29.5, 21.5, 18, 11, ',');
      g.rect(28, 1, 4, 8, '.'); g.rect(28, 35, 4, 8, '.'); g.rect(1, 20, 9, 4, '.'); g.rect(50, 20, 9, 4, '.');
      g.set(40, 9, ':'); g.set(40, 8, ':');                                        // une seule place vide dans les gradins
      return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#9a9890'] }, floor2: { p: 'grass', c: ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#3a6a2a'] }, floor3: { p: 'hstripes', c: ['#a84838', '#984030'] } },
    tall: { '{': { look: 'cardperson' } }, style: { sky: ['#e0dccc', '#f8f4ec'], cliffH: 0.6, cliff: '#7a7a74' }, music: 'massgames', amb: { type: 'crowd', vol: 0.05 },
    doors: [{ to: 'W263', type: 'train', look: 'train', opt: LINE, at: [3, 21], label: 'the train back towards Lamp Village' },
      { to: 'W265', type: 'train', look: 'train', opt: LINE, at: [56, 21], label: 'the train on to the cooperative farm' },
      { to: 'W271', type: 'stairs', look: 'stairsdown', at: [30, 41], cond: { flag: 'nl_stadium' }, secret: true, label: 'steps under the stands' }],
    place: [{ id: 'card0', type: 'decor', at: [40, 8], look: 'cardperson', lookOpt: { seed: 3 }, use: [{ set: { nl_chol2: true } }],
        lines: ['An empty seat in the stands, with a card propped on it that nobody is holding.', 'On the back of the card, in pencil: “3열 11번 — 철이”. Row three, seat eleven.', 'Beside it, a little sun drawn by hand, not in the official colours.'] },
      SOUL([KN('련습은 반년, 공연은 한 시간. 그 한 시간 동안 나는 해님의 왼쪽 눈이었습니다.', 'Six months of rehearsal, one hour of performance. For that hour, I was the left eye of the sun.')])],
    decor: [{ look: 'loudspeaker', n: 2, lines: [KN('하나처럼! 하나처럼!', 'As one! As one!')] }, { look: 'flagpole', n: 2, lines: ['A flagpole at the edge of the track. The flag hangs still: even the wind is rehearsing.'] },
      { look: 'banner', n: 1, opt: { text: '하나처럼' }, lines: ['A banner stretched between two poles, its letters a metre high.'] }],
    npcs: [{ id: 'N1415', name: 'The Rehearsal Coach', at: [30, 22], look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#3a5a3a', '#2a4a2a', '#e0c0a0', '#1a1a1a'], acc: 'baton' }), behavior: 'static', solid: true,
        lines: [KN('제가 하는 대로 하십시오. 틀리면 처음부터.', 'Do as I do. If you make a mistake, from the beginning.'), KN('왼쪽, 왼쪽, 오른쪽, 오른쪽… 아니, 말로 하면 안 됩니다. 보십시오.', 'Left, left, right, right… No. You must not say it. Watch.'), 'He turns, and turns, as if the whole stadium were tied to his shoulders.'] },
      { id: 'N1416', name: 'A Card Child', count: 4, look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#f0f0f0', '#c8c8c8', '#f0c8a0', '#1a1a1a'], acc: 'flag', mouth: 'painted' }), behavior: 'static', solid: true,
        lines: [KN('팔이 아파요. 그래도 웃어요. 웃는 건 카드가 해요.', 'My arms hurt. I smile anyway. The card does the smiling.'), 'She has held her card up so long that her arms have forgotten how to come down.', KN('3열 11번 자리는 비었어요. 아니, 안 비었어요. 카드가 있어요.', 'Row three, seat eleven is empty. No, it is not empty. There is a card.')] },
      VOICE('N1417', [KN('십만경기장입니다. 오늘도 련습입니다. 공연은 래일입니다. 래일도 련습입니다.', 'Hundred Thousand Stadium. Rehearsal again today. The show is tomorrow. Tomorrow is rehearsal too.'), KN('다음 역은 초과협동농장입니다.', 'The next station is the Overfulfilment Cooperative Farm.')])],
    mech: [{ type: 'dirSequence', ent: 'N1415', seq: ['left', 'left', 'right', 'right', 'up', 'down'], dist: 6, flag: 'nl_stadium',
      winLines: ['You copy him exactly. In the stands, a hundred thousand cards flip at once.', 'For a moment you are part of a picture you will never see.',
        'The coach nods without smiling. Down the south tunnel, a child lowers her card.', 'Behind it, steps lead under the stands.'],
      reward: [{ set: { nl_stadium: true } }] }],
    info: { summary: 'An oval stadium of children holding up coloured cards, rehearsing a show that is always tomorrow.',
      rules: ['Stand near the coach and copy his turns with your steps: left, left, right, right, up, down.', 'Steps then open in the south tunnel, down to the Barber of Fifteen Haircuts (W271).',
        'In the stands, the only empty seat holds a card nobody is holding: a trace of 철이.', 'Trains go on to Lamp Village (W263) and the Three-Hundred-Per-Cent Farm (W265).'],
      secrets: ['The steps under the stands.', 'Row three, seat eleven.'],
      lore: 'Being one pixel in someone else’s picture, and the seat that stays empty in it.' } });
  link('W071', { to: 'W264', look: 'gate', lookOpt: { c: ['#a02020'] }, label: 'the gate to the stadium rehearsal' });

  /* ---------------------------------------------------------------
   *  W265 — La Ferme à trois cents pour cent (pousser les sacs)
   * --------------------------------------------------------------- */
  S({ id: 'W265', name: 'The Three-Hundred-Per-Cent Farm', depth: 3, tier: 'hard', back: 'W074', backLook: 'gate', backAt: [3, 2], backLabel: 'the cart track back to the collective fields', outdoor: true,
    map: (function () { var g = K.grid(52, 34, '+'); g.border('f');
      for (var y = 3; y < 32; y += 3) g.hline(2, 49, y, '"');
      g.box(18, 4, 15, 9, 'f', '.'); g.set(25, 12, '.');                          // la cour de la pesée
      g.rect(1, 28, 50, 1, ':'); g.rect(1, 29, 50, 3, 'r'); g.rect(1, 32, 50, 1, ':');
      return g.rows(); })(),
    look: { floor: { p: 'dirt', c: ['#8a7a5a', '#7a6a4a', '#9a8a6a'] }, soil: { p: 'soil', c: ['#6a5a3a', '#5a4a2a', '#7a6a4a'] }, leafg: { p: 'grass', c: ['#c8a848', '#b89838', '#d8b858', '#a88828'] },
      fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#6a5a4a'] }, floor3: { p: 'concrete', c: ['#8a8a84'] }, rail: { p: 'rails', c: ['#3a2a20', '#c8b080'] } },
    tall: { 'f': { look: 'fence' } }, style: { sky: ['#d8d0b0', '#f0e8c8'] }, music: 'quotaharvest', amb: { type: 'wind', vol: 0.06 }, weather: { dust: true },
    doors: [{ to: 'W264', type: 'train', look: 'train', opt: LINE, at: [6, 30], label: 'the train back to the Stadium' },
      { to: 'W266', type: 'train', look: 'train', opt: LINE, at: [45, 30], label: 'the train on to Number One Department Store' },
      { to: 'W267', look: 'bigdoor', opt: { c: ['#6a5a3a'] }, at: [40, 7], cond: { flag: 'nl_quota' }, secret: true, label: 'a granary door that was not there before' }],
    place: [{ id: 's1', type: 'decor', at: [22, 9], look: 'crate', lines: ['A sack.'] }, { id: 's2', type: 'decor', at: [25, 9], look: 'crate', lines: ['A sack.'] }, { id: 's3', type: 'decor', at: [28, 9], look: 'crate', lines: ['A sack.'] },
      { id: 'p1', type: 'decor', at: [22, 6], look: 'chalkmark', solid: false, lines: ['A square painted on the ground: QUOTA.'] },
      { id: 'p2', type: 'decor', at: [25, 6], look: 'chalkmark', solid: false, lines: ['A square painted on the ground: QUOTA.'] },
      { id: 'p3', type: 'decor', at: [28, 6], look: 'chalkmark', solid: false, lines: ['A square painted on the ground: QUOTA.'] },
      { type: 'decor', at: [16, 8], look: 'loudspeaker', lines: [KN('올해 수확은 계획의 삼백 프로! 삼백 프로!', 'This year’s harvest: three hundred per cent of the plan! Three hundred per cent!')] },
      { type: 'decor', at: [35, 15], look: 'loudspeaker', lines: [KN('배고픈 사람은 없습니다. 배고프다는 말이 없기 때문입니다.', 'Nobody is hungry. There is no word for it any more.')] },
      { type: 'decor', at: [10, 14], look: 'scarecrow', lines: ['A scarecrow in a work brigade jacket. It has a medal for exceeding its quota of crows.'] },
      { type: 'decor', at: [44, 20], look: 'scarecrow', lines: ['A scarecrow. Its straw has been pulled out, a handful at a time, by someone who needed it more.'] },
      { type: 'decor', at: [34, 5], look: 'seedbag', lines: ['A seed sack, sewn shut. On the label: “for planting”. Underneath, in pencil: “for eating, if”.'] },
      { type: 'decor', at: [14, 22], look: 'seedbag', lines: ['An empty seed sack, folded very carefully, as if it might be filled again.'] },
      { type: 'decor', at: [25, 15], look: 'flagpole', lines: ['A red pennant: “best brigade of the season”. It has been awarded every season.'] },
      SOUL([KN('자루가 무거우면 저울이 웃고, 자루가 가벼우면 사람이 웁니다.', 'When the sack is heavy, the scale smiles. When the sack is light, people cry.')], [8, 8])],
    npcs: [{ id: 'N1420', name: 'The Brigade Leader', at: [34, 10], look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#5a5a3a', '#4a4a2a', '#e0c0a0', '#1a1a1a'], acc: 'clipboard' }), behavior: 'static', solid: true,
        lines: [KN('올해도 대풍입니다. 계획의 삼백 프로. 래년에는 사백 프로.', 'Another record harvest this year. Three hundred per cent of the plan. Next year, four hundred.'), KN('자루를 저울 칸에 올려 주십시오. 저울은 언제나 기뻐합니다.', 'Please push the sacks onto the scale squares. The scale is always pleased.')] },
      { id: 'N1421', name: 'A Gleaning Child', at: [10, 25], look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#8a7a5a', '#6a5a3a', '#e0c0a0', '#1a1a1a'], eyes: 'sad' }), behavior: 'wander', radius: 3, speed: 0.8, solid: true,
        lines: [KN('떨어진 이삭은 줍지 말라고 했어요. 그래서 밤에 주워요.', 'They told us not to pick up fallen ears. So we pick them up at night.'), 'She has hidden three grains of rice in her shoe. She shows you, then makes you promise.'] },
      { id: 'N1422', name: 'A Crow Counting', at: [30, 20], look: { t: 'crow', c: ['#1a1a1e'], h: 10 }, behavior: 'fly', radius: 6, speed: 1.2, solid: false, talkable: true,
        lines: ['It counts the grains the loudspeaker announces. Every time, it arrives at a smaller number.'] },
      VOICE('N1423', [KN('초과협동농장입니다. 올해 수확은 계획의 삼백 프로입니다.', 'Overfulfilment Cooperative Farm. This year’s harvest is three hundred per cent of the plan.'), KN('다음 역은 제일백화점입니다.', 'The next station is Number One Department Store.')])],
    mech: [{ type: 'push', blocks: ['s1', 's2', 's3'], plates: ['p1', 'p2', 'p3'], flag: 'nl_quota',
      winLines: ['Three sacks on three squares. The loudspeakers burst into applause: three hundred per cent!', 'You look into one of the sacks. Chaff, and a single potato with a smiling face drawn on it.', 'Across the field, a granary door has appeared. That is where the real harvest goes.'],
      reward: [{ set: { nl_quota: true } }] }],
    info: { summary: 'Golden fields and a weighing yard where the harvest is always three times the plan.',
      rules: ['In the fenced yard, push the three sacks up onto the three painted squares.', 'A granary door then appears in the field, leading to the Market Behind the Station (W267).', 'Trains go on to the Stadium (W264) and the Department Store (W266).'],
      secrets: ['The granary door.'],
      lore: 'The figures are always good. The sacks are light.' } });
  link('W074', { to: 'W265', look: 'gate', lookOpt: { c: ['#8a7a5a'] }, label: 'a cart track towards the harvest' });

  /* ---------------------------------------------------------------
   *  W266 — Le Grand Magasin où rien n'est à vendre
   * --------------------------------------------------------------- */
  S({ id: 'W266', name: 'The Department Store With Nothing to Sell', depth: 3, tier: 'hard', back: 'W265', backOpt: { style: 'glass', c: ['#c8a050'] }, backAt: [3, 27], backLabel: 'the revolving door, back to the platform',
    map: (function () { var g = K.grid(46, 30, ' '); g.box(0, 0, 46, 30, '#', '.');
      [6, 12, 18].forEach(function (y) { g.hline(4, 16, y, '{'); g.hline(26, 37, y, '{'); });
      g.rect(19, 23, 8, 2, 'u');                                                  // le comptoir
      g.rect(38, 1, 7, 5, '#'); g.rect(39, 2, 5, 2, '.'); g.set(41, 4, '?'); g.set(41, 5, '?');   // la réserve, derrière un mur peint
      return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#e0dcd0', '#c0b8a8'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a10'], topColor: '#2c2016' }, wallface: { p: 'panel', c: ['#d8c098', '#b8a078', '#8a7050'], skirt: '#6a1a1a' },
      secret: { p: 'panel', c: ['#d8c098', '#b8a078', '#8a7050'] }, counter: { p: 'wood', c: ['#8a5a3a', '#6a4028', '#9a6a48'] } },
    tall: { '{': { look: 'shelf' } }, style: { tallWalls: true }, music: 'displaygoods', amb: { type: 'hum', vol: 0.04 }, dark: 0.2,
    doors: [{ to: 'W268', look: 'door', opt: { style: 'glass', c: ['#c8a050'] }, at: [42, 27], label: 'the platform for the next train, towards the Singing Kindergarten' },
      { id: 'staff', to: 'W271', type: 'stairs', look: 'stairs', at: [2, 2], cond: { flag: 'nl_store' }, secret: true, label: 'the staff stairs, up to the barber’s' }],
    place: [[6, 8], [10, 8], [14, 8], [28, 8], [32, 8], [36, 8], [8, 15], [30, 15]].map(function (p, i) { return { id: 'v' + i, type: 'decor', at: p, look: 'vitrine', lookOpt: { c: [['#e0a040', '#c84030', '#4a8a4a', '#e8d8b0'][i % 4]] }, lines: ['A display case. Not for sale. For display.'] }; }).concat([
      { id: 'toW267', type: 'door', to: 'W267', at: [41, 2], look: 'door', lookOpt: { style: 'metal', c: ['#5a5a5a'] }, secret: true, unreachOk: 'through the painted wall, with the Glassless Window', label: 'the stockroom door' },
      { id: 'till', type: 'decor', at: [20, 22], look: 'till', lines: ['The till drawer is open. Inside: nothing, very neatly arranged.'] },
      HINT([KN('저 벽은 벽처럼 칠했을 뿐입니다. 유리 없는 창문으로 보면 압니다.', 'That wall is only painted to look like a wall. Look through a window with no glass and you will know.')], [41, 7])]),
    decor: [{ look: 'poster', n: 2, lines: ['A poster: a woman smiling over a tin of peaches. The same tin as in the display case. The only tin.', 'A poster of the store itself, fuller than it has ever been.'] },
      { look: 'banner', n: 1, opt: { text: '제일백화점' }, lines: ['A banner over the shelves: Number One Department Store.'] }],
    npcs: [{ id: 'N1425', name: 'The Shop Assistant', at: [24, 22], look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#c83030', '#a02020', '#e0c0a0', '#1a1a1a'], mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [KN('어서 오십시오. 아무것도 팔지 않습니다. 어서 오십시오.', 'Welcome. We sell nothing. Welcome.'), KN('진렬품은 모두 두 개씩 있습니다. 하나는 보여 드리려고, 하나는 보여 드리려고.', 'Every display item comes in twos. One to show you, and one to show you.'),
          'When the guide looks away, she whispers that the real shop is round the back. Then she smiles harder.'] },
      { id: 'N1426', name: 'A Customer Who Has Queued Since Morning', at: [10, 20], look: H({ t: 'old', body: 'coat', c: ['#5a5a4a', '#4a4a3a', '#e0c8a8', '#c8c8c8'] }), behavior: 'static', solid: true,
        lines: [KN('뭘 파는지는 모릅니다. 줄이 있어서 섰습니다.', 'I do not know what they are selling. There was a queue, so I joined it.'), 'He is the only person in the queue. He has kept his place for hours.'] },
      VOICE('N1427', [KN('제일백화점입니다. 모든 상품이 진렬되여 있습니다.', 'Number One Department Store. All goods are on display.'), KN('다음 역은 노래유치원입니다.', 'The next station is the Singing Kindergarten.')])],
    mech: [{ type: 'pairs', tiles: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'], flag: 'nl_store',
      winLines: ['Every display item has found its twin. The assistant claps, once, very quietly.', 'In the corner behind the shelves, a door marked “staff” unlocks: stairs up, smelling of hair oil.'],
      reward: [{ set: { nl_store: true } }] }],
    info: { summary: 'A department store of full shelves and display cases where nothing is for sale.',
      rules: ['Each display case hides a sign: find the four pairs to unlock the staff stairs (top-left corner).', 'They lead up to the Barber of Fifteen Haircuts (W271).',
        'The top-right corner is only a painted wall: with the Glassless Window (E223), walk through it.', 'Behind it, the stockroom door leads to the Market Behind the Station (W267).'],
      secrets: ['The staff stairs.', 'The painted wall of the stockroom.'],
      lore: 'Shops for looking at. The goods are real; they are just not for anyone.' } });

  /* ---------------------------------------------------------------
   *  W267 — Le Marché derrière la gare (suivre les pas)
   * --------------------------------------------------------------- */
  S({ id: 'W267', name: 'The Market Behind the Station', depth: 3, tier: 'hard', back: 'W266', backOpt: { style: 'metal', c: ['#5a5a5a'] }, backAt: [43, 28], backLabel: 'the stockroom door, back into the department store', outdoor: true,
    map: (function () { var g = K.grid(46, 30, ' '); g.box(0, 0, 46, 30, '#', '.');
      for (var y = 4; y < 27; y += 4) { g.hline(1, 44, y, '{'); if (y % 8) g.set(6, y, '.'); else { g.set(22, y, '.'); g.set(39, y, '.'); } }
      return g.rows(); })(),
    look: { floor: { p: 'dirt', c: ['#5a4a38', '#4a3a2a', '#6a5a46'] }, wall: { p: 'brick', c: ['#4a3a30', '#3a2a24', '#2a1a14'] } },
    tall: { '{': { look: 'stall2', vary: [{ opt: { c: ['#a04040'] } }, { opt: { c: ['#4060a0'] } }, { opt: { c: ['#a08040'] } }, { opt: { c: ['#5a7a4a'] } }] } },
    style: { sky: ['#1a1420', '#4a3a40'] }, music: 'backmarket', amb: { type: 'whispers', vol: 0.05 }, dark: 0.6,
    doors: [{ to: 'W262', look: 'door', opt: { style: 'metal', c: ['#3a3a3a'] }, at: [2, 28], label: 'the embankment, towards the stopped train' },
      { to: 'W265', look: 'bigdoor', opt: { c: ['#6a5a3a'] }, at: [23, 28], label: 'the granary, back to the farm' },
      { id: 'van', to: 'W270', look: 'door', opt: { style: 'metal', c: ['#3a4a3a'] }, at: [44, 14], cond: { flag: 'nl_radio267' }, secret: true, arrive: 'back', label: 'a van with an antenna on its roof, back doors ajar' }],
    place: [{ id: 'tstart', type: 'decor', at: [40, 27], look: 'scuff', solid: false, lines: ['Footprints in the dust, fresh, leading away between the stalls.'] },
      { id: 'radiostall', type: 'decor', at: [4, 2], look: 'stall2', lookOpt: { c: ['#3a3a3a'] }, lines: ['A stall with nothing on it but a cloth. Under the cloth, shapes the size of radios.'] },
      { type: 'decor', at: [14, 2], look: 'lantern', light: 1.6, lines: ['A paper lantern with the candle turned low, so it does not show from the station.'] },
      { type: 'decor', at: [30, 27], look: 'lantern', light: 1.6, lines: ['A lantern on the ground, between two baskets of something that is not for sale.'] },
      SOUL([KN('여기서는 모두 아무것도 안 팝니다. 그래서 모두 살아 있습니다.', 'Here, everyone sells nothing. That is how everyone stays alive.')])],
    radio: { '93.1': { cond: { equipped: 'E220' }, line: KN('…오늘의 쌀값은 말하지 않겠습니다. 모두 알고 있으니까. 이것을 들으셨다면, 들은 사람이 또 있습니다.', '…Today’s price of rice we will not say. Everyone knows it. If you heard this, someone else heard it too.'), do: [{ set: { nl_radio267: true } }] } },
    npcs: [{ id: 'N1430', name: 'The Rice Woman', at: [20, 2], look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#6a5a4a', '#4a3a2a', '#e0c0a0', '#2a2a2a'] }), behavior: 'static', solid: true,
        lines: [KN('여기는 시장이 아닙니다. 우리는 그냥 서 있는 겁니다. 물건을 들고.', 'This is not a market. We are just standing here. Holding things.'), KN('밥 한 공기 값으로 소문 하나. 소문 두 개면 신발 한 켤레.', 'One rumour for the price of a bowl of rice. Two rumours, a pair of shoes.')] },
      { id: 'N1431', name: 'The Radio Man', at: [2, 2], look: H({ t: 'adult', head: 'cap', body: 'coat', c: ['#3a3a3a', '#2a2a2a', '#e0c0a0', '#1a1a1a'], acc: 'bag', eyes: 'down' }), behavior: 'static', solid: true,
        lines: [KN('…쉿. 이 라지오는 봉인이 뜯겼습니다. 남쪽 노래가 나옵니다. 저는 듣지 않습니다. 팔기만 합니다.', '…Shh. The seal on this radio has been cut. Songs from the South come out of it. I do not listen. I only sell.'),
          KN('저한테 바로 오는 사람에게는 따라붙는 사람이 있습니다. 제 발자국을 처음부터 밟고 오십시오.', 'Whoever comes straight to me is followed. Walk in my footprints, from the very beginning.'),
          { if: { effect: 'E220' }, t: '구십삼 점 일. 저는 아무 말도 안 했습니다.', lang: 'ko-n', tr: 'Ninety-three point one. I said nothing.' }] },
      { id: 'N1432', name: 'A Boy With Long Sleeves', at: [30, 26], look: H({ t: 'kid', body: 'coat', c: ['#5a5a5a', '#3a3a3a', '#e0c0a0', '#1a1a1a'], eyes: 'sad' }), behavior: 'wander', radius: 3, speed: 0.9, solid: true,
        lines: [KN('떨어진 국수 한 가닥도 여기서는 주인이 있어요.', 'Even one fallen noodle has an owner here.'), 'His sleeves are too long. He uses them as pockets.'] },
      { id: 'N1433', name: 'The Inspector Who Sees Nothing', at: [12, 27], look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [KN('여기에는 아무것도 없습니다. 저는 아무것도 못 봤습니다. …그 계란 얼마요?', 'There is nothing here. I saw nothing. …How much is that egg?')] }],
    mech: [{ type: 'trail', from: 'tstart', to: 'radiostall', give: 'E220', lostLine: 'You stepped aside. Someone noticed. The footprints start again from the beginning.',
      winLines: ['You arrive in his footprints, exactly. Nobody followed you; nobody saw you.', 'The radio man slips something into your hands without looking at you:', 'a small radio, its state seal neatly cut.',
        { t: '구십삼 점 일. 저는 아무 말도 안 했습니다.', lang: 'ko-n', tr: 'Ninety-three point one. I said nothing.', who: 'The Radio Man' }] }],
    info: { summary: 'Rows of stalls behind the station after dark, where nobody sells anything and everybody buys.',
      rules: ['Follow the footprints from the far end of the market to the radio man’s stall: the Unsealed Radio (E220).', 'With the Unsealed Radio, tune to 93.1: a van opens on the east side, towards the Listening Room (W270).',
        'Doors lead to the Stopped Train (W262), the farm’s granary (W265) and the store’s stockroom (W266).'],
      secrets: ['The listeners’ van, after 93.1.'],
      lore: 'The market that does not exist, where the country really eats.' } });

  /* ---------------------------------------------------------------
   *  W268 — Le Jardin d'enfants qui chante au signal (marcher au rythme)
   * --------------------------------------------------------------- */
  S({ id: 'W268', name: 'The Kindergarten That Sings on Cue', depth: 3, tier: 'hard', back: 'W266', backOpt: { style: 'glass', c: ['#c8a050'] }, backAt: [20, 24], backLabel: 'the platform, back towards the department store',
    map: (function () { var g = K.grid(40, 26, ' '); g.box(0, 0, 40, 26, '#', '.');
      for (var y = 8; y < 20; y += 3) for (var x = 6; x < 34; x += 4) g.set(x, y, '}');
      g.rect(2, 1, 36, 2, ',');                                                   // la rangée des portemanteaux
      return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#d8b888', '#c8a878', '#e0c898'] }, floor2: { p: 'rug', c: ['#e8c8c8', '#d8b0b0'] }, wall: { p: 'flat', c: ['#4a3a3a', '#3a2a2a'], topColor: '#3a2c2c' },
      wallface: { p: 'wallpaper', c: ['#f0e0c0', '#e0c8a0', '#c83030'], skirt: '#6a4a3a' } },
    tall: { '}': { look: 'chair', opt: { c: ['#e05050'] } } }, style: { tallWalls: true }, music: 'kindercue', amb: { type: 'kids', vol: 0.04 },
    doors: [{ to: 'W272', look: 'door', opt: { style: 'glass', c: ['#c8a050'] }, at: [37, 23], label: 'the platform for the next train, towards Bright Light Apartments' },
      { to: 'W073', look: 'door', opt: { style: 'wood', c: ['#c8a060'] }, at: [2, 23], cond: { roomLight: false }, secret: true, arrive: 'back', label: 'a little door at child height, with light underneath' }],
    place: [{ id: 'piano', type: 'decor', at: [30, 4], look: 'piano', lines: ['An upright piano. Every key plays the same note: the one the song starts on.'] },
      { id: 'hooks', type: 'decor', at: [10, 1], look: 'clothesline', lines: ['Thirty coat hooks with thirty names above them. Twenty-nine coats.'] },
      SOUL([KN('노래를 크게 부르면 배고픈 소리가 안 들립니다.', 'If you sing loudly enough, nobody can hear your stomach.')])],
    decor: [{ look: 'drawing', n: 2, lines: ['A child’s drawing: a house, a sun, the Parent. In the corner, very small, a second sun, crossed out.', 'A drawing of the class in a row. Thirty children. One is drawn in pencil only, waiting to be coloured in.'] },
      { look: 'toybox', n: 1, lines: ['A box of toys: wooden rifles and tractors. At the bottom, hidden, a soft rabbit with one ear chewed.'] }],
    npcs: [{ id: 'N1435', name: 'The Teacher With the Baton', at: [26, 4], look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#3a4a6a', '#2a3a5a', '#e0c0a0', '#1a1a1a'], acc: 'baton', mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [KN('하나, 둘, 셋, 웃어요!', 'One, two, three, smile!'), KN('노래할 때 움직이고, 노래가 멈추면 멈춥니다. 그것이 질서입니다.', 'You move while we sing, and when the song stops, you stop. That is order.'),
          KN('저 옷걸이요? 서른 개입니다. 아이도 서른 명입니다. 언제나.', 'Those hooks? There are thirty. And thirty children. Always.')] },
      { id: 'N1436', name: 'A Singing Child', count: 6, look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#f0f0f0', '#d0d0d0', '#f0c8a0', '#1a1a1a'], mouth: 'o' }), behavior: 'static', solid: true,
        lines: [KN('♪ 해님이 웃어요, 우리도 웃어요 ♪', '♪ The sun is smiling, and so are we ♪'), 'He sings with his whole mouth open. His eyes are not singing.', KN('철이는 아파서 안 와요. 오래 아파요.', 'Chol-i is not coming, he is ill. He has been ill a long time.')] }],
    mech: [{ type: 'rhythmWalk', start: [20, 22], lineY: 21, zone: [1, 1, 38, 2], period: 1.6, window: 0.55, give: 'E221', failText: 'The song stops. Everyone freezes. So should you. Back to your place.',
      winLines: ['You reach the coat hooks without ever moving in the silences. Thirty hooks, twenty-nine coats.', 'Above the empty hook, a name has been painted over, white on white. Under the paint you can still read: 철이.', 'On the hook, forgotten, a red scarf. Small. Warm, as if someone had only just taken it off.'],
      reward: [{ set: { nl_chol3: true } }] }],
    info: { summary: 'A bright kindergarten where thirty children sing on the teacher’s cue, and freeze when the song stops.',
      rules: ['From the back of the room to the coat hooks, move only while the children sing; freeze in the silences.', 'Moving in a silence sends you back. At the hooks: the Red Scarf (E221) and a trace of 철이.',
        'When the bedroom light is off, a little door bottom-left leads to the School of the Parent (W073).', 'The platform door goes on to Bright Light Apartments (W272).'],
      secrets: ['The little door with light underneath.'],
      lore: 'Learning early when to move and when to freeze.' } });

  /* ---------------------------------------------------------------
   *  W269 — L'Hôtel des visiteurs (l'étage qui n'existe pas)
   * --------------------------------------------------------------- */
  S({ id: 'W269', name: 'The Hotel for Visitors', depth: 3, tier: 'hard', back: 'W261', backOpt: { style: 'glass', c: ['#c8a050'] }, backAt: [2, 2], backLabel: 'the glass doors back to Right-Time Station',
    map: (function () { var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.'); g.rect(10, 6, 20, 14, ',');
      [[8, 6], [31, 6], [8, 19], [31, 19]].forEach(function (p) { g.set(p[0], p[1], '^'); });
      g.rect(3, 22, 10, 2, 'u'); return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#e8dcc8', '#c8b8a0'] }, floor2: { p: 'carpet', c: ['#8a1a24', '#6a1018', '#c8a040'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a10'], topColor: '#2c2016' },
      wallface: { p: 'panel', c: ['#c8b088', '#a89068', '#7a6040'], skirt: '#4a1a1a' }, counter: { p: 'wood', c: ['#6a3a20', '#4a2810', '#7a4a30'] } },
    tall: { '^': { look: 'column' } }, style: { tallWalls: true }, music: 'visitorhotel', amb: { type: 'hum', vol: 0.04 },
    doors: [{ to: 'W272', look: 'bigdoor', opt: { c: ['#5a3a2a'] }, at: [20, 26], cond: { equipped: 'E219' }, label: 'the front doors, onto the city at night',
      locked: [{ t: 'The front doors are locked from the inside.' }, { t: 'A brass plate: visitors may not go out into the city without a travel permit and a guide.' }] }],
    place: [{ id: 'lift', type: 'decor', at: [34, 1], look: 'elevator', cond: { notFlag: 'nl_floor5' }, lines: ['The lift. The panel has buttons for floors 1, 2, 3, 4, 6 and 7.'] },
      { id: 'lift5', type: 'elevator', to: 'W270', at: [34, 1], look: 'elevator', cond: { flag: 'nl_floor5' }, secret: true, label: 'the lift, to the floor that is not on the panel' },
      { id: 'panel', type: 'decor', at: [37, 1], look: 'board', lookOpt: { lines: ['1 2 3 4 _ 6 7', '', ''], color: '#f0d070' }, lines: ['The floor indicator above the lift. Between 4 and 6, a gap, very neatly kept.'] },
      { type: 'decor', at: [6, 21], look: 'bell', lines: ['A reception bell. When you ring it, three people look up from three different doorways.'] },
      { type: 'decor', at: [11, 21], look: 'phone', lines: ['A telephone with no dial. It only rings inwards.'] },
      SOUL([EN('Room 503 has a lovely view, the guests say. There is no room 503.')])],
    decor: [{ look: 'sofa', n: 2, lines: ['A velvet sofa. The cushions have never been sat on long enough to dent.', 'A sofa facing a window with the curtains sewn shut.'] }, { look: 'pot', n: 2, lines: ['A potted palm. The leaves are silk; the soil is real, and kept damp.'] },
      { look: 'poster', n: 1, lines: ['A poster of the hotel at night, every window lit. Tonight, three are.'] }],
    npcs: [{ id: 'N1440', name: 'The Bellboy', at: [32, 3], look: H({ t: 'kid', head: 'cap', body: 'uniform', c: ['#a02020', '#801818', '#f0c8a0', '#1a1a1a'], acc: 'tray' }), behavior: 'static', solid: true,
        lines: [KN('승강기는 사층에서 육층으로 갑니다. 그 사이에서는… 똑똑 소리가 납니다.', 'The lift goes from the fourth floor to the sixth. In between, there is… a knocking.'), KN('오층이요? 이 호텔에 오층은 없습니다. 다섯 번 물어보셔도 없습니다.', 'The fifth floor? This hotel has no fifth floor. Ask five times: there is none.')] },
      { id: 'N1441', name: 'The Receptionist', at: [8, 21], look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#2a2a3a', '#1a1a2a', '#e0c0a0', '#1a1a1a'], mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [KN('손님 방은 모두 강 쪽입니다. 창밖은 보지 마십시오. 강이 보입니다.', 'All the guest rooms face the river. Please do not look out of the window. You will see the river.'), KN('밖에 나가시려면 려행증과 안내원이 필요합니다.', 'To go outside, you need a travel permit and a guide.')] },
      { id: 'N1442', name: 'A Visitor Photographing Flowers', look: H({ t: 'adult', hairStyle: 'long', body: 'coat', c: ['#c8a878', '#a88858', '#f0d0b0', '#6a4a2a'], acc: 'phone' }), behavior: 'wander', radius: 5, speed: 0.8, solid: true,
        lines: [EN('Everything is so clean. Where is everyone?'), EN('They told me not to photograph soldiers, building sites, or people. So I photograph the flowers.')] }],
    mech: [{ type: 'knock', mark: 'lift', n: 5, within: 3, flag: 'nl_floor5',
      winLines: ['Five knocks. Between the fourth floor and the sixth, the lift answers with five knocks of its own.', 'The doors slide open onto a floor that is not on the panel.'], reward: [{ set: { nl_floor5: true } }] }],
    info: { summary: 'A grand hotel for foreign visitors, comfortable and closed, with a floor missing from the lift panel.',
      rules: ['Knock five times in quick succession on the lift doors: the lift opens onto the missing floor (W270).', 'With the Travel Permit (E219) equipped, the front doors open onto Bright Light Apartments (W272).'],
      secrets: ['The fifth floor.'],
      lore: 'Visitors see what they are shown, from a building they may not leave.' } });

  /* ---------------------------------------------------------------
   *  W270 — La Salle d'écoute du cinquième étage
   * --------------------------------------------------------------- */
  S({ id: 'W270', name: 'The Fifth-Floor Listening Room', depth: 3, tier: 'hard', back: 'W269', backLook: 'elevator', backAt: [33, 20], backLabel: 'the lift, back down to the lobby',
    map: (function () { var g = K.grid(36, 22, ' '); g.box(0, 0, 36, 22, '#', '.'); for (var y = 6; y < 19; y += 4) g.hline(5, 30, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'tileLines', c: ['#4a4a44', '#3a3a34'] }, wall: { p: 'flat', c: ['#1a1a18', '#101010'], topColor: '#1a1a18' }, wallface: { p: 'panel', c: ['#5a5a4a', '#4a4a3a', '#2a2a20'], skirt: '#1a1a10' } },
    tall: { '{': { look: 'desk' } }, style: { tallWalls: true, renderer: 'surveillance' }, music: null, amb: { type: 'typewriter', vol: 0.05 }, dark: 0.45,
    doors: [{ to: 'W272', look: 'door', opt: { style: 'metal', c: ['#2a2a2a'] }, at: [2, 20], cond: { flag: 'nl_listened' }, secret: true, label: 'the little door the wire goes through' }],
    place: [{ id: 'r1', type: 'decor', at: [8, 1], look: 'radio', lines: ['A reel-to-reel recorder.'] }, { id: 'r2', type: 'decor', at: [14, 1], look: 'radio', lines: ['A reel-to-reel recorder.'] },
      { id: 'r3', type: 'decor', at: [20, 1], look: 'radio', lines: ['A reel-to-reel recorder.'] }, { id: 'r4', type: 'decor', at: [26, 1], look: 'radio', lines: ['A reel-to-reel recorder.'] },
      SOUL([KN('듣는 사람도 밤에는 자기 집 벽을 봅니다.', 'At night, the listeners look at their own walls too.')])],
    decor: [{ look: 'clipboard', n: 2, lines: ['A transcript: “23:04 — flat 7 — child crying — mother sings — nothing to report.”', 'A transcript: “02:10 — flat 3 — man talks in his sleep — words not understood — noted anyway.”'] },
      { look: 'monitor', n: 2, lines: ['A screen showing a corridor in the dark. Someone walks along it, then stops, as if they knew.', 'A screen showing the hotel lobby. You can see yourself, a few minutes ago.'] },
      { look: 'wire', n: 2, lines: ['A cable along the ceiling, going somewhere through a little door.'] }],
    npcs: [{ id: 'N1445', name: 'The Listener', at: [18, 8], look: H({ t: 'adult', body: 'suit', c: ['#3a3a3a', '#2a2a2a', '#e0c0a0', '#1a1a1a'], acc: 'headphones', eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [KN('삼층 칠호, 스물세 시 사 분. 아이가 웁니다. 엄마가 노래합니다. …기록합니다.', 'Third floor, flat seven, 23:04. A child is crying. The mother is singing. …Noted.'),
          KN('저는 듣기만 합니다. 듣는 것은 죄가 아닙니다. 들은 것을 적는 것이… 제 일입니다.', 'I only listen. Listening is not a crime. Writing down what I hear is… my job.'),
          'He has worn the headphones so long that he hums along to other people’s lullabies without noticing.'] },
      { id: 'N1446', name: 'The Typist', at: [10, 12], look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#4a4a3a', '#3a3a2a', '#e0c0a0', '#1a1a1a'], eyes: 'down' }), behavior: 'static', solid: true,
        lines: [KN('특이 사항 없음. 특이 사항 없음. 특이 사항 없음.', 'Nothing to report. Nothing to report. Nothing to report.'), 'She types without looking at the keys, or at anything.'] }],
    mech: [{ type: 'sequence', order: ['r3', 'r1', 'r4', 'r2'], ring: { every: 1.6, pause: 4, hear: 30, sfx: 'speaker_blip', glyph: '◉', color: '#c8f0c8' }, flag: 'nl_listened',
      winLines: ['You stop the reels in the order they started. For once, the room hears nothing.', 'In the silence you can follow the wire: along the ceiling, down the far wall, through a little door.'],
      reward: [{ set: { nl_listened: true } }] }],
    info: { summary: 'The floor missing from the hotel lift: rows of headphones and tape recorders listening to the city.',
      rules: ['The four tape recorders click on one after another: touch them in the same order.', 'A little door then opens bottom-left, along the wire, to Bright Light Apartments (W272).',
        'Reached by knocking five times on the hotel lift (W269), or by tuning in where one should not.'],
      secrets: ['The door the wire goes through.'],
      lore: 'The floor that hears every other floor.' } });

  /* ---------------------------------------------------------------
   *  W271 — Le Coiffeur aux quinze coupes
   * --------------------------------------------------------------- */
  S({ id: 'W271', name: 'The Barber of Fifteen Haircuts', depth: 3, tier: 'hard', back: 'W266', backLook: 'stairsdown', backAt: [2, 16], backLabel: 'the staff stairs, back down to the department store',
    map: K.hall(30, 18, '#', '.'),
    look: { floor: { p: 'checker', c: ['#e8e4dc', '#2a2a2a'] }, wall: { p: 'flat', c: ['#2a3a3a', '#1a2a2a'], topColor: '#1a2a2a' }, wallface: { p: 'tile', c: ['#c8dcd8', '#a8c0bc', '#7a908c'], skirt: '#3a5a50' } },
    style: { tallWalls: true }, music: 'fifteencuts', amb: { type: 'clock', vol: 0.04 },
    doors: [{ to: 'W264', type: 'stairs', look: 'stairs', at: [27, 16], label: 'steps up into the stadium tunnel' },
      { id: 'mirror3', to: 'W075', look: 'mirror', at: [18, 1], cond: { flag: 'nl_barber' }, secret: true, arrive: 'back', label: 'the third mirror, which no longer reflects the shop' }],
    place: [{ type: 'decor', at: [6, 1], look: 'mirror', lines: ['A mirror. You look exactly as approved.'] }, { type: 'decor', at: [12, 1], look: 'mirror', lines: ['A mirror. Behind your reflection, the chart of haircuts, the right way round.'] },
      { type: 'decor', at: [18, 1], look: 'mirror', cond: { notFlag: 'nl_barber' }, lines: ['A third mirror. For a moment, your reflection has longer hair than you.'] },
      { id: 'chart', type: 'decor', at: [24, 1], look: 'poster', lines: ['The chart of approved haircuts.'] },
      { type: 'decor', at: [6, 3], look: 'chair', lookOpt: { c: ['#a02020'] }, lines: ['A barber’s chair, red leather, worn into the shape of everybody.'] },
      { type: 'decor', at: [12, 3], look: 'chair', lookOpt: { c: ['#a02020'] }, lines: ['A barber’s chair. On the shelf in front of it, fifteen combs, numbered.'] },
      { type: 'decor', at: [18, 3], look: 'chair', lookOpt: { c: ['#a02020'] }, lines: ['A barber’s chair, turned towards the third mirror, as if waiting for someone.'] },
      { type: 'decor', at: [25, 5], look: 'sink', lines: ['A basin. A single long hair is caught in the plughole, and nobody has dared to remove it.'] },
      SOUL([KN('머리는 다시 자랍니다. 그래서 리발소는 문을 닫지 않습니다.', 'Hair grows back. That is why the barber’s never closes.')])],
    npcs: [{ id: 'N1450', name: 'The Barber', at: [12, 6], look: H({ t: 'adult', hairStyle: 'short', body: 'apron', c: ['#e8e8e0', '#c8c8c0', '#e0c0a0', '#1a1a1a'], acc: 'scissors' }), behavior: 'static', solid: true,
        lines: [KN('어떤 머리로 해 드릴까요? 열다섯 가지 중에서 고르십시오. 안 고르셔도 됩니다. 제가 골라 드립니다.', 'Which haircut would you like? Choose one of the fifteen. You need not choose. I will choose for you.'),
          KN('열여섯 번째 머리요? 그런 것은 없습니다. 있었다면 열여섯 가지라고 했을 것입니다.', 'A sixteenth haircut? There is no such thing. If there were, we would say sixteen.'), 'He snips at the air while he waits, keeping his hands in time.'] },
      { id: 'N1451', name: 'A Boy Waiting for Haircut No. 3', at: [6, 9], look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#e8e8e8', '#c8c8c8', '#f0c8a0', '#1a1a1a'] }), behavior: 'static', solid: true,
        lines: [KN('저는 삼 번이에요. 아버지도 삼 번이에요. 할아버지도 삼 번이었어요.', 'I am number three. My father is number three. My grandfather was number three.')] },
      { id: 'N1452', name: 'A Woman Under the Dryer', at: [20, 8], look: H({ t: 'adult', head: 'hood', body: 'robe', c: ['#c8a0a0', '#a88080', '#e0c0a0', '#2a1a1a'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [KN('일없습니다. 제 머리는 원래 이랬습니다.', 'It is nothing. My hair was always like this.'), 'Under the dryer she is whispering the name of a haircut that is not on the chart.'] }],
    mech: [{ type: 'cycleFrames', mark: 'chart', every: 1.8, good: 4, flag: 'nl_barber',
      frames: ['The chart of approved haircuts. No. 1: “the Worker”.', 'No. 4: “the Student”. Very short, very neat.', 'No. 9: “the Young Wife”. A bun, pinned tight.', 'No. 15: “the Veteran”. Almost nothing left to cut.',
        'For a blink, after No. 15: a sixteenth haircut. Long hair, loose, like someone’s mother on a Sunday.', 'No. 7: “the Pioneer”. A fringe cut straight along a ruler.'],
      doneLine: 'The chart shows fifteen haircuts. You know there were sixteen.',
      winLines: ['You point at the sixteenth haircut before it disappears.', 'The barber goes pale, then laughs, very quietly, for the first time in years.', { t: '그건… 우리 어머니 머리였습니다.', lang: 'ko-n', tr: 'That one… was my mother’s hair.', who: 'The Barber' }, 'Behind him, the third mirror stops reflecting the shop.'],
      reward: [{ set: { nl_barber: true } }] }],
    info: { summary: 'A tiled barber’s shop above the department store, where there are exactly fifteen approved haircuts.',
      rules: ['The chart of haircuts changes every two seconds: touch it when it shows the sixteenth haircut.', 'The third mirror then opens onto the Portrait Hall (W075).', 'Reached by the staff stairs of the department store (W266) or by the steps under the stadium (W264).'],
      secrets: ['The third mirror.'],
      lore: 'Even hair has a list.' } });

  /* ---------------------------------------------------------------
   *  W272 — Les Immeubles de la Lumière éclatante (sans courant)
   * --------------------------------------------------------------- */
  S({ id: 'W272', name: 'The Bright Light Apartments', depth: 3, tier: 'hard', back: 'W268', backLook: 'stairsdown', backAt: [2, 11], backLabel: 'the stairs down to the street and the station',
    map: (function () { var g = K.grid(46, 14, ' '); g.box(0, 0, 46, 14, '#', '.'); g.rect(1, 1, 44, 3, '#'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#5a5a58', '#4a4a48'] }, wall: { p: 'flat', c: ['#1a1a1c', '#121214'], topColor: '#1a1a1c' }, wallface: { p: 'concrete', c: ['#4a4a4c', '#3a3a3c', '#2a2a2c'], skirt: '#1a1a1a' } },
    style: { tallWalls: true }, music: null, amb: { type: 'drip', vol: 0.04 }, dark: 0.88,
    doors: [{ to: 'W273', type: 'stairs', look: 'stairsdown', at: [43, 11], label: 'the basement, where the line goes on underground' },
      { to: 'W269', look: 'door', opt: { style: 'wood', c: ['#5a3a2a'] }, at: [2, 6], label: 'the street door, towards the visitors’ hotel' },
      { id: 'hatch', to: 'W274', type: 'ladder', look: 'ladder', at: [24, 12], cond: { flag: 'nl_flats' }, secret: true, label: 'a ladder up through the roof hatch' },
      { id: 'neighbour', to: 'W270', look: 'door', opt: { style: 'wood', c: ['#4a3a2a'] }, at: [42, 4], cond: { flag: 'nl_radio272' }, secret: true, arrive: 'back', label: 'a neighbour’s door, ajar, with a wire under it' }],
    place: [{ id: 'f1', type: 'decor', at: [6, 4], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: '1' }, lines: ['Door 1. Behind it, someone is counting candles.', KN('초는 하나만 켭니다. 두 개 켜면 밖에서 보입니다.', 'We light only one candle. With two, it shows from outside.')] },
      { id: 'f2', type: 'decor', at: [14, 4], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: '2' }, lines: ['Door 2. A child’s voice, doing homework by feel.', KN('이 일은 이, 이 이는 사… 엄마, 불은 언제 와요?', 'Two ones are two, two twos are four… Mum, when does the light come?')] },
      { id: 'f3', type: 'decor', at: [22, 4], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: '3' }, lines: ['Door 3. Behind it, a radio being tuned, very softly, then switched off in a hurry.', KN('백사 점 오… 아니, 아무것도 안 들었습니다.', 'One hundred and four point five… no, I heard nothing.')] },
      { id: 'f4', type: 'decor', at: [30, 4], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: '4' }, lines: ['Door 4. An old woman sings to someone who is too old for lullabies.', KN('자장자장, 우리 아기…', 'Hush-a-bye, my little one…')] },
      { id: 'f5', type: 'decor', at: [38, 4], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'], symbol: '5' }, use: [{ set: { nl_chol4: true } }],
        lines: ['Door 5. Nobody answers. The door is not locked.', 'Inside, in the dark: a table, three bowls turned upside down, and one the right way up, waiting.', 'On the waiting bowl, scratched with a spoon: 철.'] },
      { type: 'decor', at: [10, 12], look: 'candle', light: 1.4, lines: ['A candle stub on a saucer, shared by the whole corridor.'] },
      { type: 'decor', at: [34, 12], look: 'candle', light: 1.2, lines: ['A candle. Someone has written the date on the saucer, to know how long it has lasted.'] },
      { type: 'decor', at: [44, 8], look: 'portrait', lookOpt: { redacted: true }, light: 2.2, lines: ['At the end of the corridor, a portrait glows in the dark: the only thing in the building with electricity.'] },
      SOUL([KN('정전이 되면 초상화에만 불이 들어옵니다. 초상화는 전기가 따로 있습니다.', 'When the power goes, only the portraits stay lit. The portraits have their own electricity.')])],
    radio: { '104.5': { cond: { equipped: 'E220' }, line: KS('…여기는 서울입니다. 오늘 밤 서울은 맑겠습니다. 북쪽의 가족 여러분, 안녕히 주무십시오.', '…This is Seoul. Tonight the sky over Seoul will be clear. To the families in the North: good night.'), do: [{ set: { nl_radio272: true } }] } },
    decor: [{ look: 'barrel', n: 2, lines: ['A barrel of water carried up from the pump, nine floors. It is labelled with a family name.'] }, { look: 'clothesline', n: 1, lines: ['Washing hung across the corridor, drying in the dark. It will take a week.'] }],
    npcs: [{ id: 'N1455', name: 'The Block Warden', look: H({ t: 'old', hairStyle: 'bun', body: 'uniform', c: ['#4a4a5a', '#3a3a4a', '#e0c8a8', '#c8c8c8'], acc: 'clipboard' }), behavior: 'patrol', path: [[4, 8], [40, 8]], speed: 0.4, solid: true,
        lines: [KN('전기는 래일 옵니다. 어제도 그렇게 말했습니다. 래일도 그렇게 말할 겁니다.', 'The electricity comes back tomorrow. I said so yesterday. I will say so tomorrow.'),
          KN('라지오는 모두 고정 주파수입니다. 저는 문 앞에서 듣습니다. 그것이 저의 일입니다.', 'All radios are on the fixed frequency. I listen at the doors. That is my job.')] },
      { id: 'N1456', name: 'A Girl Carrying Water', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#6a7a9a', '#4a5a7a', '#f0c8a0', '#1a1010'] }), behavior: 'wander', radius: 4, speed: 0.7, solid: true,
        lines: [KN('물은 아래층에서 길어 와요. 승강기는 그림이에요.', 'We fetch water from downstairs. The lift is a painting.'), 'She carries two buckets, and smiles at you so that you will not offer to help.'] }],
    mech: [{ type: 'visitAll', marks: ['f1', 'f2', 'f3', 'f4', 'f5'], flag: 'nl_flats',
      winLines: ['Five doors, five dark flats. Nobody here has had light for a long time.', 'Everybody says it is coming back tomorrow.', 'Above the corridor, a roof hatch you had not noticed has been left unbolted.'],
      reward: [{ set: { nl_flats: true, nl_chol4: true } }] }],
    info: { summary: 'A tower block called Bright Light, in total darkness; behind each door, a family waiting for the electricity.',
      rules: ['Listen at all five doors: a ladder appears to the roof hatch, towards Monument Square (W274).', 'Door 5 holds a trace of 철이.',
        'With the Unsealed Radio (E220), tune to 104.5 (heard behind door 3): a neighbour’s door opens.', 'It leads to the Fifth-Floor Listening Room (W270).', 'The basement stairs lead to the Unlit Tunnel (W273); the street door to the Hotel for Visitors (W269).'],
      secrets: ['The roof hatch.', 'The neighbour’s door, after 104.5.'],
      lore: 'Seen from above at night, the whole city is dark except for the monuments.' } });

  /* ---------------------------------------------------------------
   *  W273 — Le Tunnel sans lumière (l'écho)
   * --------------------------------------------------------------- */
  S({ id: 'W273', name: 'The Unlit Tunnel', depth: 3, tier: 'hard', back: 'W272', backLook: 'stairs', backAt: [1, 3], backLabel: 'the stairs back up to the dark apartments',
    map: (function () { var g = K.grid(72, 10, ' '); g.box(0, 0, 72, 10, '#', '.'); g.rect(1, 1, 70, 1, '#'); g.set(20, 1, '.'); g.set(50, 1, '.'); g.rect(1, 4, 70, 3, 'r'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#2a2a2c', '#222224'] }, rail: { p: 'rails', c: ['#1a1a1a', '#5a5a60'] }, wall: { p: 'stone', c: ['#1a1a1c', '#121214', '#242426'] } },
    style: { tallWalls: true }, music: null, amb: { type: 'drip', vol: 0.06 }, dark: 0.95,
    doors: [{ to: 'W274', type: 'stairs', look: 'stairs', at: [70, 3], label: 'steps up towards a square full of light' },
      { id: 'niche', to: 'W278', look: 'door', opt: { style: 'metal', c: ['#5a5a4a'] }, at: [50, 1], cond: { equipped: 'E224' }, secret: true, arrive: 'back', label: 'a door in a niche, visible only by lamplight' },
      { id: 'maint', to: 'W110', look: 'door', opt: { style: 'metal', c: ['#4a3a2a'] }, at: [20, 1], cond: { flag: 'nl_echo' }, secret: true, arrive: 'back', label: 'a maintenance door, warm to the touch' }],
    decor: [{ look: 'wire', n: 3, lines: ['Cables along the wall. They carry nothing.', 'A cable, cut, the ends wrapped neatly in cloth, as if it might be needed again.'] },
      { look: 'puddle', n: 2, lines: ['A puddle between the sleepers. It reflects nothing, because there is nothing to reflect.'] }, { look: 'crack', n: 2, lines: ['A crack in the tunnel wall. Through it, a draught that smells of snow.'] }],
    place: [SOUL([KN('불이 없는 굴에서는 모두 같은 얼굴입니다.', 'In a tunnel with no light, everyone has the same face.')])],
    npcs: [{ id: 'N1460', name: 'The Linesman Without a Lamp', at: [30, 7], look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#3a3a2a', '#2a2a1a', '#e0c8a8', '#c8c8c8'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [KN('굴은 대답을 좋아합니다. 대답에 대답하는 사람은 더 좋아합니다.', 'The tunnel likes an answer. It likes even better someone who answers its answer.'), 'He walks the line by touch. He knows every sleeper by name, he says, and none of them by sight.'] },
      { id: 'N1461', name: 'Someone Walking Home Along the Rails', look: { t: 'shadow', c: ['#0a0a10'], h: 22 }, behavior: 'wander', radius: 10, speed: 0.7, solid: false,
        lines: ['A silhouette walking home along the rails, because no trains are running. It nods to you in the dark.'] }],
    mech: [{ type: 'echo', zone: [1, 1, 70, 8], words: ['fine', 'nothing', 'soon', 'again', 'here'], flag: 'nl_echo',
      winLines: ['The tunnel says its word back to you, and you say it back to the tunnel.', 'For a moment you and the dark agree on something. In a niche, a maintenance door unlocks itself.'], reward: [{ set: { nl_echo: true } }] }],
    info: { summary: 'A railway tunnel with no power and no light, where people walk home along the rails.',
      rules: ['Say something in the tunnel; it answers with a word; say that word back to it.', 'A maintenance door then opens in a niche, towards the Censorship Archives (W110).',
        'With The Lamp Left On (E224) equipped, a second niche shows a door to the Halt Not on the Map (W278).', 'Also reached by falling through the gap in Right-Time Station (W261).'],
      secrets: ['The maintenance door.', 'The door seen only by lamplight.'],
      lore: 'Between two stations, the country as it is when the power is off.' } });

  /* ---------------------------------------------------------------
   *  W274 — La Place du monument, la nuit (tours et foulard rouge)
   * --------------------------------------------------------------- */
  S({ id: 'W274', name: 'Monument Square at Night', depth: 3, tier: 'hard', back: 'W273', backLook: 'stairsdown', backAt: [24, 37], backLabel: 'the steps back down into the tunnel', outdoor: true,
    map: (function () { var g = K.grid(50, 40, '.'); g.border('#');
      g.ellipse(24.5, 17.5, 12, 10, 'f'); g.ellipse(24.5, 17.5, 10, 8, ':'); g.set(24, 26, ':'); g.set(24, 27, ':');
      return g.rows(); })(),
    look: { floor: { p: 'stone', c: ['#8a8478', '#6a6458', '#9a9488'] }, floor3: { p: 'marble', c: ['#e8e0d0', '#a89878'] }, wall: { p: 'flat', c: ['#1a1a20', '#101014'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#8a8a8a'] } },
    tall: { 'f': { look: 'fence', opt: { c: ['#8a8a8a'] } } }, style: { stars: true, sky: ['#05060c', '#1a2030'] }, music: 'nightsquare', amb: { type: 'wind', vol: 0.05 }, dark: 0.65,
    doors: [{ to: 'W275', look: 'bigdoor', opt: { c: ['#4a4a3a'] }, at: [24, 2], label: 'the Travel Permit Office, open all night' },
      { id: 'plinth', to: 'W076', type: 'stairs', look: 'stairsdown', at: [24, 19], cond: { tempGte: { nl_laps274: 12 } }, secret: true, arrive: 'back', label: 'steps going down inside the plinth' }],
    place: [{ id: 'monument', type: 'decor', at: [24, 17], look: 'monument', light: 4, lines: ['The monument, floodlit. It is the brightest thing for a hundred kilometres.', 'At its feet, flowers. Real ones at night; plastic ones by day.'] },
      { id: 'gate', type: 'decor', at: [24, 27], look: 'gate', solid: false, block: { unless: { equipped: 'E221' } }, lines: ['A low gate in the railings. A night guard’s cap hangs on it.'] },
      SOUL([KN('동상은 밤에도 불을 켭니다. 우리 집보다 먼저.', 'The statue gets its light at night too. Before our homes do.')])],
    decor: [{ look: 'streetlamp', n: 4, light: 2, lines: ['A street lamp, lit. It points at the statue, not at the pavement.'] }, { look: 'flowers', n: 3, lines: ['Flowers laid at the edge of the square, in rows. Each bunch has been counted.'] },
      { look: 'bench', n: 2, lines: ['A bench facing the monument. Sitting with your back to it is not forbidden. Nobody does it.'] }],
    npcs: [{ id: 'N1465', name: 'The Night Sweeper', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#5a5a4a', '#4a4a3a', '#e0c8a8', '#c8c8c8'], acc: 'broom' }), behavior: 'patrol', path: [[10, 5], [39, 5], [39, 30], [10, 30]], speed: 0.4, solid: true,
        lines: [KN('밤에는 모두 세 번 돌고 집에 갑니다. 세 번. 그러면 돌이… 아니, 아무것도 안 열립니다.', 'At night, everyone walks round three times before going home. Three times. Then the stone… no. Nothing opens.'), 'She sweeps up the petals of the flowers people laid, so that tomorrow there can be new ones.'] },
      { id: 'N1466', name: 'The Night Guard', at: [26, 29], look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#4a5a3a'] }), behavior: 'static', solid: true,
        lines: [KN('밤에는 어른은 올라갈 수 없습니다. 붉은 넥타이를 맨 아이들만 꽃을 바칩니다.', 'At night, adults may not go up. Only children in red scarves lay flowers.')],
        reacts: { E221: { lines: ['He sees the red scarf and steps aside, saluting a child who is not quite there.'] } } },
      { id: 'N1467', name: 'A Woman Bowing for Too Long', look: H({ t: 'adult', hairStyle: 'bun', body: 'hanbok', c: ['#e8e4dc', '#c8c4bc', '#d8c0a8', '#1a1a1a'], eyes: 'down' }), behavior: 'static', solid: true,
        lines: [{ seq: ['She has been bowing since before you arrived. When she straightens up, her face is wet.', 'She says it is the dew.'] }, KN('이슬입니다. 일없습니다.', 'It is the dew. It is nothing.')] },
      VOICE('N1468', [KN('기념광장입니다. 광장은 밤에도 밝습니다.', 'Monument Square. The square is bright even at night.'), KN('다음은 려행증 발급소입니다.', 'Next: the Travel Permit Office.')], 26)],
    mech: [{ type: 'laps', center: [24.5, 17.5], key: 'nl_laps274' }],
    info: { summary: 'A vast floodlit square at night, the only lit place in a dark city, with a statue behind railings.',
      rules: ['Only children in red scarves may pass the gate in the railings at night: equip the Red Scarf (E221).', 'Walk three times round the monument: steps open in the plinth, down to the Great Monument (W076).', 'The big door leads to the Travel Permit Office (W275).'],
      secrets: ['The steps inside the plinth.'],
      lore: 'The brightest place in the country, and the emptiest.' } });

  /* ---------------------------------------------------------------
   *  W275 — Le Bureau des laissez-passer
   * --------------------------------------------------------------- */
  S({ id: 'W275', name: 'The Travel Permit Office', depth: 3, tier: 'hard', back: 'W274', backLook: 'bigdoor', backOpt: { c: ['#4a4a3a'] }, backAt: [22, 26], backLabel: 'the doors back out to Monument Square',
    map: (function () { var g = K.grid(46, 28, ' '); g.box(0, 0, 46, 28, '#', '.');
      g.hline(3, 35, 5, 'u');                                                     // les guichets
      g.vline(39, 2, 9, '}'); g.hline(40, 44, 9, '}');                            // des classeurs cachent un recoin
      return g.rows(); })(),
    look: { floor: { p: 'tileLines', c: ['#a8a490', '#8a8670'] }, wall: { p: 'flat', c: ['#2a2a20', '#1a1a14'], topColor: '#2a2a20' }, wallface: { p: 'panel', c: ['#a8b098', '#889078', '#5a6050'], skirt: '#3a4030' }, counter: { p: 'wood', c: ['#6a5a3a', '#4a3a28', '#7a6a48'] } },
    tall: { '}': { look: 'drawer' } }, style: { tallWalls: true }, music: 'permits', amb: { type: 'office', vol: 0.05 },
    doors: [{ to: 'W276', look: 'gate', opt: { c: ['#4a4a4a'] }, at: [42, 26], cond: { equipped: 'E219' }, label: 'the platform for the border train',
      locked: [{ t: 'A gate onto the platform for the border train.' }, { t: 'A soldier holds out his hand for a travel permit, and keeps holding it out.' }] },
      { to: 'W279', look: 'door', opt: { style: 'wood', c: ['#5a4a3a'], symbol: '9' }, at: [43, 3], label: 'window 9: family reunion applications' }],
    place: [{ id: 'w1', type: 'decor', at: [8, 5], look: 'till', cycle: false, lines: ['Window 1: Photographs.', KN('사진은 3번 창구의 7호 양식이 있어야 찍습니다.', 'Photographs only with form 7 from window 3.')] },
      { id: 'w2', type: 'decor', at: [14, 5], look: 'till', cycle: false, lines: ['Window 2: Signatures.', KN('인민반 도장이 있으면 무엇이든 서명합니다.', 'If it has the neighbourhood stamp, I sign anything.')] },
      { id: 'w3', type: 'decor', at: [20, 5], look: 'till', cycle: false, lines: ['Window 3: Forms.', KN('7호 양식입니다. 모두 여기서 시작합니다.', 'Form 7. Everyone starts here.')] },
      { id: 'w4', type: 'decor', at: [26, 5], look: 'till', cycle: false, lines: ['Window 4: Neighbourhood stamps.', KN('사진이 붙어 있어야 도장을 찍습니다.', 'I stamp it only once the photograph is attached.')] },
      { id: 'w5', type: 'decor', at: [32, 5], look: 'till', lines: ['Window 5. A handwritten card: closed until further notice. The card is yellow with age.'] },
      { id: 'cabinet', type: 'decor', at: [34, 12], look: 'drawer', use: [{ set: { nl_chol5: true } }],
        lines: ['A filing cabinet. One drawer is labelled with a single syllable: 철.', 'Inside, one card: “Transferred.” Destination: a dash.', 'The dash is drawn very carefully, as if the clerk had wanted it to be a real place.'] },
      HINT([KN('구 번 창구는 없습니다. 있다면 저 서랍장 뒤에 있을 겁니다.', 'There is no window nine. If there were, it would be behind those filing cabinets.')], [37, 2])],
    decor: [{ look: 'clock', n: 1, lines: ['An office clock. It is twenty past nine. It has been twenty past nine since the office opened.'] }, { look: 'poster', n: 2, lines: ['A poster: a smiling family boarding a train. The train has no destination board.', 'A poster listing the documents required. The list continues onto a second poster, which has been taken down.'] }],
    npcs: [{ id: 'N1470', name: 'A Woman With a Folder of Forms', at: [12, 9], look: H({ t: 'adult', hairStyle: 'long', body: 'coat', c: ['#6a5a6a', '#4a3a4a', '#e0c0a0', '#1a1a1a'], acc: 'book' }), behavior: 'static', solid: true,
        lines: [KN('줄은 서 있는 것만으로도 일이 됩니다.', 'Standing in a queue counts as work.'), 'Her folder of forms is held together with a hair clip. Some of the forms are older than she is.'] },
      { id: 'N1471', name: 'A Man Finishing His Father’s Form', at: [18, 11], look: H({ t: 'old', body: 'suit', c: ['#4a4a4a', '#3a3a3a', '#e0c8a8', '#c8c8c8'], acc: 'briefcase' }), behavior: 'static', solid: true,
        lines: [KN('이 양식은 제 아버지가 시작했습니다. 제가 끝낼 겁니다. 아니면 제 아들이.', 'My father started this form. I will finish it. Or else my son.')] },
      { id: 'N1472', name: 'The Soldier at the Gate', at: [40, 26], look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#4a5a3a'] }), behavior: 'static', solid: true,
        lines: [KN('려행증.', 'Permit.'), 'He holds out his hand. He has held it out for so long that it no longer expects anything.'],
        reacts: { E219: { lines: ['He reads the permit upside down, nods, and looks away so that you can pass.'] } } }],
    mech: [{ type: 'sequence', order: ['w3', 'w1', 'w4', 'w2'], passThrough: true, give: 'E219', wrongLine: 'The clerk does not look up. She points, without a word, at another window.',
      winLines: ['Form 7, a photograph, the neighbourhood stamp, a signature.', 'At the last window, the clerk slides a travel permit under the glass.', 'Valid for one journey, in one direction. The direction has been left blank.'] }],
    info: { summary: 'An office open all night, with five windows, a queue that never moves and filing cabinets full of people.',
      rules: ['Visit the windows in the order the clerks demand (3, 1, 4, 2): the Travel Permit (E219).', 'With the permit equipped, the soldier opens the gate to the border train (the Painted Horizon, W276).',
        'Behind the filing cabinets top-right, a narrow gap leads to window 9 and the Lottery of Names (W279).', 'One drawer of the filing cabinets holds a trace of 철이.'],
      secrets: ['Window 9, behind the filing cabinets.'],
      lore: 'Going anywhere starts with a form, and the form starts at another window.' } });

  /* ---------------------------------------------------------------
   *  W276 — Le Pont à l'horizon peint (P4)
   * --------------------------------------------------------------- */
  var CANVAS = { p: 'gradient', c: ['#a8c8e8', '#f0e0c0'] };
  S({ id: 'W276', name: 'The Painted Horizon', depth: 4, tier: 'hard', back: 'W275', backLook: 'gate', backOpt: { c: ['#4a4a4a'] }, backAt: [8, 56], backLabel: 'back to the platform of the permit office', outdoor: true,
    map: (function () { var g = K.grid(18, 58, '~'); g.rect(6, 4, 6, 54, '='); g.rect(0, 0, 18, 4, '.'); g.hline(0, 17, 4, '?'); return g.rows(); })(),
    look: { floor: { p: 'grass', c: ['#5a6a5a', '#4a5a4a', '#6a7a6a'] }, bridge: { p: 'plank', c: ['#6a5a4a', '#4a3a2a', '#7a6a5a'] }, water: { p: 'water', c: ['#3a4a4a', '#2a3a3a', '#4a5a5a', '#a0b0b0'] }, secret: CANVAS, wall: CANVAS },
    style: { renderer: 'watercolor', sky: ['#5a6a7a', '#c8ccd0'] }, music: 'paintedhorizon', amb: { type: 'river', vol: 0.08 }, dark: 0.3, weather: { dust: true },
    doors: [{ id: 'tear', to: 'W278', look: 'door', opt: { style: 'shoji', c: ['#d8d0c0'] }, at: [11, 5], cond: { flag: 'nl_horizon' }, secret: true, label: 'a tear in the canvas, where the paint has peeled' }],
    place: [{ id: 'toW077', type: 'door', to: 'W077', at: [8, 1], look: 'gate', lookOpt: { c: ['#7a7a7a'] }, arrive: 'back', secret: true, unreachOk: 'through the painted canvas, with the Glassless Window', label: 'the real riverbank, where a real fence begins' },
      { id: 'glow', type: 'decor', at: [9, 30], look: 'lantern', light: 3, lines: ['A lantern, on the far side of the bridge. It is always a little further away than it was.'] },
      SOUL([KN('강 건너 불빛은 그림보다 덜 밝습니다. 그런데 꺼지지 않습니다.', 'The lights across the river are less bright than the painting. But they never go out.')])],
    radio: { '88.8': { cond: { equipped: 'E220' }, line: { t: '…music from the far bank: an accordion, a dog barking, someone laughing at a joke you cannot hear.' }, do: [{ secret: 'nl_farbank' }] } },
    npcs: [{ id: 'N1475', name: 'The Painter of the Horizon', at: [7, 7], look: H({ t: 'old', body: 'coat', c: ['#a8b8c8', '#8898a8', '#e0c8a8', '#c8c8c8'], acc: 'needle' }), behavior: 'static', solid: true,
        lines: [KN('매일 아침 수평선을 다시 칠합니다. 밤사이에 저쪽 불빛이 배어 나오니까.', 'Every morning I repaint the horizon. Overnight, the lights from the other side seep through.'), KN('그림 속 마을이 더 행복합니다. 제가 그렇게 그렸습니다.', 'The town in the painting is happier. I painted it that way.'),
          'He has paint up to his elbows: the blue of a sky nobody has seen from here.'] },
      { id: 'N1476', name: 'A Guard Facing the Canvas', at: [10, 12], look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#4a5a3a'] }), behavior: 'static', solid: true,
        lines: [KN('저 건너편은 그림입니다. 그림이 아니라면… 그림입니다.', 'The other side is a painting. And if it is not a painting… it is a painting.')] },
      { id: 'N1477', name: 'A Boatman With No Boat', at: [8, 40], look: H({ t: 'old', body: 'shirt', c: ['#8a8a7a', '#6a6a5a', '#e0c8a8', '#a8a8a8'] }), behavior: 'wander', radius: 2, speed: 0.4, solid: true,
        lines: [KN('강은 좁습니다. 헤엄치면 십 분. 저는 헤엄을 못 칩니다. 다행입니다.', 'The river is narrow. Ten minutes, swimming. I cannot swim. That is lucky.')] }],
    mech: [{ type: 'recede', mark: 'glow', dist: 8, flag: 'nl_horizon',
      winLines: ['The lantern stops at the foot of the canvas: it has nowhere left to go.', 'Up close, you see that it was painted too. Beside it, a strip of canvas has peeled away.', 'Something cold and real is breathing through the tear.'],
      reward: [{ set: { nl_horizon: true } }] }],
    info: { summary: 'A border bridge over a grey river, ending at a huge canvas on which the far bank has been painted, happier.',
      rules: ['A lantern on the bridge backs away when you look at it: chase it until it is stuck against the canvas.', 'A tear then opens onto the Halt Not on the Map (W278).',
        'The canvas is only paint: with the Glassless Window (E223), walk through it to the real bank.', 'There, a gate leads to the Border (W077).', 'With the Unsealed Radio (E220), 88.8 picks up the far bank.'],
      secrets: ['The tear in the canvas.', 'The real riverbank behind the paint.'],
      lore: 'A horizon repainted every morning, so that the other side never shows through.' } });

  /* ---------------------------------------------------------------
   *  W277 — La Salle des retrouvailles, deux heures (P4)
   * --------------------------------------------------------------- */
  S({ id: 'W277', name: 'The Two-Hour Reunion Hall', depth: 4, tier: 'hard', back: 'W279', backAt: [2, 27], backLabel: 'back to the lottery hall',
    map: (function () { var g = K.grid(44, 30, ' '); g.box(0, 0, 44, 30, '#', '.'); g.rect(2, 2, 40, 22, ',');
      for (var y = 5; y < 22; y += 4) for (var x = 6; x < 40; x += 7) g.set(x, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#d8ccb8', '#b8a890'] }, floor2: { p: 'carpet', c: ['#7a2a3a', '#5a1a2a', '#c8a040'] }, wall: { p: 'flat', c: ['#2a1a14', '#1a100c'], topColor: '#2a1a14' }, wallface: { p: 'panel', c: ['#c8b088', '#a89068', '#7a6040'], skirt: '#4a1a1a' } },
    tall: { '{': { look: 'table', opt: { cloth: '#f0e8d8' } } }, style: { tallWalls: true, renderer: 'sepia' }, music: 'reunion', amb: { type: 'crowd', vol: 0.03 }, dark: 0.2,
    doors: [{ id: 'bus', to: 'W261', look: 'door', opt: { style: 'metal', c: ['#3a5a8a'] }, at: [22, 28], cond: { remainingLt: 120 }, secret: true, label: 'the buses, leaving' }],
    place: [{ id: 'clock', type: 'decor', at: [22, 1], look: 'wallclock', lookOpt: { hour: 2, min: 0 }, lines: ['A clock with only two hours on its face. When the hand reaches two, the buses leave.'] },
      { id: 'emptychair', type: 'decor', at: [33, 13], look: 'chair', lookOpt: { c: ['#c8a040'] }, lines: ['The chair opposite him is empty. On the table before it, a name card: 안옥순.', 'It has been straightened many times.'] },
      SOUL([KN('헤여질 때는 손을 흔들지 마십시오. 버스 창문은 열리지 않습니다.', 'When you part, do not wave. The bus windows do not open.')])],
    npcs: [{ id: 'N1480', name: 'The Old Man at Table Fifty-One', at: [35, 13], look: H({ t: 'old', body: 'suit', c: ['#3a3a48', '#2a2a38', '#e8c8a8', '#d0d0d0'], eyes: 'sad', acc: 'box' }), behavior: 'static', solid: true,
        lines: [KN('두 시간입니다. 칠십 년을 기다렸으니, 두 시간이면 충분합니다.', 'Two hours. After seventy years of waiting, two hours is plenty.'),
          KN('누이는 신발 한 짝을 잃어버렸습니다. 왼쪽입니다. 새 신발을 가져왔습니다. 두 짝 다.', 'My little sister lost one of her shoes. The left one. I have brought new shoes. Both of them.'),
          'He keeps glancing at the empty chair, then apologising to it.',
          KN('그 애 이름을 누가 불러 주면 올 것 같습니다. 그런데 저는 너무 오래 안 불러서, 소리가 안 나옵니다.', 'If someone called her name, I think she would come. I have not said it for so long, no sound comes out.')] },
      { id: 'N1481', name: 'A Family Holding Photographs', count: 3, look: H({ t: 'adult', body: 'hanbok', c: ['#d8d0c0', '#b8b0a0', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true,
        lines: [KN('이게 우리 손자입니다. 이게 증손자. 이건… 모르는 사람입니다. 그래도 가족입니다.', 'This is our grandson. This is our great-grandson. This one… I do not know who this is. But he is family.'),
          'They talk very fast, all at once, to fit seventy years into the time it takes a clock hand to go round twice.'] },
      { id: 'N1482', name: 'The Supervisor With the Stopwatch', look: H({ t: 'adult', body: 'suit', c: ['#2a2a2a', '#1a1a1a', '#e0c0a0', '#1a1a1a'], acc: 'clipboard' }), behavior: 'patrol', path: [[3, 3], [40, 3], [40, 24], [3, 24]], speed: 0.4, solid: true,
        lines: [KN('남은 시간을 확인하십시오. 울어도 시간은 갑니다.', 'Check the time remaining. Crying does not stop the clock.')] }],
    mech: [{ type: 'sayTo', ent: 'N1480', dist: 3, words: ['옥순', '안옥순', 'oksun', 'ok sun', 'ahn oksun', 'ahn ok sun', 'oksoon', 'ok soon'], give: 'E222',
      winLines: ['You say her name, very quietly, the way you would call someone in for dinner.', 'The old man closes his eyes. For a moment the chair opposite is not quite empty:', 'there is a dip in the cushion, the size of a small girl.',
        { t: '…옥순아. 왔구나. 오빠가 늦었다.', lang: 'ko-n', tr: '…Ok-sun. You came. Your big brother is late.', who: 'The Old Man at Table Fifty-One' },
        'He unbuckles his watch and puts it in your hand. Its face only goes up to two.',
        { t: '두 시간이었습니다. 저는 한 시간이면 됐습니다. 나머지는 가지십시오.', lang: 'ko-n', tr: 'It was two hours. One would have been enough for me. Keep the rest.', who: 'The Old Man at Table Fifty-One' }] }],
    info: { summary: 'A banqueting hall where separated families have two hours together, under a clock that only goes up to two.',
      rules: ['Near the old man at table fifty-one, say the name on the card opposite him (Ok-sun, 옥순).', 'He gives you the Two-Hour Watch (E222).',
        'In the last two minutes of the dream, a door opens at the bottom: buses back to Right-Time Station (W261).'],
      secrets: ['The buses, at the very end.'],
      lore: 'Seventy years, two hours. Some names were never drawn; some chairs stayed empty.' } });

  /* ---------------------------------------------------------------
   *  W278 — La Halte qui n'est pas sur la carte (P4)
   * --------------------------------------------------------------- */
  S({ id: 'W278', name: 'The Halt Not on the Map', depth: 4, tier: 'hard', back: 'W276', backOpt: { style: 'shoji', c: ['#d8d0c0'] }, backAt: [3, 9], backLabel: 'back through the tear in the canvas', outdoor: true,
    map: (function () { var g = K.grid(52, 22, 'n'); g.border('^'); g.rect(4, 8, 44, 3, ':'); g.rect(1, 11, 50, 3, 'r'); return g.rows(); })(),
    look: { snow: { p: 'snow', c: ['#e8eef6', '#d8e0ec', '#ffffff'] }, floor3: { p: 'plank', c: ['#5a5048', '#4a4038', '#6a6058'] }, rail: { p: 'rails', c: ['#2a2a2a', '#8a8a90'] } },
    tall: { '^': { look: 'pine', opt: { c: ['#2a4a3a', '#1a3a2a', '#f0f4f8'] } } }, style: { renderer: 'watercolor', stars: true, sky: ['#0a1020', '#2a3a5a'] },
    music: null, amb: { type: 'wind', vol: 0.08 }, dark: 0.55, weather: { snow: true },
    doors: [{ id: 'stops', to: 'W079', type: 'train', look: 'train', opt: { c: ['#3a3a3a', '#c8c8c8'], dark: true }, at: [10, 12], cond: { flag: 'nl_named' }, secret: true, arrive: 'back', label: 'a train that stops here, now that here has a name' },
      { id: 'lamphut', to: 'W280', look: 'door', opt: { style: 'wood', c: ['#6a4a2a'] }, at: [44, 3], cond: { flag: CHOL }, secret: true, label: 'a path through the snow, towards a lit window' }],
    place: [{ id: 'board', type: 'decor', at: [24, 7], look: 'board', lookOpt: { lines: ['', '', ''], color: '#e8e8e8' },
        lines: [{ if: { equipped: 'E224' }, t: 'By lamplight you can see where a name was painted out: three syllables, and the outline of a boy’s cap.' }, 'The station name board. It is blank. Below it, three wooden letter wheels, frozen stiff.'] },
      { id: 'd1', type: 'decor', at: [22, 9], look: 'wheel', lines: ['A letter wheel.'] }, { id: 'd2', type: 'decor', at: [24, 9], look: 'wheel', lines: ['A letter wheel.'] }, { id: 'd3', type: 'decor', at: [26, 9], look: 'wheel', lines: ['A letter wheel.'] },
      { type: 'decor', at: [33, 9], look: 'bench', lines: ['A bench under the snow. One place on it has been brushed clear, the size of a child.'] },
      { type: 'trigger', at: [24, 10], lines: ['A train goes through without slowing down. Every window is dark.', 'In one, a small hand is pressed against the glass.'] },
      HINT([KN('이름이 없는 역에는 렬차가 서지 않습니다.', 'Trains do not stop at a station with no name.')])],
    npcs: [{ id: 'N1485', name: 'A Boy on the Bench', at: [34, 9], appear: { flag: CHOL }, look: H({ t: 'kid', head: 'cap', body: 'shirt', c: ['#8a8a7a', '#6a6a5a', '#f0d0b0', '#2a2a2a'], alpha: 0.7, eyes: 'down' }), behavior: 'static', solid: true,
        lines: [KN('…제 이름 알아요? 다들 모른다고 했어요.', '…You know my name? Everyone said they did not.'), 'He swings his legs. He is not cold. He has been here so long he has stopped expecting to be.',
          KN('저 불빛 있는 데로 가요. 할아버지가 등불을 켜 놔요. 아무도 안 와도.', 'Go towards the light. The old man keeps the lamp lit. Even when nobody comes.')] },
      { id: 'N1486', name: 'The Stationmaster Nobody Appointed', at: [16, 9], look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#3a4a5a', '#2a3a4a', '#e0c8a8', '#f0f0f0'] }), behavior: 'static', solid: true,
        lines: [KN('이 역은 지도에 없습니다. 그래서 저도 명단에 없습니다. 그래도 매일 승강장을 씁니다.', 'This station is not on the map. So I am not on the list either. I sweep the platform every day anyway.'),
          KN('이름을 붙이면 렬차가 섭니다. 아무 이름이나 되는 것은 아닙니다.', 'Give it a name and the trains will stop. Not just any name.')] }],
    mech: [{ type: 'dials', marks: ['d1', 'd2', 'd3'], states: 6, values: ['—', '철', '이', '역', '정', '시'], target: [1, 2, 3], labelText: 'The wheel clacks round: ', flag: 'nl_named',
      winLines: ['The board reads: 철이역. Chol-i Station.', 'Far off, a train slows down for the first time. It stops.', 'Its doors open onto the platform, as if it had always stopped here.'], reward: [{ set: { nl_named: true } }] }],
    info: { summary: 'A snowbound halt with a blank name board, where every train goes through without stopping.',
      rules: ['Turn the three letter wheels under the board to read 철이역 (Chol-i Station): a train stops.', 'It leads to the Platform of Farewells (W079).',
        'Find the five traces of 철이 (Lamp Village, Stadium, Kindergarten, Apartments, Permit Office).', 'Then a boy sits on the bench, and a path opens through the snow to the Lamp Hut (W280).',
        'Also reached from platform zero (Two-Hour Watch) and from the Unlit Tunnel (The Lamp Left On).'],
      secrets: ['The station’s name.', 'The path to the lit window.'],
      lore: 'The last stop, for those who were taken off the map.' } });

  /* ---------------------------------------------------------------
   *  W279 — Le Tirage au sort des noms
   * --------------------------------------------------------------- */
  S({ id: 'W279', name: 'The Lottery of Names', depth: 3, tier: 'hard', back: 'W275', backOpt: { style: 'wood', c: ['#5a4a3a'], symbol: '9' }, backAt: [2, 26], backLabel: 'back through window 9',
    map: (function () { var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.'); for (var y = 10; y < 24; y += 3) for (var x = 4; x < 36; x += 2) g.set(x, y, '}');
      g.vline(1, 1, 24, '#'); g.vline(38, 1, 24, '#'); for (var a = 3; a < 24; a += 4) { g.set(1, a, '.'); g.set(38, a, '.'); }   // des recoins le long des murs
      return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#6a5a48', '#5a4a38', '#7a6a58'] }, wall: { p: 'flat', c: ['#2a2420', '#1a1410'], topColor: '#2a2420' }, wallface: { p: 'panel', c: ['#b8a888', '#988868', '#6a5a40'], skirt: '#3a2a1a' } },
    tall: { '}': { look: 'chair', opt: { c: ['#6a5040'] } } }, style: { tallWalls: true, renderer: 'engraving' }, music: 'lottery', amb: { type: 'paper', vol: 0.05 },
    doors: [{ id: 'drawn', to: 'W277', look: 'door', opt: { style: 'red', c: ['#a02020'] }, at: [20, 1], cond: { flag: 'nl_drawn' }, secret: true, label: 'the door for names that have been drawn' }],
    place: [{ id: 'drum', type: 'decor', at: [20, 4], look: 'wheel', lines: ['The lottery drum. A hundred thousand names go in. A hundred come out.', 'Inside the drum, the names rustle like dry leaves.'] },
      { id: 'list', type: 'decor', at: [8, 1], look: 'board', lookOpt: { lines: ['김 ○○  리 ○○  박 ○○', '최 ○○  ○ ○○  ○ ○○', '— 다음 해 —'], color: '#f0f0e0' }, lines: ['The board of names drawn this year. Most of the names have been replaced by circles.'] },
      SOUL([KN('이름이 안 뽑힌 사람은 아무도 못 만납니다. 그래도 해마다 넥타이를 맵니다.', 'Those whose names are not drawn meet nobody. They put on a tie every year anyway.')])],
    npcs: [{ id: 'N1490', name: 'A Runaway Application', at: [30, 6], look: { t: 'moth', c: ['#f0ece0'], h: 10 }, behavior: 'flee', fleeDist: 5, radius: 20, speed: 1.3, solid: false, talkable: true,
        lines: ['An application form, fluttering away from you like a moth. Someone filled it in with great care.'] },
      { id: 'N1491', name: 'An Applicant of Forty Years', look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#e8e4dc', '#c8c4bc', '#d8c0a8', '#e0e0e0'], acc: 'box' }), behavior: 'static', solid: true,
        lines: [KN('사십 년 동안 신청했습니다. 해마다. 제 이름은 언제나 다음 해에 뽑힙니다.', 'I have applied for forty years. Every year. My name is always drawn next year.'), 'She has brought a lunch box, in case today is the day. It has been every day for forty years.',
          KN('종이는 언제나 구석으로 갑니다. 구석에 들어가야 서류가 됩니다.', 'Paper always ends up in a corner. Only in a corner does it become a document.')] },
      { id: 'N1492', name: 'The Clerk Who Turns the Drum', at: [23, 4], look: H({ t: 'adult', body: 'uniform', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true,
        lines: [KN('공정한 추첨입니다. 모든 이름이 똑같이 안 뽑힐 기회가 있습니다.', 'It is a fair draw. Every name has an equal chance of not being drawn.'), 'One application got away from him this morning. He has not dared to report it.'] }],
    mech: [{ type: 'corner', ent: 'N1490', flag: 'nl_drawn',
      winLines: ['You corner the runaway application. It stops fluttering, as if relieved to be caught at last.', 'The name on it is written in a child’s hand: 안옥순. Under it, in an adult’s hand: “still waiting”.', 'Somewhere a bell rings. A name has been drawn. A red door opens at the top of the hall.'],
      reward: [{ set: { nl_drawn: true } }] }],
    info: { summary: 'A hall of empty chairs and a great drum: a hundred names drawn out of a hundred thousand.',
      rules: ['An application form flutters away from you: drive it into a recess along the side walls.', 'Cornered, it is drawn: a red door opens to the Two-Hour Reunion Hall (W277).', 'Reached through window 9 of the Travel Permit Office (W275).'],
      secrets: ['The door for names that have been drawn.'],
      lore: 'Reunions by lottery: most names are always drawn next year.' } });

  /* ---------------------------------------------------------------
   *  W280 — La Cabane de la lampe, au bout de la ligne (P4)
   * --------------------------------------------------------------- */
  S({ id: 'W280', name: 'The Lamp Hut at the End of the Line', depth: 4, tier: 'hard', back: 'W278', backOpt: { style: 'wood', c: ['#6a4a2a'] }, backAt: [12, 14], backLabel: 'back out into the snow',
    map: (function () { var g = K.grid(26, 16, ' '); g.box(0, 0, 26, 16, '#', '.'); g.rect(8, 5, 10, 6, ','); return g.rows(); })(),
    look: { floor: { p: 'plank', c: ['#6a4a30', '#5a3a20', '#7a5a40'] }, floor2: { p: 'rug', c: ['#8a3a2a', '#6a2a1a'] }, wall: { p: 'flat', c: ['#2a1a10', '#1a100a'], topColor: '#2a1a10' }, wallface: { p: 'wood', c: ['#6a4a30', '#5a3a20', '#3a2a14'], skirt: '#2a1a0a' } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'lamphut', amb: { type: 'hum', vol: 0.04 }, dark: 0.75,
    doors: [{ to: 'W261', look: 'door', opt: { style: 'metal', c: ['#6a2a2a'] }, at: [24, 8], label: 'the track back south, to the first platform' }],
    place: [{ id: 'stove', type: 'decor', at: [20, 2], look: 'stove', light: 2.5, lines: ['A cast-iron stove, roaring. Now and then a spark escapes and wanders off.'] },
      { id: 'signal', type: 'decor', at: [13, 2], look: 'lantern', lines: ['A signal lamp, cold. It needs a flame from the stove, not a match.'] },
      { type: 'decor', at: [4, 2], look: 'clock', lines: ['A clock that stopped at the hour the last train came.'] },
      { type: 'decor', at: [4, 12], look: 'mailbox', lines: ['A letterbox for the line. Empty. It has been emptied every day.'] },
      SOUL([KN('남쪽에서 온 편지는 한 통도 없었습니다. 그래도 우체통을 비웁니다.', 'Not one letter ever came from the South. He empties the letterbox anyway.')])],
    npcs: [{ id: 'N1495', name: 'The Signalman', at: [6, 6], look: H({ t: 'old', head: 'cap', body: 'coat', c: ['#4a3a2a', '#3a2a1a', '#e8c8a8', '#e0e0e0'], acc: 'lantern' }), behavior: 'static', solid: true,
        lines: [KN('렬차는 이제 여기까지 안 옵니다. 그래도 등불은 켜 둡니다. 남쪽으로 돌아가는 길을 찾게.', 'The trains do not come this far any more. I keep the lamp lit anyway. So they can find the way back south.'),
          KN('난로에서 불티가 날아갔습니다. 뛰지 말고 주워 오십시오. 불티는 겁이 많습니다.', 'Sparks have flown out of the stove. Gather them, but do not run. Sparks frighten easily.'), 'He has kept the lamp lit so long that his face has taken on its colour.'] },
      { id: 'N1496', name: 'A Spark From the Stove', tag: 'nlspark', look: { t: 'jelly', c: ['#f0a040'], h: 6, glow: '#f0c060' }, light: 1.2, behavior: 'fly', radius: 5, speed: 0.6, solid: false, lines: ['A spark from the stove, drifting as if it had somewhere to be.'] },
      { id: 'N1497', name: 'A Spark From the Stove', tag: 'nlspark', look: { t: 'jelly', c: ['#f08030'], h: 6, glow: '#f0b050' }, light: 1.2, behavior: 'fly', radius: 5, speed: 0.6, solid: false, lines: ['A spark, hovering by the window as if looking for the way out.'] },
      { id: 'N1498', name: 'A Spark From the Stove', tag: 'nlspark', look: { t: 'jelly', c: ['#f0c050'], h: 6, glow: '#f0d070' }, light: 1.2, behavior: 'fly', radius: 5, speed: 0.6, solid: false, lines: ['A spark that keeps going back towards the stove, then changing its mind.'] }],
    mech: [{ type: 'catchN', tag: 'nlspark', n: 3, noRun: true, key: 'nl_sparks', give: 'E224', runLine: 'The sparks scatter when you run.', countText: 'A spark, cupped in your hands: # of %.',
      winLines: ['Three sparks, cupped in your hands. You carry them to the lamp, and it catches.', 'The signalman watches the flame for a long time, then hands you the lamp.',
        { t: '가져가거라. 누가 켜 놓아야 한다. 아무도 안 와도.', lang: 'ko-n', tr: 'Take it. Someone has to keep it lit. Even if nobody comes.', who: 'The Signalman' }] }],
    info: { summary: 'A linesman’s hut at the end of the line, where an old signalman keeps a lamp lit for trains that never come.',
      rules: ['Catch the three sparks that escaped from the stove, walking, never running: The Lamp Left On (E224).', 'The track leads back south to Right-Time Station (W261): the end of the line is the first platform.',
        'Reached from the Halt Not on the Map once the five traces of 철이 have been found.'],
      lore: 'Someone has to keep the light on, even when nobody comes. Somebody always did.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
