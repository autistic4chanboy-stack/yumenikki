/* =========================================================================
 *  MONDES SECRETS (1/8) — W041 à W060
 *  Branches : le Monde mono (W042), la Bibliothèque (W046), les Toits (W052).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  /* répliques parlées : anglais, coréen du Sud, coréen du Nord (tr = traduction française) */
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  /* une âme : elle dit son fragment une fois, puis se défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }

  /* W041 — La Chambre de papier */
  S({ id: 'W041', name: 'The Paper Room', depth: 2, tier: 'easy', back: 'W042', backLook: 'door', backOpt: { style: 'shoji' },
    map: K.hall(20, 14, 'p', '.'), look: { floor: { p: 'paper', c: ['#f0ece4'] }, paper: { p: 'paper', c: ['#e8e4dc'] }, wall: { p: 'paper', c: ['#e0dcd4'] } },
    style: { renderer: 'charcoal', tallWalls: true }, music: 'paperroom',
    decor: [{ look: 'bed', opt: { c: ['#f8f8f0', '#d8d8d0'] }, lines: ['A bed of folded paper. It rustles when you look at it.'] }, { look: 'window', lines: ['A drawn window. Behind it, another drawing of a window.'] }, { look: 'desk', opt: { c: ['#e8e4d8'] }, lines: ['A paper desk. On the blotter, pressed into it, the trace of a letter written with a heavy hand: “come back”.'] }],
    npcs: [{ name: 'The Folding Woman', look: H({ head: 'mask', body: 'dress', c: ['#f0ece4', '#d8d4cc', '#f8f4ec', '#e0dcd4'] }), behavior: 'static', solid: true, lines: ['She folds rooms. This one is the forty-third.', EN('If you tear it, it folds itself back up. Rooms want to stay rooms.')] }],
    place: [
      SOUL([EN('I lived in a room like this one. Then they folded the house and sent it somewhere smaller.')]),
      SOUL(['A paper soul, folded in four.', EN('She never saw the real room. She folds it from what you remember. That is why the lamp is missing.')]),
      SOUL([KS('냉장고에 쪽지 붙여 놨어. 읽었니?', 'I stuck a note on the fridge. Did you read it?')])],
    info: { summary: 'A paper copy of the bedroom, folded by someone who has never seen the original.', lore: 'What you keep of a house once you no longer live there.' } });

  /* W042 — La Ruche de cire */
  S({ id: 'W042', name: 'The Wax Hive', depth: 2, tier: 'easy', back: 'W005', backLook: 'hole', backArrive: 'exitX',
    gen: { type: 'cave', w: 46, h: 34, opts: { fill: 0.42, steps: 4 } }, look: { floor: { p: 'hex', c: ['#e8c040', '#a07820'] }, wall: { p: 'hex', c: ['#c89830', '#8a6418'] } },
    style: { renderer: 'watercolor' }, music: 'hive', amb: { type: 'bees', vol: 0.08 }, weather: { dust: true },
    doors: [{ to: 'W041', look: 'door', opt: { style: 'shoji' }, label: 'a paper cell' }, { to: 'W043', look: 'hole', label: 'a white cell' }, { to: 'W044', look: 'hole', label: 'a cell that smells of hay' }],
    decor: [{ look: 'hive', n: 6, lines: ['A cell full of set honey. Inside, a little folded note: “the queen dances”.', 'An empty cell. It is exactly the shape of someone small.'] }],
    npcs: [{ id: 'N200', name: 'The Queen', look: { t: 'bee', c: ['#e8a020'], h: 18 }, behavior: 'static', solid: true, lines: ['She dances on the spot: three times left, once up. Then she starts again, more slowly, for you.'] },
      { name: 'A Worker', count: 5, look: { t: 'bee', c: ['#e8c030'], h: 10, shadow: false }, behavior: 'fly', radius: 6, speed: 2, solid: false, lines: ['Bzz. She carries a drop of honey in which someone has written a name.'] }],
    effect: { id: 'E44', how: 'mech', mech: { type: 'dirSequence', ent: 'N200', seq: ['left', 'left', 'left', 'up'], dist: 7, winLines: ['You dance like the queen. The bees draw aside: the empty cell fills with a glow, and two antennae sprout from your hair.'] } },
    place: [
      SOUL([EN('Nobody here has words. We say things with the body, and the others copy us until they understand.')]),
      SOUL([EN('The empty cell was made for someone small. She went out to play one summer, and the wax kept her shape.')]),
      SOUL(['A soul that smells of wet earth and soap.', KS('봐, 벌들이 꽃한테 인사하잖아. 춤추는 거 보이지?', 'Look, the bees are saying hello to the flowers. Can you see them dancing?')])],
    info: { summary: 'Inside a wax hive, warm and golden, where the queen dances a message.', rules: ['Dancing like the queen (left, left, left, up) gives the Antennae (E44).'], lore: 'Talking without words: you understand by doing the same.' } });

  /* W043 — Le Couloir blanc */
  S({ id: 'W043', name: 'The White Corridor', depth: 2, tier: 'easy', back: 'W042', backLook: 'hole', wrap: true, loop: true,
    map: K.corridor(60, 3, '#', '.'), look: { floor: { p: 'flat', c: ['#f4f4f4', '#ececec'] }, wall: { p: 'flat', c: ['#e0e0e0', '#d8d8d8'] } },
    style: { tallWalls: true }, music: 'whitecorridor', amb: { type: 'hum', vol: 0.02 },
    doors: [{ to: 'W045', look: 'door', opt: { style: 'metal', c: ['#e8e8e8'] }, cond: { fn: function () { return Math.abs(YN.save.temp('wc') || 0) >= 3; } }, label: 'a door that wasn’t there' }, { to: 'W158', look: 'door', opt: { style: 'metal', c: ['#ffffff'] }, cond: { effect: 'E05' }, label: 'a white door on white' }],
    decor: [{ look: 'frame', n: 4, opt: { c: ['#f0f0f0'] }, lines: ['A white frame with a white picture.', 'In the frame, a white corridor. Someone is walking down it, back turned. It is you, a little further on.'] }],
    mech: [{ type: 'loopCount', key: 'wc', onLoop: function (rt, n) { YN.world.reeval(rt); if (Math.abs(n) === 3) YN.game.toast('A door, somewhere.'); } }],
    npcs: [{ name: 'The White Nurse', look: H({ t: 'tall', head: 'none', body: 'robe', c: ['#f8f8f8', '#e8e8e8', '#f8f8f8', '#f8f8f8'] }), behavior: 'patrol', path: [[5, 2], [55, 2]], speed: 0.8, lines: ['She does not speak. She points to the end of the corridor, which has no end.', 'Three times, she mimes with her fingers. Three times round.'] }],
    place: [
      SOUL([EN('Night shift, corridor B. I walked it so many times my shoes learned the way without me.')]),
      SOUL([EN('A child waited on the plastic chair until seven. Her mother came out smiling.'), EN('She always smiled at seven.')]),
      SOUL([EN('Here, doors appear for those who go round in circles. Patience is a key too.')])],
    info: { summary: 'A white corridor that comes back on itself; after three laps, a door appears.', rules: ['The corridor loops; going round three times makes a door appear (W045).'], lore: 'Hospital corridors at night, when you wait without knowing what for.' } });

  /* W044 — Le Champ d'épouvantails */
  S({ id: 'W044', name: 'The Scarecrow Field', depth: 2, tier: 'easy', back: 'W042', backLook: 'hole', outdoor: true,
    gen: { type: 'empty', w: 44, h: 34, opts: { floor: '.', border: '#', decor: ';"', decorRate: 0.18 } },
    look: { floor: { p: 'soil', c: ['#7a6440'] }, leafb: { p: 'leaves', c: ['#8a7a40', '#c8a040', '#a08030'] }, leafg: { p: 'grass', c: ['#a09040', '#8a7a30', '#b8a850', '#6a5a20'] }, wall: { p: 'hedge', c: ['#6a5a2a', '#5a4a1a', '#7a6a3a', '#3a2a0a'] } },
    style: { sky: ['#e8b060', '#f8e0a0'] }, music: 'scarecrows', amb: { type: 'crows', vol: 0.06 },
    doors: [{ to: 'W045', look: 'door', opt: { style: 'wood', c: ['#8a5a2a'] }, label: 'the barn' }],
    decor: [{ look: 'scarecrow', n: 10, lines: ['A scarecrow. Its head is turned towards the centre of the field.', 'A scarecrow. It watches you when you move, and stops watching when you keep still.'] }, { id: 'center', look: 'sign', n: 1, at: [22, 17], lines: ['A soul planted like a stake in the middle of the wheat.', EN('Stay.'), EN('Don’t move. Not until every one of them is looking at you.')] }],
    effect: { id: 'E45', how: 'mech', mech: { type: 'standStill', zone: [20, 15, 24, 19], secs: 18, tick: 'creak', winLines: ['One by one, the scarecrows have turned towards you. When the last one is done, you feel your arms spread out on their own, like theirs.'], breakLine: 'The scarecrows turn away.' } },
    npcs: [{ name: 'The Crow', count: 3, look: { t: 'crow', c: ['#1a1a1e'], h: 12 }, behavior: 'wander', radius: 6, speed: 2.2, lines: ['Caw. It only comes near things that keep still.'] }],
    place: [
      SOUL([EN('At school I stood very still in the corner. If you don’t move, they stop seeing you.'), EN('It works too well.')]),
      SOUL([EN('The scarecrows were children once. Someone told them: stand there and don’t make a fuss.')]),
      SOUL([EN('Wheat dries faster when nobody comes back to harvest it.')])],
    info: { summary: 'A field of dry wheat planted with scarecrows that look towards the centre.', rules: ['Standing still in the centre until they all turn towards you gives the Scarecrow (E45).'], lore: 'Don’t move, so as not to be seen. It works on grown-ups too.' } });

  /* W045 — La Grange */
  S({ id: 'W045', name: 'The Barn', depth: 2, tier: 'easy', back: 'W044', map: K.hall(26, 18, '#', '.'),
    look: { floor: { p: 'wood', c: ['#8a6a40', '#6a4a28', '#9a7a50'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a10'], topColor: '#3a2a1a' }, wallface: { p: 'panel', c: ['#8a4a2a', '#6a3a1a', '#4a2a10'], skirt: '#3a2010' } },
    style: { tallWalls: true }, music: 'barn', dark: 0.4,
    doors: [{ to: 'W043', look: 'door', opt: { style: 'metal', c: ['#e8e8e8'] }, label: 'a white door at the back' }],
    decor: [{ look: 'crate', n: 6, lines: ['Bales of hay. In one of them, an empty nest.', 'A crate: “APPLES — ORCHARD”. It is full of letters.'] }, { look: 'ladder', lines: ['A ladder up to the hayloft. There is no hayloft.'] }],
    npcs: [{ name: 'The Counting Cow', look: { t: 'dog', c: ['#f0f0f0', '#1a1a1a'], h: 18 }, behavior: 'static', solid: true, lines: ['Moo. She counted the days. She stopped at nine years.'] }, { name: 'The Faceless Farmer', look: H({ head: 'none', body: 'apron', c: ['#4a6a3a', '#3a5a2a', '#e0c0a0', '#2a2a2a'] }), behavior: 'wander', radius: 3, lines: ['He lifts his hat. Underneath, nothing. He puts it back politely.'] }],
    place: [
      SOUL([EN('The apple crate is full of letters because the orchard never wrote back.')]),
      SOUL([EN('We were supposed to go to the countryside that summer. Dad said: next year.'), EN('Then there was no dad.')]),
      SOUL([EN('Nine years. The cow stopped counting at nine. A lot of things stop at nine.')])],
    info: { summary: 'A barn of dark wood between the field and the white corridor.', lore: 'The country holidays you tell people about and never had.' } });

  /* W046 — L'Herbier */
  S({ id: 'W046', name: 'The Herbarium', depth: 2, tier: 'easy', back: 'W018', backArrive: 'herbarium', map: (function () { var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.'); for (var x = 4; x < 31; x += 6) g.vline(x, 4, 17, '%'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#c8a878', '#a08858', '#d8b888'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a10'], topColor: '#3a2a1a' }, wallface: { p: 'wallpaper', c: ['#d8e0c0', '#b8c8a0', '#7a8a60'], skirt: '#4a3a20' }, wall2: { p: 'brick', c: ['#6a8a4a', '#4a6a2a', '#3a4a1a'], ownFace: true } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'herbarium',
    doors: [{ to: 'W047', look: 'door', opt: { style: 'wood', c: ['#4a6a3a'] }, label: 'the door to the press' }, { to: 'W048', look: 'door', opt: { style: 'glass', c: ['#a0c8d8'] }, label: 'a door that smells of washing powder' }],
    decor: [{ id: 'flower', look: 'flower', n: 1, opt: { c: ['#e06080'] }, type: 'item', item: { pressedflower: 1 }, once: true, solid: false, lines: ['A pressed flower, fallen from a book. It is still pink.'] },
      { look: 'book', n: 3, opt: { c: ['#f0e8d0', '#4a7a3a'] }, lines: ['“Spring”. The pages are full of see-through leaves.', '“Autumn”. A ginkgo leaf, shaped like a fan.', '“Winter”. Nothing. Just the mark of a snowflake.'] }],
    effect: { id: 'E46', how: 'find', look: 'book', opt: { c: ['#f8f0c8', '#e0a030'] }, need: { item: { pressedflower: 1 } }, notYet: ['“Summer”. One page is empty, with a flower-shaped mark.'], lines: ['You lay the pressed flower on summer’s empty page. The book closes by itself, and you with it: you feel flat and light, like a flower between two pages.'] },
    npcs: [{ name: 'The Blind Botanist', look: H({ t: 'old', body: 'coat', c: ['#4a5a3a', '#3a4a2a', '#e0c8b0', '#d8d8d8'], eyes: 'closed', acc: 'book' }), behavior: 'static', solid: true, lines: [EN('I know every flower by touch. One is missing from summer. The rose, the little one.'), EN('The seasons are shelved in order. Except summer: somebody borrowed it.')] }],
    place: [
      SOUL([KS('꽃은 사전 사이에 끼워 두면 오래 가. 사람은 그렇게 안 되지만.', 'Flowers last a long time pressed in a dictionary. People don’t.')]),
      SOUL([EN('A ginkgo leaf, pressed in 1989. A little girl put it there while she waited up for her father.')]),
      SOUL([EN('The white library sends its books here when they have nothing left to say.'), EN('We press them until they are only colour.')])],
    info: { summary: 'A room of green shelves where every book is a pressed season.', rules: ['Returning the pressed flower to the empty page of the “Summer” book gives the Herbarium (E46).'], lore: 'The flowers Grandma used to dry in the dictionary.' } });

  /* W047 — Le Pressoir */
  S({ id: 'W047', name: 'The Press', depth: 3, tier: 'easy', back: 'W046', map: K.hall(22, 16, '#', ','),
    look: { floor: { p: 'stone', c: ['#8a7a6a', '#6a5a4a', '#4a3a2a'] }, wall: { p: 'stone', c: ['#5a4a3a', '#4a3a2a', '#3a2a1a'] } }, music: 'press', dark: 0.5,
    doors: [{ to: 'W050', look: 'door', opt: { style: 'red', c: ['#8a2a3a'], symbol: '404' }, label: 'a hotel door' }],
    decor: [{ look: 'barrel', n: 5, lines: ['A barrel. Inside, flower juice, very sweet, that smells of Sundays.', 'An empty barrel that echoes when you speak into it.'] }, { look: 'wheel', lines: ['The wheel of the press. It turns when someone sings.'] }],
    npcs: [{ name: 'The Presser', look: H({ t: 'tall', head: 'box', body: 'apron', c: ['#6a4a3a', '#4a2a1a', '#c8a070', '#202020'] }), behavior: 'static', solid: true, lines: [EN('We press the flowers to keep their colour. Afterwards, that is all they have left.'), EN('Everything kept too long goes flat.')] }],
    place: [
      SOUL([EN('Sunday juice. It tastes like a kitchen with the radio on and someone humming at the stove.')]),
      SOUL(['A soul gone quite flat, like a flower forgotten in a book.', KS('괜찮아. 괜찮아. 자꾸 말하면 납작해져.', 'It’s fine. It’s fine. Say it often enough and it goes flat.')]),
      SOUL([EN('Speak into the empty barrel. It gives your voice back a little older.')])],
    info: { summary: 'A stone cellar where flowers are pressed for their colour.', lore: 'You flatten things to keep them.' } });

  /* W048 — La Laverie */
  S({ id: 'W048', name: 'The Launderette', depth: 2, tier: 'easy', back: 'W046',
    map: (function () { var g = K.grid(30, 18, ' '); g.box(0, 0, 30, 18, '#', '.'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#d8e0e0', '#a8b8b8'] }, wall: { p: 'flat', c: ['#2a3a3a', '#1a2a2a'], topColor: '#2a3a3a' }, wallface: { p: 'tile', c: ['#c8e0e0', '#a0c0c0', '#7090a0'], skirt: '#4a7a8a' } },
    style: { tallWalls: true }, music: 'laundry', amb: { type: 'machine', vol: 0.06 },
    doors: [{ to: 'W050', look: 'door', opt: { style: 'glass', c: ['#c8d8e0'] }, label: 'the service door' }, { to: 'W057', look: 'washer', label: 'the porthole of machine 9', cond: { equipped: 'E47' } }],
    decor: [{ look: 'washer', n: 5, animated: true, lines: ['A washing machine running empty. In the porthole, a sock goes round with it.', 'A machine that has stopped. The washing inside has been dry for years.'] }],
    place: [{ id: 'm6', type: 'decor', at: 'random-any', look: 'washer', lookOpt: { num: '6' }, animated: true, lines: ['Machine 6. A dial: Cotton · Synthetics · Gentle.'], use: [{ fn: function () { if (YN.save.hasEffect('E47') || YN.save.isEgg('E47')) return; YN.ui.dialog.choose(['Cotton', 'Synthetics', 'Gentle'], function (i) { if (i === 2) YN.ui.dialog.queue([{ t: 'Gentle programme. The machine turns ever so softly, and out drifts a bubble as big as you, which does not want to burst.' }], {}, function () { YN.game.giveEffect('E47'); }); else YN.ui.dialog.queue([{ t: 'The machine spins violently, then stops. Nothing.' }]); }); } }] },
      SOUL([EN('I was twelve. I learned the machines on my own: two coins, the blue powder, the button that sticks.')]),
      SOUL([EN('A care assistant’s tunic goes round in number 3 every morning at a quarter past seven. Then she runs for the bus.')]),
      SOUL([EN('Some socks never find their pair again. They go round together anyway, for the company.')])],
    npcs: [{ name: 'The Lady Waiting for Her Laundry', look: H({ t: 'adult', hairStyle: 'bun', body: 'dress', c: ['#8a7a9a', '#6a5a7a', '#e0c0a0', '#3a2a2a'], eyes: 'closed' }), behavior: 'static', solid: true, lines: [EN('I’m waiting for it to dry. It never dries. So I wait.'), EN('Number 6 is the only one that takes care. You have to set it to gentle.')] }, { name: 'The Launderette Cat', look: { t: 'cat', c: ['#e8e0d0', '#40a0e0'], h: 12 }, behavior: 'static', solid: true, lines: ['It sleeps on the warm machine.'] }],
    info: { summary: 'A launderette open all night: pale tiles, turning portholes.', rules: ['Setting machine 6 to “Gentle” gives the Bubble (E47).', 'With the Bubble equipped, the porthole of machine 9 leads further (W057).'], lore: 'Doing your own washing at twelve.' } });

  /* W049 — Le Parking infini */
  S({ id: 'W049', name: 'The Endless Car Park', depth: 3, tier: 'mid', back: 'W052',
    inf: { type: 'plain', floor: '.', scatter: ['^', '^', '^', '{'], density: 0.035, landmarks: 'o', landmarkRate: 0.12, cache: 48 },
    look: { floor: { p: 'concrete', c: ['#5a5a5e'] }, wall: { p: 'concrete', c: ['#6a6a6e', '#5a5a5e', '#4a4a4e'] } },
    tall: { '^': { look: 'pillar', vary: [{ opt: { c: ['#8a8a8e'] } }, { opt: { c: ['#8a8a8e'] } }, { opt: { c: ['#8a8a8e'] } }, { opt: { c: ['#c83030'] } }] }, '{': { look: 'carpart' }, 'o': { look: 'sign' } },
    music: 'parking', amb: { type: 'hum', vol: 0.05 }, dark: 0.55,
    doors: [{ to: 'W053', look: 'elevator', at: [20, 14], label: 'the car park lift' }],
    place: [{ id: 'panel', type: 'decor', at: [17, 14], look: 'sign', lines: ['A soul bent over the lift button.', EN('Say your level.'), EN('The level is the sum of the red pillars on this level.')] },
      SOUL([EN('Level minus three, row F. A woman slept here in her car between two shifts. The radio played to keep her company.')]),
      SOUL([EN('Hospital car park, at dawn. A girl counted the pillars until her mother came down.'), EN('She got to twelve, then started again.')]),
      SOUL([EN('The cars that stay are waiting for someone who said: five minutes.')])],
    mech: [{ type: 'sayTo', mark: 'panel', words: ['12', 'twelve', 'level 12', 'level twelve', 'floor 12', 'floor twelve', '십이', '열둘', '12층'], dist: 4, give: 'E48', winLines: ['You say your level out loud. Every strip light in the car park comes on at once, and two car headlights switch on in your eyes.'], wrong: 'The panel crackles: “Unknown level.”' }],
    npcs: [{ name: 'The Car Park Attendant', look: H({ head: 'cap', body: 'uniform', c: ['#4a4a3a', '#3a3a2a', '#d8b898', '#e8d040'] }), behavior: 'static', at: [22, 16], solid: true, lines: [EN('There are twelve red pillars on every level. Always twelve. I count them in circles.'), EN('People leave their cars and never come back. I keep watch.')] }],
    info: { summary: 'An underground car park that stretches on without end; pillars, car wrecks, a lift at the start.', rules: ['Endless world.', 'Saying “12” to the lift panel gives the Headlights (E48).'], lore: 'Waiting in the car, in the hospital car park, for the night to end.' } });

  /* W050 — L'Hôtel des chambres 404 */
  S({ id: 'W050', name: 'The Hotel of Rooms 404', depth: 3, tier: 'mid', back: 'W048',
    map: (function () { var g = K.grid(44, 24, ' '); g.box(0, 0, 44, 24, '#', ','); for (var i = 0; i < 6; i++) { g.box(1 + i * 7, 1, 7, 8, '#', '.'); g.set(4 + i * 7, 8, '.'); g.box(1 + i * 7, 15, 7, 8, '#', '.'); g.set(4 + i * 7, 15, '.'); } return g.rows(); })(),
    look: { floor: { p: 'carpet', c: ['#6a2a3a', '#4a1a2a'] }, floor2: { p: 'carpet', c: ['#8a3a4a', '#6a2a3a'] }, wall: { p: 'flat', c: ['#2a1a1a', '#1a0a0a'], topColor: '#2a1a1a' }, wallface: { p: 'wallpaper', c: ['#c8a890', '#a88870', '#7a5a40'], skirt: '#4a2a1a' } },
    style: { tallWalls: true }, music: 'hotel', dark: 0.35,
    doors: [{ to: 'W053', look: 'elevator', label: 'the lift' }, { to: 'W047', look: 'door', opt: { style: 'wood', symbol: '0' }, label: 'room 0' }],
    decor: [{ look: 'door', n: 6, opt: { style: 'wood', c: ['#6a3a2a'], symbol: '404' }, lines: ['Room 404. Locked.', 'Room 404. A television can be heard.', 'Room 404. “DO NOT DISTURB”.'] }],
    npcs: [{ id: 'N201', name: 'The Receptionist', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#2a2a4a', '#1a1a3a', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, lang: 'en',
      lines: [{ t: 'Good evening. Your name, please? The key is under the name of the guest. Or the name of nobody.', lang: 'en' }] }],
    effect: { id: 'E49', how: 'mech', mech: { type: 'sayTo', ent: 'N201', words: ['nobody', 'no one', 'noone', 'none', '아무도'], dist: 4, winLines: [{ t: 'Nobody. Of course. Room 404 for nobody.', lang: 'en' }, { t: 'She hands you a warm keycard, in nobody’s name.' }], wrong: { t: 'I’m sorry, there’s no one by that name. Is there?', lang: 'en' } } },
    place: [
      SOUL([EN('I asked for my husband’s room. They said 404. Every room is 404 when the one you want is gone.')]),
      SOUL([EN('Behind one of the doors, a television laughs all night for a guest who checked out years ago.')]),
      SOUL([EN('A suitcase marked J. waited in the lobby for a long time. Then one night it was gone.'), EN('Nobody signed for it.')])],
    info: { summary: 'A hotel where every room is numbered 404.', rules: ['Asking for the key “in the name of nobody” (say “nobody”) gives the Keycard 404 (E49).'], lore: 'Not found: the room you are looking for does not exist.' } });

  /* W051 — La Rue sous la pluie */
  S({ id: 'W051', name: 'The Street in the Rain', depth: 2, tier: 'easy', back: 'W052', outdoor: true,
    gen: { type: 'city', w: 50, h: 36, opts: { block: 8, street: 3, wall: '%', floor: '.' } }, look: 'night', tall: K.TALL.city,
    weather: { rain: true }, music: 'rainstreet', amb: { type: 'rain', vol: 0.12 }, dark: 0.6,
    doors: [{ to: 'W055', look: 'door', opt: { style: 'glass', c: ['#4060a0'], symbol: 'TV' }, label: 'the television shop' }, { to: 'W056', look: 'photobooth', label: 'a photo booth' }],
    decor: [{ look: 'puddle', n: 6, opt: {}, solid: false, lines: ['A puddle. In it, the reflection of a lit street lamp.', 'A puddle. The reflection of a window where someone is washing up.'] }, { id: 'darkpuddle', look: 'puddle', n: 1, solid: false, opt: { dark: true }, lines: ['A puddle. In it, the reflection of a street lamp that is off. Yet the real one is lit.'] }],
    mech: [{ type: 'standStill', mark: 'darkpuddle', secs: 5, give: 'E50', winLines: ['You stay in the puddle of the unlit lamp. The water rises to your ankles, lukewarm, and never quite goes back down: you can become a puddle now.'] }],
    npcs: [{ name: 'The Man with the Closed Umbrella', look: H({ t: 'adult', body: 'coat', c: ['#2a2a3a', '#1a1a2a', '#d8b898', '#2a2a2a'], acc: 'umbrella' }), behavior: 'wander', radius: 4, lines: [{ seq: ['He never opens it.', EN('Rain is for remembering.')] }, EN('Puddles show what was lit before. Only one shows what was dark.')] }, { name: 'A Wet Dog', look: { t: 'dog', c: ['#6a5a4a', '#4a3a2a'], h: 13 }, behavior: 'follow', radius: 5, lines: ['It shakes itself dry all over you. It is happy.'] }],
    place: [
      SOUL([EN('Nobody came with an umbrella. She walked home as if it had been her idea.')]),
      SOUL([EN('Every window on this street has its own puddle. Mine shows a lamp that somebody switched off.')]),
      SOUL(['A soul that smells of wet paper and the fridge.', KS('우산 챙겨. 엄마 늦어.', 'Take an umbrella. Mum will be late.')])],
    info: { summary: 'A street under rain that never stops; the puddles reflect other moments.', rules: ['Stopping (standing still) in the puddle that reflects a light that is off gives the Puddle (E50).'], lore: 'Walking home in the rain without an umbrella, because nobody came.' } });

  /* W052 — Le Toit du monde */
  S({ id: 'W052', name: 'The Roof of the World', depth: 2, tier: 'mid', back: 'W026', backLook: 'hatch', backArrive: 'roofworld', outdoor: true,
    map: (function () { var g = K.grid(40, 30, ' '); g.ellipse(20, 15, 17, 13, '.'); g.ellipse(20, 15, 4, 3, ','); return g.rows(); })(),
    look: { floor: { p: 'metal', c: ['#5a5e66'] }, floor2: { p: 'grid', c: ['#101420', '#e0e0ff'] } }, style: { stars: true, sky: ['#02030a', '#0a1030'], cliffH: 0.8, cliff: '#1a1e26' },
    music: 'worldroof', amb: { type: 'wind', vol: 0.1 }, weather: { wind: 0.6 }, dark: 0.5,
    doors: [{ to: 'W049', look: 'stairsdown', label: 'stairs to the car park' }, { to: 'W051', look: 'stairsdown', label: 'stairs to the street' }, { to: 'W059', look: 'stairsdown', label: 'stairs to a courtyard' }],
    place: [{ id: 'ant1', type: 'decor', at: [8, 10], look: 'antenna', lookOpt: { dir: 0 }, lines: ['A swivelling antenna.'] }, { id: 'ant2', type: 'decor', at: [32, 10], look: 'antenna', lookOpt: { dir: 0 }, lines: ['A swivelling antenna.'] }, { id: 'ant3', type: 'decor', at: [20, 25], look: 'antenna', lookOpt: { dir: 0 }, lines: ['A swivelling antenna.'] },
      { id: 'windows', type: 'sign', at: [20, 5], look: 'skylight', lines: ['A soul sitting on the edge of the roof, feet dangling over the void.', EN('Down there, very far, thousands of windows. Only one is lit. Due north.')] },
      SOUL([EN('From up here every lit window looks like someone waiting. Most of them are only people who forgot to sleep.')]),
      SOUL([KS('서울은 지금 아침이야. 화면 속에서는 다들 웃어.', 'It’s morning in Seoul now. On the screen, everyone is smiling.')]),
      SOUL([EN('The stars here are only the windows of a city upside down. Somebody up there is looking at you.')])],
    effect: { id: 'E51', how: 'mech', mech: { type: 'dials', marks: ['ant1', 'ant2', 'ant3'], states: 4, values: ['north', 'east', 'south', 'west'], start: [1, 2, 3], target: [0, 0, 0], optKey: 'dir', labelText: 'The antenna points ', winLines: ['The three antennas aim at the same lit window. A crackle, then a voice, very far away:', KS('…밥은 먹었어?', '…have you eaten?'), 'A little antenna sprouts on your head.'] } },
    npcs: [{ name: 'The Rooftop Astronomer', look: H({ t: 'old', head: 'helmet', body: 'coat', c: ['#3a3a5a', '#2a2a4a', '#e0c0a0', '#c8c8d0'] }), behavior: 'static', solid: true, lines: [EN('You can see every window from here. The northern one has been lit for seven years.'), EN('To hear it, the three antennas have to look at it at the same time.')] }],
    info: { summary: 'A round roof above every city, under the stars, with three swivelling antennas.', rules: ['Turning all three antennas north (towards the lit window) gives the Antenna (E51).'], lore: 'Watching other people’s lit windows.' } });

  /* W053 — L'Ascenseur qui ne s'arrête pas */
  S({ id: 'W053', name: 'The Lift That Never Stops', depth: 3, tier: 'mid', back: 'W049', map: K.hall(10, 8, '#', '.'),
    look: { floor: { p: 'metal', c: ['#6a6e76'] }, wall: { p: 'flat', c: ['#3a3e46', '#2a2e36'], topColor: '#3a3e46' }, wallface: { p: 'metal', c: ['#8a8e96'], skirt: '#5a5e66' } },
    style: { tallWalls: true }, music: 'elevator', amb: { type: 'hum', vol: 0.08 },
    doors: [{ to: 'W054', look: 'elevator', cond: { remainingMod: { every: 40, under: 20 } }, label: 'the doors open', locked: 'The floors flick past: 3… 7… 404… -1…' }, { to: 'W058', look: 'stairs', cond: { remainingMod: { every: 40, under: 10 } }, label: 'a stair hatch' }, { to: 'W050', look: 'elevator', label: 'back to the hotel' }],
    decor: [{ look: 'sign', lines: ['A soul pressed against the button panel.', EN('The buttons go from minus infinity to plus infinity. Somebody tore off the zero.'), EN('Zero was home.')] }],
    npcs: [{ name: 'The Lift Attendant', look: H({ t: 'kid', head: 'cap', body: 'uniform', c: ['#a02030', '#801020', '#f0c8a0', '#c8a040'] }), behavior: 'static', solid: true, lines: [EN('Next floor! Next floor! … There is never a floor, miss. The doors open when they feel like it.')] }],
    place: [
      SOUL([KS('이십 년 동안 매일 아침 44층까지 올라갔어요. 우리 집 층에서는 한 번도 못 내렸어요.', 'For twenty years I went up to the 44th floor every morning. I never once got off at the floor where I live.')]),
      SOUL([EN('Between two floors there is a place where nobody can call you. I lived there for a while.')]),
      SOUL([EN('Count down when the doors open. The lift likes to be met halfway.')])],
    info: { summary: 'A lift car in perpetual motion; now and then its doors open onto other places.', rules: ['The doors open according to the countdown (Waiting Room W054, Penrose Stairs W058).'], lore: 'Going up and down without ever arriving.' } });

  /* W054 — La Salle d'attente */
  S({ id: 'W054', name: 'The Waiting Room', depth: 3, tier: 'mid', back: 'W053', map: K.hall(28, 18, '#', '.'),
    look: { floor: { p: 'tile', c: ['#c8c8c0', '#a0a098'] }, wall: { p: 'flat', c: ['#2a2a2a', '#1a1a1a'], topColor: '#2a2a2a' }, wallface: { p: 'panel', c: ['#b8c0b8', '#98a098', '#6a706a'], skirt: '#4a504a' } },
    tall: { '{': { look: 'chair' } }, style: { tallWalls: true }, music: 'waiting', amb: { type: 'clock', vol: 0.05 },
    mapPost: function (rows) { for (var y = 4; y < 14; y += 3) for (var x = 3; x < 25; x += 2) rows = YN.gen.put(rows, x, y, '{'); return rows; },
    place: [{ id: 'screen', type: 'decor', at: [14, 1], look: 'board', lookOpt: { lines: ['No. 76', 'No. 76', '----'], color: '#e04040' }, lines: [{ t: function () { return YN.cond.check({ remainingMod: { every: 40, under: 8 } }) ? 'The screen shows: ----. Time to say your number.' : 'The screen shows: No. 76. Nobody gets up.'; } }] },
      { id: 'dispenser', type: 'decor', at: [2, 2], look: 'ticketmachine', lines: ['The ticket dispenser. It gives you 77. Always 77.'], use: [{ if: { not: { temp: { ticket77: true } } }, temp: { ticket77: true }, toast: 'Ticket No. 77' }] },
      SOUL([EN('Children’s emergencies, three in the morning. Her mother still had her work badge on. She had come from the other wing.')]),
      SOUL(['A soul whispering, bent over an empty chair.', KS('괜찮아, 괜찮아. 엄마 여기 있어. …조금만 자.', 'It’s all right, it’s all right. Mum’s here. …Sleep a little.')]),
      SOUL([EN('I was number 76. I let everybody go first. Now the screen only knows my number.')])],
    effect: { id: 'E52', how: 'mech', mech: { type: 'sayTo', mark: 'screen', words: ['77', 'seventy seven', 'seventy-seven', 'number 77', 'ticket 77', '칠십칠', '77번'], dist: 14, cond: { remainingMod: { every: 40, under: 8 } }, notNow: 'The screen cannot hear you. It is showing another number.', winLines: ['You call out your number. Everyone turns towards you. An invisible nurse hands you a ticket: you are next now, for ever.'] } },
    npcs: [{ name: 'Patient No. 12', count: 3, look: H({ t: 'adult', head: 'none', body: 'coat', c: ['#6a6a6a', '#4a4a4a', '#c8c8c8', '#2a2a2a'] }), behavior: 'static', solid: true, lines: ['He waits. He has always waited.', EN('When the screen goes dash, dash, dash, dash, you have to speak. Otherwise you stay.')] }],
    info: { summary: 'A huge, silent waiting room; a number screen, a ticket dispenser.', rules: ['Taking ticket 77, then saying “77” when the screen shows ---- (a window every 40 s), gives the Queue Ticket (E52).'], lore: 'Children’s A&E at three in the morning, with the mother in her work tunic.' } });

  /* W055 — Le Magasin de télévisions */
  S({ id: 'W055', name: 'The Television Shop', depth: 3, tier: 'easy', back: 'W051', map: K.hall(30, 20, '#', '.'),
    look: { floor: { p: 'tile', c: ['#4a4a5a', '#3a3a4a'] }, wall: { p: 'flat', c: ['#1a1a24', '#10101a'], topColor: '#1a1a24' }, wallface: { p: 'panel', c: ['#2a2a3a', '#1a1a2a', '#4a4a6a'], skirt: '#40c0ff' } },
    style: { tallWalls: true }, music: 'tvshop', amb: { type: 'tv', vol: 0.08 }, dark: 0.7,
    decor: [{ look: 'tv', n: 12, animated: true, lines: [EN('…and now the weather: it will be fine. It is always fine.'), { t: 'A children’s programme. The puppets look at the camera without speaking.' }, { t: 'Static.' }, { t: 'A news bulletin from the North: people applauding.' }] }],
    place: [{ id: 'tv13', type: 'tv', at: [15, 3], look: 'tv', animated: true, lines: [{ if: { remainingLt: 180, noEffect: 'E53' }, t: 'Channel 13. A child’s bedroom, filmed from above. A girl is asleep. Someone puts a remote control on the pillow. The remote control is in your hand.', do: [{ give: 'E53' }] }, { t: 'Channel 13: “LATE-NIGHT PROGRAMME — later”.' }] },
      SOUL([EN('We left the television on so the flat would sound like a family.')]),
      SOUL([KN('텔레비죤에서는 모두가 웃었습니다. 우리도 따라 웃었습니다.', 'On the television, everyone laughed. We laughed along with them.')]),
      SOUL([EN('Channel 13 is filmed from the ceiling of a child’s bedroom. Nobody knows who holds the camera.')])],
    npcs: [{ name: 'The Screen Salesman', look: H({ head: 'tv', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#c8c8c8', '#8af0ff'] }), behavior: 'static', solid: true, lines: [EN('All our channels! Channel 13 only comes on at the end of the evening. Late, very late, when there is almost no time left.')] }],
    info: { summary: 'A shop where a hundred televisions show a hundred channels; 13 only comes on late.', rules: ['Watching channel 13 with less than 3:00 left gives the Remote Control (E53).'], lore: 'The television left on, for company.' } });

  /* W056 — La Cabine de photomaton */
  S({ id: 'W056', name: 'The Photo Booth', depth: 3, tier: 'mid', back: 'W051', map: K.hall(24, 12, '#', '.'),
    look: { floor: { p: 'checker', c: ['#e8e8e8', '#202020'] }, wall: { p: 'flat', c: ['#2a2020', '#1a1010'], topColor: '#2a2020' }, wallface: { p: 'panel', c: ['#c83030', '#a02020', '#801010'], skirt: '#f0f0f0' } },
    style: { tallWalls: true, renderer: 'photo' }, music: 'photobooth',
    place: [{ id: 'ph1', type: 'decor', at: [4, 4], look: 'photobooth', lines: ['Picture 1: she smiles.'] }, { id: 'ph2', type: 'decor', at: [9, 7], look: 'photobooth', lines: ['Picture 2: she closes her eyes.'] }, { id: 'ph3', type: 'decor', at: [14, 4], look: 'photobooth', lines: ['Picture 3: there is someone behind her.'] }, { id: 'ph4', type: 'decor', at: [19, 7], look: 'photobooth', lines: ['Picture 4: the booth is empty.'] },
      SOUL([EN('Passport photo, 2008. Don’t smile, they said. She didn’t smile for a long time after that.')]),
      SOUL([EN('In the third picture there is always someone behind you. In the fourth, they have taken your place.')]),
      SOUL([EN('We squeezed in, all three of us, for one strip. Then two of us. Then the machine kept the strip.')])],
    doors: [{ to: 'W057', look: 'photobooth', cond: { effect: 'E54' }, label: 'the fifth picture' }],
    effect: { id: 'E54', how: 'mech', mech: { type: 'sequence', order: ['ph1', 'ph2', 'ph3', 'ph4'], winLines: ['You enter the fourth picture through the first three. Flash. You come out with a strip of photos you are not in, and a little camera.'], wrongLine: 'Flash. The photo comes out blank.' } },
    npcs: [{ name: 'The Late Reflection', look: H({ t: 'kid', head: 'round', hair: '#1e1a26', hairStyle: 'short', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], alpha: 0.5 }), behavior: 'mimic', solid: false, talkable: true, lines: ['Your reflection, half a second behind. It signals you to go in order: one, two, three, four.'] }],
    info: { summary: 'Four photo booths in a chequerboard; each one is a picture on the strip.', rules: ['Entering the booths in the order of the pictures (1, 2, 3, 4) gives the Photo Booth (E54).'], lore: 'ID photos where you were not allowed to smile.' } });

  /* W057 — La Salle de bains infinie */
  S({ id: 'W057', name: 'The Endless Bathroom', depth: 3, tier: 'mid', back: 'W048', wrap: true, loop: true,
    map: (function () { var g = K.grid(24, 16, '.'); for (var x = 2; x < 24; x += 6) { g.set(x, 3, '}'); g.set(x + 3, 11, '{'); } return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#e8f0f0', '#b8c8c8'] } }, tall: { '}': { look: 'sink' }, '{': { look: 'bathtub' } },
    style: { renderer: 'watercolor' }, music: 'bathroom', amb: { type: 'drip', vol: 0.08 },
    doors: [{ to: 'W056', look: 'mirror', label: 'a misted mirror' }, { to: 'W104', look: 'mirror', cond: { equipped: 'E21' }, label: 'the pocket mirror shows a city' }],
    decor: [{ look: 'mirror', n: 3, lines: ['A mirror. Misted up. Someone has written on it with a finger: “S”.', 'In the mirror, the bathroom carries on, on the other side. It carries on on this side too.'] }],
    npcs: [{ name: 'The Rubber Duck', look: { t: 'bird', c: ['#f0d030', 0, 0, '#e08020'], h: 10 }, behavior: 'wander', radius: 5, speed: 1, lines: ['Squeak. It floats on the dry tiles.'] }],
    place: [
      SOUL([EN('Keep the door open while you’re in the bath. That way you’ll hear if someone comes home.')]),
      SOUL([EN('Someone wrote an S on the mirror. When the steam comes back, the S is still there, waiting for the rest of the word.')]),
      SOUL([KS('물 너무 뜨겁게 하지 마. 엄마 없을 때는.', 'Don’t run the water too hot. Not when Mum’s not here.')])],
    info: { summary: 'A tiled bathroom that repeats in every direction.', rules: ['The world loops.', 'With the Pocket Mirror equipped, a mirror leads to the Mirror City (W104).'], lore: 'The evening bath, alone, with the door kept open.' } });

  /* W058 — L'Escalier de Penrose */
  S({ id: 'W058', name: 'The Penrose Stairs', depth: 3, tier: 'mid', back: 'W053', wrap: true, loop: true,
    map: (function () { var g = K.grid(26, 26, ' '); g.box(3, 3, 20, 20, '#', 's'); g.rect(7, 7, 12, 12, ' '); g.box(6, 6, 14, 14, '#', null); g.rect(7, 7, 12, 12, ' '); return g.rows(); })(),
    look: { stairs: { p: 'hstripes', c: ['#c8c0b0', '#9a9284'] }, wall: { p: 'stone', c: ['#d8d0c0', '#b8b0a0', '#8a8478'] } },
    style: { renderer: 'engraving' }, music: 'penrose', invertY: true, extra: { invertY: true },
    place: [{ id: 'bottom', type: 'sign', at: [12, 21], look: 'plaque', lines: ['A soul sitting on the last step, or the first.', EN('Down. Or up. It depends which side you came from.')] },
      SOUL([EN('I smiled on every step on the way down. By the bottom, nobody could tell.')]),
      SOUL([KS('괜찮아요, 괜찮아요. 계단이 안 끝나도 괜찮아요.', 'It’s all right, it’s all right. Even if the stairs never end, it’s all right.')]),
      SOUL([EN('Four flights. Not three, not five. The stairs count the way children do, on their fingers.')])],
    mech: [{ type: 'reach', zone: [10, 20, 14, 21], cond: { fn: function () { return /up/.test(YN.game.player.dir) && (YN.save.temp('penroseFlights') || 0) >= 3; } }, give: 'E55', failLine: 'You are at the bottom without having gone down. You have to go down looking up, four flights.', winLines: ['You went down four flights looking up. Your feet have understood something your head never will.'] },
      { type: 'laps', center: [12.5, 12.5], key: 'penroseFlights' }],
    npcs: [{ name: 'The Monk of the Stairs', count: 2, look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#6a5a4a', '#4a3a2a', '#d8b898', '#202020'] }), behavior: 'patrol', path: [[4, 4], [21, 4], [21, 21], [4, 21]], speed: 1, lines: ['He climbs. He keeps climbing. He is back in the same place.', EN('Here, looking up takes you down. Don’t ask why.')] }],
    info: { summary: 'A square staircase that climbs (or descends) without end; here, the body goes the opposite way to the eyes.', rules: ['Vertical controls reversed: you look up while going down.', 'Reaching the “BOTTOM” landing while looking up, after going round, gives the Reversed Step (E55).'], lore: 'Pretending to be fine: smiling all the way down.' } });

  /* W059 — La Cour d'immeuble */
  S({ id: 'W059', name: 'The Courtyard', depth: 3, tier: 'mid', back: 'W052', outdoor: true,
    map: (function () { var g = K.grid(30, 30, '%'); g.rect(4, 4, 22, 22, '.'); g.ellipse(15, 15, 3, 3, ','); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#5a5a5e'] }, floor2: { p: 'grass', c: ['#4a6a3a', '#3a5a2a', '#5a7a4a', '#2a4a1a'] }, wall2: { p: 'brick', c: ['#6a6a7a', '#4a4a5a', '#3a3a4a'], h: 2.6 } },
    style: { stars: true }, music: 'courtyard', dark: 0.65,
    place: [{ id: 'windows', type: 'sign', at: [15, 4], look: 'skylight', lines: ['A soul that flickers on and off, like the windows of the courtyard.', EN('Long, long. Short, long. Long, long. Short, long.'), EN('The windows say it every evening, patiently, like someone calling.')], cycle: false },
      SOUL([EN('I used to send signals from the fourth floor with a torch. Nobody answered. But the window opposite sometimes blinked.')]),
      SOUL([EN('At night the courtyard knows which windows have a child alone behind them. They are the ones that never go dark.')]),
      SOUL(['A soul hesitating, a hand on a light switch.', KS('불 끄고 자. …아니야, 켜 둬도 돼.', 'Turn off the light and sleep. …No, you can leave it on.')])],
    doors: [{ to: 'W060', look: 'door', opt: { style: 'red', c: ['#8a1a1a'], symbol: '▶' }, label: 'the cinema' }],
    effect: { id: 'E56', how: 'mech', mech: { type: 'sayTo', mark: 'windows', words: ['mama', 'mum', 'mummy', 'mom', 'eomma', '엄마'], dist: 30, winLines: ['You say the word out loud. Every window lights up at once, then only one keeps blinking, for you. Now you know how to answer.'], wrong: 'The windows carry on, patient.' } },
    npcs: [{ name: 'The Courtyard Keeper', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#5a6a5a', '#3a4a3a', '#e0c8b0', '#c8c8c8'], acc: 'broom' }), behavior: 'static', solid: true, lines: [EN('The windows talk in the evening. In light. Short, long. The old folks called it Morse.'), EN('If you understand, say it out loud. The windows only hear voices.')] }],
    info: { summary: 'A square courtyard surrounded by tall buildings; the windows blink a message.', rules: ['Reading the windows’ Morse (M-A-M-A) and saying it out loud gives the Morse (E56).'], lore: 'A child at her window, signalling with a torch.' } });

  /* W060 — Le Cinéma vide */
  S({ id: 'W060', name: 'The Empty Cinema', depth: 3, tier: 'mid', back: 'W059',
    map: (function () { var g = K.grid(32, 22, ' '); g.box(0, 0, 32, 22, '#', '.'); for (var y = 8; y < 20; y += 2) for (var x = 4; x < 28; x++) if (x !== 15 && x !== 16) g.set(x, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'carpet', c: ['#4a1a1a', '#3a0a0a'] }, wall: { p: 'flat', c: ['#1a0a0a', '#100606'], topColor: '#1a0a0a' }, wallface: { p: 'panel', c: ['#5a1a1a', '#4a0a0a', '#2a0505'], skirt: '#c8a040' } },
    tall: { '{': { look: 'chair', opt: { c: ['#8a2a2a'] } } }, style: { tallWalls: true }, music: 'cinema', dark: 0.85,
    place: [{ id: 'screen', type: 'decor', at: [16, 2], look: 'screen', light: 4, lookOpt: { frame: 0 } },
      SOUL([EN('In the reel, the suitcase is by the door in one frame and gone in the next. Nobody filmed him leaving.')]),
      SOUL([EN('Knock knock. — Who’s there? — …'), EN('The film always cuts before the punchline.')]),
      SOUL([EN('I watched the kitchen scene a thousand times. The woman never turns around. I still think that next time she will.')])],
    effect: { id: 'E57', how: 'mech', mech: { type: 'cycleFrames', mark: 'screen', every: 2.2, optKey: 'frame', good: 4, frames: ['On screen: a kitchen. A woman with her back turned.', 'On screen: a child in a corridor.', 'On screen: a suitcase by a door.', 'On screen: the suitcase is gone.', 'On screen: a door at the end of the corridor that wasn’t there.', 'On screen: the child looks at the camera.', 'On screen: static.'], winLines: ['You stop the film on the door. The film unspools from the screen all the way to you and winds itself around your wrist.'] } },
    doors: [{ to: 'W052', look: 'door', opt: { style: 'red' }, label: 'emergency exit' }],
    npcs: [{ name: 'The Projectionist', look: H({ head: 'eye', body: 'suit', c: ['#2a2a2a', '#1a1a1a', '#e0c0a0', '#f0e040'] }), behavior: 'static', solid: true, lines: [EN('The film plays on a loop. There is one frame where a door appears. If you stop it there, it stays.'), EN('I never learned how to stop a film. They pay me to keep it going.')] }, { name: 'A Sleeping Spectator', count: 2, look: H({ head: 'round', body: 'coat', eyes: 'closed' }), behavior: 'static', solid: true, lines: ['He sleeps through the film. He smiles at the kitchen scene.'] }],
    info: { summary: 'An empty cinema where a silent family film plays on a loop.', rules: ['Interacting with the screen on the frame with the door gives the Film Roll (E57).'], lore: 'The memories you replay over and over, hoping for a different ending.' } });
})(typeof window !== 'undefined' ? window : globalThis);
