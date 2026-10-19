/* =========================================================================
 *  ÉVÉNEMENTS À L'HEURE RÉELLE — jamais nécessaires, toujours suggérés
 *  par un indice quelque part dans les rêves.
 *    · l'heure du loup (03:00–03:59) ........ indice : graffiti, Ville au crépuscule
 *    · la minute qui bégaie (11:11, 22:22…) . indice : Toc-Toc, Salle des horloges
 *    · 어버이날 (8 mai) ...................... indice : calendrier du 44e étage
 *    · le vendredi 13 ........................ indice : le facteur des portes identiques
 *    · la veille de Noël (24–25 déc.) ....... indice : boîte aux lettres du quartier vide
 *  (le train de 23h71, la fête des mères, la pleine lune, la pause déjeuner
 *   et l'école fermée le dimanche sont définis avec leurs mondes)
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function place(world, md) { var w = YN.data.worlds[world]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ at: 'random-any' }, md)]); }

  /* ---- l'heure du loup ---- */
  place('W003', { id: 'wolfgraffiti', type: 'sign', look: 'poster', lookOpt: { c: ['#3a3a4a', '#c8c8d0'] }, lines: ['Its fingers are white with chalk. With its chin, it points at the forest that always comes back.', EN('At three, even the wolves don’t sleep.'), EN('He keeps the night workers company. Go and see him, if you’re up.')] });
  YN.defEntity({ id: 'N580', name: 'The Wolf That Never Sleeps', world: 'W109', kind: 'animal', behavior: 'wander', radius: 4, speed: 0.9, solid: true, appear: { realDate: 'wolf' },
    look: { t: 'dog', c: ['#4a4a5a'], h: 16 },
    lines: ['A grey wolf, sitting among the trees that grow back. He doesn’t bite. There are dark rings under his eyes.', EN('Three o’clock. The hour when people who work nights are coldest. I keep them company.'), { if: { realDate: 'wolf' }, t: 'He rests his head on your knees, just for a moment. He is heavy, and warm.', do: [{ secret: 'wolf_hour' }, { note: 'n_wolf' }] }] });
  YN.data.worlds.W109.npcs = (YN.data.worlds.W109.npcs || []).concat([{ id: 'N580', at: 'random-any' }]);

  /* ---- la minute qui bégaie : un vœu ---- */
  place('W081', { id: 'twinclock', type: 'sign', look: 'wallclock', lines: ['A clock soul, with two hands of the same length instead of arms.', EN('When the hour repeats itself, it listens.'), EN('Eleven past eleven. Twenty-two past ten at night. Say what you want, out loud.')] });
  var toc = YN.data.dialogues.toctoc;
  if (toc) toc.branches.splice(toc.branches.length - 1, 0, { if: { realDate: 'twinMinute' }, lines: [EN('Shh, Boss! The clock’s stuttering! Quick, a wish! Out loud, or it doesn’t count!')] });
  YN.bus.on('boot', function () {
    YN.speech.listen(function (n) {
      var G = YN.game; if (!G.rt || !YN.save.dream || G.rt.depth === 0) return false;
      if (!/(^| )(wish|wishes|wishing|소원)( |$)/.test(n)) return false;
      if (!YN.realtime.named('twinMinute')) return false;
      var d = YN.realtime.now(), key = 'wish:' + d.getFullYear() + (d.getMonth() + 1) + d.getDate() + ':' + d.getHours() + d.getMinutes();
      if (YN.save.flag(key)) return false;
      YN.save.setFlag(key, true, true);
      YN.audio.sfx('reveal');
      setTimeout(function () { YN.ui.dialog.queue([{ t: 'Every clock in the dream stops for a second, to listen to you.' }, { t: 'In your pocket, something that wasn’t there before.' }], {}, function () { G.giveCookie(); YN.save.setSecret('twin_wish'); }); }, 700);
      return true;
    });
  });

  /* ---- 어버이날, le 8 mai ---- */
  place('W139', { id: 'kimcalendar', type: 'decor', look: 'calendar', lines: ['A desk calendar. 8 May is circled in red marker: “어버이날”. Someone has drawn a carnation on it, very clumsily, like a child.'] });
  place('W033', { id: 'carnations', type: 'decor', look: 'flowers', lookOpt: { c: ['#d02040', '#40a040'] }, cond: { realDate: 'parentsDay' }, lines: ['On every desk in the tower, a red carnation in a plastic cup. Nobody knows who put them there.', KS('엄마 아빠 사랑해요.', 'Mum, Dad, I love you.'), 'The handwriting is a child’s. On one of the cups: “미란”.'], use: [{ secret: 'parents_day' }, { note: 'n_parentsday' }] });

  /* ---- le vendredi 13 : la maison numéro 13 ---- */
  var post = YN.data.entities.N611 && YN.data.entities.N611.world === 'W010' ? YN.data.entities.N611 : U.keys(YN.data.entities).map(function (k) { return YN.data.entities[k]; }).filter(function (e) { return e.world === 'W010' && /facteur|postman/i.test(e.name || ''); })[0];
  if (post) post.lines = (post.lines || []).concat([EN('On Friday the 13th there’s one more house. Number 13. I don’t deliver there. Nobody lives above 12.')]);
  place('W010', { id: 'house13', type: 'door', to: 'W142', look: 'door', lookOpt: { style: 'wood', c: ['#2a2a2a'], symbol: '13' }, cond: { realDate: 'friday13' }, label: 'house number 13', appearSfx: 'reveal' });

  /* ---- la veille de Noël ---- */
  place('W008', { id: 'xmasletter', type: 'decor', look: 'mailbox', lines: ['A letterbox. A card is sticking out, handwritten:', EN('On the 24th we light the tree, even if nobody comes.')] });
  place('W008', { id: 'xmastree', type: 'decor', look: 'pine', light: 3.5, cond: { realDate: 'christmas' }, lines: ['Behind a window, a Christmas tree with its lights on. The only lit house in the whole neighbourhood. Someone came after all.'], use: [{ secret: 'christmas_window' }] });

  Object.assign(YN.data.notes, {
    n_wolf: { t: 'At three o’clock, a wolf keeps the night workers company.' },
    n_parentsday: { t: 'On 8 May, carnations on every desk. One cup said “미란”.' }
  });
})(typeof window !== 'undefined' ? window : globalThis);
