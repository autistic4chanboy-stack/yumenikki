/* =========================================================================
 *  AJOUTS (05) — énigmes et secrets pour W121–W147 (le laboratoire, la
 *  tour de bureaux, le Jardin de nuit et ce qu'il ouvre, les mondes à
 *  apparition). Rien n'est retiré : des marques, des mécaniques, un chien.
 *  PNJ N2190 · drapeaux / secrets préfixés m5_.
 *  Mondes générés (W125, W129, W130, W136, W145, W147) : aucune coordonnée
 *  fixe (sinon l'Étendue ne les agrandirait plus) — random / near / marques.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  /* comme YN.kit.more ; sur une carte dessinée de profondeur ≥ 3 (marques au hasard retirées chaque nuit),
     nos marques à coordonnées fixes passent en tête de la liste : celles posées au hasard les évitent ensuite */
  function M(id, o) {
    var d0 = YN.data.worlds[id], n0 = d0 && d0.place ? d0.place.length : 0, d = YN.kit.more(id, o);
    if (d && d.map && (d.depth || 0) >= 3 && o.place) d.place = d.place.slice(n0).concat(d.place.slice(0, n0));
    return d;
  }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t) { return { t: t, lang: 'en' }; }
  function WHO(who, l) { return Object.assign({}, l, { who: who }); }
  /* une réplique conditionnelle d'objet */
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  /* effets qui révèlent, qui éclairent, qui écrivent, qui effacent, qui tamponnent */
  var REVEAL = ['E14', 'E66', 'E106', 'E129', 'E155', 'E171'];
  var LIGHTS = ['E05', 'E27', 'E56', 'E98', 'E105', 'E117', 'E154', 'E179', 'E180'];
  var INK = ['E24', 'E14'];
  /* une salle de plus à l'est d'une carte dessinée : colonnes ajoutées (vide), pièce de y0 à y1 */
  function eastRoom(w, y0, y1) {
    return function (rows) {
      return rows.map(function (r, y) {
        var add;
        if (y === y0 || y === y1) add = new Array(w + 1).join('#');
        else if (y > y0 && y < y1) add = new Array(w).join('.') + '#';
        else add = new Array(w + 1).join(' ');
        return r + add;
      });
    };
  }

  /* ---------------------------------------------------------------
   *  W121 — The Observation Room
   *  Secret : derrière le mur est, la pièce d'où la mère regardait.
   * --------------------------------------------------------------- */
  M('W121', {
    post: eastRoom(6, 10, 16),
    fakeWalls: [[29, 13]],
    place: [
      { id: 'm5_cardigan', type: 'decor', at: [28, 12], look: 'chair', lookOpt: { c: ['#c8d0d8'] },
        lines: ['A plastic chair pushed against the east wall. A nurse’s cardigan hangs on its back, not a lab coat.', 'It still smells of hand gel.',
          'When you lean on the wall beside it, the wall leans back a little, like a curtain.'] },
      { id: 'm5_chair', type: 'decor', at: [31, 13], look: 'chair', lookOpt: { c: ['#5a6a7a'] },
        lines: ['A chair facing the wall, as if the wall were glass. From this side, it is.', 'Through it you can see the whole Observation Room and, beyond it, the bedroom.',
          IF({ notSecret: 'm5_w121_chair' }, { t: 'On the seat, a hospital lanyard: NURSING ASSISTANT · NIGHTS. The badge photo is turned to face the glass.', do: [{ secret: 'm5_w121_chair' }] }),
          IF({ secret: 'm5_w121_chair' }, 'The lanyard is still on the seat, photo turned towards the glass.')] },
      { id: 'm5_drag', type: 'decor', at: [28, 13], look: 'scuff', solid: false, flat: true,
        lines: ['Scuff marks on the floor, running straight into the east wall, as if a chair had been dragged through it.'] },
      { id: 'm5_worn', type: 'decor', at: [30, 13], look: 'crumbs2', solid: false, flat: true,
        lines: ['Two worn patches on the floor, where somebody’s work shoes rested, one morning after another.'] },
      { id: 'm5_cup', type: 'decor', at: [33, 12], look: 'coffee', solid: false,
        lines: ['A paper cup of vending-machine coffee, gone cold. On its side, in biro: 07:10.', 'Then, smaller: “she’s asleep, she’s fine, go home”.'] }],
    rules: ['Secret: beside the chair with the nurse’s cardigan, against the east wall of the lower room, the wall can be walked through. Behind it, a small room where someone sat watching through the glass after a night shift: a chair, a hospital badge, a cold coffee.']
  });

  /* ---------------------------------------------------------------
   *  W122 — The Subject Archives
   *  Énigme : le formulaire d'admission (quiz).
   *  Secret : de 7 h à 8 h (heure réelle), le formulaire de consentement.
   * --------------------------------------------------------------- */
  M('W122', {
    place: [
      { id: 'm5_form', type: 'decor', at: [29, 1], look: 'desk', lookOpt: { book: true },
        lines: ['An intake desk. A form is clipped to it, half filled in.'] },
      { id: 'm5_sleeptalk', type: 'decor', at: [30, 1], look: 'drawer', cond: { flag: 'm5_w122_form' },
        lines: ['Drawer 6, open. A thick folder of typed pages: everything the subject has said in her sleep, night after night.',
          '“Night 4: I’m not tired.” “Night 9: leave it on.” “Night 12: the birds, Halmeoni, the birds.” “Night 30: nothing.”',
          IF({ notSecret: 'm5_w122_file' }, { t: 'In the margin of night 30, in a different pen: “but she was smiling”.', do: [{ secret: 'm5_w122_file' }] }),
          IF({ secret: 'm5_w122_file' }, 'In the margin of night 30: “but she was smiling”.')] },
      { id: 'm5_clock', type: 'decor', at: [7, 1], look: 'wallclock',
        lines: ['The archive clock. Someone has circled the seven in red pen. Underneath, a label: FORMS ARRIVE WITH THE NIGHT SHIFT.'] },
      { id: 'm5_consent', type: 'decor', at: [1, 20], look: 'letter', solid: false, flat: true, cond: { realHour: [7, 8] },
        lines: ['A consent form on the floor in the corner, still damp, as if it had come in out of the rain.', 'The signature is in a hurry: Kim Mi-ran. Beside it: 07:04.',
          'In the margin, the same hand: “Will it hurt her?” Underneath, in another: “No.”',
          { t: 'Then the first hand again, smaller: “Will it help?” Nobody has answered that one.', do: [{ secret: 'm5_w122_consent' }] }] }],
    mech: [{ type: 'quiz', mark: 'm5_form', flag: 'm5_w122_form',
      intro: ['The intake form. Three boxes are still empty. The pen is on a string, too short to take away.'],
      questions: [{ q: 'SUBJECT S. — AGE:', choices: ['Nine', 'Twelve', 'Forty-four'], right: 1 },
        { q: 'SILENT SINCE:', choices: ['1951', '1989', '2023'], right: 2 },
        { q: 'PARENT AVAILABLE:', choices: ['Days', 'Nights', 'Mornings, after seven'], right: 2 }],
      failLine: 'The archivist takes the form back, rubs your answers out with his thumb, and clips it to the desk again.',
      doneLine: 'The form is filed. COMPLETE, in red, across the top.',
      reward: [{ set: { m5_w122_form: true } }],
      winLines: ['The archivist reads the form twice, and stamps it: COMPLETE.',
        WHO('The Archivist in a Lab Coat', EN('Complete. Nobody ever completes them. They always leave the parent box empty.')),
        'He opens a drawer marked 6, at the corner of the desk, and files it. The drawer was already full.'] }],
    rules: ['Fill in the intake form on the desk in the north-east corner: age twelve, silent since 2023, parent available mornings, after seven (the files and the intern give the answers). The archivist opens drawer 6: everything she has said in her sleep.',
      'Secret: between 7:00 and 8:00 in the morning (real time), the consent form her mother signed after her night shift lies in the south-west corner.']
  });

  /* ---------------------------------------------------------------
   *  W123 — The Recording Room
   *  Énigme : le compteur de la bande sur 2·1·4 (dials).
   *  Secret : effacer « ALL IS WELL » : la bande neuf, dessous.
   * --------------------------------------------------------------- */
  var DIG = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var ERASE9 = [{ if: { notFlag: 'm5_w123_tape9' }, set: { m5_w123_tape9: true },
    lines: ['You rub at the label, then at the tape itself. ALL IS WELL comes off in grey crumbs.', 'Something underneath starts to turn on its own.'] }, { reeval: true }];
  M('W123', {
    place: [
      { id: 'm5_deck', type: 'decor', at: [12, 12], look: 'radio', lookOpt: { c: ['#4a3a30'] },
        lines: ['A reel-to-reel deck with a tape labelled NIGHT 3. The counter beside it has three wheels: the hour, then the minutes.',
          'Someone has scratched into the casing with a key: SHE SAID SOMETHING. FIND IT.'] },
      { id: 'm5_c1', type: 'decor', at: [13, 12], look: 'neon', lookOpt: { text: '0', c: ['#e04030'] }, light: 0.6, lines: ['A counter wheel.'] },
      { id: 'm5_c2', type: 'decor', at: [14, 12], look: 'neon', lookOpt: { text: '0', c: ['#e04030'] }, light: 0.6, lines: ['A counter wheel.'] },
      { id: 'm5_c3', type: 'decor', at: [15, 12], look: 'neon', lookOpt: { text: '0', c: ['#e04030'] }, light: 0.6, lines: ['A counter wheel.'] },
      { id: 'm5_tapes', type: 'decor', at: [8, 1], look: 'shelf',
        lines: [IF({ notFlag: 'm5_w123_tape9' }, 'A shelf of tapes. One is labelled 9 in pencil, then relabelled in thick marker: ALL IS WELL.'),
          IF({ notFlag: 'm5_w123_tape9' }, 'The new label has been rubbed at, as if someone had started to take it off and lost their nerve.'),
          IF({ flag: 'm5_w123_tape9' }, 'Tape nine, without its label. It is still turning.')],
        onEffect: { E10: ERASE9, E96: ERASE9 } },
      { id: 'm5_tape9', type: 'decor', at: [9, 1], look: 'musicbox', cond: { flag: 'm5_w123_tape9' },
        lines: ['Under ALL IS WELL, worn thin, the old recording comes through: a kitchen, a pan, a tap running.', 'And a woman humming a lullaby, a little out of tune.',
          { t: 'Halfway through, she stops humming to say something to a small child, too low to catch, and laughs.', do: [{ secret: 'm5_w123_tape9' }] }] }],
    mech: [{ type: 'dials', marks: ['m5_c1', 'm5_c2', 'm5_c3'], states: 10, values: DIG, optKey: 'text', target: [2, 1, 4],
      labelText: 'The counter clicks to ', flag: 'm5_w123_counter', doneLine: 'The counter stays on 2:14. The tape has nothing else to say.',
      reward: [{ secret: 'm5_w123_word' }],
      winLines: ['Two, one, four. The reels spin backwards, then forwards. Hiss. Breathing. A duvet turning over.', 'Then one word, very clear, in a sleeping voice:',
        KS('엄마.', 'Mum.'), 'Not inaudible at all. Somebody wrote “inaudible” in the log because nobody was supposed to hear it.'] }],
    rules: ['Set the three wheels of the tape counter by the south wall to 2·1·4, the time the microphone mentions: the tape plays the one word she said in her sleep.',
      'Secret: use an eraser (Eraser or Scented Eraser) on the shelf of tapes by the north wall. Under “ALL IS WELL” is tape nine: a grandmother humming in a kitchen.']
  });

  /* ---------------------------------------------------------------
   *  W124 — The Dream Machine
   *  Secret : lumière éteinte dans la chambre : le journal de la machine.
   * --------------------------------------------------------------- */
  M('W124', {
    place: [
      { id: 'm5_gauge', type: 'decor', at: [34, 1], look: 'monitor', lookOpt: { c: ['#3a3e46'] },
        lines: [IF({ roomLight: true }, 'A gauge wired to something very far away. ROOM LIGHT: the needle sits on ON.'),
          IF({ roomLight: true }, 'Beside it, a slot, shut: LOG — DARK NIGHTS ONLY.'),
          IF({ roomLight: false }, 'ROOM LIGHT: the needle has dropped to OFF. The slot beside it is open, and paper is coming out of it.')] },
      { id: 'm5_log', type: 'decor', at: [34, 2], look: 'letter', solid: false, flat: true, cond: { roomLight: false },
        lines: ['A log sheet, still warm from the machine:', '“21:01 — room light off (mother leaving for work). Depth: increased. Output: darker, quieter, longer.”',
          '“07:12 — door. Footsteps. Someone stands in the doorway for a long time.”',
          { t: '“The light is not switched back on, so as not to wake her.”', do: [{ secret: 'm5_w124_log' }] },
          'Underneath, in the mechanic’s pencil: “Note it down. She always comes back.”'] }],
    rules: ['Secret: with the light switched off in her bedroom, the machine prints a log sheet under the ROOM LIGHT gauge in the north-east corner.']
  });

  /* ---------------------------------------------------------------
   *  W125 — The City That Replaces Itself
   *  Énigme : approcher le chien qui se souvient, sans courir (catchN).
   * --------------------------------------------------------------- */
  M('W125', {
    npcs: [{ id: 'N2190', name: 'A Dog Who Remembers', tag: 'm5_dog', look: { t: 'dog', c: ['#a08060', '#5a4030'], h: 13 }, behavior: 'flee', fleeDist: 6, radius: 12, speed: 3, solid: false,
      goneIf: { flag: 'm5_w125_dog' },
      lines: ['A scruffy dog with a red collar. He backs away from you, growling softly, then wags, then backs away again.',
        'People who rush at him are strangers. His man used to come home slowly.'] }],
    mech: [{ type: 'catchN', tag: 'm5_dog', key: 'm5_dogcatch', n: 1, noRun: true, runLine: 'You ran. He flinches and bolts, ears flat.', flag: 'm5_w125_dog', reward: [{ secret: 'm5_w125_dog' }],
      winLines: ['You walk up to him slowly, the way someone used to. He stops growling and sits down on your feet, the way dogs do.',
        'The tag on his collar says IF FOUND, RETURN TO — then an address replaced so many times it is a smudge.',
        'On the back, older, scratched with a nail: a man’s first name, and “he walks me at seven”.',
        'He lets you scratch his ears once. Then he trots off to wait on a doorstep that is not there any more.'] }],
    rules: ['A dog who remembers his old owner backs away from you through the city. Reach him without running (running makes him bolt): his tag says who he is still waiting for. (The man who replaced his owner mentions him.)']
  });

  /* ---------------------------------------------------------------
   *  W126 — The Dormitory of Sleeping Children
   *  Énigme : les pas de la somnambule (trail).
   *  Secret : dire bonne nuit au neuvième lit (listen).
   * --------------------------------------------------------------- */
  M('W126', {
    place: [
      { id: 'm5_bed9', type: 'decor', at: [1, 9], look: 'bed', lookOpt: { c: ['#e8e8f0', '#b0b0c0'] },
        lines: ['A ninth bed against the wall, made very tight, the way beds are made when nobody tucks anyone in.',
          'The eight children turn towards it in their sleep. They seem to be waiting for someone to say something.', 'The last thing grown-ups say at night.',
          'Small bare footprints lead away from it across the floorboards.'],
        listen: [{ match: ['good night', 'goodnight', 'night night', 'sleep well', 'sweet dreams', '잘 자', '잘자', '잘 자요', '안녕히 주무세요'], if: { notFlag: 'm5_w126_gn' },
          do: [{ set: { m5_w126_gn: true } }, { reeval: true }],
          lines: ['From the eight beds, eight sleeping voices answer together, without waking:', EN('Good night.'), 'Nobody had ever said it to the ninth bed. Under its pillow, something rustles.'] }] },
      { id: 'm5_tag', type: 'decor', at: [1, 10], look: 'letter', solid: false, flat: true, cond: { flag: 'm5_w126_gn' },
        lines: ['Under the pillow of the ninth bed, a name tape, the kind sewn into school clothes. It says only: 6.',
          { t: 'On the back, in a grown-up’s hurried writing: “please make sure she sleeps with the lamp on”.', do: [{ secret: 'm5_w126_ninth' }] }] },
      { id: 'm5_curl', type: 'decor', at: [28, 5], look: 'blanketlump', solid: false,
        lines: ['A dent in the floor at the foot of the fourth bed, the size of a child curled up small.'] }],
    mech: [{ type: 'trail', from: 'm5_bed9', to: 'm5_curl', slack: 1, flag: 'm5_w126_steps', lostLine: 'You lose the footprints. They start again from the ninth bed.',
      reward: [{ secret: 'm5_w126_steps' }],
      winLines: ['The footprints stop at the foot of the fourth bed.', 'Someone small slept here, on the floor, close to the girl who stopped talking.',
        'In the dent left behind, a piece of the dream that none of the eight got:', '“…the light stays on so that somebody can find the way back…”',
        'In the fourth bed, the girl smiles in her sleep, as if she had heard it too.'] }],
    rules: ['Small footprints lead from the empty ninth bed (against the west wall) to the foot of the fourth bed: follow them without straying to find the missing piece of the dream.',
      'Secret: say “good night” beside the ninth bed. The eight children answer in their sleep, and a name tape appears under its pillow.']
  });

  /* ---------------------------------------------------------------
   *  W127 — Corridor 0
   *  Énigme : compter le couloir de 0 à 4, vers l'ouest (stepOrder).
   * --------------------------------------------------------------- */
  var C0 = [33, 24, 15, 8, 40], C0P = {};
  C0.forEach(function (x, i) { C0P[x + ',1'] = i; C0P[x + ',2'] = i; });
  M('W127', {
    /* le monde boucle (wrap) mais la carte était fermée aux deux bouts : on ouvre les deux murs d'extrémité,
       pour que le couloir revienne vraiment sur lui-même (les sept tours de la porte de souris en dépendent) */
    post: function (rows) { return rows.map(function (r, y) { return (y === 1 || y === 2) && r.length > 2 ? '.' + r.slice(1, -1) + '.' : r; }); },
    place: C0.map(function (x, i) {
      return { id: 'm5_n' + i, type: 'decor', at: [x, 1], look: 'chalkmark', solid: false, flat: true,
        lines: [i === 0 ? 'A zero chalked right across the corridor, wall to wall. Beside it, a little arrow pointing west, and one word: COUNT.'
          : 'A ' + ['', 'one', 'two', 'three', 'four'][i] + ', chalked right across the corridor, wall to wall, in a child’s hand.'] };
    }).concat([
      { id: 'm5_n5', type: 'decor', at: [22, 1], look: 'chalkmark', solid: false, flat: true, cond: { flag: 'm5_w127_count' },
        lines: [{ t: 'A five, chalked in another hand, bigger. Underneath, smaller: “keep going, I’m counting with you”.', do: [{ secret: 'm5_w127_five' }] }] }]),
    mech: [{ type: 'stepOrder', plates: C0P, count: 5, color: 'rgba(240,240,255,0.9)', flag: 'm5_w127_count',
      winLines: ['Zero, one, two, three, four. You have counted the corridor all the way round.',
        'In the nearest frame, the corridor is shorter by exactly five steps.', 'At the end of it, in a lit doorway, somebody small is standing, counting too.',
        'Somewhere behind you, chalk squeaks.'] }],
    rules: ['Five numbers are chalked across the corridor. Start on 0 and walk west over 1, 2, 3 and 4 in order, going round the loop; a number crossed out of order starts the count again. A fifth number is then chalked behind you.']
  });

  /* ---------------------------------------------------------------
   *  W128 — The Room Without a Door
   *  Énigme : l'air cousu sur la boîte à musique (melodyLock).
   *  Secret : petite, on voit la chambre dans la plinthe.
   * --------------------------------------------------------------- */
  M('W128', {
    place: [
      { id: 'm5_musicbox', type: 'decor', at: [7, 1], look: 'musicbox',
        lines: ['A music box with no key. Stitched into a scrap of felt on the lid: la, sol, mi — la, sol, mi — do.', 'The notes somebody used to hum at the door, coming in from the garden.',
          'It does not play. It is waiting for someone else to start.'] },
      { id: 'm5_crack', type: 'decor', at: [8, 1], look: 'crack', solid: false, flat: true, cond: { notEquipped: 'E13' },
        lines: ['Tiny scratches on the skirting board in the corner, the kind a very small person makes to keep a place secret.'] },
      { id: 'm5_doll', type: 'decor', at: [8, 1], look: 'dollhouse', cond: { equipped: 'E13' },
        lines: ['Now that you are small, you can see it: behind a crack in the skirting board, a room inside the room.',
          'A matchbox bed. A thimble of water. A button for a cushion.',
          { t: 'A note in very small writing: “for when this room feels too big”.', do: [{ secret: 'm5_w128_tiny' }] }] }],
    mech: [{ type: 'melodyLock', mark: 'm5_musicbox', tune: '4324320', dist: 3, flag: 'm5_w128_tune',
      reward: [{ secret: 'm5_w128_tune' }, { collect: 'photos' }],
      winLines: ['You hum it: la, sol, mi, la, sol, mi, do. Your voice is very small in a room with no door.',
        'The music box answers by itself and plays the next line, the one you never knew.', 'It is slower, as if whoever wound it had just sat down.',
        'Tucked inside the lid, a photograph: a garden, and a watering can much too big for the child holding it.'] }],
    rules: ['Play la, sol, mi, la, sol, mi, do (the notes stitched on the lid) with the Melody beside the music box in the north-east corner: it plays the next line and gives up a photograph.',
      'Secret: with Tiny equipped, the scratched corner of the skirting board is a little room: a matchbox bed and a note.']
  });

  /* ---------------------------------------------------------------
   *  W129 — The Abandoned Kindergarten
   *  Énigme : lui dire l'heure (sayTo) — six heures.
   *  Secret : le vendredi (date réelle), le registre de la maîtresse.
   * --------------------------------------------------------------- */
  M('W129', {
    place: [
      { id: 'm5_clock', type: 'decor', at: 'random-any', look: 'poleclock',
        lines: ['A clock on a pole, the kind that tells parents they are late.', 'Its hands have stopped at six. They have been six for years.'] },
      { id: 'm5_bench', type: 'decor', at: 'random-any', look: 'bench',
        lines: ['The bench where the teacher sat with the last child.', 'Someone has carved a week into the seat: five notches, the fifth cut much deeper than the others.'] },
      { id: 'm5_register', type: 'decor', at: 'random-hidden', look: 'book', solid: false, cond: { weekday: 5 },
        lines: ['The register, left open on the ground. FRIDAY. A tick beside every name: collected, collected, collected.',
          'One name has no tick. Only times in pencil, rubbed out and written again: 18:00. 18:40. 19:15. 20:00.',
          { t: 'At the bottom, in the teacher’s hand: “stayed with her”. That has been rubbed out too, but not very hard.', do: [{ secret: 'm5_w129_friday' }] }] }],
    mech: [{ type: 'sayTo', ent: 'N398', dist: 3, words: ['six', '6', '6 00', '여섯 시', '여섯시'], flag: 'm5_w129_six',
      reward: [{ secret: 'm5_w129_six' }, { collect: 'cranes' }],
      winLines: ['She looks at the stopped clock, then at you, for a long time.', WHO('The Child Nobody Came For', EN('Six. Then she’s coming.')),
        'She puts her bag on both shoulders and turns to face the gate.', 'She stands very straight, the way you stand when you want to be found first.',
        'Before that, she gives you the paper crane she folded while she waited. Its wings have gone soft from being held.'] }],
    rules: ['The child asks what time it is. The stopped clock in the playground says six: tell her (say “six”). She gives you the paper crane she folded while waiting.',
      'Secret: on Fridays (real date), the teacher’s register lies open in a nook of the playground; the carved bench hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W130 — The Beach of Shoes
   *  Énigme : la vague qui rapporte la chaussure droite (cycleFrames).
   *  Secret : à 23:71 (00:11–00:20), la botte du frère.
   * --------------------------------------------------------------- */
  M('W130', {
    place: [
      { id: 'm5_redshoe', type: 'decor', at: 'random-hidden', look: 'shoe', lookOpt: { c: ['#c83030'] },
        lines: [IF({ notFlag: 'm5_w130_pair' }, 'A small red shoe, a left one, set down neatly facing the sea.'),
          IF({ notFlag: 'm5_w130_pair' }, 'A name is sewn inside in red thread, by someone who meant it to come home.'),
          IF({ notFlag: 'm5_w130_pair' }, 'It is not waiting for its owner. It is waiting for the other shoe.'),
          IF({ flag: 'm5_w130_pair' }, 'The two red shoes sit side by side now, left and right, a little apart, facing the sea.'),
          IF({ flag: 'm5_w130_pair' }, 'Like a sister and a brother on a platform.')] },
      { id: 'm5_waves', type: 'decor', at: 'random-any', look: 'puddle', solid: false, flat: true,
        lines: ['A tide pool where the sea comes in very quietly and sets things down.'] },
      { id: 'm5_timetable', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true,
        lines: ['A railway timetable, washed up and dried stiff. The sea has rubbed out every departure except one: 23:71.', 'Someone has written beside it, in old-fashioned letters: “the shoes come back at this time too”.'] },
      { id: 'm5_boot', type: 'decor', at: 'random-hidden', look: 'shoe', lookOpt: { c: ['#202020'] }, cond: { realDate: 'h2371' },
        lines: ['A railwayman’s boot, black, laced tight, standing upright at the edge of the wet sand.', 'As if somebody had just stepped out of it.',
          { t: 'Inside the tongue, in old ink, a boy’s name and a year: 1951. A ticket stub is knotted into the lace. It says 23:71.', do: [{ secret: 'm5_w130_boot' }] },
          'It is a left boot. It is facing the red shoe’s way.'] }],
    mech: [{ type: 'cycleFrames', mark: 'm5_waves', every: 2.4, good: 3, flag: 'm5_w130_pair',
      frames: ['A wave sets down a man’s work boot, then takes it back.', 'A wave sets down a woman’s slipper, then takes it back.',
        'A wave sets down a child’s sandal, then takes it back.', 'A wave sets down a small red shoe, the right one — and begins to take it back.',
        'The wave goes out. Foam. Nothing.', 'A wave sets down a school shoe with a name inside, rubbed out, then takes it back.'],
      doneLine: 'The tide pool is still. It has given back what it had to give.',
      reward: [{ secret: 'm5_w130_pair' }],
      winLines: ['You catch it before the sea does: a small red shoe, the right one, heavy with water.',
        'You carry it up the beach to the left one and set it down beside it. Neither of them is your size.',
        'Behind you, the boy looking for pairs stops, and looks, and does not say anything for a while.'] }],
    rules: ['At the tide pool, the waves set down a different shoe every few seconds. Take the small red right shoe when it comes in: it joins the red left shoe with a name sewn inside, waiting in a nook of the beach.',
      'Secret: at 23:71 (00:11–00:20, real time), a railwayman’s boot from 1951 stands at the edge of the sand, in a nook. The washed-up timetable hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W131 — The Big Laugh’s Office
   *  Secret : éteindre la télévision du directeur (télécommande).
   * --------------------------------------------------------------- */
  var TVOFF = [{ if: { notFlag: 'm5_w131_tv' }, set: { m5_w131_tv: true },
    lines: ['Click. The laughter stops in the middle of a laugh.', 'For the first time, the floor is silent. The employees lift their heads one by one, as if somebody had called their names.',
      'In his cage, the director stares at the dark screen, like a boy whose television has been switched off at bedtime.'] }, { reeval: true }];
  M('W131', {
    place: [
      { id: 'm5_tv', type: 'decor', at: [27, 3], look: 'tv',
        lines: [IF({ notFlag: 'm5_w131_tv' }, 'A small television in the corner of the glass office, sound low: a comedy show with nobody in it, only laughter.'),
          IF({ notFlag: 'm5_w131_tv' }, 'It is the one thing on this floor that laughs on time.'),
          IF({ notFlag: 'm5_w131_tv' }, 'There is no remote anywhere. Nobody here has ever switched it off.'),
          IF({ flag: 'm5_w131_tv' }, 'The little television is dark. In its black screen, the glass office is reflected, very quiet.')],
        onEffect: { E53: TVOFF, E141: TVOFF } },
      { id: 'm5_drawing', type: 'decor', at: [28, 3], look: 'drawing', solid: false, cond: { flag: 'm5_w131_tv' },
        lines: ['Taped low on the glass, where only someone sitting on the floor by the television would see it: a child’s drawing.',
          'A boy alone in front of a television, with a big speech bubble: HA HA HA.',
          { t: 'In the corner, a teacher’s red pen: “Very funny! But who is laughing with you?”', do: [{ secret: 'm5_w131_drawing' }] }] }],
    rules: ['Secret: switch off the little television in the corner of the director’s glass office with a remote (Remote Control or Broken Remote). The floor falls silent, and a drawing from his childhood appears on the glass beside it.']
  });

  /* ---------------------------------------------------------------
   *  W132 — The Staff Canteen
   *  Secret : dire le bénédicité du midi (« 잘 먹겠습니다 ») au cuiseur.
   * --------------------------------------------------------------- */
  M('W132', {
    place: [
      { id: 'm5_poster', type: 'decor', at: [2, 1], look: 'poster',
        lines: ['A poster above the serving counter, in cheerful round letters:', KS('식사 전에 인사합시다! 잘 먹겠습니다!', 'Say it before you eat! “I will eat well!”'),
          'The corners have curled. Nobody here has said it out loud for years. They eat too fast.'] },
      { id: 'm5_cooker', type: 'decor', at: [3, 1], look: 'pot', lookOpt: { c: ['#d8d8d0'] },
        lines: ['A huge rice cooker, keeping rice warm for people who have no time to sit down.', IF({ flag: 'm5_w132_bowl' }, 'One bowl stays on the counter beside it now, lid on.')],
        listen: [{ match: ['잘 먹겠습니다', '잘먹겠습니다', '잘 먹겠어요', 'i will eat well', 'thank you for the food', 'thanks for the food', 'jal meokgesseumnida'], if: { notFlag: 'm5_w132_bowl' },
          do: [{ set: { m5_w132_bowl: true } }, { reeval: true }],
          lines: ['The dinner lady looks up, surprised, and smiles properly for the first time.',
            WHO('The Dinner Lady', KS('어머, 그 말 하는 사람 진짜 오랜만이네요.', 'Oh — it’s been such a long time since anyone said that.')),
            'From under a cloth at the back of the counter, she brings out one bowl of rice with a lid.', 'A slip of paper on the lid: 김 과장님.',
            WHO('The Dinner Lady', KS('이분은 한 번도 안 내려왔어요. 그래도 매일 떠 놔요.', 'He never once came down to eat. I serve it every day all the same.'))] }] },
      { id: 'm5_bowl', type: 'decor', at: [2, 2], look: 'jar', lookOpt: { c: ['#f0ece0'] }, solid: false, cond: { flag: 'm5_w132_bowl' },
        lines: ['A bowl of rice with a lid, kept warm for Manager Kim.',
          'You lift the lid. Steam.', { t: 'Someone has pressed a little hollow into the top with a spoon, the way you do for a child, for the egg.', do: [{ secret: 'm5_w132_bowl' }] }] }],
    rules: ['Secret: say the grace on the poster (“I will eat well”, in Korean or in English) beside the rice cooker in the north-west corner. The dinner lady shows the bowl she has kept warm every day for Manager Kim.']
  });

  /* ---------------------------------------------------------------
   *  W133 — The Shrinking Open-Plan Office
   *  Énigme : partir à l'heure, dans l'ordre (sequence) : les murs reculent.
   *  Secret : un dessin sous le dernier bureau (effet qui révèle), avant les murs.
   * --------------------------------------------------------------- */
  M('W133', {
    place: [
      { id: 'm5_howto', type: 'decor', at: [12, 14], look: 'board',
        lines: ['A laminated notice, its corners curling: HOW TO GO HOME. 1. Clock out. 2. Switch off. 3. Take your coat.', 'Under it, in biro: “has anyone actually tried?”'] },
      { id: 'm5_punch', type: 'decor', at: [18, 13], look: 'ticketmachine', lookOpt: { c: ['#8a8a90'] },
        lines: ['A punch clock by the door to the roof. One card in the rack has never been punched out.', 'Instead of a name, it has a drawing of a house on it.'] },
      { id: 'm5_screen', type: 'decor', at: [13, 12], look: 'monitor', light: 0.6,
        lines: ['The last screen still lit, a spreadsheet scrolling by itself.', 'The power button is worn shiny, like a button nobody dares to press.'] },
      { id: 'm5_coat', type: 'decor', at: [20, 12], look: 'chair', lookOpt: { c: ['#3a3a44'] },
        lines: ['A chair with a coat over its back, as if somebody meant to leave any minute. The coat has been there since spring.'] },
      { id: 'm5_crayon', type: 'decor', at: [16, 11], look: 'crumbs2', solid: false, flat: true,
        lines: ['A wax crayon, rolled under the desks.', 'A trail of tiny crayon dots leads across the carpet to the far corner, where the walls come first.'] },
      { id: 'm5_kiddraw', type: 'decor', at: [29, 21], look: 'drawing', solid: false, flat: true, cond: { equipped: REVEAL },
        lines: ['Taped under the last desk in the corner, a child’s drawing: MUM AT WORK.', 'A desk, a screen, and inside the screen a very small girl, waving.',
          'Somebody has added, in grown-up biro, a second small figure beside the desk, waving back.', { t: 'It has been drawn and rubbed out many times.', do: [{ secret: 'm5_w133_drawing' }] }] }],
    mech: [{ type: 'sequence', order: ['m5_punch', 'm5_screen', 'm5_coat'], flag: 'm5_w133_home',
      okLines: ['Ka-chunk. The card comes out stamped 18:00. Nobody on this floor has ever seen that time on a card.', 'You press the worn button. The spreadsheet goes dark, and the room seems to breathe out.'],
      wrongLine: 'Not like that. Somewhere, a phone starts ringing, and the walls lean in to listen.',
      doneLine: 'The coat is gone from the chair. Somebody went home on time, once.',
      reward: [{ fn: function () { var rt = YN.game && YN.game.rt; if (!rt || rt.id !== 'W133') return; rt.clearLayer('shrink'); rt.mechs.forEach(function (m) { if (m.type === 'shrink') m.s.k = 99; }); } },
        { secret: 'm5_w133_home' }],
      winLines: ['You lift the coat off the chair and put it over your arm. It is far too big for you.',
        'The walls stop. Then, slowly, as if embarrassed, they slide back to where they were.',
        KS('…칼퇴?', '…Leaving on the dot?'), 'Somebody whispers it, and somebody else laughs, a real laugh, quickly hidden. Tomorrow the walls will start again.'] }],
    rules: ['Leave on time: punch the clock beside the roof door, switch off the last lit screen, then take the coat from the chair, in that order (the notice says so). The walls slide back — until the next visit.',
      'Secret: with a revealing effect (Glasses, AR Glasses, Electrode…), a child’s drawing can be seen under the desk in the south-east of the office. Hurry: the walls reach it in about forty seconds.']
  });

  /* ---------------------------------------------------------------
   *  W134 — The Eternal Meeting Room
   *  Secret : quand tous hochent la tête (toutes les 8 s), l'ordre du jour.
   * --------------------------------------------------------------- */
  M('W134', {
    place: [
      { id: 'm5_placecard', type: 'decor', at: [22, 9], look: 'plaque', solid: false,
        lines: ['A place card at the head of the table: CHAIR. The chair is empty.', 'The agenda lies under a sleeping hand nearby. Only when all the heads go down at once does the hand let go of it.'] },
      { id: 'm5_agenda', type: 'decor', at: [22, 8], look: 'clipboard', solid: false, cond: { remainingMod: { every: 8, under: 3 } },
        lines: ['For the length of a nod, nobody is holding the agenda down. You slide it out.',
          'AGENDA. 1. Figures. 2. Figures again. 3. Tomorrow’s meeting. 4. Tomorrow’s figures. … 9. Go home — postponed (since 1989).',
          { t: 'Item 9 has been underlined very hard by somebody, and then the underline has been crossed out.', do: [{ secret: 'm5_w134_agenda' }] }] }],
    rules: ['Secret: every eight seconds all the participants nod at once. For those few seconds, the agenda can be taken from the head of the table (east end, beside the CHAIR card): item 9.']
  });

  /* ---------------------------------------------------------------
   *  W135 — The Tower Roof
   *  Énigme : les quatre fenêtres allumées, dans les flaques (visitAll).
   *  Secret : avec sa propre lumière, la craie autour de la porte qui redescend.
   * --------------------------------------------------------------- */
  M('W135', {
    place: [
      { id: 'm5_p1', type: 'decor', at: [7, 8], look: 'puddle', solid: false, flat: true,
        lines: ['In the puddle, the city upside down, and one lit window.', 'A man ironing a school shirt at two in the morning, very carefully, for tomorrow.'] },
      { id: 'm5_p2', type: 'decor', at: [19, 8], look: 'puddle', solid: false, flat: true,
        lines: ['In the puddle, a lit window: a nurse just home, still in her coat, in a doorway.', 'She is looking at a sleeping child, and leaving the light on.'] },
      { id: 'm5_p3', type: 'decor', at: [8, 15], look: 'puddle', solid: false, flat: true,
        lines: ['In the puddle, a lit window: an old woman feeding a cat on a windowsill, telling it about her day in a low voice.'] },
      { id: 'm5_p4', type: 'decor', at: [14, 18], look: 'puddle', solid: false, flat: true,
        lines: ['In the puddle, a lit window: a boy doing homework by a lamp. Every few minutes he looks up at the door.'] },
      { id: 'm5_dust', type: 'decor', at: [20, 14], look: 'scuff', solid: false, flat: true,
        lines: ['Chalk dust on the concrete near the door that goes back down.', 'There are words under it, too faint to read by the city’s light alone.'] },
      { id: 'm5_chalk', type: 'decor', at: [23, 15], look: 'chalkmark', solid: false, flat: true, cond: { equipped: LIGHTS },
        lines: ['By your own light, the chalk shows: dozens of small notes, in dozens of hands, all around the door down.',
          EN('I came up. I went back down. — 2019'), EN('Me too.'), EN('Me too. Somebody stayed with me.'),
          { t: 'The newest one is in a child’s handwriting, and not finished yet.', do: [{ secret: 'm5_w135_metoo' }] }] }],
    mech: [{ type: 'visitAll', marks: ['m5_p1', 'm5_p2', 'm5_p3', 'm5_p4'], countText: 'Lit windows counted: # / %', flag: 'm5_w135_windows',
      reward: [{ secret: 'm5_w135_windows' }, { cookie: 1 }],
      winLines: ['Four windows. Four people, awake for somebody.', 'When you look up, more windows have come on down below, one after another.', 'As if the city had heard you counting.',
        'Somewhere behind you, the woman with the badge has turned away from the fence to look at them too.'] }],
    rules: ['Look into the four puddles on the roof: each one shows a lit window and a person awake for somebody. After the fourth, the city lights up below (and leaves a biscuit).',
      'Secret: with a light of your own equipped (Lantern, Fireflies, Flashlight…), chalked messages appear beside the door that goes back down: people who came up, and went back down.']
  });

  /* ---------------------------------------------------------------
   *  W136 — The Night Garden
   *  Énigme : siffler pour le dernier bouton de belle-de-nuit (gate).
   * --------------------------------------------------------------- */
  M('W136', {
    place: [
      { id: 'm5_bud', type: 'decor', at: 'random-hidden', look: 'flower', lookOpt: { c: ['#8a8ab8'] }, solid: false,
        lines: [IF({ notFlag: 'm5_w136_bud' }, 'A moonflower bud, shut tight, a little apart from all the others.'),
          IF({ notFlag: 'm5_w136_bud' }, 'A blackbird’s feather is caught on it, as if a bird had once been called here, and had come.'),
          IF({ flag: 'm5_w136_bud' }, 'The last moonflower is open. It smells of soap and wet earth, and of someone’s hands.'),
          IF({ flag: 'm5_w136_bud' }, { t: 'On the inside of one petal, very small, a child has written in pencil: 할머니. The pencil is still lying in the grass.', do: [{ secret: 'm5_w136_bud' }] })] }],
    mech: [{ type: 'gate', mark: 'm5_bud', flag: 'm5_w136_bud', dist: 4, events: ['whistle'], text: 'Somewhere in the dark, a blackbird answers. The last bud opens.' }],
    rules: ['One moonflower bud, in a nook of the garden, has never opened (a blackbird feather is caught on it). Blow a whistle beside it (the Blackbird Whistle): a blackbird answers and the last flower opens, with a name inside.']
  });

  /* ---------------------------------------------------------------
   *  W138 — The Post Office of Impossible Letters
   *  Secret : tamponner l'enveloppe en attente : la lettre de la grand-mère.
   * --------------------------------------------------------------- */
  var STAMP = [{ if: { notFlag: 'm5_w138_stamp' }, set: { m5_w138_stamp: true },
    lines: ['You stamp the envelope. The ink is still wet when the shelf lets go of it.', 'It is addressed in a careful, shaky hand: “to the little one — deliver when she is ready”.'] }, { reeval: true }];
  M('W138', {
    place: [
      { id: 'm5_held', type: 'decor', at: [28, 1], look: 'shelf',
        lines: [IF({ notFlag: 'm5_w138_stamp' }, 'A pigeonhole shelf marked HELD FOR COLLECTION. One envelope is stuck at the back.'),
          IF({ notFlag: 'm5_w138_stamp' }, 'It has no stamp, and it cannot leave without one.'),
          IF({ flag: 'm5_w138_stamp' }, 'The HELD FOR COLLECTION shelf is empty now.')],
        onEffect: { E34: STAMP, E175: STAMP } },
      { id: 'm5_hletter', type: 'decor', at: [29, 1], look: 'letter', solid: false, cond: { flag: 'm5_w138_stamp' },
        lines: ['The letter, opened at last. Pencil, the letters drawn large so that a child could read them:',
          KS('밥 잘 먹고, 새들한테 인사해 줘. 할머니는 괜찮아.', 'Eat properly, and say hello to the birds for me. Grandma is all right.'),
          { t: 'It is dated the week before the hospital. It was never posted. It never needed to be.', do: [{ secret: 'm5_w138_letter' }] }] }],
    rules: ['Secret: stamp (Stamp or Stapler) the envelope stuck on the HELD FOR COLLECTION shelf in the north-east corner: it is a letter from the grandmother, never posted.']
  });

  /* ---------------------------------------------------------------
   *  W141 — The Grocery That Doesn’t Exist
   *  Énigme : la liste de courses, dans l'ordre (sequence).
   * --------------------------------------------------------------- */
  M('W141', {
    place: [
      { id: 'm5_list', type: 'decor', at: [12, 2], look: 'letter', solid: false, flat: true,
        lines: ['A shopping list in pencil on the back of an envelope, dropped just inside the door.', 'Korean words you cannot quite read, each with a little drawing beside it, for a child.',
          'First a white square; then a squiggle with a tail; then a round sweet with stripes.', 'She always shopped in the order of the list. Never anything out of order.'] },
      { id: 'm5_tofu', type: 'decor', at: [20, 3], look: 'fridge', lookOpt: { c: ['#e0e8e8'] },
        lines: ['A little fridge humming against the wall. Tofu in water, in white blocks.'] },
      { id: 'm5_sprouts', type: 'decor', at: [20, 6], look: 'crate', lookOpt: { c: ['#b89060'] },
        lines: ['A crate of bean sprouts, little tails and all, sold by the handful.'] },
      { id: 'm5_sweets', type: 'decor', at: [1, 10], look: 'jar', lookOpt: { c: ['#e8f0f0'] },
        lines: ['A glass jar of striped mint sweets on the end of the counter.'] }],
    mech: [{ type: 'sequence', order: ['m5_tofu', 'm5_sprouts', 'm5_sweets'], flag: 'm5_w141_list',
      okLines: ['You take a block of tofu. It is cold through the paper.', 'A handful of bean sprouts: exactly enough for one soup, the way she always bought them.'],
      wrongLine: 'You put it back. That is not how she did the shopping. She followed the list from the top, every time.',
      doneLine: 'The grocer has already wrapped everything. There is nothing left to buy.',
      reward: [{ secret: 'm5_w141_list' }, { collect: 'coins' }],
      winLines: ['The grocer adds it all up without a till, moving her lips.', 'Then she shakes her head and pushes your coins back across the counter.',
        WHO('The Grocer Who Knows Your Name', EN('Your grandmother paid for this already. Years ago. She paid for a lot of things in advance.')),
        'She puts one coin back in your palm anyway, and closes your fingers over it.'] }],
    rules: ['Do the shopping in the order of the list dropped by the door: tofu (the fridge), bean sprouts (the crate), then a mint sweet (the jar on the counter). The grocer will not take your money, but gives you a coin.']
  });

  /* ---------------------------------------------------------------
   *  W142 — Floor 13A
   *  Énigme : la respiration derrière la porte répond (echo).
   *  Secret : à partir de la deuxième visite, le registre des visiteurs.
   * --------------------------------------------------------------- */
  M('W142', {
    place: [
      { id: 'm5_door13', type: 'decor', at: [29, 1], look: 'door', lookOpt: { style: 'metal', symbol: '13A' },
        lines: [IF({ notFlag: 'm5_w142_echo' }, 'Another door marked 13A, a little apart from the others. Behind it, breathing: yours, a beat late.'),
          IF({ notFlag: 'm5_w142_echo' }, 'When you say something, it says something back, a beat late — but not the same thing.'),
          IF({ flag: 'm5_w142_echo' }, 'Door 13A stands open a crack. Inside: a hospital room, an empty bed, made.'),
          IF({ flag: 'm5_w142_echo' }, 'Beside it, a visitor’s chair far too small for a grown-up.')] },
      { id: 'm5_book', type: 'decor', at: [38, 2], look: 'book', cond: { visits: { W142: 2 } },
        lines: ['At the dead end of the corridor, a visitors’ book on a stand, as if the floor had noticed that you came back.',
          'Every line holds the same name, in the same child’s handwriting, a little steadier each night.', { t: 'Tonight’s line is empty, with a pencil waiting.', do: [{ secret: 'm5_w142_book' }] }] }],
    mech: [{ type: 'echo', zone: [27, 1, 31, 3], words: ['me', 'here', 'too', 'stay', 'wait', 'scared', 'again', 'who'], flag: 'm5_w142_echo',
      reward: [{ secret: 'm5_w142_visitor' }],
      winLines: ['You say it back. Behind the door, the breathing stops, as if somebody had been holding it too.',
        'The door opens a crack: a room with an empty bed and a visitor’s chair, child-sized, the seat worn shiny.',
        'Stuck on the back of the chair, a visitor’s sticker: 13A · ONE VISITOR · EVERY NIGHT.'] }],
    rules: ['Near the 13A door to the right of the lift, say anything: the breathing behind it answers with another word. Say that word back: the door opens on a hospital room with a child-sized visitor’s chair.',
      'Secret: from your second visit to Floor 13A onwards, a visitors’ book stands at the far east end of the corridor.']
  });

  /* ---------------------------------------------------------------
   *  W143 — The Stairs in the Dark
   *  Énigme : allumer les quatre veilleuses à la fois (lampsAll).
   * --------------------------------------------------------------- */
  var NL = [[8, 9], [5, 17], [8, 25], [5, 36]];
  M('W143', {
    place: NL.map(function (p, i) {
      return { id: 'm5_nl' + i, type: 'decor', at: p, look: 'lantern', lookOpt: { c: ['#f0e8c0'] },
        lines: ['A little plug-in night-light shaped like a moon, fixed to the edge of the step, plugged into nothing. It is cold.'] };
    }),
    mech: [{ type: 'lampsAll', lamps: NL.map(function (p, i) { return 'm5_nl' + i; }), time: 14, light: 2.6, flag: 'm5_w143_lit',
      litLines: ['A small moon of light. Under it, the steps stop growing.', 'Another little moon. Up above, the first one is already fading.', 'Click. The dark takes one step back.'],
      onLine: 'It is on. Somewhere above you, another one is fading.', doneLine: 'The night-lights stay on now, all the way down.',
      reward: [{ secret: 'm5_w143_moons' }],
      winLines: ['Four little moons, all lit at once, from the top of the stairs to the bottom.', 'The voice that counts the steps stops in the middle of a number.',
        WHO('The Voice That Counts the Steps', EN('…You can stop counting now. You can see where you are.')), 'For the first time, the stairs are only stairs.'] }],
    rules: ['Four moon-shaped night-lights are fixed to the edges of the stairs. Light all four before the first one goes out (each stays on about fourteen seconds): the voice stops counting.']
  });

  /* ---------------------------------------------------------------
   *  W144 — The House in the Distance
   *  Énigme : la rejoindre sans la regarder (recede).
   *  Secret : la chambre derrière le mur est, éclairée pour personne.
   * --------------------------------------------------------------- */
  M('W144', {
    post: eastRoom(5, 10, 14),
    fakeWalls: [[27, 12]],
    place: [
      { id: 'm5_apron', type: 'decor', at: [23, 13], look: 'ghostfig', solid: false, alpha: 0.7,
        lines: ['A woman in a gardening apron, her back to you, a watering can in her hand.', 'When you look straight at her, she is further away.'] },
      { id: 'm5_lightline', type: 'decor', at: [26, 12], look: 'glint', solid: false, flat: true,
        lines: ['A thin line of warm light under the east wall, as if there were one more room behind it.', 'A room where somebody leaves the lamp on all night.'] },
      { id: 'm5_rug', type: 'decor', at: [28, 12], look: 'towel', solid: false, flat: true,
        lines: ['A folded bath towel laid just inside as a mat, the kind you step onto with cold feet.'] },
      { id: 'm5_lamp', type: 'decor', at: [28, 11], look: 'lamp', light: 2,
        lines: ['A bedside lamp, on. It has been on every night since the house was built, for a child who never lived here.'] },
      { id: 'm5_desk', type: 'decor', at: [31, 11], look: 'desk',
        lines: ['A small desk, the right height for you. Nothing in the drawers but crayons, all the same colour, worn down to stubs.'] },
      { id: 'm5_family', type: 'decor', at: [30, 13], look: 'drawing', solid: false, flat: true,
        lines: ['A school drawing on the floor: DRAW YOUR FAMILY. Four bowls on a table, steam rising, and no faces.',
          'Very lightly in pencil, somebody has begun a fifth bowl, smaller, at the end of the table.', { t: 'The way you set a place for a guest you hope will come.', do: [{ secret: 'm5_w144_room' }] }] }],
    mech: [{ type: 'recede', mark: 'm5_apron', dist: 7, flag: 'm5_w144_reach',
      reward: [{ secret: 'm5_w144_reach' }, { collect: 'photos' }],
      winLines: ['You reach her without looking, the way you used to creep up on her in the garden.',
        'She does not turn round. She only puts the watering can down, at last, and her hand finds the top of your head.',
        KS('이리 와. 밥 식는다.', 'Come here. The rice is getting cold.'),
        'When you look up, there is nobody. Only the watering can, still dripping.', 'Beside it, a photograph: four people at a table, every face turned towards the smallest.'] }],
    rules: ['The woman in the gardening apron in the right-hand room moves away whenever you look straight at her: reach her without looking at her (approach sideways). She puts down her watering can and leaves a photograph.',
      'Secret: the east wall of the right-hand room, where a line of warm light shows under it, can be walked through: a lit child’s room nobody ever lived in, with a drawing of the family.']
  });

  /* ---------------------------------------------------------------
   *  W145 — The Passage When You Stop
   *  Énigme : rester assise sur le banc usé (standStill) : du temps rendu.
   *  Secret : au début du rêve seulement, le cahier du matin.
   * --------------------------------------------------------------- */
  M('W145', {
    place: [
      { id: 'm5_bench', type: 'decor', at: 'random-any', look: 'bench', solid: false,
        lines: ['A bench a little apart from the others, with a dip worn into the middle of the seat.', 'Somebody sat very still here, for a very long time.',
          'Carved into the backrest: MORNINGS ARE BEST HERE.'] },
      { id: 'm5_notebook', type: 'decor', at: 'random-hidden', look: 'book', solid: false, cond: { phase: 'opening' },
        lines: ['A school exercise book dropped in the grass, still damp with morning.',
          'On the last page, in a round child’s hand: “Today I stopped on the way to school.”', '“I watched an ant for the whole of first lesson.”',
          { t: 'In the margin, a teacher has written LATE in red — and then, smaller, as if she had changed her mind: “good”.', do: [{ secret: 'm5_w145_notebook' }] }] }],
    mech: [{ type: 'standStill', mark: 'm5_bench', secs: 40, flag: 'm5_w145_rest', breakLine: 'You moved. The butterfly that was about to land changes its mind.',
      reward: [{ secret: 'm5_w145_rest' }, { time: 60 }],
      winLines: ['You sit. You do nothing. Nobody asks you to do anything.', 'After a long while, the slow butterfly lands on your knee and stays there.',
        'When you finally get up, the dream feels longer than it was, as if the rest had been given back to you with interest.'] }],
    rules: ['Sit on the bench with the worn dip (stand still on it) for forty seconds: the butterfly lands on your knee and the dream gives you a minute back.',
      'Secret: in the first part of the dream only (“mornings are best here”), a school exercise book lies in a nook of the meadow.']
  });

  /* ---------------------------------------------------------------
   *  W146 — The Witch’s Room
   *  Énigme : dire à la poupée qu'elle peut parler (sayTo).
   *  Secret : écrire sur le sixième papier (un stylo).
   * --------------------------------------------------------------- */
  var WRITE6 = [{ if: { notFlag: 'm5_w146_sixth' }, set: { m5_w146_sixth: true },
    lines: ['You write on the blank slip. Your hand knows what to put before you do.'] }, { reeval: true }];
  M('W146', {
    place: [
      { id: 'm5_slip', type: 'decor', at: [2, 1], look: 'letter', solid: false, flat: true,
        lines: [IF({ notFlag: 'm5_w146_sixth' }, 'A sixth slip of paper, tucked under the edge of the pillow, apart from the five rules. It is blank.'),
          IF({ notFlag: 'm5_w146_sixth' }, 'The others were written in pencil by a small hand. This one is waiting for a pen.'),
          IF({ flag: 'm5_w146_sixth' }, 'The sixth slip, in your own handwriting now.')],
        onEffect: { E41: WRITE6, E58: WRITE6, E147: WRITE6, E126: WRITE6 } },
      { id: 'm5_sixth', type: 'decor', at: [3, 1], look: 'letter', solid: false, flat: true, cond: { flag: 'm5_w146_sixth' },
        lines: ['The sixth slip, laid beside the five rules. It is not a rule. It says: “you are allowed to be sad out loud”.',
          { t: 'The five slips on the pillow seem to lie a little flatter, as if something heavy had been lifted off them.', do: [{ secret: 'm5_w146_sixth' }] }] }],
    mech: [{ type: 'sayTo', ent: 'N727', dist: 3, flag: 'm5_w146_doll',
      words: ['you can talk', 'you can speak', 'you can say it', 'you may speak', 'you may talk', 'talk to me', 'tell me', 'speak up', 'it s okay to talk', 'it s ok to talk', 'it s okay to speak',
        '말해도 돼', '말해 봐', '말해봐', '얘기해도 돼', '얘기해 봐'],
      reward: [{ secret: 'm5_w146_doll' }],
      winLines: ['The loose stitch in the middle slips. Then the next one. The red thread falls to the floor in little curls.',
        'The doll opens her mouth for the first time. For a long while she says nothing at all.',
        WHO('A Doll with a Sewn-Up Mouth', EN('…Mum isn’t sleeping. She’s at work.')), 'Then, very quietly:',
        WHO('A Doll with a Sewn-Up Mouth', EN('Thank you for letting me.'))] }],
    rules: ['Tell the doll with the sewn-up mouth that she may speak (“you can talk”, “talk to me”, “말해도 돼”…): the stitches come undone and she says what “hush” was hiding.',
      'Secret: write on the blank sixth slip beside the bed with a pen (Word, Red Pen, Four-Colour Pen or Letter Never Sent): the sixth slip is not a rule.']
  });

  /* ---------------------------------------------------------------
   *  W147 — The Corrupted Room
   *  Énigme : lire les trois mots barrés (encre), dire la phrase (password).
   *  Secret : avec l'Encre, l'original du Protocole 0.
   * --------------------------------------------------------------- */
  var PAGEW = ['IT', 'DID', 'HAPPEN'];
  M('W147', {
    place: PAGEW.map(function (w, i) {
      return { id: 'm5_page' + i, type: 'decor', at: 'random-any', look: 'scraps', solid: false, flat: true,
        lines: [IF({ equipped: INK }, 'A torn page. Under the black bar, the ink of the word has soaked through from the back. It says: ' + w + '.'),
          IF({ not: { equipped: INK } }, 'A torn page. One word on it has been crossed out so hard the paper split.'),
          IF({ not: { equipped: INK } }, 'With ink of your own, you might read it through from the other side.')] };
    }).concat([
      { id: 'm5_corrdesk', type: 'decor', at: 'random-any', look: 'table', lookOpt: { c: ['#e8e4d8'] },
        lines: ['A desk where things are corrected. A thick black marker lies uncapped beside a blank form headed STATEMENT.', 'The form only has room for one sentence. It wants it said out loud.'] },
      { id: 'm5_protocol', type: 'decor', at: 'random-hidden', look: 'letter', solid: false, flat: true, cond: { equipped: 'E24' },
        lines: ['Pinned in a corner where nobody looks: the original page of PROTOCOL 0. “If it hurts, cross it out.”',
          { t: 'Under it, added later in a child’s pencil, pressing so hard it went through: “PROTOCOL 1. If it hurts, say so.”', do: [{ secret: 'm5_w147_protocol' }] }] }]),
    mech: [{ type: 'password', mark: 'm5_corrdesk', dist: 3, words: ['it did happen', 'it happened', 'it did happen to me'], flag: 'm5_w147_said',
      do: [{ if: { notSecret: 'm5_w147_said' }, collect: 'pages',
        lines: ['You say it out loud, to the black marker: it did happen.', 'The marker rolls off the desk by itself and lies still, with its cap on.',
          'All over the paper room, the black bars lift at one corner, like plasters coming away.', 'Under them, words. Not kind ones. But they are there.'] },
        { secret: 'm5_w147_said' }] }],
    rules: ['Three torn pages each hide one word under a black bar, readable with Ink (or Glasses) equipped: IT, DID, HAPPEN. Say “it did happen” at the correction desk: the bars lift, and a page joins her collection.',
      'Secret: with Ink equipped, the original page of Protocol 0 appears in a nook, with a line a child added.']
  });
})(typeof window !== 'undefined' ? window : globalThis);
