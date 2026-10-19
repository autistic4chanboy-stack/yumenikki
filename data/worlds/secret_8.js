/* =========================================================================
 *  MONDES SECRETS (8/8) — W181 à W200
 *  Les deux seules entrées de la sixième couche (W181, W182), la sixième
 *  couche elle-même (W183–W190, W193), l'espace en caractères (W191),
 *  le train de 23h71 (W192) et les lieux retrouvés (W194–W200).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret, U = YN.util;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  function G() { return YN.game; }
  /* ajoute une porte dans un monde déjà défini (placée au hasard, puis rendue joignable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  var P5LOOK = { floor: { p: 'mosaic', c: ['#1a1030', '#2a1a48', '#3a2a60', '#100820', '#4a3a70'] }, wall: { p: 'flat', c: ['#05030a', '#0a0614'] } };

  /* ---------------------------------------------------------------
   *  W181 — Le Lit au fond de l'eau (entrée 1 de la sixième couche)
   * --------------------------------------------------------------- */
  S({ id: 'W181', name: 'The Bed at the Bottom of the Water', depth: 4, tier: 'hard', back: 'W090', backLook: 'hole', backLabel: 'back up to the surface', secretLevel: 5,
    gen: { type: 'cave', w: 44, h: 34, opts: { fill: 0.44, iter: 4 } },
    look: { floor: { p: 'sand', c: ['#1e3a56', '#16304a', '#284a68'] }, wall: { p: 'rock', c: ['#08141e', '#040a10', '#122230'] } },
    style: { renderer: 'watercolor', sky: ['#02060c', '#0a2030'] }, music: 'seabed', amb: { type: 'sea', vol: 0.09 }, dark: 0.6, weather: { dust: true },
    doors: [{ to: 'W183', look: 'bed', opt: { c: ['#dfe6f0', '#5a7aa0'] }, cond: { equipped: 'E77' }, label: 'the bed at the bottom', essential: true,
      locked: 'A bed, right at the bottom. The sheets ripple like seaweed. To lie down in it, she would have to breathe here. Slowly. Again.' }],
    decor: [{ look: 'coral', n: 6, lines: ['Pale coral. It grows on a sunken bedside table.'] },
      { look: 'shell', n: 4, lines: ['A shell. Inside, instead of the sea, there is the sound of a washing machine.', 'A closed shell. It does not want to be listened to.'] },
      { look: 'boat', n: 1, lines: ['A rowing boat lying on its side. On the hull, in chalk: “do not wake”.'] },
      { look: 'letter', n: 1, lines: ['A sodden letter. Only the end can still be read: “… and you, have you eaten properly?”'] }],
    npcs: [{ name: 'A Nightlight Jellyfish', count: 5, look: { t: 'jelly', c: ['rgba(180,210,255,0.75)'], h: 12, glow: '#a0c8ff' }, light: 1.8, behavior: 'fly', radius: 5, speed: 0.4, solid: false, lines: ['It pulses softly, like a nightlight someone forgot to switch off.'] },
      { name: 'The Deep-Sea Diver', look: H({ t: 'adult', head: 'helmet', body: 'coat', c: ['#8a7a5a', '#6a5a3a', '#c8b890', '#c0a060'] }), behavior: 'static', solid: true,
        lines: [EN('You don’t go deeper by swimming. You go deeper by breathing. Slowly. Again.'), EN('The bed has always been here. It isn’t a bed for sleeping. It’s a bed for remembering.'), { if: { equipped: 'E77' }, t: 'You breathe like me now. Go on. I’ll keep the surface.', lang: 'en' }] },
      { name: 'A Sleeping Fish', count: 2, look: { t: 'whale', c: ['#3a5a7a'], h: 22 }, behavior: 'swim', radius: 6, speed: 0.3, solid: false, lines: ['It sleeps with its eyes open. Fish do that. Some children too.'] }],
    place: [SOUL([EN('Under all the dreams there is water. Under the water, the oldest bed.')]),
      SOUL([EN('The washing machine runs at night. It is the only thing in the flat that works the night shift with her.')]),
      SOUL([EN('Breathe in. Hold it. The sea forgets you are here.')])],
    info: { summary: 'A midnight-blue seabed where, in the middle of the sand, a bed is waiting.', rules: ['Three lit lighthouses, or a real full moon, reveal the way from the Inner Sea.', 'The Diving Suit must be equipped to lie down in the bed.'], lore: 'One of only two entrances to the sixth layer.' } });

  /* ---------------------------------------------------------------
   *  W182 — La Chambre d'en bas (entrée 2 de la sixième couche)
   *  Tout est à l'envers. Le lit n'accepte que si la chambre d'en haut
   *  est l'inverse du dessin, si elle a pris le comprimé bleu et si le
   *  rêve affiche 8:00 restantes.
   * --------------------------------------------------------------- */
  S({ id: 'W182', name: 'The Room Below', depth: 4, tier: 'hard', back: 'W038', backLook: 'stairs', backLabel: 'back up to the cellar', backAt: [8, 10], secretLevel: 5,
    map: (function () { var g = K.grid(17, 12, ' '); g.box(0, 0, 17, 12, '#', '.'); g.rect(5, 4, 7, 4, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'wood', c: ['#8a7058', '#6a5440', '#9a806a'] }, floor2: { p: 'rug', c: ['#a8b8d0', '#90a0c0'] } }),
    style: { tallWalls: true, filter: 'invert(1) hue-rotate(180deg)' }, music: 'roomunder', amb: { type: 'hum', vol: 0.05 }, dark: 0.35,
    extra: { invertX: true, invertY: true },
    place: [
      { id: 'drawing', type: 'decor', at: [5, 1], look: 'drawing', lines: ['A felt-tip drawing, hung upside down: her bedroom. The lamp is on (yellow lines everywhere). The window is wide open (curtains flying). The door is shut (coloured in black, very hard).'] },
      { id: 'clock', type: 'decor', at: [12, 1], look: 'wallclock', lines: ['An alarm clock, upside down. It says 8:00. It ticks, without moving.'] },
      { id: 'lamp', type: 'decor', at: [14, 3], look: 'lamp', lines: ['A bedside lamp. Its light falls towards the ceiling.'] },
      { id: 'window', type: 'decor', at: [9, 1], look: 'window', lines: ['The window looks onto the bedroom above, seen from underneath. Someone is sleeping there.'] },
      { id: 'roomdoor', type: 'decor', at: [1, 6], look: 'door', lines: ['The bedroom door. The handle is at the top, too high.'] },
      { id: 'underbed', type: 'decor', at: [3, 8], look: 'toybox', lines: ['A box, under the bed, upside down. Inside, drawings for her mother. Not one was ever given.'], use: [{ secret: 'drawings_for_mother' }, { note: 'n_drawings_box' }] },
      { id: 'bed', type: 'door', to: 'W183', at: [3, 3], look: 'bed', lookOpt: { c: ['#e8e0f0', '#7a6aa0'] }, label: 'the bed below',
        cond: { all: [{ pill: true }, { roomLight: false }, { roomWindow: false }, { roomDoor: true }, { remainingGt: 479 }] },
        locked: 'The bed is cold. It is not expecting this. Not like this. Not now.' },
      SOUL([EN('Lamp off. Window shut. Door a little open. Down here, that is how a room says goodnight.')]),
      SOUL([EN('The drawings under the bed were all for her. Fourteen of them. None given.')]),
      SOUL([EN('Eight hours of dream still ahead, and the bed will listen.')])
    ],
    signs: [{ at: [8, 8], glyphs: 'everything is upside down even you', lines: [EN('Down here, you are the right way up. It is everything else that turned over.')] }],
    npcs: [{ name: 'The Reflection from Below', look: H({ t: 'kid', body: 'sweater', c: ['#c8b8e0', '#a898c0', '#f0e0f0', '#3a2a4a'], alpha: 0.55 }), behavior: 'mimic', solid: false,
        lines: [EN('You’re up there. I’m down here. We sleep at the same time.'), EN('When your lamp is on, mine is off. That’s how we see each other.'), EN('I drew the picture the right way up. You’re the one looking at it upside down.')] },
      { name: 'The Voice in the Ceiling', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 18,
        ambientLines: [EN('Has she taken her blue pill?'), KS('여덟 시간. 여덟 시간만 더 있으면 집에 가.', 'Eight hours. Just eight more hours and I go home.'), KS('문 조금 열어 둬. 들러 볼게.', 'Leave the door open a little. I’ll look in on you.'), KS('불 끄고 자.', 'Turn off the light and sleep.')] }],
    info: { summary: 'Sora’s bedroom, upside down, beneath the cellar of the apartment block.', rules: ['A blue pill and a visit to P3 are needed for the cellar stairs to go down.', 'The bed only opens if the bedroom above is the reverse of the drawing (lamp off, window shut, door ajar), with the blue pill, and at least 8:00 of dream remaining.'], secrets: ['The box under the bed: the drawings never given.'], lore: 'The other entrance to the sixth layer.' } });

  /* ---------------------------------------------------------------
   *  W183 — La Sixième Couche
   * --------------------------------------------------------------- */
  var BEDS = ['W184', 'W185', 'W186', 'W187', 'W188', 'W189', 'W190'];
  var bedAt = function (i) { var a = -Math.PI / 2 + i * Math.PI * 2 / 7; return [Math.round(20 + Math.cos(a) * 12), Math.round(20 + Math.sin(a) * 12)]; };
  var BEDCOL = [['#f0f0ff', '#ff60c0'], ['#f0f0ff', '#e0d8c0'], ['#f0f0ff', '#8090e0'], ['#f0f0ff', '#e0b060'], ['#f0f0ff', '#f0e0a0'], ['#ffffff', '#ffffff'], ['#f0f0ff', '#f0f080']];
  var BEDLBL = ['a bed with colourless sheets', 'a bed from before words', 'a cradle', 'a bed near a door', 'a baby’s cot, in the sun', 'a white bed, without a sound', 'a bed under a lit lamp'];
  S({ id: 'W183', name: 'The Sixth Layer', depth: 5, tier: 'extreme', region: 'P5', back: 'W181', backLook: 'bed', backOpt: { c: ['#dfe6f0', '#5a7aa0'] }, backLabel: 'the bed at the bottom of the water', backAt: [20, 36], secretLevel: 5,
    map: (function () { var g = K.grid(41, 41, ' '); g.ellipse(20, 20, 18, 18, '.'); g.ellipse(20, 20, 4, 4, ','); return g.rows(); })(),
    look: Object.assign({}, P5LOOK, { floor2: { p: 'marble', c: ['#d8d0f0', '#a898d0'] } }),
    style: { renderer: 'psychedelic', stars: true, sky: ['#05030a', '#1a1030'], cliffH: 0.4, cliff: '#0a0614' }, music: 'sixthlayer', amb: { type: 'choir', vol: 0.04 }, dark: 0.45,
    doors: BEDS.map(function (id, i) { return { to: id, at: bedAt(i), look: 'bed', opt: { c: BEDCOL[i] }, label: BEDLBL[i] }; })
      .concat([{ to: 'W182', at: [20, 4], look: 'bed', opt: { c: ['#e8e0f0', '#7a6aa0'] }, label: 'the bed below' },
        { to: 'W193', at: [20, 20], look: 'bed', opt: { c: ['#ffffff', '#c8b8ff'] }, cond: { visited: BEDS }, label: 'the middle bed', locked: 'The middle bed is made with tight corners. It is waiting for the other seven to be slept in.' }]),
    signs: [{ at: [20, 25], glyphs: 'here we no longer dream we remember', lines: [EN('Here, everything is true. Once.')] }],
    place: [SOUL([EN('Before the train. Before the garden. Before you.')]),
      SOUL([KN('옥순아… 거기 있니?', 'Ok-sun… are you there?')]),
      SOUL([KS('엄마…', 'Mum…')]),
      SOUL([EN('Seven beds, one family. Someone slept in each of them before you.')]),
      SOUL([EN('Down here, memories keep the light on by themselves.')])],
    npcs: [{ name: 'The Keeper of Beds', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#3a2a5a', '#2a1a4a', '#d8c8f0', '#c8b8ff'], eyes: 'closed' }), behavior: 'patrol', path: [[14, 14], [26, 14], [26, 26], [14, 26]], speed: 0.35, solid: true,
        lines: [EN('Seven beds. Seven sleeps. You don’t choose the order.'), EN('Here, we don’t dream anymore. We remember. It’s heavier, but it keeps you warm.'), EN('The bed in the middle can only be unmade once. After that, there is no more down.')] },
      { name: 'A Sleeper', count: 4, look: ghost('rgba(200,190,255,0.45)', 18), behavior: 'statue', solid: false, lines: ['He sleeps, floating. He is smiling at something very old.', 'She sleeps curled up. Her lips are counting something: visits.'] }],
    info: { summary: 'A circle of seven beds under a violet sky, around an eighth.', rules: ['The only ways in are the Bed at the Bottom of the Water and the Room Below.', 'The middle bed (W193) waits until the other seven have been slept in.'], lore: 'Lower than dreams: memories.' } });

  /* W184 — Les Couleurs sans nom */
  var COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'violet', 'orange', 'gold', 'silver', '빨강', '파랑', '초록', '노랑', '검정', '하양',
    'grey', 'gray', 'brown', '보라', '주황', '회색', '분홍', '갈색', '빨간색', '파란색', '초록색', '노란색', '검은색', '흰색', '보라색'];
  S({ id: 'W184', name: 'The Nameless Colours', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[0] }, backLabel: 'back to the beds',
    gen: { type: 'cave', w: 44, h: 34, shifting: true, opts: { fill: 0.36, iter: 4 } }, look: { floor: { p: 'mosaic', c: ['#ff40a0', '#40e0c0', '#f0f040', '#8040ff', '#ff8040'] }, wall: { p: 'flat', c: ['#100818', '#080410'] } },
    extra: { styles: [{ renderer: 'psychedelic' }, { renderer: 'psychedelic', filter: 'hue-rotate(72deg)' }, { renderer: 'psychedelic', filter: 'hue-rotate(144deg)' }, { renderer: 'psychedelic', filter: 'hue-rotate(216deg)' }, { renderer: 'psychedelic', filter: 'hue-rotate(288deg)' }] },
    mech: [{ type: 'shifting', every: 15 }], music: 'namelesscolors2', amb: { type: 'glass', vol: 0.04 },
    npcs: [{ name: 'The Eyeless Painter', look: H({ t: 'tall', head: 'hollow', body: 'robe', c: ['#e8e0f0', '#c8c0d8', '#f0e8f8', '#000000'], acc: 'needle' }), behavior: 'static', solid: true, hearDist: 5,
        lines: [EN('Tell me a colour. Not one that exists. One that is missing.'), EN('All the ones that have a name have worn out from being said.')],
        hears: [{ match: COLORS, lines: [EN('That one already has a name. It wears out, with use. Another one.')] },
          { any: true, lines: ['He dips his brush in the word you have just said. The ground turns a colour nobody had ever seen.', EN('…Yes. That one. Nobody had said it yet. It’s yours.')], do: [{ secret: 'color_unnamed' }, { note: 'n_color_unnamed' }, { sfx: 'reveal' }] }] },
      { name: 'A Blot Afraid of Being Named', count: 5, look: { t: 'blob', c: ['#40e0c0'], h: 12 }, behavior: 'shy', shyDist: 4, radius: 5, speed: 1.4, solid: false, lines: ['It changes colour as soon as you look at it for too long.'] }],
    place: [SOUL([EN('Blue-before-sleep.')]),
      SOUL([EN('Her grandmother had a word for this one. It went with her.')]),
      SOUL([KS('이 색… 이름이 없어.', 'This colour… has no name.')])],
    info: { summary: 'A maze of impossible colours that rearranges itself every fifteen seconds.', rules: ['Shifting dream.', 'The painter is waiting for a word that is not a known colour.'], lore: 'The world as seen before learning to cut it up into words.' } });

  /* W185 — Avant les mots */
  S({ id: 'W185', name: 'Before Words', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[1] }, backLabel: 'back to the beds', outdoor: true,
    gen: { type: 'empty', w: 46, h: 36, opts: { floor: '.', decor: 'o', decorRate: 0.02 } }, look: { floor: { p: 'meadow', c: ['#e8dcc0', '#dcd0b0', '#f0e4c8', '#d0c4a0'] } }, tall: { o: { look: 'glyphstone' } },
    style: { renderer: 'watercolor', sky: ['#f8f0e0', '#fff8f0'] }, music: 'beforewords', amb: { type: 'wind', vol: 0.03 },
    signs: [{ glyphs: 'ma', lines: ['It is the size of a toddler.', EN('ma. ma.')] }, { glyphs: 'ba', lines: [KS('바… 밥.', 'Ba… rice.')] }, { glyphs: 'warm', lines: [EN('warm.')] }, { glyphs: 'light', lines: [EN('light. on. light. on.')] }, { glyphs: 'again', lines: ['It is worn smooth, as if it had been touched a great deal.', EN('again. again. again.')] }],
    place: [SOUL([EN('Milk. Soap. Her.')]),
      SOUL([KS('맘마 먹자.', 'Time for num-nums.')]),
      SOUL([EN('Before words, nobody could tell you to be quiet.')])],
    npcs: [{ name: 'A Toddler', look: H({ t: 'kid', head: 'round', body: 'sweater', c: ['#f0d0d8', '#e0b0c0', '#f8e0d0', '#3a2a2a'], h: 14, eyes: 'wide', mouth: 'o' }), behavior: 'wander', radius: 3, speed: 0.6, hearDist: 4,
        lines: [EN('ba.'), EN('… ba. ba.'), 'He holds out his arms to you, then forgets why, and looks at a light.'],
        hears: [{ match: ['mummy', '엄마', 'eomma', 'mama', 'ma', 'mom', 'mommy', 'mum', 'umma', 'momma'], lines: ['The toddler stops.', EN('mmm… ma.'), 'Then he laughs, very loudly, at himself.', 'It is his first word. He will not remember it. You will.'], do: [{ secret: 'first_word' }, { note: 'n_first_word' }] },
          { any: true, lines: ['The toddler listens to the shape of the sound. Words have no meaning here yet. Only warmth.'] }] },
      { name: 'A Soft Shape', count: 4, look: ghost('rgba(255,230,200,0.5)', 24), behavior: 'wander', radius: 6, speed: 0.4, solid: false, lines: ['A shape that smells of warm milk and soap. It has no face, only a voice.', 'A shape that hums. No words yet.'] }],
    info: { summary: 'A cream-coloured plain scattered with stones carved with very simple signs.', rules: ['Here, words have no meaning yet.'], lore: 'The time before language, when everything fitted into “ma” and “again”.' } });

  /* W186 — La Berceuse */
  S({ id: 'W186', name: 'The Lullaby', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[2] }, backLabel: 'back to the beds',
    map: (function () { var g = K.grid(24, 20, ' '); g.box(0, 0, 24, 20, '#', '.'); g.ellipse(11.5, 10, 6, 5, ','); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#2a2440', '#201a34', '#342e4a'] }, floor2: { p: 'rug', c: ['#3a3460', '#4a4470'] }, wall: { p: 'flat', c: ['#0a0818', '#06040e'], topColor: '#0a0818' }, wallface: { p: 'wallpaper', c: ['#2a2a50', '#20204a', '#e0d890'], skirt: '#101020' } },
    style: { tallWalls: true, stars: true }, music: 'lullaby', amb: { type: 'musicbox', vol: 0.05 }, dark: 0.7,
    place: [{ id: 'crib', type: 'decor', at: [11, 9], look: 'bed', lookOpt: { c: ['#f0e8d0', '#a0a8e0'] }, lines: ['A cradle. Inside, a blanket that has kept the shape of someone very small.'],
        listen: [{ match: ['자장자장', '자장 자장', 'jajang', 'jajangjajang', 'lullaby', '자장가', 'hush little baby', 'rock a bye', 'rockabye'], lines: ['You hum. The star mobile begins to turn. Another voice, tired, very soft, joins in with you:', KS('자장자장 우리 아기…', 'Hush-a-bye, my little one…'), 'Then the voice stops. She has fallen asleep before the end, as always.'], do: [{ secret: 'lullaby_sung' }, { note: 'n_lullaby' }, { music: 'lullaby' }] }] },
      { id: 'musicbox', type: 'decor', at: [6, 4], look: 'musicbox', lines: ['A music box. The dancer has been replaced by a little plastic nurse.'] },
      SOUL([EN('Two hours. She asked for two hours. She got forty minutes.')]),
      SOUL([KS('우리 아기 잘도 잔다…', 'My baby sleeps so well…')]),
      SOUL([EN('The nurse in the box keeps dancing. Somebody has to.')])],
    npcs: [{ name: 'The Star Mobile', count: 5, look: { t: 'jelly', c: ['#f0e890'], h: 8, glow: '#f0e890' }, light: 1.4, behavior: 'orbit', center: [11.5, 9], radius: 3, speed: 0.5, solid: false, lines: ['A felt star, hanging from nothing.'] },
      { name: 'The Humming Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 15,
        ambientLines: ['Someone is humming, without words, in another room.', KS('자장자장…', 'Hush-a-bye…'), KS('두 시간만 자야 돼. 딱 두 시간만.', 'I have to sleep for two hours. Just two hours.')] }],
    signs: [{ at: [17, 15], glyphs: 'sing it before she does', lines: [EN('Before her. Sing.')] }],
    info: { summary: 'A midnight-blue nursery: a cradle, a star mobile.', rules: ['Sing the lullaby near the cradle.'], lore: 'The lullabies sung by a mother who falls asleep before her child.' } });

  /* W187 — La Voix de la mère */
  S({ id: 'W187', name: 'The Mother’s Voice', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[3] }, backLabel: 'back to the beds', backAt: [1, 2],
    map: (function () { var g = K.grid(62, 5, ' '); g.box(0, 0, 62, 5, '#', '.'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#4a3a2a', '#3a2a1a', '#5a4a3a'] }, wall: { p: 'flat', c: ['#14100c', '#0a0806'], topColor: '#14100c' }, wallface: { p: 'wallpaper', c: ['#6a5a48', '#5a4a38', '#3a2a1a'], skirt: '#2a1a10' } },
    style: { tallWalls: true }, music: null, amb: { type: 'hum', vol: 0.06 }, dark: 0.92, playerLight: 0.6,
    place: [{ id: 'enddoor', type: 'decor', at: [60, 2], look: 'door', lookOpt: { style: 'wood', c: ['#6a5a3a'] }, light: 2.2, lines: ['A door. A line of light underneath. On the other side, someone is breathing, sitting down.', 'It does not open from here. It will open from above, one day, if someone speaks.'] },
      { id: 'photo', type: 'decor', at: [30, 1], look: 'photo', lookOpt: { person: true }, lines: ['A photo on the wall: a young nurse, laughing on a hospital roof. On the back: “1st night shift. 2008.”'] },
      { id: 'coat', type: 'decor', at: [45, 1], look: 'clothesline', lines: ['A uniform tunic, hanging up. In the pocket, a list: “milk — rice — call Sora — sleep”.'] },
      SOUL([KS('일곱 시. 일곱 시에 갈게.', 'Seven o’clock. I’ll be there at seven.')]),
      SOUL([EN('A line of light under a door is a voice too.')]),
      SOUL([KS('엄마도 엄마가 보고 싶어.', 'Mum misses her mum too.')]),
      SOUL([EN('She sits on the other side every night. She does not knock either.')]),
      SOUL([EN('Say the word. Only the first word.')])],
    npcs: [{ name: 'Behind the Door', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 8, ambientEvery: 12,
      ambientLines: [KS('…네, 일곱 시에 끝나요…', '…yes, I finish at seven…'), KS('…자는 것 같아요. 불을 못 켜겠어요.', '…I think she’s asleep. I can’t bring myself to turn the light on.'), KS('미안해…', 'I’m sorry…'), KS('너무 피곤해서, 피곤한 건지도 모르겠어.', 'I’m so tired I can’t even tell if I’m tired.')],
      hears: [{ match: ['mummy', '엄마', 'eomma', 'mom', 'mama', 'momma', 'mommy', 'mum', 'mother', '어머니'], lines: ['The breathing stops, behind the door.', KS('…응. 엄마 여기 있어.', '…Yes. Mum’s here.'), 'The voice is tired. It is there all the same. It says it again, more quietly, as if to itself:', KS('여기 있어.', 'I’m here.')], do: [{ setNow: { heard_mother: true } }, { note: 'n_voice_mother' }, { secret: 'mother_voice' }] },
        { match: ['love you mum', 'saranghae', '사랑해', 'i love you', 'love you', '사랑해요'], lines: ['A long silence. Then a very small laugh, wet with tears.', KS('나도. 나도.', 'Me too. Me too.')], do: [{ secret: 'mother_love' }] },
        { any: true, lines: ['On the other side, someone is listening. But it is not the word she is waiting for.'] }] }],
    info: { summary: 'A very long, almost black corridor, with a door at the end and light underneath.', rules: ['You have to speak to the door.'], secrets: ['What she hears here counts for the bedroom door, awake.'], lore: 'The mother’s voice, heard through a door, at last.' } });

  /* W188 — Le Premier souvenir */
  S({ id: 'W188', name: 'The First Memory', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[4] }, backLabel: 'back to the beds',
    map: (function () { var g = K.grid(22, 16, ' '); g.box(0, 0, 22, 16, '#', '.'); g.rect(7, 5, 8, 6, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'wood', c: ['#e8c890', '#d8b880', '#f0d8a0'] }, floor2: { p: 'rug', c: ['#f0e0c0', '#e8d0b0'] } }),
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'firstmemory', amb: { type: 'birds', vol: 0.04 },
    place: [{ id: 'crib', type: 'decor', at: [10, 7], look: 'bed', lookOpt: { c: ['#ffffff', '#f0c0c0'] }, lines: ['A baby’s cot, in the sun. You know, without knowing how, that it is yours.'] },
      { id: 'suitcase', type: 'decor', at: [19, 13], look: 'suitcase', lines: ['A suitcase by the door. Marked “J.”. It is closed. It is ready.'] },
      { id: 'window', type: 'decor', at: [11, 1], look: 'window', light: 3, lines: ['Sunday sunlight. The dust is dancing. It is the oldest light you remember.'] },
      SOUL([EN('Sunday. Dust. Laughter. That is the whole memory.')]),
      SOUL([EN('Knock knock.')]),
      SOUL([KS('소라야, 엄마 봐.', 'Sora, look at Mummy.')]),
      SOUL([EN('The suitcase was packed before you could walk.')]),
      SOUL([KS('이 웃음, 꼭 기억해 둬.', 'This laugh — be sure to remember it.')])],
    npcs: [{ name: 'A Laughing Young Woman', look: H({ t: 'adult', hairStyle: 'long', body: 'sweater', c: ['#f0c8a0', '#e0b890', '#f0d0b0', '#2a1a10'], mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [KS('봐! 눈으로 불빛을 따라가!', 'Look! She’s following the light with her eyes!'), 'She laughs. You have never heard her laugh like that. Or yes: once. Here.', KS('우리 소라, 잘 잤어?', 'My Sora, did you sleep well?')], do: [{ secret: 'first_memory' }] },
      { name: 'A Blurred Man', look: H({ t: 'adult', body: 'coat', c: ['#6a6a7a', '#4a4a5a', '#d0c0b0', '#1a1a1a'], alpha: 0.4, eyes: 'none', acc: 'suitcase' }), behavior: 'static', solid: false,
        lines: [{ seq: ['He is blurred, like a shaken photo.', EN('I’ll be right back.')] }, 'He looks at his watch. The watch still has its hands.'] }],
    info: { summary: 'A sunlit bedroom, on a Sunday: a baby’s cot, a laughing young woman, a packed suitcase.', lore: 'The first memory: the mother who laughed, the father already almost gone.' } });

  /* W189 — Le Silence */
  S({ id: 'W189', name: 'Silence', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[5] }, backLabel: 'back to the beds', outdoor: true,
    gen: { type: 'empty', w: 50, h: 40, opts: { floor: '.' } }, look: { floor: { p: 'flat', c: ['#f4f4f4', '#ececec'] } },
    style: { sky: ['#ffffff', '#ffffff'] }, music: null, amb: null,
    place: [{ id: 'center', type: 'decor', at: [25, 20], look: 'sparkle', lookOpt: { c: ['#e0e0e0'] }, solid: false, lines: ['Here, even your footsteps make no sound.'] },
      SOUL([EN('Here, silence is not a rule.')]),
      SOUL([EN('They called her the mute one. She was only keeping her words for later.')])],
    mech: [{ type: 'standStill', mark: 'center', secs: 40, flag: 'silence_heard', winLines: ['You stop moving. You say nothing. For a long time.', 'The silence asks nothing of you. For once, there is nobody you must not wake.', { t: 'You have the right to stay silent. You also have the right to speak. Both are yours.', lang: 'en', who: '' }], reward: [{ secret: 'silence_heard' }, { note: 'n_silence' }] }],
    npcs: [],
    info: { summary: 'A white expanse, without a single sound.', rules: ['Stay still in the centre, for a long time.'], lore: 'Silence imposed, and silence chosen.' } });

  /* W190 — La Chambre allumée */
  YN.defDialogue('mother190', {
    who: 'A Silhouette',
    branches: [
      { if: { temp: { w190_off: true } }, lines: ['The silhouette is gone. The blanket is still warm.'] },
      { lines: ['A silhouette, in the doorway. She whispers:', KS('소라야… 자니?', 'Sora… are you asleep?')],
        choices: [{ t: 'Pretend to sleep', lines: ['You close your eyes. Footsteps, very soft. A blanket pulled up. Click.', 'The light goes out. For the first time, you are not the one who turned it off.'], do: [{ temp: { w190_off: true } }, { sfx: 'switch' }, { secret: 'light_off_by_mother' }, { note: 'n_light_off' }, { fn: function () { G().rebuildWorld(); } }] },
          { t: '“No.”', lines: ['The silhouette stops. She does not know what to do with this no. She stays. She sits on the edge of the bed, without a word, until you pretend to sleep anyway.'], do: [{ setNow: { heard_mother: true } }] }] }
    ]
  });
  S({ id: 'W190', name: 'The Lit Bedroom', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'bed', backOpt: { c: BEDCOL[6] }, backLabel: 'back to the beds', backAt: [13, 9],
    map: (function () { var g = K.grid(17, 12, ' '); g.box(0, 0, 17, 12, '#', '.'); g.rect(5, 4, 7, 4, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'wood', c: ['#c8a880', '#b89870', '#d8b890'] }, floor2: { p: 'rug', c: ['#e8d8b0', '#d8c8a0'] } }),
    style: { tallWalls: true }, music: 'litroom', amb: { type: 'hum', vol: 0.05 }, playerLight: 0,
    variants: { off: { cond: { temp: { w190_off: true } }, dark: 0.93, music: 'lullaby', place: [{ id: 'blanket', type: 'decor', at: [4, 5], look: 'blanketlump', lines: ['Someone has laid a second blanket on the bed. It smells of washing powder and hospital.'] }] } },
    place: [{ id: 'lamp', type: 'decor', at: [14, 2], look: 'lamp', light: 5, lines: ['The lamp. It has always been on, here. Nobody has ever come to turn it off.'] },
      { id: 'bed', type: 'decor', at: [3, 3], look: 'bed', lookOpt: { c: ['#f0f0f8', '#a0b0d0'] }, lines: ['Her bed. She sits on it. She is waiting for something, without knowing what.'] },
      SOUL([EN('Every night the light waits for someone else’s hand.')]),
      SOUL([KS('불 꺼 줄게. 자.', 'I’ll turn off the light for you. Sleep.')]),
      SOUL([EN('Pretending to sleep is also a way of being tucked in.')])],
    npcList: [],
    npcs: [{ name: 'A Silhouette', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#2a1a10'], alpha: 0.7, eyes: 'closed' }), behavior: 'static', solid: true, at: [1, 6], dialog: 'mother190' }],
    info: { summary: 'Sora’s bedroom, light on; a silhouette appears in the doorway.', rules: ['Pretend to sleep: someone turns off the light.'], lore: 'What she waits for every night: for someone else to turn off the light.' } });

  /* ---------------------------------------------------------------
   *  W191 — L'Espace en caractères (mode debug : « set 68 » devant un mur)
   *  Fin IV : y écrire (ou dire) le mot FIN.
   * --------------------------------------------------------------- */
  S({ id: 'W191', name: '▒▒▒▒▒▒', depth: 5, tier: 'extreme', region: 'P?', back: 'NEXUS', backLook: 'door', backLabel: 'D', backAt: [2, 2], secretLevel: 5, cookie: false,
    map: (function () { var g = K.grid(40, 20, ' '); g.box(0, 0, 40, 20, '#', '.'); for (var x = 4; x < 36; x += 4) g.set(x, 10, '|'); return g.rows(); })(),
    look: { floor: { p: 'grid', c: ['#000000', '#0a3a0a'] }, wall: { p: 'flat', c: ['#30ff60', '#10a030'] } }, music: null, amb: { type: 'hum', vol: 0.03 },
    extra: { debugWorld: true, asciiOnly: true, asciiText: [{ x: 6, y: 3, text: 'THIS IS NOT A DREAM' }, { x: 6, y: 5, text: 'THIS IS WHERE THEY ARE WRITTEN' }, { x: 6, y: 14, text: 'ONE WORD IS MISSING AT THE END' }, { x: 6, y: 16, text: '> _' }] },
    npcs: [{ name: '?', ascii: '?', look: { t: 'voice' }, kind: 'voice', invisible: true, behavior: 'static', hearDist: 50, ambientEvery: 20, ambientLines: [EN('> she is still asleep'), EN('> 200 worlds. 90 effects. 1 lamp.'), EN('> who counts the visits?')] }],
    info: { summary: '█████', rules: ['Only reachable in character mode.'], secrets: ['Write END.'], lore: '█████' } });
  var asciiByUs = false;
  YN.bus.on('worldEnter', function (rt) {
    if (!rt || !YN.debug) return;
    if (rt.id === 'W191') { if (!YN.debug.ascii) { YN.debug.toggleAscii(true); asciiByUs = true; } }
    else if (asciiByUs) { asciiByUs = false; if (YN.debug.ascii) YN.debug.toggleAscii(false); }
  });
  function finIV(v) {
    var g = G(); if (!g || !g.rt || g.rt.id !== 'W191') return false;
    if (U.norm(v) !== 'fin' && U.norm(v) !== 'the end' && U.norm(v) !== 'end' && U.norm(v) !== '끝') return false;
    setTimeout(function () { g.ending('IV'); }, 900);
    return true;
  }
  YN.bus.on('write', finIV);
  YN.bus.on('boot', function () { YN.speech.listen(function (n, raw) { return finIV(raw); }); });
  if (YN.data.worlds.NEXUS) YN.data.worlds.NEXUS.links = (YN.data.worlds.NEXUS.links || []).concat([{ to: 'W191', debugOnly: true, kind: 'debug', note: 'set 68 facing a wall, in character mode' }]);

  /* ---------------------------------------------------------------
   *  W192 — Le Train de 23h71 (fin de la quête Q01)
   * --------------------------------------------------------------- */
  YN.defDialogue('ahn_train', {
    who: 'Mr. Ahn',
    branches: [
      { if: { effect: 'E38' }, lines: ['He looks out of the window.', KN('다음 역에서 내리겠습니다. 이쪽에서요. 고맙습니다, 아가씨.', 'I will get off at the next stop. On this side. Thank you, young lady.')] },
      { if: { quest: { Q01: 'gone' } }, lines: ['His seat is empty. On it, his shoes, well polished, side by side.'] },
      { once: 'aboard', lines: [KN('아… 아가씨도 이 렬차를 타셨군요.', 'Ah… so you caught this train too, young lady.'), KN('23시 71분. 드디어 왔습니다. 아주 많이 늦었습니다. 그래도 제시간입니다.', '23:71. It has come at last. It is very, very late. And yet it is on time.'), KN('북쪽으로 갑니다. 1951년으로 갑니다.', 'It is going north. It is going to 1951.'), 'He points at the window: snow, and people walking the other way.'], do: [{ quest: { Q01: 'aboard' } }] },
      { if: { questLog: { Q01: 'witness' } }, lines: [KN('저에게 하실 말씀이 있으신 것 같습니다.', 'You look as if you have something to tell me.'), 'He waits, hands on his knees, the way one waits for a train.'],
        choices: [{ t: '“She grew up. She watered a garden all her life.”', lines: ['He says nothing for three stations.', KN('컸다…', 'Grew up…'), 'He tries the word on, like a new shoe.', KN('그렇다면 그 아이에게는 제가 도착할 필요가 없었군요. 한 번도 없었습니다. 그 아이에게 필요했던 건, 누군가 곁에 남아 주는 것이었습니다.', 'Then she never needed me to arrive. Not once. What she needed was someone to stay beside her.'), 'He unhooks his watch and holds it out to you. The hands have fallen into his palm.', KN('저도 남겠습니다. 승강장이 아니라, 여기에. 이 세기에.', 'I will stay too. Not on the platform. Here. In this century.')], do: [{ give: 'E38' }, { quest: { Q01: 'stay' } }, { set: { ahn_stayed: true } }, { rel: { N002: 3 } }] },
          { t: '“She’s still waiting for you.”', lines: ['His face lights up, terribly.', KN('그럼 저는 내리지 않겠습니다.', 'Then I will not get off.'), 'He sits back down, upright, hands on his knees. The train speeds up.'], do: [{ quest: { Q01: 'gone' } }] },
          { t: 'Say nothing.', lines: ['He nods, as if the silence were an answer all the same.'] }] },
      { if: { item: { shoe: 1 } }, lines: ['He sees the shoe.', KN('옥순이… 그 아이가 어떻게 되었는지 아십니까? 누군가는 그 아이가 크는 것을 보았겠지요. 저는 못 보았습니다.', 'Ok-sun… do you know what became of her? Someone must have watched her grow up. I did not.'), 'Someone, somewhere in the south, saw the little girl on the platform. That someone has to be found.'] },
      { lines: [KN('이 렬차는 북쪽으로 갑니다. 아무도 내리지 않습니다. 다음 역은 이제 없다고들 합니다.', 'This train goes north. Nobody gets off. They say the next station no longer exists.')] }
    ]
  });
  S({ id: 'W192', name: 'The 23:71 Train', depth: 4, tier: 'hard', back: 'W082', backLook: 'train', backOpt: { c: ['#2a2a3a', '#e8c040'] }, backLabel: 'get off onto the platform', backAt: [2, 2],
    map: K.corridor(52, 3, '#', '.'),
    look: { floor: { p: 'hstripes', c: ['#5a3a2a', '#4a2a1a'] }, wall: { p: 'flat', c: ['#1a120c', '#100a06'], topColor: '#1a120c' }, wallface: { p: 'panel', c: ['#7a5a3a', '#6a4a2a', '#3a2a1a'], skirt: '#2a1a0a' } },
    style: { tallWalls: true, renderer: 'sepia' }, music: 'train2371', amb: { type: 'train', vol: 0.12 }, dark: 0.35,
    doors: [{ to: 'W197', at: [50, 2], look: 'door', opt: { style: 'metal', c: ['#6a5a4a'] }, label: 'the gangway to the next carriage', cond: { quest: { Q01: ['stay', 'gone'] } }, locked: 'The door to the next carriage will not open. The inspector shakes his head and points at the passengers, one by one: each of them must choose their station first.' }],
    decor: [{ look: 'trainseat', n: 8, lines: ['A worn velvet seat. The shape of someone is still in it.'] },
      { look: 'window', n: 5, lines: ['Outside, it is 1951. People walk through the snow, southwards, with mattresses on their backs.', 'Outside, a station goes by without stopping. The sign says: “23:71”.', 'Outside, nothing. Then a field of rice paddies under the moon.'] }],
    npcs: [{ id: 'N002B', name: 'Mr. Ahn', major: false, world: 'W192', look: H({ t: 'old', body: 'coat', c: ['#2e3448', '#20263a', '#e8c8a8', '#202030'], eyes: 'closed', acc: 'ticket' }), behavior: 'static', solid: true, at: [26, 2], dialog: 'ahn_train', info: { role: 'End of Q01: stay or go on.' } },
      { name: 'The Faceless Inspector', look: H({ t: 'tall', head: 'blank', body: 'uniform', c: ['#2a2a3a', '#1a1a2a', '#d8c8b0', '#000000'], acc: 'ticket' }), behavior: 'patrol', path: [[6, 2], [46, 2]], speed: 0.5, solid: true,
        lines: [{ seq: [EN('Tickets, please.'), 'He punches your ticket. The hole is the shape of an hour that does not exist.'] }, EN('Everyone gets off at their own station. Some don’t get off. We don’t judge them.')] },
      { name: 'A Sleeping Family', count: 2, look: H({ t: 'adult', body: 'coat', c: ['#4a4a3a', '#3a3a2a', '#e0c0a0', '#202020'], eyes: 'closed' }), behavior: 'statue', solid: true, lines: ['They sleep huddled together, luggage on their knees. They are going to a house that no longer exists.'] }],
    place: [SOUL(['A child’s voice, on a platform, in 1951.', KN('오빠, 신발! 내 신발!', 'Big brother, my shoe! My shoe!')]),
      SOUL([KN('다음 렬차로 꼭 오마. 약속한다.', 'I will come on the next train, for certain. I promise.')]),
      SOUL([EN('The 23:71 only runs for those who have waited long enough to stop asking when.')]),
      SOUL([KN('일없습니다. 저는 서서 가도 됩니다.', 'It is nothing. I can travel standing.')]),
      SOUL([EN('He polished his shoes every night for seventy years. For the arrival.')])],
    info: { summary: 'The 23:71 train, arrived at last: a long sepia carriage rolling towards 1951.', rules: ['You can only board between 23:00 and midnight, real time, from the platform beneath the station.', 'What you say to Mr. Ahn decides his station.'], time: ['Real time, 23:00–23:59.'], lore: 'The last passenger, and the choice to stay.' } });

  /* ---------------------------------------------------------------
   *  W193 — Le Dernier Lit (Fin III)
   * --------------------------------------------------------------- */
  S({ id: 'W193', name: 'The Last Bed', depth: 5, tier: 'extreme', region: 'P5', back: 'W183', backLook: 'stairs', backLabel: 'back up to the seven beds', backAt: [12, 22], secretLevel: 5,
    map: (function () { var g = K.grid(25, 25, ' '); g.ellipse(12, 12, 11, 11, '.'); return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#f0ecf8', '#c8c0e0'] } }, style: { renderer: 'watercolor', stars: true, sky: ['#0a0618', '#1a1030'], cliffH: 1.2, cliff: '#05030a' },
    music: 'lastbed', amb: { type: 'choir', vol: 0.03 },
    place: [{ id: 'lastbed', type: 'decor', at: [12, 11], look: 'bed', lookOpt: { c: ['#ffffff', '#c8b8ff'] }, light: 3, lines: ['The last bed. The sheets are cold and clean.'],
      use: [{ fn: function () { YN.ui.dialog.queue([{ t: 'The sheets are turned back. There is nothing underneath any more.' }, { t: 'Lie down again?' }], {}, function () { YN.ui.dialog.choose(['Lie down again', 'Go back up'], function (i) { if (i === 0) G().ending('III'); }); }); } }] },
      SOUL([EN('Clean sheets. Cold. Nobody has slept here yet. Nobody has to.')]),
      SOUL([EN('Up there, someone is making breakfast.')]),
      SOUL([KS('소라야, 일어나. 아침이야.', 'Sora, get up. It’s morning.')])],
    signs: [{ at: [12, 16], glyphs: 'below this there is no more below', lines: [EN('Lower than this, there is only sleep.')] }],
    npcs: [{ name: 'She Who Counts', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#c8b8ff', '#a898e0', '#f0e8ff', '#000000'], eyes: 'closed', acc: 'clipboard' }), behavior: 'static', solid: true, at: [16, 11],
      lines: [EN('Two hundred worlds. I counted them all. How many have you seen?'), { t: function () { var n = YN.save.perm.stats.dreams, v = U.keys(YN.save.perm.worlds || {}).length; return { t: n + ' nights. ' + v + ' places. I count your visits too. Somebody has to.', lang: 'en' }; } }, EN('If you lie down here, you don’t go back up straight away. It isn’t a punishment. It’s another kind of sleep.')] }],
    info: { summary: 'An island of white marble among the stars, and a single bed.', rules: ['You can only enter after sleeping in all seven beds of the sixth layer.'], lore: 'The sixth sleep. Ending III.' } });

  /* ---------------------------------------------------------------
   *  W194–W200 — Les lieux retrouvés
   * --------------------------------------------------------------- */
  /* W194 — Le Jardin d'Ok-sun, 1952 */
  S({ id: 'W194', name: 'Ok-sun’s Garden, 1952', depth: 4, tier: 'hard', back: 'W159', backLook: 'statue', backLabel: 'the statue', outdoor: true,
    gen: { type: 'forest', w: 44, h: 34, opts: { density: 0.06, grass: '*' } }, look: { floor: { p: 'grass', c: ['#8aa860', '#7a9850', '#9ab870', '#6a8840'] }, flowers: { p: 'flowers', c: ['#f0e0a0', '#e0a0a0', '#ffffff', '#c0a0e0'] } },
    tall: { '^': { look: 'tree', opt: { c: ['#6a8a4a', '#4a6a3a', '#5a4030', '#8aaa6a'] } } }, style: { renderer: 'sepia' }, music: 'oksungarden', amb: { type: 'birds', vol: 0.06 }, weather: { petals: true },
    decor: [{ look: 'hanok', n: 1, lines: ['A house with a tiled roof. Chilli peppers are drying on the doorstep.'] }, { look: 'onggi', n: 5, lines: ['Kimchi jars in a row. One has a name carved into it: 옥순.'] }, { look: 'wateringcan', n: 1, lines: ['A tin watering can, too big for a ten-year-old girl. She uses it anyway.'] }],
    npcs: [{ name: 'Ok-sun', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#e8d8c0', '#c8b8a0', '#f0d0b0', '#1a1010'], acc: 'flower' }), behavior: 'wander', radius: 4, speed: 1, solid: true,
        lines: [KN('오빠가 렬차 타고 온대!', 'My big brother is coming on the train!'), KN('오빠가 약속했어. 다음 렬차로 온다고. 그래서 물 주는 거야. 오빠가 올 때 꽃밭이 예쁘라고.', 'He promised. The next train. So I water, so the flower bed is pretty when he comes.'), { if: { quest: { Q01: 'stay' } }, seq: ['She stops watering and looks at the sky.', KN('오빠는 안 오는 거지? 일없어. 그래도 물 줄 거야. 평생이라도.', 'He isn’t coming, is he. It doesn’t matter. I’ll keep watering anyway. All my life, if I have to.')], do: [{ quest: { Q01: 'home' } }, { note: 'n_oksun_garden' }] }] },
      { name: 'A Blackbird', count: 2, look: { t: 'bird', c: ['#1a1a1a'], h: 8 }, behavior: 'fly', radius: 5, speed: 1.4, solid: false, lines: ['A blackbird. It whistles a tune you have heard before, in another garden, much later.'] },
      { name: 'Ok-sun’s Mother', look: H({ t: 'adult', hairStyle: 'bun', body: 'robe', c: ['#f0ece0', '#d8d4c8', '#e0c0a0', '#1a1010'] }), behavior: 'static', solid: true, lines: [KN('옥순아, 밥 먹어라!', 'Ok-sun, come and eat!'), 'She is calling her daughter in to eat. They came south last winter, with a single bundle.'] }],
    place: [SOUL([KN('피난 와서 맞는 첫 봄이다. 그래도 꽃은 피는구나.', 'The first spring since we fled. The flowers open all the same.')]),
      SOUL([KS('저 집 애는 이북에서 왔대. 말이 좀 달라.', 'They say the girl in that house came from the North. She talks a bit differently.')]),
      SOUL([KN('보따리는 하나였다. 이름은 둘이었다. 하나는 렬차에 두고 왔다.', 'One bundle. Two names. We left one on the train.')]),
      SOUL([EN('The watering can is too big. She will grow into it. It will take seventy years.')]),
      SOUL([KN('신발은 새로 사 주마. 왼쪽만 살 수는 없지 않니.', 'I will buy you new shoes. You can’t buy just the left one.')])],
    info: { summary: 'A refugee garden in the south, in 1952; a little girl waters it while she waits for her brother.', rules: ['From the true statue, once the plaque has been read.'], lore: 'Ok-sun, Sora’s grandmother, as a child. The one from the statue in the Garden.' } });
  link('W159', { to: 'W194', look: 'gate', lookOpt: { c: ['#8a7a5a'] }, label: 'a very old wooden gate', cond: { secret: 'statue_truth' }, locked: 'A little gate. She would need to know the name of the girl who went through it.' });

  /* W195 — La Cuisine de 1989 */
  S({ id: 'W195', name: 'The Kitchen of 1989', depth: 4, tier: 'hard', back: 'W171', backLook: 'door', backOpt: { style: 'wood', c: ['#e8d8a0'] },
    map: (function () { var g = K.grid(20, 14, ' '); g.box(0, 0, 20, 14, '#', '.'); g.rect(7, 5, 6, 3, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'tile', c: ['#d8c8a0', '#b8a880'] }, floor2: { p: 'wood', c: ['#8a6848', '#6a4a30'] } }), style: { tallWalls: true, renderer: 'sepia' }, music: 'kitchen1989', amb: { type: 'rain', vol: 0.05 }, dark: 0.3,
    place: [{ id: 'table', type: 'decor', at: [9, 6], look: 'table', lookOpt: { cloth: '#e8d8c0' }, light: 3, lines: ['A low table. A bowl of rice covered with a plate, to keep it warm. For someone who comes home late.'] },
      { id: 'tv', type: 'decor', at: [16, 2], look: 'crt', lines: ['The television shows demonstrations, then a cartoon, then the test card.'] },
      { id: 'phone', type: 'decor', at: [3, 2], look: 'phone', lines: [KS('엄마 늦어. 먼저 자.', 'Mum will be late. Go to bed without me.'), 'A rotary telephone. It has just rung. It will not ring again tonight.'] },
      SOUL([KS('김 과장, 오늘 회식 빠지면 안 돼.', 'Manager Kim, you can’t miss the team dinner tonight.')]),
      SOUL([KS('부장님, 오늘은 딸 생일이라서… 아, 아닙니다. 가겠습니다.', 'Sir, today is my daughter’s birthday… Ah, no. Never mind. I’ll come.')]),
      SOUL([EN('Rice under a plate stays warm for one hour. After that, it is only waiting.')]),
      SOUL([KS('아빠, 열두 시 넘었어. 밥 식었어.', 'Dad, it’s past midnight. The rice has gone cold.')]),
      SOUL([KS('미란아, 문 꼭 잠가. 엄마도 오늘 늦어.', 'Mi-ran, make sure you lock the door. Mum’s late tonight too.')])],
    npcs: [{ name: 'Mi-ran, Aged Nine', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#c8a0a0', '#a88080', '#f0d0b0', '#1a1010'], eyes: 'wide' }), behavior: 'static', solid: true,
        lines: [KS('아빠는 일해. 열두 시 넘어서 와. 문 열지 말랬어. 밥 먹으랬어.', 'Dad’s at work. He comes home after midnight. He said not to open the door. He said to eat.'), KS('나 안 울어. 밥 보고 있어. 밥이 식으면, 아빠가 곧 온다는 거야.', 'I’m not crying. I’m watching the rice. When it goes cold, it means he’s coming soon.'), { if: { secret: 'mother_voice' }, seq: ['She looks at you for a long time.', KS('너, 내가 나중에 알게 될 사람의 눈을 닮았어.', 'You have the eyes of someone I’m going to know.'), KS('나중에 나도 똑같이 할 거야. 그러기 싫을 텐데… 그래도 똑같이 할 거야. 미리 미안해.', 'Later on, I’ll do the same, you know. I won’t want to… I’ll do the same anyway. I’m sorry in advance.')], do: [{ note: 'n_miran_child' }, { secret: 'miran_child' }] }] },
      { name: 'A Ladybird on the Window', look: { t: 'ant', c: ['#c02020'], h: 6 }, behavior: 'wander', radius: 2, speed: 0.5, solid: false, lines: ['It walks on the window pane, on the inside. It does not get out either.'] }],
    info: { summary: 'A Seoul kitchen, in 1989; a little girl waits for her father in front of a bowl of rice.', rules: ['From Mi-ran’s Sleep.'], lore: 'Mi-ran, Sora’s mother, as a child waiting for her father. The cycle.' } });
  link('W171', { to: 'W195', look: 'door', lookOpt: { style: 'wood', c: ['#c8b880'] }, label: 'a kitchen door, in 1989' });

  /* W196 — La Classe de Nour */
  S({ id: 'W196', name: 'Nour’s Classroom', depth: 4, tier: 'hard', back: 'W140', backLook: 'door', backOpt: { style: 'wood', c: ['#3a5a8a'] },
    map: (function () { var g = K.grid(26, 18, ' '); g.box(0, 0, 26, 18, '#', '.'); for (var y = 6; y < 16; y += 3) for (var x = 4; x < 22; x += 4) g.set(x, y, '{'); return g.rows(); })(),
    look: K.LOOK.school, tall: { '{': { look: 'schooldesk' } }, style: { tallWalls: true }, music: 'nourclass', amb: { type: 'whispers', vol: 0.06 },
    place: [{ id: 'board', type: 'decor', at: [12, 1], look: 'blackboard', lines: ['On the blackboard, in chalk, someone has written her name with a nasty word beside it. Everyone saw it. Nobody wiped it off.'],
      use: [{ if: { equipped: 'E10' }, msg: 'You run the Eraser over it. The nasty word comes off. The name stays, all alone, clean. The whispering stops dead.', secret: 'nour_board', note: 'n_nour_board', temp: { nour_board: true } }] },
      { id: 'nourdesk', type: 'decor', at: [20, 15], look: 'schooldesk', lines: ['The desk at the back. Carved into it: “i am not here”. Inside, a blue felt-tip, almost dry.'] },
      SOUL([EN('Everyone saw the word. Everyone thought someone else would wipe it off.')]),
      SOUL([EN('She drew a map on her arm so she would always know the way home. Home moved anyway.')]),
      SOUL([EN('The quiet ones see everything. Nobody asks them.')])],
    npcs: [{ name: 'The Whisperers', count: 6, look: H({ t: 'kid', body: 'uniform', c: ['#5a6a8a', '#4a5a7a', '#e0c8b0', '#1a1a1a'], eyes: 'none', mouth: 'grin', alpha: 0.75 }), behavior: 'statue', solid: true,
        lines: ['He whispers to his neighbour while looking at you. You cannot hear the words. You do not need to.', { seq: [EN('That’s her.'), 'Laughter.'] }, { if: { temp: { nour_board: true } }, t: 'He lowers his eyes. He has stopped whispering.' }] },
      { name: 'The Teacher Who Sees Nothing', look: H({ t: 'adult', hairStyle: 'bun', body: 'coat', c: ['#8a7a6a', '#6a5a4a', '#e0c8b0', '#3a2a1a'], eyes: 'closed', acc: 'book' }), behavior: 'static', solid: true,
        lines: [EN('Everything is fine in this class. They’re children. They’re playing.'), EN('If someone had a problem, they would come and tell me. Nobody came.')] },
      { name: 'Little Nour', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#c89068', '#1a1a1a'], eyes: 'line', mouth: 'line' }), behavior: 'static', solid: true, at: [20, 14],
        lines: ['She draws on her arm with the blue felt-tip. Lines. Boxes. Like a map.', EN('If I don’t move, they forget me. It almost works.'), { if: { temp: { nour_board: true } }, seq: ['She looks at the board, then at you. She puts the felt-tip away.', EN('…Thanks. Nobody had ever wiped it off.')], do: [{ rel: { N008: 2 } }, { quest: { Q07: 'class' } }] }] }],
    info: { summary: 'Nour’s classroom, full of whispering children and a teacher who sees nothing.', rules: ['The Eraser rubs out what is written on the board.'], lore: 'The bullying nobody stops, and the map drawn on her arm.' } });
  link('W140', { to: 'W196', look: 'door', lookOpt: { style: 'wood', c: ['#6a7a9a'] }, label: 'a school door', cond: { quest: { Q07: ['drawing', 'done', 'class'] } }, locked: 'A school door. She does not want to go back in. Not without someone.' });

  /* W197 — Le Quai retrouvé */
  S({ id: 'W197', name: 'The Platform Found Again', depth: 4, tier: 'hard', back: 'W192', backLook: 'train', backOpt: { c: ['#2a2a3a', '#e8c040'] }, backLabel: 'back on board the train', outdoor: true,
    map: (function () { var g = K.grid(50, 14, ' '); g.box(0, 0, 50, 14, '#', '.'); g.rect(1, 9, 48, 4, 'r'); g.hline(1, 48, 8, ','); return g.rows(); })(), look: K.LOOK.station, style: { renderer: 'watercolor', sky: ['#f0d0a0', '#f8e8c8'] }, music: 'foundplatform', amb: { type: 'birds', vol: 0.05 },
    decor: [{ look: 'bench', n: 3, lines: ['A bench in the sun. Someone has left a watering can on it.'] }, { look: 'poleclock', n: 1, lines: ['The platform clock. It has no hands any more, and everyone seems to know the time anyway.'] }, { look: 'flowers', n: 6, lines: ['Flowers planted between the rails. Someone has been watering them for a very long time.'] }],
    npcs: [{ name: 'An Old Lady Watering', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#e8e0d0', '#c8c0b0', '#e0c0a0', '#c8c8c8'], acc: 'flower' }), behavior: 'wander', radius: 4, speed: 0.5, solid: true,
        lines: ['She waters the flowers between the rails. She does not look up.', KS('기다리는 것도 사랑이야.', 'Waiting is a way of loving too.'), { if: { quest: { Q01: ['stay', 'home'] } }, seq: ['At last she looks up. She smiles at someone behind you, very far away, in another century.', KS('왔구나. 오래도 걸렸네. 앉아. 정원이 예뻐.', 'There you are. You certainly took your time. Sit down. The garden is lovely.')], do: [{ quest: { Q01: 'home' } }, { secret: 'q01_reunion' }, { note: 'n_reunion' }] }] },
      { name: 'A Retired Stationmaster', look: H({ t: 'old', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#e0c8a8', '#c8c8c8'], acc: 'flag' }), behavior: 'static', solid: true, lines: [EN('Trains don’t arrive here anymore. People do.')] }],
    place: [SOUL([KS('오빠, 나 정원 가꿨어. 평생.', 'Big brother, I made a garden. All my life.')]),
      SOUL([KN('늦어서 미안하다, 옥순아.', 'I am sorry I am late, Ok-sun.')]),
      SOUL([EN('The clock has no hands. Here, it is always the time someone arrives.')]),
      SOUL([KS('할머니, 이 꽃 이름이 뭐야?', 'Grandma, what’s this flower called?')]),
      SOUL([EN('Flowers between the rails. Nobody planted them on purpose. Nobody pulled them out either.')])],
    info: { summary: 'A platform at sunset, full of flowers between the rails, where an old lady is watering.', rules: ['From the 23:71 train, once Mr. Ahn has chosen his station.'], lore: 'The reunion that only ever happened in a dream.' } });

  /* W198 — La Terrasse rêvée */
  S({ id: 'W198', name: 'The Dreamt Terrace', depth: 4, tier: 'hard', back: 'W177', backLook: 'cloudpuff', backLabel: 'a cloud towards the sky below', outdoor: true,
    map: (function () { var g = K.grid(24, 14, ' '); g.box(0, 0, 24, 14, '#', '.'); g.hline(1, 22, 1, ','); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#b8b0a0', '#988f80'] }, floor2: { p: 'tile', c: ['#c8c0b0', '#a8a090'] }, wall: { p: 'flat', c: ['#3a3a48', '#2a2a38'] } },
    style: { stars: true, sky: ['#101830', '#304070'], cliffH: 0.8, cliff: '#202030' }, music: 'dreamterrace', amb: { type: 'wind', vol: 0.05 },
    decor: [{ look: 'pot', n: 10, lines: ['A flowerpot. A label: “those who stayed”. It has bloomed.', 'A pot with a shoot. A label: “one more day”.', 'A pot. A label: “tomorrow, maybe”. The soil is damp.'] },
      { look: 'payphone', n: 1, lines: ['A telephone, on the terrace. A note taped to it: “109 — someone is listening, at night too”.'] },
      { look: 'swing', n: 1, lines: ['A swing, hanging from nothing. It does not go high. It rocks.'] }],
    npcs: [{ name: 'The Keeper of Pots', look: H({ t: 'old', body: 'robe', c: ['#6a8a5a', '#4a6a3a', '#e0c0a0', '#e0e0e0'], acc: 'flower' }), behavior: 'wander', radius: 4, speed: 0.4, solid: true,
        lines: [EN('Every pot is someone who wanted to leave, one night, and stayed until morning.'), EN('Nothing blooms right away. You water it anyway.'), { seq: [EN('If you want to talk to someone, for real, awake: the phone works over there too.'), 'She points to the telephone, at the edge of the terrace.'] }] },
      { name: 'The Windows of the City', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 20, ambientLines: ['Below, a window lights up. Someone else is not sleeping either.', 'Another window lights up. Then another. Nobody keeps watch alone.'] }],
    place: [SOUL([EN('I stayed one more night. Then one more. That is all staying is.')]),
      SOUL([EN('Someone is awake in the window across the street. You are not the only light.')]),
      SOUL([KS('내일 또 와. 물 줘야 하니까.', 'Come back tomorrow. They will need watering.')])],
    info: { summary: 'The apartment block’s terrace, in a dream, covered with pots that have bloomed.', rules: ['From the Sky Below.'], lore: 'Staying, one more night. This place shows nothing but flowers and lit windows.' } });
  link('W177', { to: 'W198', look: 'cloudpuff', label: 'a cloud that leads to a terrace' });

  /* W199 — Le Nid */
  S({ id: 'W199', name: 'The Nest', depth: 4, tier: 'hard', back: 'W022', backLook: 'nest', backLabel: 'back down towards the washing lines', outdoor: true,
    map: (function () { var g = K.grid(30, 30, ' '); g.ellipse(14.5, 14.5, 13, 13, '.'); g.ellipse(14.5, 14.5, 7, 7, ','); return g.rows(); })(),
    look: { floor: { p: 'leaves', c: ['#a08060', '#806040', '#c0a080'] }, floor2: { p: 'rug', c: ['#e0d0c0', '#c8b8a8'] } }, style: { sky: ['#a0c8f0', '#e0f0ff'], cliffH: 0.8, cliff: '#6a5030' }, music: 'nest', amb: { type: 'wind', vol: 0.06 },
    decor: [{ look: 'sock', n: 5, lines: ['An odd sock, woven into the nest. The one that was always missing.'] }, { look: 'towel', n: 3, lines: ['A hospital towel, folded in four, like a pillow.'] }, { look: 'egg', n: 4, lines: ['A warm egg. Something inside is waiting, in no hurry.'] }, { look: 'plush', n: 1, lines: ['A cuddly toy, wedged between two twigs. It looks as if it has kept watch for a long time.'] }],
    npcs: [{ name: 'The Great Laundry Bird', look: { t: 'bird', c: ['#f0f0f0'], h: 30 }, behavior: 'static', solid: true, lines: ['A bird made of sheets. It built this nest out of everything the family lost in the wash.', EN('Nothing falls here. You can sleep. I’m watching.')] },
      { name: 'A Fledgling', count: 3, look: { t: 'bird', c: ['#f0d080'], h: 7 }, behavior: 'wander', radius: 3, speed: 0.8, solid: false, lines: ['It opens its beak. It is not hungry. It just wants someone to see it open its beak.'] }],
    place: [SOUL([EN('Every lost sock ends up here. Every lost night too.')]),
      SOUL([EN('The hospital towel still smells of her night shift.')]),
      SOUL([EN('Something in the egg is waiting without hurry. It is the first thing here that is not late.')])],
    info: { summary: 'A giant nest woven from socks, sheets and towels, above the clouds.', rules: ['From the Laundry Sky, with the Feather equipped.'], lore: 'A place where someone keeps watch, for once.' } });
  link('W022', { to: 'W199', look: 'nest', label: 'a nest right at the top', cond: { equipped: 'E22' }, secret: true, locked: 'Right at the top, an enormous nest. Too high. She would have to be light.' });

  /* W200 — Les Archives des rêves */
  S({ id: 'W200', name: 'The Dream Archives', depth: 4, tier: 'hard', back: 'W014', backLook: 'bookcase', backLabel: 'back through the shelf', secretLevel: 5,
    map: (function () { var g = K.grid(44, 30, ' '); g.box(0, 0, 44, 30, '#', '.'); for (var y = 4; y < 27; y += 4) { g.hline(3, 18, y, '%'); g.hline(25, 40, y, '%'); } return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#4a3420', '#3a2614', '#5a4430'] }, wall: { p: 'flat', c: ['#1a120a', '#100a04'], topColor: '#1a120a' }, wallface: { p: 'panel', c: ['#5a3a20', '#4a2a10', '#2a1a08'], skirt: '#1a0a04' } },
    tall: { '%': { look: 'bookcase' } }, style: { tallWalls: true, renderer: 'engraving' }, music: 'archive', amb: { type: 'pages', vol: 0.05 }, dark: 0.5,
    place: [{ id: 'ledger', type: 'decor', at: [21, 15], look: 'book', light: 3, lines: [{ t: function () { var p = YN.save.perm, v = U.keys(p.worlds || {}).filter(function (k) { return /^W\d{3}$/.test(k); }).length; return 'An open ledger: “Dreams of S. — ' + p.stats.dreams + ' nights, ' + v + ' places out of 200, ' + (p.effects || []).length + ' effects out of 90.”'; } }, 'The last line is being written right now. It is this sentence.'], use: [{ secret: 'archive_read' }] },
      { id: 'cardfile', type: 'decor', at: [21, 25], look: 'drawer', lines: ['A card index. One card for each inhabitant of the dreams. Some cards are blank: the ones she has not met yet.'] },
      SOUL([EN('Shelf M: letters from Seoul, 1989. Someone slow is still delivering them.')]),
      SOUL([EN('Shelf S: letters from 2044. They have not been written yet. They are already tired.')]),
      SOUL([KN('기록에 없는 사람은 없었던 사람입니다. 다들 그렇게 말합니다.', 'Whoever is not in the records never existed. That is what everyone says.')]),
      SOUL([KS('엄마 꿈은 한 장뿐이야. 시간이 없었대.', 'Mum’s dream is only one page long. She didn’t have the time, she says.')]),
      SOUL([EN('Subjects one to five: files missing. Subject six: still dreaming.')])],
    decor: [{ look: 'book', n: 6, lines: ['A dated dream diary. The handwriting changes over the pages: she is growing up.', 'A dream diary belonging to another girl, from another country. The same doors. The same witches.', 'An empty dream diary, in the name of her child, one day. She closes it.', 'Her mother’s dream diary. A single page: “i don’t have time to dream”.'] }],
    npcs: [{ name: 'The Archivist', look: H({ t: 'old', body: 'coat', c: ['#4a3a2a', '#3a2a1a', '#e0c8a8', '#c8c8c8'], acc: 'book', eyes: 'closed' }), behavior: 'patrol', path: [[21, 3], [21, 27]], speed: 0.4, solid: true,
        lines: [EN('Shh. Here we keep the dreams of those who forget them when they wake.'), EN('Yours is shelved over there. It isn’t finished. The best ones never are.'), EN('The Dream Archive, people call it. It’s only a name. It’s a library that keeps watch.')] },
      { name: 'A Sleeping Reader', count: 3, look: H({ t: 'adult', body: 'sweater', c: ['#6a5a4a', '#4a3a2a', '#e0c0a0', '#2a1a10'], eyes: 'closed' }), behavior: 'statue', solid: true, lines: ['He has fallen asleep on a dream diary. His own, perhaps.'] }],
    info: { summary: 'A dark library where all the dream diaries are shelved.', rules: ['Behind a shelf in the Charcoal World, after twenty-five nights.'], lore: 'The place that gives the game its name.' } });
  link('W014', { to: 'W200', look: 'bookcase', label: 'a shelf that swings round', cond: { dreams: 25 }, secret: true, locked: 'A shelf full of diaries. They are not for you yet.' });
})(typeof window !== 'undefined' ? window : globalThis);
