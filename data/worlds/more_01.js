/* =========================================================================
 *  AJOUTS (01) — énigmes et secrets des vingt premiers mondes, W001 à W020.
 *  Rien n'est retiré ni déplacé : des marques, des mécaniques, quelques
 *  habitants (N2100-N2119) et de petites pièces cachées derrière des faux
 *  murs (fakeWalls + post qui creuse le plein ou le vide inutilisé).
 *  Drapeaux, temps de rêve et clés de secrets : préfixe m1_.
 *  Les énigmes du Jardin (merle, feuilles, nénuphars, poisson, statue,
 *  planches du pont) ne sont pas touchées ; aucun nouvel effet.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  /* les répliques d'un objet peuvent être écrites en groupes (IF à plusieurs phrases) : on les aplatit */
  function flat(a) { return a.reduce(function (o, x) { return o.concat(Array.isArray(x) ? flat(x) : [x]); }, []); }
  function MORE(id, o) { (o.place || []).forEach(function (p) { if (p.lines) p.lines = flat(p.lines); }); return YN.kit.more(id, o); }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t) { return { t: t, lang: 'en' }; }
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  /* une réplique conditionnelle (objet ou habitant) */
  function IF(c, l, act) {
    if (Array.isArray(l)) return l.map(function (x, i) { return IF(c, x, i ? null : act); }); // plusieurs phrases, même condition, action sur la première
    var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; if (act) o.do = act; return o;
  }
  /* la même, dont l'action se rejoue à chaque fois (compteurs) */
  function IFR(c, l, act) { var o = IF(c, l, act); (Array.isArray(o) ? o : [o]).forEach(function (x) { if (x.do) x.repeat = true; }); return o; }
  /* un compteur de rêve à valeur exacte (0 = jamais touché) */
  function AT(k, n) { var o = {}; o[k] = n; if (!n) { var g = {}; g[k] = 1; return { not: { tempGte: g } }; } return { temp: o }; }
  function INC(k) { var o = {}; o[k] = 1; return { tempInc: o }; }
  /* retouches de carte : une case, un rectangle, une pièce fermée (rangées allongées si besoin) */
  function put(rows, x, y, ch) { while (rows.length <= y) rows.push(''); var r = rows[y]; while (r.length <= x) r += ' '; rows[y] = r.slice(0, x) + ch + r.slice(x + 1); }
  function fill(rows, x0, y0, w, h, ch) { for (var y = y0; y < y0 + h; y++) for (var x = x0; x < x0 + w; x++) put(rows, x, y, ch); }
  function room(rows, x0, y0, w, h, floor, wall) { fill(rows, x0, y0, w, h, wall || '#'); fill(rows, x0 + 1, y0 + 1, w - 2, h - 2, floor || '.'); }

  /* ---------------------------------------------------------------
   *  W001 — The Garden (grand monde : cinq secrets, aucune énigme du
   *  jardin modifiée). Le carré douze derrière son mur de pierre, le
   *  périlla et l'arrosoir, le banc tiède, la boîte de graines au bout
   *  du jardin, l'arrosoir de l'aube (heure réelle). Indices : le
   *  Monsieur du comité (N2100) et les objets eux-mêmes.
   * --------------------------------------------------------------- */
  MORE('W001', {
    fakeWalls: [[67, 25]],
    place: [
      { id: 'm1_plotgap', type: 'decor', at: [68, 25], look: 'tuft', solid: false, flat: true,
        lines: ['Perilla leaves poke out between the stones of the old plot wall, here and nowhere else.', 'Something on the other side is still growing.'] },
      { id: 'm1_perilla', type: 'decor', at: [63, 25], look: 'sprout', lookIf: [{ cond: { flag: 'm1_perilla' }, look: 'flowers' }],
        lines: [IF({ notFlag: 'm1_perilla' }, ['Inside plot twelve the soil has been turned by hand, in neat rows.', 'One perilla plant stands in the middle, as if nobody had told it.'], [{ secret: 'm1_plot12' }]),
          IF({ notFlag: 'm1_perilla' }, 'Its leaves droop. The ground around it is dry and cracked.'),
          IF({ flag: 'm1_perilla' }, 'The perilla stands knee-high now. Its leaves smell of her hands, of summer, of the kitchen.')],
        onEffect: { E35: [{ if: { notFlag: 'm1_perilla' }, set: { m1_perilla: true }, secret: 'm1_perilla', sfx: 'reveal',
          lines: ['You tip the watering can. The cracked earth drinks and drinks.', 'The perilla straightens, leaf by leaf, the way someone sits up when their name is called.',
            'Where the water ran off, the soil has given something back.'],
          else: [{ msg: 'The soil is still dark with water. It does not need more.' }] }, { reeval: true }] } },
      { id: 'm1_photo', type: 'decor', at: [64, 26], look: 'photo', solid: false, flat: true, cond: { all: [{ flag: 'm1_perilla' }, { notFlag: 'm1_photo' }] },
        lines: ['A photograph folded into four, pressed into the wet soil at the foot of the perilla,', 'face up, so that it could see the sky.'],
        use: [{ if: { notFlag: 'm1_photo' }, set: { m1_photo: true }, collect: 'photos' }, { reeval: true }] },
      { id: 'm1_tin', type: 'decor', at: [131, 48], look: 'deadleaves', solid: false, flat: true,
        lines: [IFR({ all: [AT('m1_dig', 0), { notFlag: 'm1_seedtin' }] }, ['Dead leaves, banked up in the very corner where the last hedges meet.', 'The soil under them is soft, as if it had been dug before.'], [INC('m1_dig')]),
          IFR({ all: [AT('m1_dig', 1), { notFlag: 'm1_seedtin' }] }, ['You scrape with your fingers. Roots, a snail shell, a button.', 'Further down, something hard and round comes up out of the earth.'], [INC('m1_dig'), { reeval: true }]),
          IF({ all: [{ tempGte: { m1_dig: 2 } }, { notFlag: 'm1_seedtin' }] }, 'The hole you dug is still there, and what came out of it.'),
          IF({ flag: 'm1_seedtin' }, 'The hole has been filled in again, gently. The leaves have been put back on top, the way you tuck someone in.')] },
      { id: 'm1_seedtin', type: 'decor', at: [130, 48], look: 'cookiejar', lookOpt: { c: ['#8a6a4a'] }, cond: { all: [{ tempGte: { m1_dig: 2 } }, { notFlag: 'm1_seedtin' }] },
        lines: ['A biscuit tin, rusted at the edges.', 'Inside, envelopes of seeds labelled in a grandmother’s round hand: perilla, radish, pumpkin.',
          'At the bottom, one envelope with no seeds in it, only a biscuit wrapped in paper.', 'On the paper: “for the little one, for after”.'],
        use: [{ if: { notFlag: 'm1_seedtin' }, set: { m1_seedtin: true }, secret: 'm1_seedtin', cookie: 1 }, { reeval: true }] },
      { id: 'm1_dawncan', type: 'decor', at: [57, 24], look: 'wateringcan', cond: { realHour: [5, 7] },
        lines: ['A watering can, full to the brim, much too big for one small person. Water is still dripping from the rose.', 'It has been put down beside plot twelve, as if someone had gone to fetch the other one,', 'so the two of you could carry it together.'],
        use: [{ secret: 'm1_dawn' }] }
    ],
    mech: [{ type: 'standStill', zone: [51, 47, 51, 47], secs: 14, flag: 'm1_bench', reward: [{ secret: 'm1_bench' }],
      winLines: ['You sit at the warm end of the bench and keep very still,', 'the way you do when someone is about to fall asleep.',
        'After a while the other end creaks, slowly,', 'as if someone heavier had sat down beside you, with the small sigh old people make.',
        'Nobody is there. The warmth stays a little longer, then goes, politely.'] }],
    npcs: [{ id: 'N2100', name: 'The Man from the Garden Committee', at: [57, 33], behavior: 'wander', radius: 3, speed: 0.7, kind: 'human', solid: true,
      look: H({ t: 'adult', head: 'cap', body: 'coat', c: ['#5a6a4a', '#3a4a2a', '#e0c0a0', '#3a3a2a'], acc: 'clipboard' }),
      lines: [{ seq: [EN('Plot twelve is to be cleared. It has been “to be cleared” for two summers now.'), EN('Nobody has the heart, and nobody has the key.')] },
        EN('That plot has no gate. She never needed one, she said. She went in the way the cats go in.'),
        { seq: [EN('Five in the morning, every morning, before the heat.'), EN('That was when she watered. You could have set the clocks by her.')] },
        { seq: [EN('She buried something in the far corner, where the last hedges meet.'), EN('“Seeds, for after,” she said. After what, I asked. She laughed.')] },
        { seq: [EN('The bench by the statue belongs to the committee. Sit on it, by all means.'), EN('Mind the warm end. Sit still, and somebody joins you.')] },
        'He writes something on his clipboard, rubs it out, and writes it again.'] }],
    rules: ['Plot twelve (the walled plot by the shed) has no gate: one stone of its east wall, where perilla leaves poke through, can be walked through. Inside grows a perilla plant (secret).',
      'Watering the perilla with the Watering Can (E35) makes it grow back and uncovers a photograph at its foot (a collection piece).',
      'In the far south-east corner of the garden, dig twice in the pile of dead leaves: the grandmother’s seed tin comes up (a secret and a biscuit).',
      'Sitting still for about fifteen seconds at the right-hand (warm) end of the bench near the statue: someone invisible sits down beside you (secret).',
      'Between 5 and 7 a.m. (real time), a full watering can waits beside plot twelve (secret). The man from the garden committee (new inhabitant) hints at all of these.']
  });

  /* ---------------------------------------------------------------
   *  W002 — Station of the Missing Hours
   *  Énigme : le bureau des objets trouvés (quiz : la chaussure gauche
   *  d'une enfant, quai zéro). Secrets : la craie du quai (chambre
   *  éteinte), la manchette qu'on dit tout haut près du kiosque, la
   *  dernière ligne de l'horaire (dernière minute du rêve).
   * --------------------------------------------------------------- */
  MORE('W002', {
    place: [
      { id: 'm1_lostbell', type: 'decor', at: [37, 1], look: 'bell', lines: ['A brass bell on the sill of the lost property window. “Ring for service.”'] },
      { id: 'm1_chalkwait', type: 'decor', at: [5, 16], look: 'chalkmark', solid: false, flat: true, cond: { dark: true },
        lines: ['Chalk on the platform, so faint that it only shows with the lights down:', 'a small square, and inside it, in a child’s writing:',
          KN('옥순 — 여기서 기다릴게.', 'Ok-sun — I’ll wait here.'),
          'All along the platform edge, in an old man’s careful hand,', 'the same words have been copied out again and again.'],
        use: [{ secret: 'm1_chalkwait' }] },
      { id: 'm1_kioskear', type: 'listen', at: [24, 25], listenDist: 4,
        listen: [{ match: ['not well', 'not fine', 'not ok', 'not okay', 'all is not well', 'nothing is well', 'nothing is fine', 'it is not fine', 'its not fine', '안 괜찮아', '안괜찮아', '괜찮지 않아', '괜찮지 않다', '일없지 않습니다'],
          do: [{ secret: 'm1_notwell' }, { sfx: 'page' }],
          lines: ['On the kiosk, every newspaper flutters at once, as if a train had gone past.', 'For a moment the headline blurs. Under ALL IS WELL, in smaller letters that were always there:',
            EN('SOMEONE IS STILL WAITING ON PLATFORM ZERO.'), 'Then the ink settles, and all is well again.'] }] },
      { id: 'm1_timetable', type: 'decor', at: [25, 5], look: 'poster', lookOpt: { c: ['#e8e0c8', '#3a3a4a'] }, cond: { remainingGt: 60 },
        lines: ['A timetable taped to the pillar at a child’s height.', 'Every line has been crossed out except the last one, which has no time yet.'] },
      { id: 'm1_lastline', type: 'decor', at: [25, 5], look: 'poster', lookOpt: { c: ['#f0e8c8', '#a03030'] }, cond: { remainingLt: 61 },
        lines: ['The last line of the timetable has filled itself in while you were not looking:', EN('Last train: HOME. Platform: wherever you are standing. Do not run.')],
        use: [{ secret: 'm1_lasttrain' }] }
    ],
    mech: [{ type: 'quiz', mark: 'm1_lostbell', flag: 'm1_lostquiz',
      intro: ['You ring the little bell. Behind the glass a lamp comes on, and a hand pushes a form under the window.', { t: 'Lost property. Describe the item, please.', lang: 'en', who: 'behind the glass' }],
      questions: [{ q: 'What was lost?', choices: ['An umbrella', 'A child’s shoe', 'A suitcase marked J.'], right: 1 },
        { q: 'Which foot?', choices: ['The right', 'The left'], right: 1 },
        { q: 'On which platform?', choices: ['Platform A', 'Platform B', 'Platform zero'], right: 2 }],
      failLine: { t: 'That does not match anything we hold. Please call again another night.', lang: 'en', who: 'behind the glass' },
      doneLine: 'The lamp behind the glass is off. The tag has been filed.',
      reward: [{ secret: 'm1_claimtag' }],
      winLines: [{ t: 'Child’s shoe, left. Platform zero. Unclaimed.', lang: 'en', who: 'behind the glass' },
        'The hand slides a yellowed claim tag under the window.', 'The name on it is written in Korean, in a careful grown-up hand:',
        { t: '안옥순. 아홉 살. 보호자가 찾으러 오시오.', lang: 'ko-n', tr: 'Ahn Ok-sun. Nine years old. To be collected by a guardian.', who: 'the claim tag' },
        'The shoe itself is not there any more.', 'Only the tag, and a clean space on the top shelf, where it used to watch the trains.'] }],
    npcs: [{ id: 'N2101', name: 'The Boy with Yesterday’s Paper', at: [30, 9], behavior: 'wander', radius: 3, speed: 1.1, kind: 'kid', solid: true,
      look: H({ t: 'kid', head: 'cap', body: 'shirt', c: ['#7a6a4a', '#4a3a2a', '#f0d0b0', '#2a2a2a'], acc: 'newspaper', h: 18 }),
      lines: [EN('Extra! Extra! ALL IS WELL! Read all about it!'), EN('Same headline every night. They print it before anything has happened.'),
        { seq: [EN('The other headline? Nobody prints that one.'), EN('You have to say it yourself, out loud, by the kiosk, where the papers can hear.')] },
        EN('Mr. Ahn buys one every night. He reads the date, folds it in four and goes back to waiting.'),
        EN('When the lights go out at your place, the platform shows its old writing. Grown-ups never look down.')] }],
    rules: ['Ring the bell at the lost property window and describe the lost item: a child’s shoe, the left one, lost on platform zero. The clerk hands over a claim tag (secret).',
      'With the bedroom light off, chalk writing appears on platform A, west end (secret).',
      'Saying “not well” (or 안 괜찮아) near the newspaper kiosk changes the headline for a moment (secret). The boy with yesterday’s paper (new inhabitant) hints at it.',
      'In the last minute of the dream, the timetable taped to a pillar of the hall fills in its last line (secret).']
  });

  /* ---------------------------------------------------------------
   *  W003 — Town at Dusk
   *  Énigme : le chemin du retour (trail) — des petits pas mouillés,
   *  du cartable tombé jusqu'au numéro sept. Secrets : la cour derrière
   *  le pâté de l'est (faux mur), la soucoupe que seuls les chats voient
   *  (effet Chat), la clé sur une ficelle à l'heure de la sortie d'école.
   * --------------------------------------------------------------- */
  MORE('W003', {
    fakeWalls: [[56, 19]],
    post: function (rows) { rows = rows.slice(); fill(rows, 52, 17, 4, 5, ','); return rows; },
    place: [
      { id: 'm1_satchel', type: 'decor', at: [10, 12], look: 'suitcase', lookOpt: { c: ['#a03a3a'] }, solid: false,
        lines: ['A school satchel, dropped on the pavement, straps undone.', 'Small footprints lead away from it, wet, although it has not rained yet. They know the way.'] },
      { id: 'm1_door7', type: 'decor', at: [4, 24], look: 'door', lookOpt: { style: 'wood', c: ['#5a3a2a'], symbol: '7' },
        lines: [IF({ notFlag: 'm1_home7' }, 'Number seven. Brass numbers, one screw missing, so the 7 hangs a little crooked.'),
          IF({ flag: 'm1_home7' }, 'Number seven. The key is back under the mat, for next time.')] },
      { id: 'm1_chalkarrows', type: 'decor', at: [57, 20], look: 'chalkmark', solid: false, flat: true,
        lines: ['Chalk arrows on the pavement, drawn by a child, all pointing at the same few bricks of the wall.'] },
      { id: 'm1_washing', type: 'decor', at: [53, 18], look: 'clothesline',
        lines: ['A courtyard that no window looks into. A washing line is strung across it.', 'Only children’s clothes hang on it, all the same size, all dry for years. Nobody comes to take them in.'],
        use: [{ secret: 'm1_courtyard' }] },
      { id: 'm1_bike', type: 'decor', at: [55, 21], look: 'wheel', lines: ['A child’s bicycle, leaning on the wall. The stabilisers have been taken off. The back wheel is flat.'] },
      { id: 'm1_saucer', type: 'decor', at: [30, 25], look: 'glass', lookOpt: { c: ['#f0f0f0'] }, solid: false, cond: { equipped: 'E19' },
        lines: ['A saucer of milk that only cats can see, pushed into the corner of the dead end.', 'Scratched on the rim, in a child’s capitals: FOR THE BLACK ONE, WHO WALKS ME HOME.'],
        use: [{ secret: 'm1_saucer' }] },
      { id: 'm1_keystring', type: 'decor', at: [31, 13], look: 'keyring', cond: { realHour: [15, 18] },
        lines: ['A door key on a string, hung over the switch box of the street lamp.', 'As if a child had needed both hands for something, just for a minute, and then had not come back for it.'],
        use: [{ secret: 'm1_keystring' }] }
    ],
    mech: [{ type: 'trail', from: 'm1_satchel', to: 'm1_door7', slack: 1, flag: 'm1_home7',
      lostLine: 'The little footprints go on without you. You have to start again from the satchel.',
      reward: [{ secret: 'm1_home7' }, { collect: 'coins' }],
      winLines: ['The footprints stop on the doormat of number seven. They are exactly the size of yours.',
        'Under the mat, where it always was: a door key on a string, and a coin left there for bread, years ago.',
        'Through the letterbox you can see that a light has been left on in the hall, for whoever gets home first.'] }],
    rules: ['Puzzle: small wet footprints lead from a dropped satchel (near the Nexus door) to the door of number seven, by the supermarket. Follow them all the way without straying: a coin and a secret.',
      'At the east edge of town, where chalk arrows point at a wall, one brick of the eastern block can be walked through: a hidden courtyard with a washing line (secret).',
      'With the Cat (E19) equipped, a saucer that only cats can see appears in the cats’ dead end (secret).',
      'Between 3 and 6 p.m. (real time), a key on a string hangs from a street lamp (secret).']
  });

  /* ---------------------------------------------------------------
   *  W004 — Empty School
   *  L'appel (dire « here » près du registre), le casier sans numéro
   *  qui ne s'ouvre que pendant la sonnerie, le coin de la classe trois
   *  (rester immobile, le nez au mur).
   * --------------------------------------------------------------- */
  MORE('W004', {
    place: [
      { id: 'm1_register', type: 'decor', at: [12, 2], look: 'book', listenDist: 5,
        lines: [IF({ notFlag: 'm1_present' }, 'The class register, open at tonight’s date. One row has no name, only a long line of empty boxes.'),
          IF({ notFlag: 'm1_present' }, 'In the margin, in red pen: “Never answers when called. Call louder?”'),
          IF({ flag: 'm1_present' }, 'In the row with no name, one small pencilled tick. It has not faded.')],
        listen: [{ match: ['here', 'present', 'yes miss', 'yes sir', '네', '여기요', '여기 있어요', '출석', '저 여기 있어요'],
          do: [{ set: { m1_present: true } }, { secret: 'm1_present' }, { sfx: 'chalk' }],
          lines: ['Your voice is very small in the empty classroom. It is enough.', 'Somewhere at the back, a chair scrapes, as if someone had sat up straight.',
            'In the register, in the row with no name, a tick appears in pencil,', 'as if a hand had been waiting years for you to answer.'] }] },
      { id: 'm1_locker', type: 'decor', at: [50, 14], look: 'locker', lookOpt: { c: ['#7a8aa0'] }, cond: { not: { remainingMod: { every: 120, under: 9 } } },
        lines: ['A locker with no number, at the very end of the row, against the wall.', 'Locked. It seems to be waiting for everybody to be in a hurry.'] },
      { id: 'm1_lockeropen', type: 'decor', at: [50, 14], look: 'locker', lookOpt: { c: ['#b8c8e0'] }, cond: { remainingMod: { every: 120, under: 9 } },
        lines: ['The bell is ringing, and in the rush that is not there, the locker without a number has sprung open.',
          'Inside: a pair of indoor shoes, a child’s size.', 'A name was written inside them in marker, then scratched out until the cloth tore.'],
        use: [{ secret: 'm1_locker' }] },
      { id: 'm1_toes', type: 'decor', at: [49, 11], look: 'scuff', solid: false, flat: true,
        lines: ['Two small worn patches on the floor, in the very corner of the classroom. Toes towards the wall.'] }
    ],
    mech: [{ type: 'bellRing', every: 120, under: 9 },
      { type: 'standStill', zone: [49, 11, 49, 11], secs: 20, flag: 'm1_corner', reward: [{ secret: 'm1_corner' }],
        winLines: ['You stand in the corner, nose to the wall, the way you were taught, and wait to be told you can turn round.',
          'Nobody tells you. After a long while the wall seems to soften,', 'and very quietly it starts to say the names of everyone who ever stood here.',
          'It is a long list. The last name it says is yours, and then: “You can turn round now.”'] }],
    rules: ['Say “here” (or “present”, 네) near the class register in the first classroom: someone finally ticks the empty row (secret).',
      'The school bell now rings every two dream minutes. While it rings (a few seconds), the locker without a number at the east end of the corridor stands open (secret).',
      'In the third classroom, stand still for about twenty seconds in the far corner where the floor is worn (secret).']
  });

  /* ---------------------------------------------------------------
   *  W005 — Mono World
   *  Énigme : le carré gris qui recule quand on le regarde (recede) —
   *  on le coince contre la pierre. Secrets : la feuille grise (fenêtre
   *  ouverte), l'écriture au crayon gris (Lunettes), la ligne grise
   *  (porte de la chambre entrouverte). Indices : l'enfant aux
   *  chaussettes grises (N2105).
   * --------------------------------------------------------------- */
  MORE('W005', {
    place: [
      { id: 'm1_grey', type: 'decor', at: [24, 30], look: 'cloudpuff', lookOpt: { c: ['#8a8a8a'] }, solid: false, cond: { notFlag: 'm1_grey' },
        lines: ['A grey square, the size of a hand, lying on the white.'] },
      { id: 'm1_leaf', type: 'decor', at: [47, 9], look: 'deadleaves', solid: false, flat: true, cond: { roomWindow: true },
        lines: ['A leaf, blown in from somewhere that has seasons.', 'It is brown, the only brown thing here, neither one thing nor the other.', 'It smells of the wind outside your window.'],
        use: [{ secret: 'm1_leaf' }] },
      { id: 'm1_greywrite', type: 'decor', at: [14, 27], look: 'doodle', solid: false, flat: true, hiddenUntilReveal: true,
        lines: [IF({ equipped: 'E14' }, 'In grey pencil, so light that only glasses catch it, a child’s handwriting runs across the ground:', [{ secret: 'm1_greywrite' }]),
          IF({ equipped: 'E14' }, '“I am not good. I am not bad. I am tired.” The last word has been gone over again and again.'),
          IF({ notEquipped: 'E14' }, 'White. Only white. Perhaps a little whiter than elsewhere, as if something had been rubbed out.')] },
      { id: 'm1_doorline', type: 'decor', at: [25, 38], look: 'scuff', solid: false, flat: true, cond: { roomDoor: true },
        lines: ['A thin grey line on the white, exactly like the light under a bedroom door that has been left ajar.', 'On the other side of it, someone is still awake.'],
        use: [{ secret: 'm1_doorline' }] }
    ],
    mech: [{ type: 'recede', mark: 'm1_grey', dist: 7, flag: 'm1_grey', reward: [{ secret: 'm1_grey' }],
      winLines: ['You get to it at last, by not looking at it.', 'It is a square of grey felt, warm, folded small.', 'The colour that is not allowed here. You keep it in your fist.'] }],
    npcs: [{ id: 'N2105', name: 'The Child in Grey Socks', at: [12, 36], behavior: 'static', kind: 'kid', solid: true,
      look: H({ t: 'kid', head: 'round', body: 'dress', c: ['#f0f0f0', '#101010', '#f0f0f0', '#101010'], eyes: 'dots', mouth: 'line', h: 17 }),
      lines: [EN('I’m not allowed to be grey. My socks are grey anyway. Nobody here looks at feet.'),
        EN('There’s a grey square that runs away from eyes. It can’t go through stone. Nothing can, here.'),
        EN('If you open your window at home, the wind brings in things that aren’t black or white.'),
        EN('Somebody wrote on the white in grey pencil. Only glasses can see it.'),
        { seq: [EN('When your door is left open a crack, a line of grey comes in under it.'), EN('They haven’t painted that one over yet.')] }] }],
    rules: ['Puzzle: a grey square backs away whenever she looks at it. Herd it against a rock, a pillar or furniture (it cannot move through them) and reach it: the grey felt (secret).',
      'With the bedroom window open, a brown leaf lies on the white (secret).',
      'Hidden writing in grey pencil on the checkerboard ground (south-west) is visible and readable with the Glasses (E14) (secret).',
      'With the bedroom door ajar, a grey line like light under a door appears near the hospital door (secret). The child in grey socks (new inhabitant) hints at all of these.']
  });

  /* ---------------------------------------------------------------
   *  W006 — The Orchard
   *  La danse de la ruche (trois pas à gauche, un vers le haut), la
   *  petite cueilleuse qui mène au plus vieil arbre (guide), la boîte à
   *  déjeuner de midi (heure réelle).
   * --------------------------------------------------------------- */
  MORE('W006', {
    place: [
      { id: 'm1_hivedig', type: 'trigger', at: [35, 25], cond: { notFlag: 'm1_honey' },
        lines: ['The grass under your foot sounds hollow. You kneel and dig with your hands.',
          'A jar of honey, buried with a cloth tied over the lid. A paper label in round handwriting:', '“For sore throats. For the winter. For the nights she cannot sleep.”'],
        do: [{ set: { m1_honey: true } }, { secret: 'm1_honey' }, { sfx: 'reveal' }] },
      { id: 'm1_hearttree', type: 'decor', at: [48, 33], look: 'tree', lookOpt: { c: ['#4a7a3a', '#2f5a2e', '#4a3016', '#6a9a50'] }, cond: { flag: 'm1_led' },
        lines: ['The oldest tree in the orchard, in the corner nobody picks.', 'Carved into the bark at a child’s height: a heart, cut into four, the way she cut the apples.'] },
      { id: 'm1_lunch', type: 'decor', at: [22, 22], look: 'cake', lookOpt: { c: ['#e8e0c8'] }, cond: { realHour: [12, 13] },
        lines: ['A lunch box on the courtyard stones, lid open.', 'Apple quarters, each one cut into a heart, and beside them the peel in one long unbroken ribbon.',
          'Nobody has eaten any. They have not gone brown.'],
        use: [{ secret: 'm1_lunch' }] }
    ],
    mech: [{ type: 'guide', ent: 'N2106', wait: 4.5, cond: { notFlag: 'm1_led' }, flag: 'm1_led', reward: [{ secret: 'm1_led' }],
      winLines: ['The girl stops at the last tree of the orchard and puts her hand flat on its bark.', { t: 'This one was hers. She said it was too old to give apples, so it gave shade instead.', lang: 'en', who: 'The Girl Who Picks Up the Fallen Ones' },
        'Under her hand, carved at your height, a heart cut into four.'] }],
    npcs: [{ id: 'N2106', name: 'The Girl Who Picks Up the Fallen Ones', at: [30, 22], behavior: 'patrol', path: [[30, 22], [47, 22], [47, 33], [47, 33]], speed: 0.9, kind: 'kid', solid: true,
      look: H({ t: 'kid', head: 'round', hairStyle: 'long', body: 'apron', c: ['#c86a4a', '#8a4a3a', '#f0d0b0', '#3a2a1a'], acc: 'box', h: 17 }),
      lines: [EN('I only pick up the ones that have fallen. The ones on the trees still belong to the trees.'),
        EN('Come with me. Stay close, or I stop. I’ll show you which tree was hers.'),
        { seq: [EN('At noon she brought the hearts out to the courtyard.'), EN('Every day. Even on the days there was nobody to eat them.')] },
        EN('The bees dance where the sweet things are hidden. Three steps that way, one step up. Bees don’t lie.')] }],
    rules: ['The hive hums a dance: “three steps left, one up”. Three cells left of the hive and one up, the ground is hollow: a buried jar of honey (secret).',
      'The girl who picks up the fallen apples (new inhabitant) walks to the orchard’s oldest tree, in the south-east corner, but only while you stay close to her. Follow her to the end (secret, and the tree appears for good).',
      'Between noon and 1 p.m. (real time), a lunch box with apple hearts waits in the well courtyard (secret).']
  });

  /* ---------------------------------------------------------------
   *  W007 — The Sleep Factory
   *  La salle de pause derrière le mur sud (faux mur, rangées ajoutées
   *  sous la carte), la pointeuse (pointer deux fois : entrée, sortie),
   *  la goulotte des rêves rebutés (fouiller trois fois), le tableau des
   *  veilles qui n'apparaît que chambre éteinte.
   * --------------------------------------------------------------- */
  MORE('W007', {
    fakeWalls: [[44, 33]],
    post: function (rows) { rows = rows.slice(); room(rows, 40, 33, 10, 6, '.', '#'); return rows; },
    place: [
      { id: 'm1_dustpath', type: 'decor', at: [44, 32], look: 'scuff', solid: false, flat: true,
        lines: ['A path worn into the dust by tired feet goes straight into the south wall, and stops.'] },
      { id: 'm1_cot', type: 'decor', at: [41, 36], look: 'bed', lookOpt: { c: ['#8a8a80', '#5a5a50'] },
        lines: ['A break room nobody is supposed to know about. A camp bed, still warm.', 'On the pillow, a note: “Wake me at 5:50. Do not let me sleep through. Do not let me sleep.”'],
        use: [{ secret: 'm1_breakroom' }] },
      { id: 'm1_vend', type: 'decor', at: [47, 34], look: 'vending', lookOpt: { c: ['#3a5a7a'] },
        lines: ['A vending machine that sells only iced americano. Every button is worn down to the metal.'] },
      { id: 'm1_kettle', type: 'decor', at: [46, 34], look: 'stove', lines: ['A kettle on a hot plate, switched off, still warm.', 'Eleven mugs on a tray, all clean, all labelled with the same name.'] },
      { id: 'm1_punch', type: 'decor', at: [1, 1], look: 'wallclock', lookOpt: { hour: 6, min: 50 }, lines: ['The time clock.'] },
      { id: 'm1_cards', type: 'decor', at: [3, 1], look: 'shelf', lines: ['A rack of time cards. Every one is punched IN. Not a single one has ever been punched OUT.'] },
      { id: 'm1_chute', type: 'decor', at: [56, 23], look: 'trash', lookOpt: { c: ['#5a5e66'] },
        lines: [IFR({ all: [AT('m1_chute', 0), { notFlag: 'm1_chute' }] }, ['The chute at the end of the belt. The dreams the factory could not use slide down into it, still warm.', 'You reach in: a dream about a bicycle with nobody holding the back.'], [INC('m1_chute')]),
          IFR({ all: [AT('m1_chute', 1), { notFlag: 'm1_chute' }] }, ['You reach in again: a dream of a kitchen at seven in the morning.', 'Two bowls on the table, and both of them have been used.'], [INC('m1_chute'), { reeval: true }]),
          IF({ all: [{ tempGte: { m1_chute: 2 } }, { notFlag: 'm1_chute' }] }, 'Nothing more in the chute, except, caught on the lip of it, something that is not a dream.'),
          IF({ flag: 'm1_chute' }, 'The chute is empty now. It smells faintly of warm milk.')] },
      { id: 'm1_chutenote', type: 'decor', at: [55, 23], look: 'letter', solid: false, flat: true, cond: { all: [{ tempGte: { m1_chute: 2 } }, { notFlag: 'm1_chute' }] },
        lines: ['A sticky note from a fridge door, caught on the lip of the chute, in a tired grown-up hand:',
          Object.assign(KS('못 깨워서 미안해. 밥솥에 밥 있어. 사랑해.', 'Sorry I didn’t wake you. There’s rice in the cooker. Love you.'), { who: 'the note' })],
        use: [{ set: { m1_chute: true } }, { secret: 'm1_chute' }, { reeval: true }] },
      { id: 'm1_tally', type: 'decor', at: [53, 1], look: 'board', lookOpt: { lines: ['||||| ||||| |||||', '||||| ||||| ||'], color: '#e0e0e8' }, cond: { dark: true },
        lines: ['With the lights out at home, the night-shift tally shows on the wall:', 'one stroke for every hour someone stayed awake so that someone else could sleep.',
          'The strokes go right round the factory, and start again.'],
        use: [{ secret: 'm1_tally' }] }
    ],
    mech: [{ type: 'knock', mark: 'm1_punch', n: 2, within: 1.8, sfx: 'stamp', flag: 'm1_clockout', reward: [{ secret: 'm1_clockout' }],
      firstLine: 'Clunk. The machine stamps a card: IN.',
      doneLine: 'The time clock has stopped. Its hands point to a time that is not on its face.',
      winLines: ['Clunk. OUT.', 'The machine thinks about it for a long while,', 'then prints a card with tonight’s date and a shift of zero hours, zero minutes.',
        'Somewhere along the belts, for the length of one breath, a sleeper sleeps for herself.'] }],
    rules: ['Behind the south wall, where a path worn in the dust stops, a hidden break room (secret on the camp bed).',
      'Punch the time clock by the west entrance twice in quick succession — in, then out — for a shift of zero hours (secret).',
      'Reach twice into the chute at the end of the fourth conveyor belt, by the east wall: then a note turns up on its lip (secret).',
      'With the bedroom light off, a tally of night-shift hours appears on the north wall, in the north-east corner (secret).']
  });

  /* ---------------------------------------------------------------
   *  W008 — Empty Neighbourhood
   *  Énigme : la marelle escargot (stepOrder en spirale, jusqu'à HOME).
   *  Secrets : la lanterne du dîner (heure réelle), le chien ramené à sa
   *  niche (on le mène), la lumière du perron dans les dernières minutes.
   * --------------------------------------------------------------- */
  var SNAIL = [[60, 26], [61, 26], [62, 26], [62, 27], [62, 28], [61, 28], [60, 28], [60, 27], [61, 27]];
  var SNAILP = {}; SNAIL.forEach(function (c, i) { SNAILP[c[0] + ',' + c[1]] = i; });
  MORE('W008', {
    place: SNAIL.map(function (c, i) {
      return i < 8 ? { id: 'm1_hop' + i, type: 'decor', at: c, look: 'chalkmark', solid: false, flat: true, lines: ['A chalk square with a ' + (i + 1) + ' in it. The ' + (i + 1) + ' is written backwards.'] }
        : { id: 'm1_hophome', type: 'decor', at: c, look: 'hopscotch', solid: false, flat: true, lines: ['A hopscotch shaped like a snail’s shell. In the middle, in chalk:', 'HOME. The numbers curl round it from the outside in, one to eight.'] };
    }).concat([
      { id: 'm1_dinner', type: 'decor', at: [11, 22], look: 'lantern', lookOpt: { c: ['#f0c070'] }, light: 1.6, cond: { realHour: [18, 20] },
        lines: ['A paper lantern has been lit by the Moore house’s door,', 'the way you light one when someone is expected for dinner.', 'Through the shutters: the smell of rice, and the clink of two spoons, not one.'],
        use: [{ secret: 'm1_dinner' }] },
      { id: 'm1_kennel', type: 'decor', at: [48, 10], look: 'crate', lookOpt: { c: ['#8a5a3a'] },
        lines: [IF({ notFlag: 'm1_kennel' }, 'An old kennel by the Walker house, its bowl turned over. A name was painted above the door, then painted out.'),
          IF({ notFlag: 'm1_kennel' }, 'Nobody walks the dog home any more. It follows whoever passes, hoping.'),
          IF({ flag: 'm1_kennel' }, 'The bowl has been turned the right way up. There is water in it.')] },
      { id: 'm1_kenneltrig', type: 'trigger', at: [48, 11], cond: { all: [{ notFlag: 'm1_kennel' }, { fn: function () { var g = YN.game, e = g && g.rt && g.rt.findEnt('N052'); return !!(e && e.present && Math.abs(e.x - 48) + Math.abs(e.y - 11) <= 3); } }] },
        lines: ['The dog trots past you to the old kennel, turns round three times and lies down with a long sigh.', 'It was only waiting for someone to walk it home.'],
        do: [{ set: { m1_kennel: true } }, { secret: 'm1_kennel' }] },
      { id: 'm1_porch', type: 'decor', at: [9, 36], look: 'streetlamp', lookOpt: { c: ['#f0e0a0'] }, light: 2, cond: { remainingLt: 120 },
        lines: ['In the last minutes of the dream, the porch light of the Choi house has come on, for the first time.', 'Under it, on the step, two pairs of shoes: one big, one small. Somebody has come home.'],
        use: [{ secret: 'm1_porch' }] }
    ]),
    mech: [{ type: 'stepOrder', plates: SNAILP, count: SNAIL.length, flag: 'm1_snail', color: 'rgba(240,240,255,0.9)', reward: [{ secret: 'm1_snail' }],
      winLines: ['You land on HOME on one foot, then on two.', 'Somewhere a door opens and a voice calls a child in for tea. Not you. Then, a moment later — you.', 'When you look up, every door in the street is shut again.'] }],
    rules: ['Puzzle: a snail-shaped hopscotch is chalked by the east wall, south of the houses. Step on its squares from 1 to 8 round the spiral, from the outside in, and finish on HOME (secret).',
      'Between 6 and 8 p.m. (real time), a lantern is lit by the Moore house (secret).',
      'The unleashed dog follows you everywhere: lead it to the old kennel by the Walker house (top row, fourth house) and step beside it (secret).',
      'In the last two minutes of the dream, the porch light of the Choi house (bottom row, west) comes on (secret).']
  });

  /* ---------------------------------------------------------------
   *  W009 — The House That Waits
   *  Énigme : remettre la chaise contre la table (push). Secrets : la
   *  carte postale quand on siffle près de l'horloge du couloir, le
   *  rideau du petit lit (fenêtre de la chambre ouverte), dire « je suis
   *  rentrée » dans l'entrée.
   * --------------------------------------------------------------- */
  MORE('W009', {
    place: [
      { id: 'm1_chair', type: 'decor', at: [10, 2], look: 'chair', lines: ['A chair, pushed back against the wall.'] },
      { id: 'm1_place', type: 'plate', at: [9, 3], look: 'scuff', flat: true,
        lines: [IF({ notFlag: 'm1_three' }, ['Two pale scratches on the floorboards, from the wall to the table,', 'where a chair used to be pulled out every evening.']),
          IF({ flag: 'm1_three' }, 'The third chair is at the table. Nobody sits on it, but it is there.')] },
      { id: 'm1_postcard', type: 'decor', at: [16, 24], look: 'letter', solid: false, flat: true, cond: { flag: 'm1_clock7' },
        lines: ['A postcard, pushed through the letterbox while the clock was looking the other way. A beach in winter.', 'On the back, in a man’s slanting hand: “Back on Tuesday. J.” There is no date, and no stamp.'],
        use: [{ secret: 'm1_postcard' }] },
      { id: 'm1_curtain', type: 'decor', at: [10, 14], look: 'curtain', lookOpt: { c: ['#e8c8d8'] },
        lines: [IF({ roomWindow: false }, 'A curtain hung over a wall with no window behind it. It never moves.'),
          IF({ roomWindow: true }, 'The curtain lifts and falls in a draught that comes all the way from your own bedroom window.')] },
      { id: 'm1_wallpaper', type: 'decor', at: [11, 14], look: 'drawing', solid: false, flat: true, cond: { roomWindow: true },
        lines: ['Where the curtain has lifted, someone has drawn on the wallpaper in felt-tip, at child height:', 'a girl and a tall man holding hands.',
          'The man’s face has been coloured over, very carefully, so as not to go over the lines.'],
        use: [{ secret: 'm1_curtain' }] },
      { id: 'm1_hallear', type: 'listen', at: [17, 23], listenDist: 4,
        listen: [{ match: ['i’m home', 'im home', 'i am home', 'i’m back', 'im back', 'home now', '다녀왔습니다', '다녀왔어', '다녀왔어요', '나 왔어', '엄마 나 왔어', '왔어요'],
          do: [{ secret: 'm1_imhome' }],
          lines: ['Nobody answers. The clock ticks. Then, from every room at once, very quietly, as if they had been practising:', EN('Welcome home.'), 'Someone sets a fourth plate on the table, then remembers, and takes it away again.'] }] }
    ],
    mech: [{ type: 'push', blocks: ['m1_chair'], plates: ['m1_place'], sfx: 'step_wood', flag: 'm1_three', reward: [{ secret: 'm1_three' }],
        winLines: ['The chair is back at the table.', 'For a moment the three places are complete: three bowls, three spoons, three chairs. Nobody sits down.', 'The kitchen breathes out, the way a house does when everyone is in.'] },
      { type: 'gate', mark: 'clock', flag: 'm1_clock7', events: ['whistle'], dist: 4, text: 'The hall clock lurches forward, hours at a time, and stops at seven.' }],
    rules: ['Puzzle: push the chair standing against the kitchen wall back to its place at the table (down, then left): the three places are set (secret).',
      'Whistle (Blackbird Whistle, E02) near the hall clock: it jumps to seven, and a postcard appears on the floor by the front door (secret).',
      'With the bedroom window open, the curtain in the child’s bedroom lifts and shows a drawing (secret).',
      'Say “I’m home” (or 다녀왔습니다) in the hall by the front door (secret).']
  });

  /* ---------------------------------------------------------------
   *  W010 — District of Identical Doors
   *  Énigme : l'interphone et ses quatre molettes (dials, 1-2-0-4).
   *  Secrets : le renfoncement derrière la façade de la porte 12 (faux
   *  mur, au bord ouest), attendre devant la porte 90 (rester immobile),
   *  la lumière sous la porte 74 quand les portes respirent.
   * --------------------------------------------------------------- */
  var BREATH = { remainingMod: { every: 90, under: 9 } };
  MORE('W010', {
    fakeWalls: [[2, 4]],
    post: function (rows) { rows = rows.slice(); fill(rows, 3, 4, 3, 1, ':'); return rows; },
    place: [
      { id: 'm1_intercom', type: 'decor', at: [19, 1], look: 'intercom',
        lines: [IF({ notFlag: 'm1_1204' }, ['An intercom at the end of the street, with four little number wheels under it, like a bicycle lock.', 'All of them on 0.']),
          IF({ notFlag: 'm1_1204' }, 'Someone has scratched beside the wheels: “say it in the lift so you don’t forget”.'),
          IF({ flag: 'm1_1204' }, 'The intercom hums. The line is still open, and nobody is speaking.')] },
      { id: 'm1_dial1', type: 'decor', at: [20, 1], look: 'switch', lines: ['A number wheel.'] },
      { id: 'm1_dial2', type: 'decor', at: [21, 1], look: 'switch', lines: ['A number wheel.'] },
      { id: 'm1_dial3', type: 'decor', at: [22, 1], look: 'switch', lines: ['A number wheel.'] },
      { id: 'm1_dial4', type: 'decor', at: [23, 1], look: 'switch', lines: ['A number wheel.'] },
      { id: 'm1_crack', type: 'decor', at: [1, 4], look: 'crack', solid: false, flat: true,
        lines: ['The plaster at the corner of the façade of door 12 is cracked.', 'Cold air comes through, as if there were a room behind it after all.'] },
      { id: 'm1_mitten', type: 'decor', at: [5, 4], look: 'sock', lookOpt: { c: ['#c04a4a'] },
        lines: ['Behind the front of door 12 there is no house, only the back of the door and a single hook.', 'On the hook, a child’s mitten on a string.', 'Sewn inside it, a name tag in marker: IF FOUND, PLEASE RETURN TO FLAT 12-04.'],
        use: [{ secret: 'm1_mitten' }] },
      { id: 'm1_mat90', type: 'decor', at: [20, 18], look: 'scuff', solid: false, flat: true,
        lines: ['A doormat in front of door 90, worn through in the middle.', 'Someone stood here a long time without knocking.'] },
      { id: 'm1_breath74', type: 'decor', at: [44, 18], look: 'glint', solid: false, flat: true, cond: BREATH,
        lines: ['For a few seconds all twelve doors breathe in together, and under door 74 a line of warm light shows.', 'Someone is home.', 'There is a smell of soup. Then the doors breathe out, and it is gone.'],
        use: [{ secret: 'm1_breath74' }] }
    ],
    mech: [{ type: 'dials', marks: ['m1_dial1', 'm1_dial2', 'm1_dial3', 'm1_dial4'], states: 10, target: [1, 2, 0, 4], labelText: '', sfx: 'click', flag: 'm1_1204', reward: [{ secret: 'm1_1204' }],
        doneLine: 'The wheels are stuck on 1, 2, 0, 4. They will not turn again.',
        winLines: ['The wheels click into place: one, two, zero, four. The intercom crackles.', KS('누구세요?', 'Who is it?'),
          'You say nothing. The voice waits. It is used to that.', KS('…들어와. 문 열어 놨어.', '…Come in. I’ve left the door open.'),
          'Somewhere in the street, one of the identical doors has unlocked itself.', 'They all look the same. You will never know which one it was.'] },
      { type: 'standStill', zone: [20, 18, 20, 18], secs: 18, flag: 'm1_wait90', reward: [{ secret: 'm1_wait90' }],
        winLines: ['You stand in front of door 90 and wait,', 'the way you wait outside your own door when you have forgotten the key and do not want to knock.',
          'After a long while the letterbox flap lifts by itself, a finger’s width,', 'and lets out a smell of rice and fabric softener. Your smell.',
          'Then it closes, gently, as if it had made a mistake.'] }],
    rules: ['Puzzle: the intercom at the north end of the street has four number wheels. Set them to 1, 2, 0, 4 (the flat number) and someone answers (secret). The mitten behind door 12 carries the number.',
      'At the west edge, where the plaster of door 12’s façade is cracked, one cell of the façade can be walked through: a hook with a mitten behind it (secret).',
      'Stand still for about twenty seconds on the worn doormat in front of door 90 (secret).',
      'Every minute and a half of the dream, for a few seconds, a line of light shows under door 74 (secret).']
  });

  /* ---------------------------------------------------------------
   *  W011 — Desert of Telephones (le monde boucle : on ne touche pas la
   *  carte). Le septième téléphone qui ne sonne qu'en haut de chaque
   *  heure réelle (l'horloge parlante), le combiné que le vent découvre
   *  quand la fenêtre de la chambre est ouverte, le seul point du désert
   *  où aucune ligne ne va (le plus loin possible de la cabine).
   *  Indices : la monteuse de lignes (N2111).
   * --------------------------------------------------------------- */
  MORE('W011', {
    place: [
      { id: 'm1_hourphone', type: 'decor', at: [9, 40], look: 'phone', lookOpt: { c: ['#2a2a2a'] }, cond: { fn: function () { return YN.realtime.now().getMinutes() < 3; } },
        lines: [{ t: function () { var d = YN.realtime.now(), m = d.getMinutes(); return 'At the third stroke, it will be ' + d.getHours() + ':' + (m < 10 ? '0' : '') + m + ', precisely.'; }, lang: 'en', who: 'the speaking clock' },
          'Then, for the first time in all its years, the speaking clock asks a question.', { t: '…And how are you, tonight?', lang: 'en', who: 'the speaking clock' }],
        use: [{ secret: 'm1_speakingclock' }] },
      { id: 'm1_receiver', type: 'decor', at: [5, 13], look: 'phone', lookOpt: { c: ['#b09060'] }, cond: { roomWindow: true },
        lines: ['The wind from your open window has come all the way out to the desert.', 'It has blown the sand off a receiver, its cord running down into the dune.',
          'You lift it. A girl’s voice, very close, practising a call she will never make:', KS('엄마, 오늘 학교에서… 아니야. 아무 일도 없었어. 괜찮아.', 'Mum, today at school… no. Nothing happened. It’s fine.'),
          'Then the line goes quiet, as if she had hung up before anyone could answer.'],
        use: [{ secret: 'm1_receiver' }] },
      { id: 'm1_nowhere', type: 'trigger', at: [0, 0], cond: { notFlag: 'm1_nowhere' },
        lines: ['Here, exactly as far from every telephone as the desert allows, nothing rings at all.', 'In the silence you hear your own heart.', 'It sounds as if it has been on hold all this time, and has just been put through.'],
        do: [{ set: { m1_nowhere: true } }, { secret: 'm1_nowhere' }] }
    ],
    npcs: [{ id: 'N2111', name: 'The Line Engineer', at: [26, 18], behavior: 'static', kind: 'human', solid: true,
      look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#d8a030', '#8a6a2a', '#e0c0a0', '#3a3a3a'], acc: 'phone' }),
      lines: [{ seq: [EN('Every line in this desert runs to the box in the middle.'), EN('I check them every night. Every one of them is engaged.')] },
        { seq: [EN('Walk as far from the box as the desert lets you and you reach the one spot no line goes to.'), EN('Quietest place I know.')] },
        { seq: [EN('At the top of every hour one more telephone rings out here, for a minute or two.'), EN('I have never once found it in time.')] },
        EN('When the wind gets up where you sleep, the sand shifts out here. Things come up. Receivers, mostly.')] }],
    rules: ['During the first three minutes of every real hour, a black telephone appears in the sand to the south-west: the speaking clock gives the real time, then asks how you are (secret).',
      'With the bedroom window open, the wind uncovers a receiver in the north-west of the desert (secret).',
      'The desert loops: the point farthest from the central phone box (the corner of the map) is the only silent place. Step on it (secret). The line engineer (new inhabitant) hints at all three.']
  });

  /* ---------------------------------------------------------------
   *  W012 — Village of the Unknown Tongue
   *  La Cloche (E25) sonnée sous la grande cloche sans battant, la jarre
   *  aux lettres noyées (fouiller quatre fois : ㅇ ㅓ ㅁ ㅁ ㅏ), la porte
   *  qui ne s'ouvre qu'à qui sait dire bonjour (dire « ouna-sé »), les
   *  signes à la craie de l'enfant, lisibles avec les Lunettes.
   * --------------------------------------------------------------- */
  var OUNA = ['ouna se', 'ouna-se', 'ounase', 'ouna se ouna se'];
  MORE('W012', {
    place: [
      { id: 'm1_rope', type: 'decor', at: [28, 21], look: 'wire',
        lines: [IF({ notFlag: 'm1_belltongue' }, 'The bell rope. Pulling it does nothing: the bell has no tongue.'),
          IF({ flag: 'm1_belltongue' }, 'The rope still trembles a little, as if the bell were remembering something.')],
        onEffect: { E25: [{ if: { notFlag: 'm1_belltongue' }, set: { m1_belltongue: true }, secret: 'm1_belltongue', sfx: 'bell',
          lines: ['You ring the little wooden bell under the big one.', 'For a moment, nothing. Then the big bell answers, very low and very long, with a tongue it does not have.',
            'On every door in the village the painted words shiver, as if somebody had called each of them by name.'],
          else: [{ msg: 'The big bell hums under your little one, very low, and remembers.' }] }, { reeval: true }] } },
      { id: 'm1_bellword', type: 'decor', at: [27, 21], look: 'glyph', solid: false, flat: true, cond: { flag: 'm1_belltongue' }, glyphs: 'remember',
        lines: ['Since the great bell answered, a word has come back on the ground beneath it,', 'as if it had fallen out of the bronze. Nobody here remembers saying it.'] },
      { id: 'm1_jar', type: 'decor', at: [11, 31], look: 'jar',
        lines: [IFR({ all: [AT('m1_jar', 0), { notFlag: 'm1_jar' }] }, ['A jar beside the low house, full of rainwater and drowned letters.', 'You roll up your sleeve and reach in: a small circle.'], [INC('m1_jar')]),
          IFR({ all: [AT('m1_jar', 1), { notFlag: 'm1_jar' }] }, 'You reach in again: a straight stroke, with a little branch on its left side.', [INC('m1_jar')]),
          IFR({ all: [AT('m1_jar', 2), { notFlag: 'm1_jar' }] }, 'Again: a small square, and another one stuck to it.', [INC('m1_jar')]),
          IFR({ all: [AT('m1_jar', 3), { notFlag: 'm1_jar' }] }, ['Last of all, a straight stroke with a branch on its right.', 'You lay the letters out on the doorstep to dry, in the order they came.'], [INC('m1_jar'), { reeval: true }]),
          IF({ tempGte: { m1_jar: 4 } }, 'The jar holds only rainwater now.'),
          IF({ all: [{ not: { tempGte: { m1_jar: 4 } } }, { flag: 'm1_jar' }] }, 'The jar holds only rainwater now. Someone has taken the letters in.')] },
      { id: 'm1_letters', type: 'decor', at: [12, 31], look: 'scraps', solid: false, flat: true, cond: { tempGte: { m1_jar: 4 } },
        lines: ['The drowned letters, drying on the doorstep in the order they came out.', 'They make a word the village never had:', Object.assign(KS('엄마', 'Mum'), { who: 'the doorstep' })],
        use: [{ set: { m1_jar: true } }, { secret: 'm1_jar' }] },
      { id: 'm1_h7step', type: 'listen', at: [38, 34], listenDist: 3,
        listen: [{ if: { notFlag: 'm1_h7' }, match: OUNA, do: [{ set: { m1_h7: true } }, { secret: 'm1_h7' }, { collect: 'cranes' }],
          lines: ['The door that only opens for someone who knows how to say hello opens, just a crack.',
            'Inside, in the dark, the words the village has lost hang from the beams on threads, like herbs left to dry.',
            'One of them is not a word at all but a paper crane.', 'It drops into your hands, as if it had been waiting for someone small enough to catch it.'] },
          { if: { flag: 'm1_h7' }, match: OUNA, lines: ['The painted door opens a crack, recognises you, and closes again, pleased.'] }] },
      { id: 'm1_chalkglyphs', type: 'decor', at: [16, 27], look: 'chalkmark', solid: false, flat: true, hiddenUntilReveal: true, glyphs: 'goodbye in our tongue',
        lines: [IF({ equipped: 'E14' }, ['Through the glasses, the child’s chalk signs settle one by one,', 'as if they wanted very much to be read before the rain.'], [{ secret: 'm1_chalkglyphs' }]),
          IF({ notEquipped: 'E14' }, 'Chalk signs, almost rubbed away by feet. Nobody reads them.')] }
    ],
    rules: ['With the Bell (E25) equipped, ring it facing the rope under the great bell with no clapper: the great bell answers (secret).',
      'Reach four times into the jar of drowned letters by the low house in the south-west, then read the letters drying on the step: they spell 엄마 (secret).',
      'Say “ouna-sé” (the village greeting) on the doorstep of the house whose door “only opens for someone who knows how to say hello” (south, right of the path): a paper crane (secret).',
      'Chalk signs drawn by the child, near where she sits, are only visible with the Glasses (E14) revealing (secret).']
  });

  /* ---------------------------------------------------------------
   *  W013 — The Musical Forest
   *  Le silence du rond de champignons (rester immobile dedans), la
   *  ronde autour de l'arbre chef (trois tours : laps), le creux de
   *  l'arbre de la chouette (chambre éteinte).
   * --------------------------------------------------------------- */
  MORE('W013', {
    place: [
      { id: 'm1_trodden', type: 'decor', at: [23, 24], look: 'scuff', solid: false, flat: true,
        lines: ['The grass round the chief tree is trodden flat in a ring,', 'as if children had danced round it holding hands — three times, the way the song goes.'] },
      { id: 'm1_musicbox', type: 'decor', at: [27, 23], look: 'musicbox', cond: { tempGte: { m1_laps: 12 } },
        lines: ['In the middle of the trodden ring, a wind-up music box has appeared on the grass.', 'Its little dancer is still turning.', 'It plays the three neighbours’ notes, then a fourth that none of them has.'],
        use: [{ secret: 'm1_round' }] },
      { id: 'm1_hollow', type: 'decor', at: [11, 11], look: 'nest', cond: { dark: true },
        lines: ['In the dark, a hollow shows in the trunk below the owl: a nest made of shredded paper.', 'Song sheets, torn into strips. Lullabies, with all the words cut out and only the notes left.'],
        use: [{ secret: 'm1_hollow' }] }
    ],
    mech: [{ type: 'standStill', zone: [5, 5, 7, 7], secs: 16, flag: 'm1_ring', reward: [{ secret: 'm1_ring' }],
        winLines: ['Inside the ring of mushrooms the forest goes silent: no birds, no leaves, not even your own breathing.',
          'In the silence, very close, somebody says your name. All of it, slowly, the way it is said at bedtime.',
          'When you step out of the ring, the birds start again, as if nothing had happened.'] },
      { type: 'laps', center: [27.5, 20.5], key: 'm1_laps' }],
    rules: ['Stand still for about fifteen seconds inside the ring of mushrooms (north-west): somebody says your name (secret).',
      'Walk three times round the chief tree, like a children’s round (the trodden ring is the hint): a music box appears in the clearing (secret).',
      'With the bedroom light off, a hollow full of shredded song sheets appears in the owl’s tree (secret).']
  });

  /* ---------------------------------------------------------------
   *  W014 — The Charcoal World
   *  La porte dessinée au cul-de-sac (frapper deux fois : « toc toc »),
   *  les creux du crayon que seule la Lanterne fait voir, la petite pièce
   *  derrière le mur hachuré qu'on efface (Gomme) au bas du dédale.
   * --------------------------------------------------------------- */
  MORE('W014', {
    post: function (rows) { rows = rows.slice(); room(rows, 23, 16, 5, 4, '.', '#'); put(rows, 24, 16, 'p'); return rows; },
    place: [
      { id: 'm1_drawndoor', type: 'decor', at: [21, 5], look: 'door', lookOpt: { style: 'shoji', c: ['#d8d8d8'] }, lines: ['A door, drawn in charcoal at the end of the corridor.'] },
      { id: 'm1_dents', type: 'decor', at: [32, 15], look: 'drawing', lookOpt: { c: ['#e8e4dc'] }, solid: false, flat: true, cond: { equipped: 'E05' },
        lines: ['In the lantern’s light, the blank paper at the end of the corridor shows what the eraser could not take:', 'the dents of a pencil, pressed down hard.',
          'A tall man, a suitcase, and a small hand in his.', 'Then many lines across him, all in the same direction, as if someone had tried to make it rain on him.'],
        use: [{ secret: 'm1_dents' }] },
      { id: 'm1_unfinished', type: 'decor', at: [26, 18], look: 'drawing',
        lines: ['Behind the hatched wall, a drawing nobody was allowed to finish: three people on a beach in winter.', 'The man is only half drawn. The pencil is still lying across his chest, where it was put down.'],
        use: [{ secret: 'm1_unfinished' }] }
    ],
    mech: [{ type: 'knock', mark: 'm1_drawndoor', n: 2, within: 2, sfx: 'knock', flag: 'm1_knockknock', reward: [{ secret: 'm1_knockknock' }],
      firstLine: 'Knock.', doneLine: 'A door drawn in charcoal. Someone has already knocked.',
      winLines: ['Knock knock.', { t: '…Who’s there?', lang: 'en', who: 'the drawn door' },
        'You have nothing to say. The door waits, the way he waited for you to say “who’s there?”, grinning already.',
        { t: '…Nobody? Nobody who?', lang: 'en', who: 'the drawn door' }, 'And then nothing. Whoever was drawing it never got to the end.'] }],
    rules: ['At a dead end in the middle of the maze (north of the central corridor), a door is drawn in charcoal: knock on it twice, quickly (secret).',
      'With the Lantern (E05) equipped, the dents of an erased drawing show on the paper at the west end of the eastern bottom corridor (secret).',
      'At the west end of the bottom corridor right of the exit, the bottom wall is hatched paper: rub it out with the Eraser (E10) to find a small room with an unfinished drawing (secret).']
  });

  /* ---------------------------------------------------------------
   *  W015 — The Arcade
   *  Énigme de plus : l'écran d'attraction (cycleFrames : appuyer quand
   *  la fille fait signe). Secrets : dire son nom devant le tableau des
   *  scores, la fente de monnaie qu'on pousse trois fois, la machine à
   *  deux joueurs dont les boutons s'allument dans un ordre (sequence).
   * --------------------------------------------------------------- */
  MORE('W015', {
    place: [
      { id: 'm1_initials', type: 'listen', at: [8, 21], listenDist: 4,
        listen: [{ match: ['sora', '소라', 'so ra'], do: [{ secret: 'm1_initials' }, { sfx: 'coin' }],
          lines: ['The scoreboard flickers. For a moment the first line is complete:', { t: '1. SORA  999', lang: 'en', who: 'the scoreboard' },
            'And under it, a second line that was never there before, blinking as if someone had just pressed START:', { t: '2. MUM  001', lang: 'en', who: 'the scoreboard' },
            'Then it goes back to an S and two dashes.'] }] },
      { id: 'm1_coinslot', type: 'decor', at: [11, 4], look: 'glint', solid: false, flat: true,
        lines: [IFR({ all: [AT('m1_coin', 0), { notFlag: 'm1_coinslot' }] }, 'The coin return of the machine above. You push the little flap: nothing.', [INC('m1_coin')]),
          IFR({ all: [AT('m1_coin', 1), { notFlag: 'm1_coinslot' }] }, 'Nothing again. The flap is warm, as if another hand had just been there.', [INC('m1_coin')]),
          IFR({ all: [AT('m1_coin', 2), { notFlag: 'm1_coinslot' }] }, 'On the third push, something drops out and rolls across the carpet.', [INC('m1_coin'), { reeval: true }]),
          IF({ all: [{ tempGte: { m1_coin: 3 } }, { notFlag: 'm1_coinslot' }] }, 'The coin return is empty now.'),
          IF({ flag: 'm1_coinslot' }, 'The coin return is empty. It will stay empty now.')] },
      { id: 'm1_coin', type: 'decor', at: [12, 5], look: 'coin', solid: false, flat: true, cond: { all: [{ tempGte: { m1_coin: 3 } }, { notFlag: 'm1_coinslot' }] },
        lines: ['An old coin that somebody forgot in the machine years ago, and never came back for. It is still warm.'],
        use: [{ if: { notFlag: 'm1_coinslot' }, set: { m1_coinslot: true }, secret: 'm1_coinslot', collect: 'coins' }, { reeval: true }] },
      { id: 'm1_attract', type: 'decor', at: [36, 6], look: 'arcade', lookOpt: { c: ['#6040a0'] }, animated: true, lines: ['A machine showing its attract screen.'] },
      { id: 'm1_sticker', type: 'decor', at: [35, 7], look: 'doodle', solid: false, flat: true, lines: ['On the side of the machine, a sticker in felt-tip, in a child’s hand: “wait for her to wave”.'] },
      { id: 'm1_duo', type: 'decor', at: [12, 1], look: 'arcade', lookOpt: { c: ['#a02060'] }, animated: true,
        lines: [IF({ notFlag: 'm1_duo' }, ['A two-player machine against the wall. PLAYER 1 is worn smooth; PLAYER 2 has never been pressed.', 'Under the screen, four round buttons light up one after another, then wait.']),
          IF({ flag: 'm1_duo' }, 'The two-player machine shows two little figures side by side, waiting for the next round.')] },
      { id: 'm1_btn1', type: 'decor', at: [13, 1], look: 'switch', lookOpt: { c: ['#e04040'] }, lines: ['A red button.'] },
      { id: 'm1_btn2', type: 'decor', at: [14, 1], look: 'switch', lookOpt: { c: ['#40a0e0'] }, lines: ['A blue button.'] },
      { id: 'm1_btn3', type: 'decor', at: [15, 1], look: 'switch', lookOpt: { c: ['#e0c040'] }, lines: ['A yellow button.'] },
      { id: 'm1_btn4', type: 'decor', at: [16, 1], look: 'switch', lookOpt: { c: ['#40c060'] }, lines: ['A green button.'] }
    ],
    mech: [{ type: 'sequence', order: ['m1_btn3', 'm1_btn1', 'm1_btn4', 'm1_btn2'], ring: { every: 1.1, pause: 4, hear: 9, sfx: 'chime', glyph: '●' }, flag: 'm1_duo', reward: [{ secret: 'm1_duo' }],
        okLines: ['Bip.', 'Bip, bip.', 'Bip, bip, bip.'], wrongLine: 'A low buzz. The four buttons start again from the beginning, patiently.', doneLine: 'The buttons are dark. The round is over, and nobody lost.',
        winLines: ['The fourth button. On the screen: PLAYER 2 HAS JOINED.', 'For one round a second little figure runs beside yours, jumping when you jump, never once getting in the way.',
          'GAME OVER, for both of you at the same time. That is the nicest way to lose.'] },
      { type: 'cycleFrames', mark: 'm1_attract', every: 1.7, good: 3, flag: 'm1_wave', reward: [{ secret: 'm1_wave' }],
      frames: ['The screen: a spaceship, firing at nothing.', 'The screen: a dragon made of seven pixels, asleep on its gold.', 'The screen: HIGH SCORES. S__ 999.',
        'The screen: a little girl at a lit window, waving at somebody down in the street.', 'The screen: INSERT COIN.', 'The screen: GAME OVER, in letters with tears in them.'],
      doneLine: 'The machine shows a woman in the street at dawn, waving up at a window, over and over.',
      winLines: ['You press START at the exact moment the girl on the screen is waving.', 'The game begins. It is very short: a woman walks home along a street at dawn, looks up, and waves back.', 'Then INSERT COIN, as if nothing had happened.'] }],
    rules: ['Puzzle: the machine against the east wall loops through attract screens. Press it while the girl at the window is waving (a sticker says “wait for her to wave”) (secret).',
      'Say “Sora” (the name on the scoreboard, S__) near the scoreboard: the board shows the whole name, and a second player (secret).',
      'Push the coin return under a machine of the top row three times: an old coin (secret, collection piece).',
      'The two-player machine against the north wall flashes its four buttons in an order (yellow, red, green, blue): press them in the same order and a second player joins (secret).']
  });

  /* ---------------------------------------------------------------
   *  W016 — The Empty Pool
   *  Le bonnet de bain (18 h–19 h, heure réelle de la leçon), compter
   *  jusqu'à dix au bord du grand bain (rester immobile), le vestiaire
   *  muré derrière la paroi est (faux mur, colonnes ajoutées).
   * --------------------------------------------------------------- */
  MORE('W016', {
    fakeWalls: [[43, 11]],
    post: function (rows) { rows = rows.slice(); room(rows, 43, 8, 8, 7, ',', '#'); return rows; },
    place: [
      { id: 'm1_cap', type: 'decor', at: [30, 5], look: 'ball', lookOpt: { c: ['#e04848'] }, solid: false, cond: { realHour: [18, 19] },
        lines: ['A child’s swimming cap on the edge of the pool, still wet,', 'as if the six o’clock lesson had only just finished.', 'Inside, in marker on the rubber: S.'],
        use: [{ secret: 'm1_cap' }] },
      { id: 'm1_deeppaint', type: 'decor', at: [36, 12], look: 'chalkmark', solid: false, flat: true,
        lines: ['Painted on the tiles, at the edge of the deep end, in faded blue: DEEP END. COUNT TO TEN BEFORE YOU JUMP.'] },
      { id: 'm1_tilecrack', type: 'decor', at: [42, 11], look: 'crack', solid: false, flat: true,
        lines: ['A crack in the tiles runs up the east wall and straight through it.', 'A smell of chlorine and wet towels comes out.'] },
      { id: 'm1_clockers', type: 'decor', at: [45, 9], look: 'locker', lookOpt: { c: ['#7aa0b0'] }, lines: ['A changing room someone tiled over.', 'Lockers with rubber keys on wristbands, all of them hanging in their doors.'] },
      { id: 'm1_cbench', type: 'decor', at: [46, 13], look: 'bench', lookOpt: { c: ['#a8c8d0'] }, lines: ['A slatted bench, still damp. Small wet footprints go from it to the wall, and stop.'] },
      { id: 'm1_swimsuit', type: 'decor', at: [48, 9], look: 'towel', lookOpt: { c: ['#3a7ad0'] },
        lines: ['A child’s swimsuit on a peg, bought a size too big “so it lasts”. The price tag is still on it.'],
        use: [{ secret: 'm1_swimsuit' }] }
    ],
    mech: [{ type: 'standStill', zone: [36, 13, 37, 15], secs: 10, flag: 'm1_count10', reward: [{ secret: 'm1_count10' }],
      winLines: ['You stand at the edge of the deep end and count to ten, the way the lesson would have started.',
        'On ten, you step off. The empty pool catches you like water: slowly, without a splash.', 'For a moment you are swimming. Nobody is there to see. You do it anyway.'] }],
    rules: ['Between 6 and 7 p.m. (real time, the hour on the pool clock), a wet swimming cap lies on the edge of the pool (secret).',
      'Stand still for ten seconds on the edge just right of the deep end, where the tiles say “count to ten” (secret).',
      'Where a crack runs up the east wall, the wall can be walked through: a tiled-over changing room (secret on the swimsuit).']
  });

  /* ---------------------------------------------------------------
   *  W017 — The Night Supermarket
   *  « Deux pour un » vu dans le Miroir de poche, le mot glissé sous les
   *  portes à la fermeture (fin du rêve), la pomme posée sur le tapis de
   *  caisse (objet rapporté du Verger).
   * --------------------------------------------------------------- */
  MORE('W017', {
    place: [
      { id: 'm1_forone', type: 'decor', at: [38, 1], look: 'shelf',
        lines: [IF({ notFlag: 'm1_fortwo' }, 'A shelf of ready meals. Every tray is labelled FOR ONE.'), IF({ flag: 'm1_fortwo' }, 'A shelf of ready meals. In the glass of the shelf, every tray still has its twin.')],
        onEffect: { E21: [{ if: { notFlag: 'm1_fortwo' }, set: { m1_fortwo: true }, secret: 'm1_fortwo', sfx: 'glass',
          lines: ['You hold the little mirror up to the shelf.', 'In the glass, every tray has a twin, and the label reads FOR TWO. In the mirror, the special offer is true.'],
          else: [{ msg: 'In the mirror, two of everything. Out here, one.' }] }, { reeval: true }] } },
      { id: 'm1_twin', type: 'decor', at: [39, 1], look: 'glint', solid: false, flat: true, cond: { flag: 'm1_fortwo' },
        lines: ['Beside the shelf, where you held the mirror, a patch of the glass still shows the twins,', 'FOR TWO, as if it had not wanted to give them back.'] },
      { id: 'm1_closing', type: 'decor', at: [25, 28], look: 'letter', solid: false, flat: true, cond: { remainingLt: 90 },
        lines: ['A note has slid across the floor from the automatic doors: WE ARE CLOSING. PLEASE TAKE YOUR CHILD WITH YOU.', 'Nobody has come to take anyone. The doors are stuck half open, waiting.'],
        use: [{ secret: 'm1_closing' }] },
      { id: 'm1_belt', type: 'decor', at: [16, 25], look: 'table', lookOpt: { c: ['#a0a8a8'] },
        lines: [IF({ noItem: 'apple' }, 'The bagging shelf at the end of the till. Empty. A worn label: PLACE YOUR ITEM HERE.'),
          IF({ item: { apple: 1 } }, ['You put an apple on the shelf.', 'The belt carries it away, then brings it back to you, and the till prints a receipt on its own.'], [{ set: { m1_receipt: true } }, { reeval: true }])] },
      { id: 'm1_receipt', type: 'decor', at: [15, 25], look: 'letter', solid: false, flat: true, cond: { flag: 'm1_receipt' },
        lines: ['A till receipt, still curling:', { t: 'ONE APPLE — 0 WON — ALREADY PAID FOR, BY SOMEBODY, A LONG TIME AGO.', lang: 'en', who: 'the receipt' }],
        use: [{ secret: 'm1_receipt' }] }
    ],
    rules: ['Use the Pocket Mirror (E21) facing the shelf of meals “for one” at the north end of aisle seven: in the mirror they are for two (secret).',
      'In the last minute and a half of the dream, a closing note lies by the entrance (secret).',
      'Carrying an apple (from the Orchard), put it on the bagging shelf left of the till: it is already paid for (secret).']
  });

  /* ---------------------------------------------------------------
   *  W018 — The Library of Blank Books
   *  La salle de lecture derrière le mur est (faux mur ; les pages s'y
   *  tournent dans un courant d'air), dire un nom de la famille près du
   *  tampon EFFACÉ (il refuse), une voix qui lit à travers une porte
   *  absente quand celle de la chambre est entrouverte.
   * --------------------------------------------------------------- */
  MORE('W018', {
    fakeWalls: [[43, 6]],
    post: function (rows) { rows = rows.slice(); room(rows, 43, 3, 7, 7, '.', '#'); return rows; },
    place: [
      { id: 'm1_draught', type: 'decor', at: [42, 6], look: 'scraps', solid: false, flat: true,
        lines: ['Loose blank pages on the floor here keep turning over by themselves,', 'towards the east wall, as if a draught came through it.'] },
      { id: 'm1_unerased', type: 'decor', at: [45, 4], look: 'bookcase', lines: ['A reading room behind the wall. On the shelves, the only books that would not go white:', 'a primer, a Seoul telephone directory, a hymn book.'] },
      { id: 'm1_readlamp', type: 'decor', at: [47, 4], look: 'lamp', light: 1.4, lines: ['A reading lamp with a green shade, left on.', 'The librarian reads here when nobody is looking. Whatever is read aloud, she cannot stamp.'] },
      { id: 'm1_diary', type: 'decor', at: [46, 8], look: 'book',
        lines: ['A child’s diary with a little lock. The lock was forced long ago. Every page is still written on.'],
        use: [{ if: { notFlag: 'm1_diary' }, set: { m1_diary: true }, secret: 'm1_diary', collect: 'pages' }] },
      { id: 'm1_stampear', type: 'listen', at: [19, 14], listenDist: 4,
        listen: [{ match: ['ahn ok sun', 'ok sun', 'oksun', '안옥순', '옥순', 'ahn jae sik', 'jae sik', 'jaesik', '안재식', '재식', 'kim mi ran', 'mi ran', 'miran', '김미란', '미란'],
          do: [{ secret: 'm1_namekept' }, { sfx: 'stamp' }],
          lines: ['On the librarian’s desk the ERASED stamp lifts by itself, the way it does for every word said aloud in here.',
            'It comes down — and stops a finger’s width above the page. It hangs there, trembling.', 'For once, it will not say ERASED. The name stays in the air, said, kept.'] }] },
      { id: 'm1_readaloud', type: 'decor', at: [2, 19], look: 'book', solid: false, cond: { roomDoor: true },
        lines: ['Through the gap of a door that is not there, somebody is reading aloud,', 'very softly, the way you read to a child who is supposed to be asleep.',
          'It is one of the blank books. The voice reads it anyway, page after page, making it up as it goes.'],
        use: [{ secret: 'm1_readaloud' }] }
    ],
    rules: ['Where loose pages keep turning towards the east wall (north-east of the shelves), the wall can be walked through: a hidden reading room with a diary that kept its words (secret, a torn page).',
      'Say a family name out loud by the librarian’s desk (Ok-sun, Jae-sik, Mi-ran…): the ERASED stamp refuses to come down (secret).',
      'With the bedroom door ajar, a voice reads aloud by the west passage (secret).']
  });

  /* ---------------------------------------------------------------
   *  W019 — The Firefly Marsh
   *  La butte au milieu de la mare profonde (nager ou flotter), rester
   *  immobile près de la cabane (les lucioles se posent), le bocal sur
   *  la marche de la cabane rallumé avec les Lucioles, les bottes laissées
 *  à sécher tard dans le rêve.
   * --------------------------------------------------------------- */
  MORE('W019', {
    post: function (rows) { rows = rows.slice(); put(rows, 13, 11, '.'); put(rows, 14, 11, '.'); return rows; },
    place: [
      { id: 'm1_hummock', type: 'decor', at: [14, 11], look: 'lantern', lookOpt: { c: ['#e8d8b0'] },
        lines: ['In the middle of the deepest pool, a hummock of moss no bigger than a pillow.', 'On it, a paper lantern, dry as a bone, that has never once been lit. Someone swam out here to leave it.'],
        use: [{ secret: 'm1_hummock' }] },
      { id: 'm1_jarstep', type: 'decor', at: [16, 30], look: 'jar', lookOpt: { c: ['#a8c8a0'] }, cond: { equipped: 'E27' },
        lines: ['In the light of your own fireflies, you notice a second jar on the step of the hut,', 'with no lid, that the dark was hiding.',
          'You hold your fireflies up to it.', 'One of them crosses over, lights it — and, after a moment, comes back to you. Nothing was meant to stay.'],
        use: [{ secret: 'm1_jarstep' }] },
      { id: 'm1_boots', type: 'decor', at: [29, 23], look: 'shoe', lookOpt: { c: ['#d8c040'] }, solid: false, cond: { phase: ['late', 'final'] },
        lines: ['A pair of small yellow rubber boots by the boardwalk,', 'upside down on two sticks to dry, the way you leave them before bed.', 'Muddy to the ankle. Somebody was allowed to stay out late, just this once.'],
        use: [{ secret: 'm1_boots' }] }
    ],
    mech: [{ type: 'standStill', zone: [12, 28, 16, 30], secs: 18, flag: 'm1_lit', reward: [{ secret: 'm1_lit' }],
      winLines: ['You stand beside the hut, so still that you forget you are standing.', 'One by one the fireflies come: on your sleeves, in your hair, on the toes of your shoes.',
        'You are lit up like a window at night, the kind somebody is waiting behind.'] }],
    rules: ['In the middle of the big pool in the north-west, a hummock with an unlit lantern: swim (Fish) or float (Balloon) out to it (secret).',
      'Stand still for about twenty seconds right beside the hut on stilts: the fireflies settle on you (secret).',
      'With the Fireflies (E27) equipped, a lidless jar shows on the hut’s step (secret).',
      'Late in the dream (the last 40 % of the countdown), small rubber boots dry by the southern boardwalk (secret).']
  });

  /* ---------------------------------------------------------------
   *  W020 — The Closed Funfair
   *  Le palais des glaces démonté, derrière la clôture sud (faux mur,
   *  rangées ajoutées) : un labyrinthe de murs invisibles et, au fond,
   *  le photomaton. Un tour de grande roue payé d'une minute de rêve
   *  (en haut, la fenêtre de la chambre, allumée ou non). Le cheval du
   *  manège revenu, le mardi.
   * --------------------------------------------------------------- */
  var HALL = (function () {
    var mz = YN.gen.maze(15, 11, YN.rng.make(4242), { loops: 0.08 }), X0 = 37, Y0 = 39, ent = [7, 1];
    var g = mz.map(function (r, y) { return r.split('').map(function (c, x) { return (x === 0 || y === 0 || x === 14 || y === 10) ? '#' : (c === '#' ? 'x' : '.'); }); });
    g[ent[1]][ent[0]] = '.';
    var dist = {}, q = [ent], far = ent; dist[ent.join()] = 0;
    while (q.length) { var c = q.shift(); if (dist[c.join()] > dist[far.join()]) far = c; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var n = [c[0] + d[0], c[1] + d[1]]; if (g[n[1]] && g[n[1]][n[0]] === '.' && dist[n.join()] === undefined) { dist[n.join()] = dist[c.join()] + 1; q.push(n); } }); }
    return { rows: g.map(function (r) { return r.join(''); }), x0: X0, y0: Y0, door: [X0 + ent[0], Y0], goal: [X0 + far[0], Y0 + far[1]] };
  })();
  MORE('W020', {
    fakeWalls: [HALL.door],
    post: function (rows) { rows = rows.slice(); HALL.rows.forEach(function (r, y) { if (y === 0) return; for (var x = 0; x < r.length; x++) put(rows, HALL.x0 + x, HALL.y0 + y, r[x]); }); return rows; },
    place: [
      { id: 'm1_mirrorsign', type: 'decor', at: [HALL.door[0] - 1, HALL.door[1] - 1], look: 'board', lookOpt: { lines: ['HALL OF MIRRORS', '— CLOSED —'], color: '#e0d0f0' },
        lines: ['A painted board: HALL OF MIRRORS. Someone has nailed a plank across it: CLOSED.', 'The fence beside it is cold to the touch, and smooth, like glass.'] },
      { id: 'm1_booth', type: 'decor', at: HALL.goal, look: 'photobooth',
        lines: ['At the heart of the hall of mirrors that is no longer there, the photo booth that used to stand at the exit.', 'A strip of four pictures still hangs in the slot: a man and a little girl, pulling faces.', 'In the last one he is already looking away, towards something outside the frame.'],
        use: [{ if: { notFlag: 'm1_booth' }, set: { m1_booth: true }, secret: 'm1_booth', collect: 'photos' }] },
      { id: 'm1_gondola', type: 'decor', at: [15, 18], look: 'trainseat', lookOpt: { c: ['#a04040'] },
        lines: [IF({ temp: { m1_ride: 1 } }, 'The lowest gondola takes you up. A minute of the dream ticks away under you, the price of the ride.'),
          IF({ all: [{ temp: { m1_ride: 1 } }, { roomLight: true }] }, ['At the top, beyond the dark fair, very far away, one window is lit.', 'It is yours. Someone has left the light on for you.']),
          IF({ all: [{ temp: { m1_ride: 1 } }, { roomLight: false }] }, ['At the top, you look for your window. It is dark.', 'Somewhere down there, somebody switched it off so that you would sleep.']),
          IF({ tempGte: { m1_ride: 2 } }, 'The gondola waits, door open. You have already paid your minute tonight.')],
        use: [INC('m1_ride'), { if: { temp: { m1_ride: 1 } }, time: -60, secret: 'm1_wheeltop' }] },
      { id: 'm1_horse', type: 'decor', at: [50, 12], look: 'plush', lookOpt: { c: ['#c8a070'] }, cond: { weekday: 2 },
        lines: ['Today the missing horse has come back.', 'It stands beside the carousel, waiting to be put back on its pole, a small suitcase strapped to its saddle.', 'It left on a Tuesday. It came back on a Tuesday. Nobody saw it come in.'],
        use: [{ secret: 'm1_horse' }] }
    ],
    rules: ['Behind the south fence, right of the exit, where a board says HALL OF MIRRORS — CLOSED, the fence can be walked through: a maze of invisible walls. At its far end, the old photo booth (secret, a photograph).',
      'The lowest gondola of the Ferris wheel takes one minute of dream time per night. From the top you see your bedroom window, lit or dark (secret).',
      'On real Tuesdays, the carousel’s missing horse is back beside it (secret).']
  });
})(typeof window !== 'undefined' ? window : globalThis);
