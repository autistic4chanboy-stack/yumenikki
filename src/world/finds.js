/* =========================================================================
 *  TROUVAILLES — comment s'obtiennent les 90 artefacts (E91–E180).
 *  Plus rien n'attend simplement par terre : chaque artefact a sa façon
 *  d'apparaître, tirée du lieu, toujours faisable et jamais expliquée.
 *   · fouiller   : un meuble du lieu (tiroir, casier, boîte aux lettres…) ;
 *                  il faut y revenir, la troisième fois quelque chose est au fond.
 *   · creuser    : des feuilles mortes, du sable, des cailloux : on gratte trois fois.
 *   · gardien    : un habitant du lieu le garde dans sa main fermée ; à force
 *                  de revenir lui parler, il le donne.
 *   · patience   : une lueur au sol qui ne se laisse pas prendre ; il faut
 *                  rester immobile dessus, et elle se solidifie.
 *   · trois      : trois petites choses à éveiller (bougies, carillons,
 *                  interrupteurs…) ; quand les trois sont éveillées, ailleurs,
 *                  quelque chose tinte et apparaît.
 *   · reflet     : une flaque, un miroir, une vitre : on y voit un objet qui
 *                  n'est pas dans la pièce… et il apparaît dans un recoin.
 *  Les compteurs sont propres au rêve en cours (mémoire temporaire).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var BOX = { // meubles à fouiller selon le thème du lieu
    home: ['drawer', 'commode', 'nightstand', 'toybox', 'cookiejar', 'mailbox'], school: ['locker', 'schooldesk', 'drawer'], institution: ['locker', 'drawer', 'suitcase'],
    office: ['drawer', 'locker', 'mailbox'], city: ['mailbox', 'trash', 'newsstand', 'vending'], korea: ['mailbox', 'onggi', 'vending', 'drawer'], north: ['crate', 'suitcase', 'locker'],
    nature: ['stump', 'nest', 'jar'], beach: ['shell', 'barrel', 'boat'], water: ['barrel', 'jar', 'shell'], snow: ['snowman', 'crate', 'barrel'], abstract: ['jar', 'onggi', 'vitrine', 'musicbox']
  };
  var DIG = { nature: 'deadleaves', beach: 'pebbles', snow: 'tuft', city: 'deadleaves', home: 'scraps', korea: 'deadleaves', abstract: 'pebbles', water: 'pebbles', north: 'scraps', office: 'scraps', school: 'scraps', institution: 'scraps' };
  var WAKE = { // les trois petites choses
    home: 'candle', school: 'lamp', institution: 'lamp', office: 'lamp', city: 'lamp', korea: 'chime', north: 'lever', nature: 'chime', beach: 'chime', water: 'chime', snow: 'candle', abstract: 'candle'
  };
  var MIRROR = { home: 'mirror', school: 'vitrine', institution: 'tank', office: 'crt', city: 'puddle', korea: 'puddle', north: 'crt', nature: 'puddle', beach: 'puddle', water: 'puddle', snow: 'puddle', abstract: 'mirror' };
  var WALL = {}; // (aucun objet mural : ils sont posés au sol)

  var SEARCH_LINES = [
    ['Nothing. She closes it again.', 'Nothing. But it rattles, deep inside.'],
    ['Old things, folded small.', 'Something rolls at the very back.'],
    ['Dust.', 'Dust, and under the dust, a shape.'],
    ['Empty.', 'Empty… except it isn’t.']
  ];
  var DIG_LINES = [['She scrapes a little.', 'Deeper. Something hard.'], ['Only earth and cold.', 'Her nails find an edge.']];
  var KEEP_HINT = ['%s keeps one hand closed.', '%s holds something against the chest and looks away.', '%s’s fist stays shut, even when waving.'];
  var KEEP_GIVE = ['%s opens the hand. It was warm in there for a long time.', '%s puts something in her palm and closes her fingers over it.', '“Take it. It was waiting for you, not for me.”'];
  var LOOK_LINES = ['In the reflection there is something that isn’t in the room.', 'Behind her, in the glass, something small glints. Behind her, there is nothing.', 'The water shows a corner she hasn’t looked in.'];

  function H(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
  function pick(a, h) { return a[h % a.length]; }

  /* un habitant du lieu qui peut garder l'objet : visible, posé, sans dialogue particulier */
  function keeperFor(w) {
    var list = [];
    try { list = YN.entities.defsFor(w.id); } catch (e) { list = []; }
    var ok = list.filter(function (s) {
      var d = s.def;
      return d && !d.invisible && d.kind !== 'voice' && !d.hostile && !d.dialog && !d.silentTalk && !d.onTalk && !d.gift && !s.appear && !d.appear && !d.nightOnly && !d.dayOnly && !d.snowOnly && !d.goneIf &&
        /^(static|wander|watcher|turnaway|shy)?$/.test(d.behavior || '') && (d.lines || s.lines);
    });
    return ok.length ? ok[0].def : null;
  }

  var F = YN.finds = {
    counts: {},
    /* prépare la façon d'obtenir l'artefact e dans le monde w (appelé par data/effects_more.js) */
    plan: function (w, e, i) {
      var h = H(e.id + w.id), th = (YN.furnish && YN.furnish.themeOf) ? YN.furnish.themeOf(w) : 'home';
      var view = (w.style && w.style.view) || w.view || 'top', inf = !!(w.inf || (w.gen && /inf/.test(w.gen.type || '')));
      var methods = ['search', 'keeper', 'patience', 'trio', 'dig', 'mirror'];
      var m = methods[(i * 7 + (h >>> 3)) % methods.length];
      if (inf || view !== 'top') m = 'patience';
      var keeper = m === 'keeper' ? keeperFor(w) : null;
      if (m === 'keeper' && !keeper) m = (h & 1) ? 'search' : 'mirror';
      var col = (e.icon && e.icon.c) || '#f0e0a0', key = 'find:' + e.id, P = [];
      var art = { id: 'art_' + e.id, type: 'effect', give: e.id, look: 'trinket', lookOpt: { c: [col] }, at: 'random-hidden', solid: false, animated: true, ground: true };
      e.find = m;
      if (m === 'search' || m === 'dig') {
        var look = m === 'dig' ? (DIG[th] || 'deadleaves') : pick(BOX[th] || BOX.home, h >>> 5), L = m === 'dig' ? pick(DIG_LINES, h >>> 7) : pick(SEARCH_LINES, h >>> 7);
        var notYet = { fn: function () { return !YN.save.hasEffect(e.id) && !YN.save.isEgg(e.id); } }, got = { not: notYet };
        var kq = function (n) { var o = {}; o[key] = n; return o; };
        P.push({ id: 'find_' + e.id, type: 'decor', look: look, at: 'random-hidden', solid: m === 'search' && !WALL[look], flat: m === 'dig',
          use: [{ if: notYet, tempInc: kq(1) }, { if: { all: [notYet, { tempGte: kq(3) }] }, give: e.id }, { if: got, tempInc: kq(1) }],
          lines: [{ if: { all: [notYet, { not: { tempGte: (function () { var o = {}; o[key] = 2; return o; })() } }] }, t: L[0] },
            { if: { all: [notYet, { tempGte: (function () { var o = {}; o[key] = 2; return o; })() }, { not: { tempGte: (function () { var o = {}; o[key] = 3; return o; })() } }] }, t: L[1] },
            { if: { all: [got, { temp: kq(4) }] }, t: m === 'dig' ? 'There.' : 'There it is.' },
            { if: { all: [got, { not: { temp: kq(4) } }] }, t: m === 'dig' ? 'Only earth now.' : 'Nothing left in it.' }] });
        e.get = (m === 'dig' ? 'Something is buried under the ' + look + ' in ' : 'Kept in a ' + look + ' in ') + (w.name || w.id) + ': search it more than once.';
      } else if (m === 'keeper') {
        keeper.gift = { effect: e.id, after: 3, hint: pick(KEEP_HINT, h >>> 9).replace('%s', keeper.name || 'Someone'), give: pick(KEEP_GIVE, h >>> 11).replace('%s', keeper.name || 'Someone') };
        e.get = keeper.name + ' (' + (w.name || w.id) + ') keeps it in a closed hand: come back and talk until it is given.';
        e.keeper = keeper.id;
      } else if (m === 'patience') {
        art.cond = (function () { var o = {}; o[key] = true; return { temp: o }; })();
        P.push({ id: 'find_' + e.id, type: 'decor', look: 'sparkle', lookOpt: { c: ['#fff4c8'] }, at: 'random-hidden', solid: false, flat: true, noInteract: true, animated: true, patience: { key: key, art: art.id, secs: 4 } });
        e.get = 'A glint on the ground in ' + (w.name || w.id) + ' that won’t be picked up: stand still on it.';
      } else if (m === 'trio') {
        var wl = WAKE[th] || 'candle', keys = [key + ':a', key + ':b', key + ':c'];
        keys.forEach(function (k, j) {
          var setK = {}; setK[k] = true;
          var after = { all: keys.map(function (q) { var o = {}; o[q] = true; return { temp: o }; }) };
          P.push({ id: 'find_' + e.id + '_' + j, type: 'decor', look: wl, at: 'random-any', solid: !WALL[wl] && wl !== 'switch', lookOpt: {},
            use: [{ if: { not: { temp: setK } }, temp: setK, sfx: { id: 'chime', note: j * 3 + 2 }, fx: { type: 'spark', life: 0.8, color: col } }, { reeval: true }, { if: { all: [after, { not: { effect: e.id } }] }, toast: 'Somewhere, something clinks.' }],
            lines: [{ if: { not: { temp: setK } }, t: j === 0 ? 'It wakes under her hand.' : j === 1 ? 'A second one answers.' : 'And the third.' }] });
        });
        art.cond = { all: keys.map(function (q) { var o = {}; o[q] = true; return { temp: o }; }) };
        e.get = 'Three ' + wl + 's in ' + (w.name || w.id) + ': wake all three, then look in the corners.';
      } else if (m === 'mirror') {
        var ml = MIRROR[th] || 'puddle', seen = {}; seen[key] = true;
        P.push({ id: 'find_' + e.id, type: 'decor', look: ml, at: 'random-any', solid: false, flat: ml === 'puddle', wall: !!WALL[ml],
          use: [{ if: { not: { temp: seen } }, temp: seen, sfx: 'reveal' }, { reeval: true }],
          lines: [{ if: { not: { effect: e.id } }, t: pick(LOOK_LINES, h >>> 13) }, { if: { effect: e.id }, t: 'Only her face.' }] });
        art.cond = { temp: seen };
        e.get = 'A ' + ml + ' in ' + (w.name || w.id) + ' shows a thing that isn’t there; once seen, it lies in a corner.';
      }
      if (m !== 'search' && m !== 'dig') P.push(art);
      w.place = (w.place || []).concat(P);
      F.counts[m] = (F.counts[m] || 0) + 1;
      return m;
    },

    /* une lueur : rester immobile dessus la fait apparaître */
    tick: function (dt) {
      var G = YN.game, rt = G && G.rt; if (!rt || !G.inDream() || G.paused || !rt.marks) return;
      var p = G.player;
      for (var i = 0; i < rt.marks.length; i++) {
        var m = rt.marks[i], pt = m.def.patience; if (!pt || !m.active || m.state.done) continue;
        if (YN.save.hasEffect(m.def.give || '') ) continue;
        var dx = p.px - (m.x + 0.5), dy = p.py - (m.y + 0.6);
        if (rt.wrap) { dx = U.mod(dx + rt.w / 2, rt.w) - rt.w / 2; dy = U.mod(dy + rt.h / 2, rt.h) - rt.h / 2; }
        var on = dx * dx + dy * dy < 0.55 && !p.moving;
        m.state.wait = on ? (m.state.wait || 0) + dt : 0;
        if (on && m.state.wait > 1.2 && !m.state.hummed) { m.state.hummed = true; YN.audio.sfx('swell', { vol: 0.25 }); }
        if (m.state.wait >= (pt.secs || 4)) {
          m.state.done = true; YN.save.temp(pt.key, true); YN.world.reeval(rt);
          var a = rt.findMark(pt.art); if (a) { a.x = m.x; a.y = m.y; }
          m.active = false;
          YN.audio.sfx('reveal'); YN.render.addFx({ type: 'spark', x: m.x, y: m.y, life: 1, color: '#fff4c8' });
        }
      }
    },

    /* un habitant qui garde l'objet : un indice la deuxième fois, le don à la troisième */
    afterTalk: function (e, G) {
      var g = e.def.gift; if (!g || YN.save.hasEffect(g.effect) || YN.save.isEgg(g.effect) || !G.inDream()) return;
      var n = (YN.save.temp('gift:' + e.def.id) || 0) + 1; YN.save.temp('gift:' + e.def.id, n);
      if (n === g.after - 1) YN.ui.dialog.queue([{ t: g.hint, who: '' }], { ent: e });
      else if (n >= g.after) YN.ui.dialog.queue([{ t: g.give, who: '' }], { ent: e }, function () { G.giveEffect(g.effect); });
    }
  };

  // branchements : la boucle du jeu et la parole des habitants (appelé par data/effects_more.js)
  F.hook = function () {
    var G = YN.game, EN = YN.entities;
    if (G && EN && !G._findsHooked) {
      G._findsHooked = true;
      var up = G.update; G.update = function (dt) { var r = up.apply(G, arguments); try { F.tick(dt || 0); } catch (ex) { YN.warn('finds: ' + (ex.stack || ex)); } return r; };
      var talk = EN.talk; EN.talk = function (e, g) { var r = talk.apply(EN, arguments); try { F.afterTalk(e, g || G); } catch (ex) { YN.warn('finds: ' + (ex.stack || ex)); } return r; };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
