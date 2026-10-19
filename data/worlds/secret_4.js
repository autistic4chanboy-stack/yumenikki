/* =========================================================================
 *  MONDES SECRETS (4/8) — W101 à W120
 *  La baleine ; la censure (musée, archives, voix, théâtre) ; les miroirs
 *  et les portes ; Séoul 1989 ; l'hôpital sous la réalité ; la cuisine ;
 *  le Laboratoire 6.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function soul(lines) { return { type: 'soul', at: 'random-any', lines: lines }; }

  /* W101 — Le Ventre de la baleine */
  S({ id: 'W101', name: 'The Belly of the Whale', depth: 3, tier: 'mid', back: 'W025', backLook: 'hole', backLabel: 'climb back up through the ice hole',
    map: (function () { var g = K.grid(24, 46, ' '); g.ellipse(11.5, 23, 10, 22, '.'); g.ellipse(11.5, 6, 4, 3, ','); return g.rows(); })(),
    look: K.LOOK.flesh, style: { renderer: 'psychedelic', cliffH: 0.6, cliff: '#2a0810' }, music: 'whale', amb: { type: 'heartbeat', vol: 0.12 }, dark: 0.5, backAt: [11, 42],
    doors: [{ to: 'W102', at: [11, 1], look: 'hole', label: 'towards the throat' }],
    place: [{ id: 'heart', type: 'anchor', at: [11, 5], look: 'heart', animated: true, light: 2.5, lines: ['The whale’s heart, as big as a bedroom. It beats slowly, and everything beats with it.'] },
      soul([EN('Be quiet, they told me. So I learned to breathe when she breathes.')]),
      soul(['She floats in the red, arms by her sides.', EN('She swallowed a station once. The clock inside still said twenty-three seventy-one.')]),
      soul([EN('I counted her heartbeats for a whole year.'), EN('I stopped at the number of a small girl’s years.')])],
    effect: { id: 'E83', how: 'mech', mech: { type: 'rhythmWalk', zone: [9, 6, 14, 9], start: [11, 40], period: 1.3, window: 0.5, lineY: 38, failText: 'You moved in the silence. The whale has carried you back to the bottom.', winLines: ['You walked to the heart in time with its beat. It falls into step with yours, or the other way round. In your chest, one more beat.'] } },
    npcs: [{ name: 'The Little Swallowed Fish', count: 3, look: { t: 'fish', c: ['#e0a040'], h: 10, shadow: false }, behavior: 'swim', radius: 4, speed: 1.2, solid: false, lang: 'en', lines: [{ seq: ['It swims in the red air.', EN('Only move when it thumps. Otherwise she spits you back down.')] }] }],
    info: { summary: 'The red, living inside of a whale; at the far end, its heart beats.', rules: ['Only move during the heartbeats; moving in the silence sends you back to the bottom. Reaching the heart gives the Heartbeat (E83).'], lore: 'Being so afraid of making noise that you tune yourself to someone else’s heart.' } });

  /* W102 — La Gorge de la baleine */
  S({ id: 'W102', name: 'The Throat of the Whale', depth: 3, tier: 'easy', back: 'W101', backLook: 'hole',
    gen: { type: 'cave', w: 40, h: 30, opts: { fill: 0.4, iter: 5 } }, look: K.LOOK.flesh, style: { renderer: 'psychedelic' }, music: 'whalethroat', amb: { type: 'heartbeat', vol: 0.06 }, dark: 0.6,
    doors: [{ to: 'W130', look: 'hole', label: 'a light, up above: the mouth' }],
    decor: [{ look: 'shoe', n: 4, lines: ['A swallowed shoe.', 'A swallowed suitcase, shut.', 'A swallowed newspaper: “ALL IS WELL”.'] }],
    place: [soul([EN('Forty years of waiting is one breath long, if the breath is hers.')]),
      soul(['She hugs a suitcase that is no longer there.', EN('A letter J was painted on the case. The sea took the paint first.')]),
      soul([EN('Everything we swallow instead of saying it ends up here.')])],
    npcs: [{ name: 'The Swallowed Sailor', look: H({ head: 'cap', body: 'coat', c: ['#2a3a5a', '#1a2a4a', '#d8b898', '#2a3a5a'], eyes: 'closed' }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('I am waiting for her to surface. She always surfaces, to breathe. Then I will get out.'), EN('It has been forty years.')] }] }],
    info: { summary: 'The tunnels of flesh between the whale’s belly and its mouth.', lore: 'What we swallow without saying it.' } });

  /* W103 — Le Musée des émotions interdites */
  S({ id: 'W103', name: 'The Museum of Forbidden Feelings', depth: 3, tier: 'mid', back: 'W037', backArrive: 'archive',
    map: (function () { var g = K.grid(40, 26, ' '); g.box(0, 0, 40, 26, '#', '.'); for (var x = 5; x < 36; x += 6) { g.set(x, 6, '}'); g.set(x, 19, '}'); } return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#e0d8cc', '#a89880'] }, wall: { p: 'flat', c: ['#2a2620', '#1a1610'], topColor: '#2a2620' }, wallface: { p: 'panel', c: ['#e0dcd0', '#c0bcb0', '#8a867a'], skirt: '#3a3020' } },
    tall: { '}': { look: 'vitrine' } }, style: { tallWalls: true }, music: 'museum', amb: { type: 'hum', vol: 0.03 },
    doors: [{ to: 'W108', look: 'door', opt: { style: 'wood', symbol: '♪' }, label: 'the room of voices' }, { to: 'W110', look: 'door', opt: { style: 'metal', c: ['#202020'], symbol: '█' }, label: 'the archives' }],
    decor: [{ look: 'plaque', n: 6, lines: ['DISPLAY CASE: “Anger (1999)”. A small clenched hand, in wax.', 'DISPLAY CASE: “Jealousy (2016)”. A yellow flower that counts.', 'DISPLAY CASE: “Fear (2020)”. A key around a neck.', 'DISPLAY CASE: “Laughter (1989)”. Empty. “Under restoration”.', 'DISPLAY CASE: “The Urge to Leave (2025)”. A child’s suitcase.'] }],
    effect: { id: 'E84', how: 'find', look: 'vitrine', opt: { tear: true }, need: { fn: function () { if (!YN.game.rt || YN.game.rt.id !== 'W103') return false; var n = YN.game.rt.findEnt('N220'); if (!n) return true; var p = YN.game.player; return Math.abs(n.x - p.x) + Math.abs(n.y - p.y) > 8; } }, notYet: ['DISPLAY CASE: “Grief (1987)”. A tear, very old. The guard is watching you.'], lines: ['The guard is far away. You open the “Grief (1987)” case. The tear rolls into your palm, still warm, and does not dry.'] },
    place: [soul([KN('동무, 눈물은 전시물입니다. 만지지 마십시오.', 'Comrade, tears are exhibits. Do not touch them.')]),
      soul([KN('나는 1987년에 울었습니다. 그 울음은 여기 유리 안에 있습니다. 나는 밖에 있습니다.', 'I cried in 1987. That crying is here, behind glass. I am outside.')]),
      soul(['She walks past the cases without stopping, the way you walk past someone you know.', KN('웃음도 한때 전시되였습니다. 1989년에 누군가 꺼내 갔습니다.', 'Laughter was on display too, for a time. In 1989, someone took it away.')]),
      soul([KN('감정은 없어지지 않습니다. 분류될 뿐입니다, 동무.', 'Feelings do not disappear. They are only filed away, comrade.')])],
    npcs: [{ id: 'N220', name: 'The Museum Guard', look: H({ t: 'tall', head: 'cap', body: 'uniform', c: ['#2a2a2a', '#1a1a1a', '#d8b898', '#2a2a2a'] }), behavior: 'patrol', path: [[3, 12], [36, 12], [36, 14], [3, 14]], speed: 0.9, lang: 'ko-n', lines: [{ seq: [KN('만지지 마십시오. 이 감정들은 금지되였습니다.', 'Do not touch. These feelings are forbidden.'), KN('어떻게 생겼댔는지 알게 하려고 전시한 것입니다.', 'They are displayed so that people know what they looked like.')] }, KN('1987년의 슬픔이 우리 제일 좋은 전시물입니다. 아직 아무도 찾아오지 않았습니다.', 'The Grief of 1987 is our finest exhibit. Nobody has ever come to claim it.')] }],
    info: { summary: 'A marble museum where display cases exhibit confiscated feelings.', rules: ['Stealing from the “Grief (1987)” case while the guard is far away gives the Tear (E84).'], lore: 'The rule “we don’t cry”; whatever is confiscated is put behind glass.' } });

  /* W104 — La Ville miroir */
  S({ id: 'W104', name: 'The Mirror City', depth: 3, tier: 'mid', back: 'W057', backLook: 'mirror', outdoor: true,
    gen: { type: 'city', w: 50, h: 36, opts: { block: 8 } }, look: { floor: { p: 'tile', c: ['#c8d0dc', '#a0a8b8'] }, floor2: { p: 'asphalt', c: ['#5a5e6a'] }, wall: { p: 'glass', c: ['#8ab0d8', '#e0f0ff', '#a0c0e0'] } },
    tall: K.TALL.city, style: { renderer: 'realistic' }, music: 'mirrorcity', extra: { invertX: true },
    doors: [{ to: 'W106', look: 'mirror', label: 'a full-length mirror' }],
    place: [{ id: 'pane', type: 'decor', at: 'random-any', look: 'mirror', lines: ['A large pane of glass. Your reflection is written backwards in it, like everything here. You could write your name on it — backwards, of course.'] },
      soul([EN('The glass only remembers the ones who answer.')]),
      soul(['She stands sideways, so that her reflection looks you in the face.', EN('Nobody here asks your name twice. We ask once, backwards, and we keep it.')]),
      soul([EN('I lived in the city on the other side.'), EN('There, the mother comes home at seven in the morning and the lamp is already off.')])],
    effect: { id: 'E85', how: 'mech', mech: { type: 'sayTo', mark: 'pane', words: ['aros', 'a r o s', 'aros.'], dist: 3, winLines: ['You say your name backwards: aroS. The reflection nods: it is the first time anyone has called it. It lets you cross over to its side.'], wrong: 'The reflection is waiting for a name written backwards.' } },
    npcs: [{ name: 'An Inverted Passer-by', count: 4, look: H({ t: 'adult', body: 'suit', c: ['#c8c8d0', '#a8a8b0', '#e0c0a0', '#2a2a2a'] }), behavior: 'wander', radius: 5, lang: 'en', lines: [{ t: '.olleh ,seY', lang: 'en' }, EN('Here we say our name backwards. Otherwise the windows do not recognise you.'), { t: '.ecaf ym si tahT', lang: 'en' }] }],
    info: { summary: 'A city of glass where everything is backwards, even the controls.', rules: ['Horizontal controls are reversed.', 'Saying your name backwards in front of the large pane gives the Inverted Reflection (E85).'], secrets: ['The name (never written plainly in the game): S_ra.'], lore: 'The only place where anyone asks her name.' } });

  /* W105 — Les Égouts du Dédale */
  S({ id: 'W105', name: 'The Maze Sewers', depth: 2, tier: 'easy', back: 'W031', backLook: 'stairs', backArrive: 'grate',
    gen: { type: 'maze', w: 41, h: 29, opts: { loops: 0.15, floor: '.', wall: '#' } }, look: { floor: { p: 'stone', c: ['#4a4a44', '#3a3a34', '#2a2a24'] }, wall: { p: 'stone', c: ['#3a3a34', '#2a2a24', '#1a1a14'] }, water: { p: 'water', c: ['#2a3a2a', '#1a2a1a', '#3a4a3a', '#6a8a6a'] } },
    music: 'sewers', amb: { type: 'drip', vol: 0.1 }, dark: 0.75,
    doors: [{ to: 'W106', look: 'door', opt: { style: 'metal', c: ['#4a4a4a'] }, label: 'a rusty door' }, { to: 'W109', look: 'stairs', label: 'a staircase towards a forest' }, { to: 'W100', look: 'hole', label: 'towards the cave of fruit stones' }],
    place: [soul([EN('Everything that leaves the maze comes down here. Even the girl who scratches days on the wall.')]),
      soul(['She leans over the water, looking for something in it.', EN('I ate a map once. It tasted of a station that is on no line.')]),
      soul([EN('Down here, water takes what the house throws away. Words, mostly.')])],
    npcs: [{ name: 'A Chatty Rat', count: 3, look: { t: 'rabbit', c: ['#6a6a6a'], h: 9 }, behavior: 'wander', radius: 5, speed: 2.4, lang: 'en', lines: [{ seq: [EN('Thalie? She thinks the way out leads outside. The way out leads here.'), EN('And here leads further down.')] }, EN('Squeak. We eat the maps people lose.')] }],
    info: { summary: 'A labyrinth of tunnels beneath the Maze.', lore: 'The way out that leads further down.' } });

  /* W106 — La Salle des 1000 portes */
  S({ id: 'W106', name: 'The Room of 1000 Doors', depth: 3, tier: 'mid', back: 'W105', wrap: true, loop: true,
    map: (function () { var g = K.grid(30, 20, '.'); return g.rows(); })(), look: { floor: { p: 'checker', c: ['#d8d0c0', '#4a4040'] } }, music: 'thousanddoors',
    place: (function () { var out = []; var r = YN.rng.make(1060); for (var i = 0; i < 22; i++) out.push({ type: 'decor', at: [r.int(1, 28), r.int(1, 18)], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'] }, cycleGroup: 'doors', lines: ['The door changes as soon as you look at it. It opens onto itself.'] });
      out.push(soul([EN('I knocked on nine hundred doors. The one that opened was the one I had not knocked on.')]));
      out.push(soul(['She holds a handle that belongs to no door.', EN('My father’s joke began with a knock. It never reached the end.')]));
      out.push(soul([EN('One door in this room is a rule from a house: if the bell rings, do not open.')]));
      return out; })(),
    mech: [{ type: 'cycleLooks', group: 'doors', every: 2, colors: ['#6a4a3a', '#3a4a6a', '#a02838', '#3a6a3a', '#e8e8e8', '#202020'], symbols: ['', '1', '7', '404', '?', '0'] }],
    doors: [{ to: 'W107', look: 'door', opt: { style: 'metal', c: ['#a0a0a0'] }, label: 'a door that falls upwards' }],
    effect: { id: 'E86', how: 'find', look: 'door', opt: { style: 'wood', c: ['#8a6a3a'], symbol: '◯' }, lines: ['The only door that does not change. Its handle unscrews in your hand: it opens everything that has been shut.'] },
    npcs: [{ name: 'The Doorman', look: H({ t: 'tall', head: 'doorbell', body: 'uniform', c: ['#4a3a2a', '#3a2a1a', '#c8a070', '#c8a040'] }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('Every door changes. One stays itself.'), EN('Because nobody has ever knocked on it.')] }] }],
    info: { summary: 'A room that repeats itself, full of doors that keep changing how they look.', rules: ['The world loops.', 'The only door that does not change gives the Handle (E86).'], lore: 'All the doors we don’t dare to open.' } });

  /* W107 — Le Monde à l'envers (gravité inversée) */
  S({ id: 'W107', name: 'The Upside-Down World', depth: 3, tier: 'mid', back: 'W106', gravity: -1,
    map: (function () { var g = K.grid(60, 18, ' '); g.rect(0, 0, 60, 3, '#'); g.rect(0, 15, 60, 3, '#'); [[12, 14], [22, 25], [36, 38], [46, 49]].forEach(function (p) { for (var x = p[0]; x <= p[1]; x++) { g.set(x, 0, ' '); g.set(x, 1, ' '); g.set(x, 2, ' '); } }); g.hline(14, 20, 7, '-'); return g.rows(); })(),
    look: { wall: { p: 'grass', c: ['#4a7a3a', '#3a6a2a', '#5a8a4a', '#2a5a1a'] }, platform: { p: 'cloud', c: ['#f0f0ff', '#c8d0e0'] } },
    style: { view: 'side', sky: ['#8ab0e0', '#e0ecff'] }, music: 'upsidedown', amb: { type: 'wind', vol: 0.05 },
    backAt: [2, 3], extra: { gravity: -1 },
    effect: { id: 'E87', how: 'find', at: [57, 3], look: 'sprout', lines: ['At the far end, you touch the floor of the ceiling. It is soft as a lawn. Up is down now, whenever you like.'] },
    place: [{ type: 'soul', at: [30, 3], lines: [EN('When everything is upside down, pretend it is normal. That is the whole rule.')] },
      { type: 'soul', at: [44, 3], lines: ['She walks on the ceiling, upside down, perfectly calm.', EN('Her mother sleeps at noon and works at midnight. Here, that is simply the right way up.')] }],
    npcs: [{ name: 'The Hanged Man Reversed', look: H({ t: 'adult', body: 'suit', c: ['#3a3a5a', '#2a2a4a', '#e0c0a0', '#2a2a2a'] }), behavior: 'static', at: [8, 3], solid: true, lang: 'en', lines: [{ seq: [EN('Here you fall upwards. The holes in the ceiling open onto the sky below.'), EN('Jump over them.')] }] }],
    info: { summary: 'Side view, inverted gravity: you walk on the ceiling, and holes open onto the sky.', rules: ['Gravity pulls upwards; you jump downwards.', 'Reaching the end of the ceiling gives Gravity (E87).'], lore: 'When everything is upside down and you pretend it is normal.' } });

  /* W108 — La Salle des voix */
  S({ id: 'W108', name: 'The Room of Voices', depth: 3, tier: 'easy', back: 'W103', map: K.hall(26, 16, '#', '.'),
    look: { floor: { p: 'wood', c: ['#6a5a4a', '#4a3a2a', '#7a6a5a'] }, wall: { p: 'flat', c: ['#2a1e14', '#1e140c'], topColor: '#2a1e14' }, wallface: { p: 'panel', c: ['#8a7a5a', '#6a5a3a', '#4a3a2a'], skirt: '#3a2a1a' } },
    style: { tallWalls: true }, music: 'voices',
    decor: [{ look: 'jar', n: 10, opt: {}, lines: ['A closed jar. Inside, a child’s voice saying “no”.', 'A jar: a voice singing 자장자장, very low.', 'A jar: a laugh, cut short.', 'A jar: “I don’t wanna go”.', 'An empty jar, labelled “S.”. The lid was unscrewed from the inside.'] }],
    place: [soul([KN('동무, 목소리는 보관합니다. 돌려주지는 않습니다.', 'Comrade, voices are kept. They are not given back.')]),
      soul(['She opens her mouth: nothing, then a little.', KN('우리 어머니는 자장가를 알았습니다. 그 노래는 이제 유리 안에서 돕니다.', 'My mother knew a lullaby. Now that song goes round and round inside the glass.')]),
      soul([KN('어떤 아이가 《안 가겠습니다》라고 말했습니다. 그것은 잘못된 말로 분류되였습니다.', 'A child said “I will not go”. It was filed under wrong words.')]),
      soul([KN('빈 병 하나는 안에서 열렸습니다. 일없습니다. 그런 일도 있습니다.', 'One empty jar was opened from the inside. It is nothing. These things happen too.')])],
    npcs: [{ name: 'The Voice Collector', look: H({ t: 'old', head: 'mask', body: 'robe', c: ['#e8e4dc', '#c8c4bc', '#f0ece4', '#1a1a1a'] }), behavior: 'static', solid: true, lang: 'ko-n', lines: [{ seq: [KN('내보내지 않은 목소리들을 내가 보관합니다.', 'I keep the voices that were never let out.'), KN('여기가 더 낫습니다. 더 조용합니다.', 'They are better off here. Quieter.')] }, { seq: [KN('하나가 도망쳤습니다. S 병입니다.', 'One escaped. The S jar.'), KN('돌아올 것입니다. 입을 벌리면 다 돌아옵니다.', 'It will come back. They all come back, when you open your mouth.')] }] }],
    info: { summary: 'A wood-panelled room where jars hold confiscated voices.', lore: 'Sora’s silence since her grandmother died.' } });

  /* W109 — La Forêt qui revient */
  S({ id: 'W109', name: 'The Forest That Comes Back', depth: 3, tier: 'mid', back: 'W105', wrap: true, loop: true, outdoor: true,
    gen: { type: 'forest', w: 44, h: 34, opts: { density: 0.26 } }, look: K.LOOK.forest, tall: K.TALL.forest, music: 'returnforest', amb: { type: 'birds', vol: 0.04 },
    place: [['printemps', 'flower', { c: ['#f0a0c0'] }], ['ete', 'sunflower', {}], ['automne', 'stump', { c: ['#c86030'] }], ['hiver', 'snowman', {}]].map(function (s, i) { return { id: 'season_' + s[0], type: 'decor', at: [[6, 6], [36, 8], [30, 28], [8, 26]][i], look: s[1], lookOpt: s[2], lines: ['A landmark: ' + ['a spring flower', 'a summer sunflower', 'an autumn stump', 'a winter snowman'][i] + '.'] }; }).concat([
      soul([EN('Spring, summer, autumn, winter. Then the same spring again.'), EN('I waited through four hundred of them for one letter.')]),
      soul(['She whistles two notes. A blackbird answers, very far away.', EN('A woman whistled to the blackbirds here. The trees kept the tune, not the woman.')]),
      soul([EN('Years that come back the same are the hardest to tell apart from waiting.')])]),
    effect: { id: 'E88', how: 'mech', mech: { type: 'sequence', order: ['season_printemps', 'season_ete', 'season_automne', 'season_hiver'], winLines: ['Spring, summer, autumn, winter. The forest stops coming back. A thread, caught on the last landmark, winds itself around your finger: it knows the way home.'], wrongLine: 'The forest goes back to its beginning.' } },
    doors: [{ to: 'W114', look: 'gate', cond: { effect: 'E88' }, label: 'the way out of the forest' }, { to: 'W113', look: 'door', opt: { style: 'wood', c: ['#e8d8a0'] }, cond: { all: [{ effect: 'E88' }, { effectsCount: 40 }] }, label: 'a lit door between the trees' }],
    npcs: [{ name: 'The Doe of Seasons', look: { t: 'deer', c: ['#c89060', '#f0e0c0'], h: 20 }, behavior: 'wander', radius: 6, lines: ['She grazes where it is spring, then wanders off towards summer. She knows the order.'] }],
    info: { summary: 'A forest that loops back on itself; four landmarks, one for each season.', rules: ['The world loops.', 'Visiting the landmarks in the order of the seasons gives the Thread (E88).'], lore: 'The years that come back the same.' } });

  /* W110 — Les Archives de la censure */
  S({ id: 'W110', name: 'The Censorship Archives', depth: 4, tier: 'hard', back: 'W103',
    map: (function () { var g = K.grid(44, 30, ' '); g.box(0, 0, 44, 30, '#', '.'); for (var y = 4; y < 27; y += 4) g.hline(3, 40, y, '%'); for (var y2 = 4; y2 < 27; y2 += 4) { g.set(10, y2, '.'); g.set(30, y2, '.'); } return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#4a4840'] }, wall: { p: 'flat', c: ['#1a1810', '#100e08'], topColor: '#1a1810' }, wallface: { p: 'panel', c: ['#3a3628', '#2a2618', '#1a1608'], skirt: '#000000' }, wall2: { p: 'brick', c: ['#d8d4c8', '#000000', '#a8a498'], ownFace: true } },
    style: { tallWalls: true, renderer: 'engraving' }, music: 'archives', dark: 0.6,
    doors: [{ to: 'W111', look: 'curtain', opt: { c: ['#8a1020'] }, label: 'a theatre curtain' }, { to: 'W115', look: 'door', opt: { style: 'wood', symbol: '1989' }, label: 'file 1989' }],
    decor: [{ look: 'locker', n: 8, opt: { c: ['#3a3a3a'] }, lines: ['File: “어버이 — everything ever said about him”. Every page is black.', 'File: “The Disappeared”. It is thin. It has been thinned.', 'File: “Children’s Complaints”. Filed under: misunderstandings.', 'File: “S.”. A single page: “does not speak”. Below it, crossed out: “no longer speaks”.', 'File: “What Is Going Well”. Enormous. Nothing inside.'] }],
    place: [soul([KN('이름을 지우면 력사가 깨끗해집니다. 동무, 그렇게 배웠습니다.', 'Erase a name and history comes out clean. Comrade, that is what we were taught.')]),
      soul([KN('나는 명단에 있었습니다. 지금은 명단만 남았습니다.', 'I was on the list. Now only the list is left.')]),
      soul(['She shows her hands: black ink up to the wrists.', KN('일없습니다. 밤에는 가위 소리만 들립니다.', 'It is nothing. At night, all you hear is the sound of scissors.')]),
      soul([KN('어버이에 대한 말은 모두 검은 종이가 되였습니다. 좋은 말도요.', 'Everything said about the Parent became black paper. The good words too.')])],
    npcs: [{ name: 'The Archivist with Scissors', look: H({ t: 'tall', head: 'veil', body: 'robe', c: ['#e8e4d8', '#c8c4b8', '#e0d0c0', '#000000'] }), behavior: 'patrol', path: [[2, 2], [41, 2], [41, 27], [2, 27]], speed: 0.7, lang: 'ko-n', lines: ['███ ███ ████.', KN('여기 정리된 것은 다 일없습니다.', 'Everything filed away here is fine.'), 'She cuts a word out of a newspaper and eats it.'] }],
    info: { summary: 'Endless shelves of blacked-out files.', lore: 'One of the Priestess’s readings: the “Parent of the nation” who erases.' } });

  /* W111 — Le Théâtre de marionnettes */
  S({ id: 'W111', name: 'The Puppet Theatre', depth: 4, tier: 'mid', back: 'W110',
    map: (function () { var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.'); g.rect(6, 2, 22, 6, ','); for (var y = 11; y < 20; y += 2) for (var x = 5; x < 29; x += 2) g.set(x, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#4a1a1a', '#3a0a0a', '#5a2a2a'] }, floor2: { p: 'wood', c: ['#8a6a40', '#6a4a20', '#9a7a50'] }, wall: { p: 'flat', c: ['#1a0508', '#100306'], topColor: '#1a0508' }, wallface: { p: 'panel', c: ['#6a0a1a', '#4a0510', '#c8a040'], skirt: '#c8a040' } },
    tall: { '{': { look: 'chair', opt: { c: ['#6a1a2a'] } } }, style: { tallWalls: true }, music: 'puppets', dark: 0.55,
    doors: [{ to: 'W112', look: 'curtain', opt: { c: ['#3a0a10'] }, label: 'backstage' }],
    effect: { id: 'E89', how: 'find', at: [17, 3], look: 'puppetstrings', need: { equipped: 'E10' }, notYet: ['Above the stage, strings come down to puppets that smile. The strings are drawn in chalk on the air. You would need something to rub them out.'], lines: ['With the eraser, you rub out the puppeteer’s strings. The puppets collapse, then get up again on their own, clumsily. At your fingertips, the strings remain, free.'] },
    place: [soul([EN('Strings are easier than reasons. Smile, and nobody asks why.')]),
      soul(['She lifts one arm, then the other, without thinking.', EN('I smiled for eleven years. My face kept the shape.')]),
      soul([EN('The chalk strings are drawn by somebody who is never on stage.')])],
    npcs: [{ name: 'A Smiling Puppet', count: 4, look: H({ t: 'doll', head: 'round', body: 'dress', c: ['#e8c0c8', '#c8a0a8', '#f0d8c8', '#4a2a1a'], eyes: 'painted', mouth: 'painted' }), behavior: 'dance', solid: true, lang: 'en', lines: [{ seq: [EN('All is well! All is well!'), 'Its mouth does not move: the string makes it talk.'] }, { seq: [EN('We are happy!'), 'Its arms lift by themselves.'] }] }, { name: 'The Invisible Puppeteer', look: { t: 'voice' }, kind: 'voice', invisible: true, lang: 'en', ambientLines: ['A voice drops from the flies, above the stage.', EN('Smile. More than that. Again.'), EN('Hold it. Hold the smile.')], ambientEvery: 12, hearDist: 20 }],
    info: { summary: 'A small red theatre where puppets rehearse “all is well”.', rules: ['Rubbing out the puppeteer’s strings with the Eraser equipped gives the Strings (E89).'], lore: 'Smiling because someone is pulling the strings.' } });

  /* W112 — La Coulisse */
  S({ id: 'W112', name: 'Backstage', depth: 4, tier: 'easy', back: 'W111', map: K.hall(22, 14, '#', '.'),
    look: { floor: { p: 'wood', c: ['#3a2a1a', '#2a1a10', '#4a3a2a'] }, wall: { p: 'flat', c: ['#100a06', '#0a0604'] } }, music: 'backstage', dark: 0.8,
    doors: [{ to: 'W119', look: 'door', opt: { style: 'metal', c: ['#c8d8d8'] }, label: 'a door that smells of hospital' }],
    decor: [{ look: 'mirror', n: 2, lines: ['A dressing-room mirror ringed with dead bulbs. On it, in lipstick: “smile”.'] }, { look: 'crate', n: 4, lines: ['Smiling masks, sorted by size. The smallest one is your size.'] }],
    place: [soul([EN('Backstage nobody claps. It is the only place we rest.')]),
      soul(['She tries on a mask, then puts it back in its place.', EN('The smallest mask is always the one that fits a child.')]),
      soul([EN('Somebody wrote smile on the mirror so we would not forget which face is ours.')])],
    npcs: [{ name: 'A Puppet Without Strings', look: H({ t: 'doll', body: 'dress', c: ['#c0b0b0', '#a09090', '#e0d0c0', '#4a2a1a'], eyes: 'sad' }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('I do not know how to walk by myself any more. But I am learning.'), EN('Look: one step.')] }] }],
    info: { summary: 'The dark back of the theatre, with masks sorted by size.', lore: 'What you do once the audience has gone.' } });

  /* W113 — La Cuisine allumée */
  S({ id: 'W113', name: 'The Lit Kitchen', depth: 4, tier: 'hard', back: 'W119',
    map: (function () { var g = K.grid(20, 14, ' '); g.box(0, 0, 20, 14, '#', '.'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#e8e0d0', '#c8c0b0'] }, wall: { p: 'flat', c: ['#3a2c22', '#2a1e16'], topColor: '#3a2c22' }, wallface: { p: 'wallpaper', c: ['#f0e8c8', '#d8c8a0', '#a08a60'], skirt: '#6a4a30' } },
    style: { tallWalls: true }, music: 'kitchen', amb: { type: 'fridge', vol: 0.05 },
    place: [{ type: 'decor', at: [10, 7], look: 'table', lookOpt: { cloth: '#e8d8c8' }, lines: ['A woman in a work tunic is asleep, her head on the table, one hand on her phone. Her face cannot be seen.', 'On the table, two bowls. One has been used.'] }, { type: 'decor', at: [4, 2], look: 'fridge', lookOpt: { notes: true }, floor: '#', lines: [KS('냉장고에 반찬 있어. 데워 먹어.', 'There are side dishes in the fridge. Heat them up.')] }, { type: 'decor', at: [15, 2], look: 'stove', floor: '#', lines: ['The cooker, switched off long ago. A clean saucepan, upside down.'] },
      soul([KS('괜찮아. 엄마는 괜찮아. 엄마는 늘 괜찮아.', 'It’s fine. Mum is fine. Mum is always fine.')]),
      soul([KS('아홉 시에 나가고 일곱 시에 돌아와요. 그 사이가 이 집에서 제일 긴 복도예요.', 'She goes out at nine and comes back at seven. In between is the longest corridor in this house.')]),
      soul(['She looks at the light switch, not at the woman.', KS('불은 끄지 마세요. 누가 길을 못 찾아요.', 'Don’t turn off the light. Someone won’t find their way.')]),
      soul([KS('냉장고에 쪽지가 세 장 있어요. 전부 같은 말이에요.', 'There are three notes on the fridge. They all say the same thing.')]),
      soul([KS('식은 밥 앞에서 기다리는 건 물려받는 거예요. 할머니도, 엄마도, 너도.', 'Waiting in front of cold rice is something you inherit. Grandmother, mother, and you.')]),
      soul([KS('두 개 중에 한 개만 썼어요. 그게 제일 슬픈 설거지예요.', 'Of the two bowls, only one was used. That is the saddest washing-up there is.')])],
    effect: { id: 'E90', how: 'find', at: [18, 6], look: 'switch', opt: { on: true }, lines: ['The kitchen light switch. Nobody ever turns it off, so that someone can find the way. You turn it off, gently. In the dark, the woman breathes more calmly. The switch stays in your hand: you can turn things off too, now.'] },
    npcs: [],
    info: { summary: 'A flat’s kitchen under a strip light; a woman in a work tunic sleeps at the table.', rules: ['Turning off the light that nobody ever turns off gives the Light Switch (E90).'], lore: 'The mother who falls asleep when she gets home from work; the echo of the light she turns off in the bedroom.' } });

  /* W114 — Le Cimetière des jouets */
  S({ id: 'W114', name: 'The Toy Graveyard', depth: 3, tier: 'easy', back: 'W109', outdoor: true,
    gen: { type: 'empty', w: 40, h: 30, opts: { floor: '.', border: '#' } }, look: { floor: { p: 'grass', c: ['#5a6a4a', '#4a5a3a', '#6a7a5a', '#3a4a2a'] }, wall: { p: 'hedge', c: ['#3a4a2a', '#2a3a1a', '#4a5a3a', '#1a2a0a'] } },
    style: { renderer: 'crayon', sky: ['#b0a8c0', '#e0d8e8'] }, music: 'toygraves', amb: { type: 'wind', vol: 0.04 },
    decor: [{ look: 'cross', n: 12, lines: ['A little cross made of lolly sticks: “Mr Rabbit”.', 'A grave: “the Tamagotchi (2 days)”.', 'A grave: “Nour (gone)”. It is not a grave, it is a postbox.', 'A grave with flowers: “the pasta necklace”. Two beads are missing.'] }],
    place: [soul([EN('A grave for a rabbit is practice. Nobody gets to practise for the big ones.')]),
      soul(['She posts a letter into a grave that is a postbox.', EN('Letters go in. Nothing comes out. She moved to another town.')]),
      soul([EN('The pasta necklace is missing two beads. A hand took them to remember by.')])],
    npcs: [{ name: 'The Plush Gravedigger', look: { t: 'rabbit', c: ['#c8b8a8'], h: 16 }, behavior: 'wander', radius: 4, lang: 'en', lines: [{ seq: [EN('We bury what we lose by growing up. It is not sad.'), EN('It is tidy.')] }] }],
    info: { summary: 'A hill where toys have graves made of lolly sticks.', lore: 'A child’s griefs, which count too.' } });

  /* W115 — L'École de 1989 */
  S({ id: 'W115', name: 'The School of 1989', depth: 4, tier: 'mid', back: 'W110',
    map: (function () { var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.'); for (var y = 6; y < 19; y += 3) for (var x = 4; x < 30; x += 3) g.set(x, y, '{'); g.hline(10, 24, 1, 'b'); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.school, { floor: { p: 'wood', c: ['#9a7a4a', '#7a5a2a', '#aa8a5a'] } }), tall: { '{': { look: 'schooldesk' } }, style: { tallWalls: true, renderer: 'sepia' }, music: 'school1989',
    doors: [{ to: 'W116', look: 'door', opt: { style: 'wood', c: ['#6a5a3a'] }, label: 'the way out, towards the street' }],
    decor: [{ look: 'book', n: 3, opt: { c: ['#f0e8d0', '#3a6a3a'] }, lines: [KS('김미란. 3학년 2반.', 'Kim Mi-ran. Grade 3, Class 2.'), KS('일기: 아빠는 오늘도 늦게 왔다. 나는 기다렸다.', 'Diary: Dad came home late again today. I waited.')] }],
    place: [soul([KS('3학년 2반 김미란. 숙제는 늘 다 했어요. 보여 줄 사람이 없었어요.', 'Grade 3, Class 2, Kim Mi-ran. She always did all her homework. There was nobody to show it to.')]),
      soul([KS('선생님이 아버지 직업을 물었어요. 미란이는 《회사》라고만 썼어요. 그게 아는 전부였어요.', 'The teacher asked what her father did. Mi-ran only wrote “the company”. That was all she knew.')]),
      soul(['She wipes a blackboard that is already clean.', KS('이 교실 아이들은 다 어른이 됐어요. 한 명은 밤에 일해요. 아주 멀리서요.', 'All the children in this class have grown up. One of them works nights. Very far from here.')]),
      soul([KS('기다리는 법은 아홉 살에 배워요. 그 다음엔 안 잊혀요.', 'You learn how to wait at nine. After that, you never forget.')])],
    npcs: [{ name: 'Little Mi-ran', look: H({ t: 'kid', hairStyle: 'braids', body: 'uniform', c: ['#3a5a8a', '#2a4a7a', '#f0d0b0', '#1a1a1a'], eyes: 'down', acc: 'book' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('우리 아빠는 회사에서 일해요. 아주 중요한 일이요.', 'My dad works at the company. Very important work.'), KS('밤 열두 시까지 안 자고 기다릴 거예요.', 'I’m going to stay up till midnight and wait for him.'), 'She is your age. She has your eyes, only more worried.'] }],
    info: { summary: 'A Seoul classroom in 1989, in sepia.', lore: 'Mi-ran as a child, waiting for her father every evening.' } });

  /* W116 — Séoul, 1989 */
  S({ id: 'W116', name: 'Seoul, 1989', depth: 4, tier: 'mid', back: 'W115', outdoor: true,
    gen: { type: 'city', w: 50, h: 36, opts: { block: 7 } }, look: { floor: { p: 'tile', c: ['#9a9080', '#7a7060'] }, floor2: { p: 'asphalt', c: ['#4a4840'] }, wall: { p: 'brick', c: ['#8a6a5a', '#6a4a3a', '#4a2a1a'] } },
    tall: K.TALL.city, style: { renderer: 'sepia', stars: true }, music: 'seoul1989', dark: 0.6,
    doors: [{ to: 'W139', look: 'elevator', label: 'an office tower, lit up', cond: { effect: 'E32' } }, { to: 'W138', look: 'mailbox', label: 'a red postbox' }],
    decor: [{ look: 'streetlamp', n: 4, lines: ['A streetlamp. A little girl sits beneath it, her chin on her knees.'] }, { look: 'payphone', n: 1, lines: [KS('공중전화. 동전 하나. “아빠, 언제 와?”', 'A public phone. One coin. “Dad, when are you coming home?”')] }],
    place: [soul([KS('열두 시 넘어 들어오는 아버지가 좋은 아버지라고 했어요. 그 시절엔 그랬어요.', 'They said a father who comes home after midnight is a good father. That’s how it was back then.')]),
      soul([KS('가로등 밑에 앉은 아이는 자기 아버지 구두 소리를 알아요. 백 명 중에서 골라내요.', 'The child under the streetlamp knows the sound of her father’s shoes. She can pick it out from a hundred.')]),
      soul(['She holds a coin too old for the phone box.', KS('《아빠, 언제 와?》 그 질문은 한 번도 답을 못 받았어요.', '“Dad, when are you coming home?” That question never got an answer.')]),
      soul([KS('이 도시에서 밤에 켜진 창문은 전부 누가 기다리는 창문이에요.', 'In this city, every window lit at night is a window where someone is waiting.')]),
      soul([KS('미란이는 2008년에 비행기를 탔어요. 기다리는 버릇은 가방에 넣어 갔어요.', 'Mi-ran got on a plane in 2008. She packed the habit of waiting in her bag.')]),
      soul([KS('식은 밥은 버리지 않았어요. 아침에 아버지가 그걸 먹었어요.', 'The cold rice was never thrown away. In the morning, her father ate it.')])],
    npcs: [{ name: 'A Hurried Man in a Suit', count: 3, look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], acc: 'briefcase' }), behavior: 'wander', radius: 6, speed: 2.4, lang: 'ko-s', lines: [KS('죄송합니다, 바빠서요.', 'Sorry, I’m in a hurry.'), 'He looks at his watch. It is half past midnight.', KS('수고하셨습니다. 내일 또 봅시다.', 'Good work today. See you tomorrow.')] }],
    info: { summary: 'A Seoul street at midnight, in 1989; men come home late, a child waits under a streetlamp.', lore: 'The night Mi-ran waited. The same night as Sora’s, thirty years earlier.' } });

  /* W117 — La Chambre 302 */
  S({ id: 'W117', name: 'Room 302', depth: 4, tier: 'hard', back: 'W118', map: K.hall(16, 12, '#', '.'),
    look: K.LOOK.hospital, style: { tallWalls: true, renderer: 'watercolor' }, music: 'room302', amb: { type: 'beep', vol: 0.07 },
    decor: [{ look: 'bed', opt: { c: ['#f0f0f0', '#c8d8e0'] }, lines: ['A made hospital bed. On the pillow, a hairpin.'] }, { look: 'window', lines: ['Through the window, a community garden, seen from above. Someone is watering it.'] }, { look: 'pot', opt: { plant: true }, lines: ['A plant on the bedside table. A label, in an old lady’s handwriting: “for Sora — water it”.'] }],
    place: [soul([KS('302호는 2023년부터 비어 있지 않아요. 아무도 없는데 비어 있지 않아요.', 'Room 302 hasn’t been empty since 2023. Nobody is there, and yet it isn’t empty.')]),
      soul([KS('할머니는 1951년에 신발 한 짝을 잃었어요. 왼쪽이요. 그 뒤로 평생 왼발이 시렸대요.', 'Grandmother lost a shoe in 1951. The left one. She said her left foot was cold for the rest of her life.')]),
      soul(['She waters a plant that isn’t there.', KS('물 주라고 했어요. 그게 마지막 부탁이었어요.', 'She asked for it to be watered. That was her last request.')]),
      soul([KS('딸은 《엄마, 미안해》를 문 앞에서 말했어요. 문은 이미 닫혀 있었어요.', 'The daughter said “Mum, I’m sorry” at the door. The door was already shut.')]),
      soul([KS('창밖에 텃밭이 보여요. 할머니는 끝까지 그쪽만 봤어요.', 'From the window you can see the vegetable patch. Grandmother looked only that way, right to the end.')]),
      soul([KS('그날 아이는 복도에서 기다렸어요. 그 다음부터 말을 안 해요.', 'That day, the child waited in the corridor. Since then, she doesn’t speak.')])],
    npcs: [{ name: 'The Voice in the Room', kind: 'voice', invisible: true, look: { t: 'voice' }, lang: 'ko-s', ambientLines: [KS('자장자장 우리 아가…', 'Hush, hush, my baby…'), 'A breath, very slow. Then nothing. Then the blackbird, outside.', KS('괜찮아. 다 괜찮아.', 'It’s fine. Everything is fine.')], ambientEvery: 15, hearDist: 12,
      hears: [{ match: ['halmeoni', '할머니', 'nan', 'nana', 'oksun', '옥순', 'grandmother', 'grandma', 'granny', 'ok-sun', '안옥순'], lines: ['The room falls silent. Then, very softly, a voice that smiles.', KS('우리 강아지.', 'My little puppy.')], do: [{ note: 'n_302' }, { secret: 'halmeoni302' }] }] }],
    info: { summary: 'A hospital room from 2023, overlooking the community garden.', lore: 'The room where the grandmother died, when Sora was nine.' } });

  /* W118 — L'Hôpital sous la réalité */
  S({ id: 'W118', name: 'The Hospital Beneath Reality', depth: 2, tier: 'mid', back: 'W027', backLook: 'elevator', backArrive: 'elevator',
    gen: { type: 'rooms', w: 52, h: 36, opts: { depth: 4 } }, look: Object.assign({}, K.LOOK.hospital, { floor: { p: 'tile', c: ['#8aa0a0', '#6a8080'] } }),
    style: { renderer: 'surveillance' }, music: 'underhospital', amb: { type: 'beep', vol: 0.06 }, dark: 0.7,
    doors: [{ to: 'W117', look: 'door', opt: { style: 'glass', symbol: '302' }, label: 'room 302' }, { to: 'W119', look: 'door', opt: { style: 'glass', symbol: '∞' }, label: 'the patient’s dream' }, { to: 'W120', look: 'door', opt: { style: 'metal', symbol: '6' }, label: 'laboratory 6', cond: { flag: 'factory_off' } }],
    decor: [{ look: 'bed', n: 6, opt: { c: ['#d0d8d8', '#a0b0b0'] }, lines: ['An empty bed that keeps a shape.', 'A bed whose monitor shows dreams instead of a heart.'] }],
    place: [soul([KS('위층 사람들은 자고 있어요. 아래층에서는 그 꿈을 고쳐요.', 'Upstairs, people are sleeping. Downstairs, we mend their dreams.')]),
      soul([KS('야간 근무는 사람을 반으로 접어요. 접힌 쪽은 집에 두고 와요.', 'Night shifts fold people in half. You leave the folded half at home.')]),
      soul(['She floats ten centimetres above the tiles, out of habit.', KS('여기 간호조무사 중 한 명은 딸이 혼자 자는 걸 알아요. 아무한테도 말 안 해요.', 'One of the nursing assistants here knows her daughter sleeps alone. She tells no one.')]),
      soul([KS('기계는 심장을 적어요. 그리움은 안 적어요.', 'The machines record the heart. They do not record the longing.')])],
    npcs: [{ name: 'The Footless Nurse', count: 2, look: ghost('rgba(220,240,240,0.55)', 23), behavior: 'wander', radius: 6, solid: false, talkable: true, lang: 'ko-s', lines: [{ seq: [KS('여기서는 꿈을 치료해요.', 'Here, we treat dreams.'), KS('위층 사람들은 그냥 자게 둬요.', 'The people upstairs, we just let them sleep.')] }, KS('302호는 아직 쓰고 있어요. 2023년부터요.', 'Room 302 is still occupied. Since 2023.')] }],
    info: { summary: 'Hospital wards beneath the hospital, in surveillance-camera light.', lore: 'The hospital as you dream it when someone has died there.' } });

  /* W119 — Le Rêve du patient */
  S({ id: 'W119', name: 'The Patient’s Dream', depth: 3, tier: 'hard', back: 'W118',
    gen: { type: 'cave', w: 46, h: 34, opts: { fill: 0.47, iter: 3, wall: ' ', floor: '.' } }, look: { floor: { p: 'cloud', c: ['#e8e8f8', '#c8c8e0'] } },
    style: { renderer: 'psychedelic', stars: true, cliffH: 0.5, cliff: '#6a6aa0' }, music: 'patientdream', dark: 0.3,
    doors: [{ to: 'W113', look: 'door', opt: { style: 'wood', c: ['#e8d8a0'] }, label: 'a kitchen door' }, { to: 'W112', look: 'curtain', label: 'a curtain' }],
    decor: [{ look: 'cloudpuff', n: 6, lines: ['A cloud shaped like a bed.', 'A cloud shaped like a hand holding another hand.'] }],
    place: [soul([KS('집에 못 가는 사람은 방이 아니라 부엌을 꿈꿔요.', 'Someone who can’t go home doesn’t dream of a bedroom: they dream of a kitchen.')]),
      soul(['She holds the hand of someone who isn’t there.', KS('누가 불을 끄면 돌아왔다는 뜻이에요. 그래서 아무도 안 꺼요.', 'If someone turns off the light, it means they’ve come home. So nobody turns it off.')]),
      soul([KS('여기 구름은 다 침대 모양이에요. 눕고 싶어서 그래요.', 'Here, all the clouds are shaped like beds. It’s because we want to lie down.')])],
    npcs: [{ name: 'The Dreaming Patient', look: H({ t: 'old', body: 'robe', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#e0e0e0'], eyes: 'closed', alpha: 0.7 }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('불이 켜져 있는 부엌을 꿈꿔요. 나를 위해 켜 둔 불이요.', 'I dream of a kitchen with the light on. A light left on for me.'), KS('누가 그 불을 끄면, 내가 집에 돌아온 거예요.', 'If someone turns that light off, it means I’ve come home.')] }],
    info: { summary: 'Islands of cloud hanging in the starry dark: the dream of someone sleeping in hospital.', lore: 'The dreams you have when you won’t be going home.' } });

  /* W120 — Le Laboratoire 6 (laboratoire secret) */
  S({ id: 'W120', name: 'Laboratory 6', depth: 2, tier: 'hard', back: 'W007', backArrive: 'lab', secretLevel: 4,
    map: (function () { var g = K.grid(46, 30, ' '); g.box(0, 0, 46, 30, '#', ','); g.box(2, 2, 18, 12, 'g', '.'); g.set(11, 13, '.'); g.box(26, 2, 18, 12, '#', '.'); g.set(34, 13, '.'); g.box(2, 17, 42, 11, '#', '.'); g.set(22, 17, '.'); for (var x = 5; x < 42; x += 6) g.set(x, 22, '}'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#e0e8ec', '#b0c0c8'] }, floor2: { p: 'metal', c: ['#8a9098'] }, wall: { p: 'flat', c: ['#1a2228', '#121a20'], topColor: '#1a2228' }, wallface: { p: 'panel', c: ['#d8e4e8', '#b0c4cc', '#7a909a'], skirt: '#2a7aa0' }, glass: { p: 'glass', c: ['#80b0c8', '#e0f4fc', '#a0c8dc'] } },
    tall: { '}': { look: 'server', opt: { c: ['#2a3a44'] } } }, style: { tallWalls: true }, music: 'lab6', amb: { type: 'beep', vol: 0.08 },
    doors: [{ to: 'W121', look: 'door', opt: { style: 'metal', c: ['#c8d0d8'], symbol: 'OBS' }, label: 'observation room' }, { to: 'W122', look: 'door', opt: { style: 'metal', c: ['#c8d0d8'], symbol: 'ARCH' }, label: 'subject archives' }, { to: 'W118', look: 'elevator', label: 'service lift' }],
    place: [{ type: 'decor', at: [11, 7], look: 'bed', lookOpt: { c: ['#f0f4f8', '#a0c0d8'] }, lines: ['The examination bed. Wires hang from the pillow, with little suction pads. There is a hollow the size of a twelve-year-old girl.'] },
      { type: 'decor', at: [30, 6], look: 'monitor', lookOpt: { c: ['#101820'] }, animated: true, lines: ['A screen: “POLYSOMNOGRAPHY — SUBJECT S. — AGE 12”. The curves draw mountains, then a flat line for ten minutes, then mountains.'] },
      { type: 'sign', at: [38, 6], look: 'clipboard', lines: ['She holds a clipboard she never lets go of.', EN('Subject S., twelve years old. Sleep onset normal. Paradoxical phases abnormally long: ten minutes.'), EN('The subject does not speak on waking. The subject does not speak.'), EN('Somebody added in pencil: she dreams longer than we do.')] },
      { type: 'sign', at: [22, 20], look: 'board', lookOpt: { lines: ['PROTOCOL 6', 'SUBJECT S.', 'DO NOT WAKE'], color: '#40c0e0' }, lines: [EN('Protocol six. Subject S. Do not wake her.'), EN('Subjects one to five have no files. Nobody asks why the numbers kept going.')] },
      soul([EN('Her mother asked for the examination. Her mother signed it. Her mother did not come in.')]),
      soul([EN('We measured a child who would not speak. We wrote: nothing abnormal.')]),
      soul(['She trails a wire behind her, like a lead.', EN('Ten minutes of dreaming. Inside, whole years.')]),
      soul([EN('I was subject four. I remember the ceiling. Nothing else.')]),
      soul([EN('She talks in her sleep. Nobody ever wrote down what she said.')]),
      soul([EN('The hollow in that bed is the size of a twelve-year-old. It has not filled in.')])],
    npcs: [{ name: 'The Night Technician', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#e0ecf0', '#c0d0d8', '#e0c0a0', '#3a2a20'], acc: 'clipboard' }), behavior: 'patrol', path: [[4, 15], [42, 15]], speed: 0.8, lang: 'en', lines: [{ seq: [EN('The subject is asleep. Keep the noise down.'), 'She doesn’t see you: you are the subject.'] }, { seq: [EN('Her mother works here, on the night shift. She asked for the examination.'), EN('She is worried. She does not say so.')] }] }, { name: 'The Electrode', count: 3, look: { t: 'jelly', c: ['#c8e8f0'], h: 10 }, behavior: 'fly', radius: 5, speed: 1, solid: false, lines: ['A little suction pad floats by, trailing its wire behind it. It is looking for a head.'] }],
    info: { summary: 'A hospital sleep laboratory: an examination room behind glass, a screen room, subject archives.', rules: ['Reached through the armoured door of the Sleep Factory (once the factory is stopped) or from the Hospital Beneath Reality.'], lore: 'The sleep study done at the hospital where Mi-ran works: “Subject S.”. Her dreams last ten minutes.' } });
})(typeof window !== 'undefined' ? window : globalThis);
