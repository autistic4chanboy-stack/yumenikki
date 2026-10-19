/* =========================================================================
 *  La parole : la joueuse tape une phrase, la protagoniste la dit.
 *  Éveillée, elle ne parle pas (« … »), sauf quand sa voix est revenue.
 *  Ce qui est dit est un bruit (la Sonnette l'entend) et la Copieuse s'en souvient.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var SP = YN.speech = {
    bubbles: [], // {who:'player'|ent, text, until}
    globalListeners: [],
    listen: function (fn) { SP.globalListeners.push(fn); },
    voiceReturned: function () { return !!YN.save.flag('voice_returned'); },
    say: function (text) {
      var G = YN.game;
      text = String(text || '').trim().slice(0, 80);
      if (!text) return;
      var awake = G.rt && G.rt.depth === 0;
      if (awake && !SP.voiceReturned()) {
        SP.bubble('player', '…', 2.4);
        YN.audio.sfx('breath');
        SP.dispatch(text, true);
        return;
      }
      SP.bubble('player', text, 3.2);
      var n = U.norm(text);
      if (YN.save.dream) {
        YN.save.dream.said.push(n); YN.save.dream.saidRaw = YN.save.dream.saidRaw || []; YN.save.dream.saidRaw.push(text);
        if (YN.save.dream.said.length > 60) { YN.save.dream.said.shift(); YN.save.dream.saidRaw.shift(); }
      }
      for (var i = 0; i < Math.min(8, text.length); i++) setTimeout(function () { YN.audio.blip({ wave: 'triangle', pitch: 520, vary: 3, vol: 0.05 }); }, i * 55);
      if (G.rt && G.rt.depth > 0) G.noise(G.player.x, G.player.y, 5, 'speech');
      SP.dispatch(text, awake);
    },
    dispatch: function (text, awake) {
      var G = YN.game, rt = G.rt, n = U.norm(text), handled = false;
      for (var g = 0; g < SP.globalListeners.length; g++) { try { if (SP.globalListeners[g](n, text, awake)) handled = true; } catch (e) { YN.warn('listener: ' + e); } }
      if (!rt) return handled;
      if (YN.world.mechCall(rt, 'onSpeak', n, text)) handled = true;
      // marques qui écoutent (portes à mot de passe, statues...)
      rt.marks.forEach(function (m) {
        if (!m.active || !m.def.listen) return;
        if (U.dist(m.x, m.y, G.player.x, G.player.y) > (m.def.listenDist || 4)) return;
        m.def.listen.forEach(function (L) {
          if (L.if && !YN.cond.check(L.if, { mark: m })) return;
          var ok = L.any || (L.match || []).some(function (w) { var ww = U.norm(w); return L.exact ? n === ww : (n === ww || n.indexOf(ww) >= 0); });
          if (ok) { handled = true; YN.act.run(L.do, { mark: m, said: text }); if (L.lines) YN.ui.dialog.queue(L.lines, { mark: m }); }
        });
      });
      // PNJ proches
      rt.ents.forEach(function (e) {
        if (!e.present || U.dist(e.x, e.y, G.player.x, G.player.y) > (e.def.hearDist || 4)) return;
        if (YN.entities.hear(e, text)) handled = true;
      });
      return handled;
    },
    bubble: function (who, text, sec) {
      SP.bubbles = SP.bubbles.filter(function (b) { return b.who !== who; });
      SP.bubbles.push({ who: who, text: text, until: YN.game.clock + (sec || 3) });
      if (YN.ui) YN.ui.bubbles.refresh();
    },
    npcBubble: function (ent, line) {
      if (!ent) return;
      var t = typeof line === 'string' ? line : (line.t || '');
      var r = YN.lang.render(typeof line === 'string' ? { t: line, lang: ent.def.lang } : line, {});
      SP.bubbles = SP.bubbles.filter(function (b) { return b.who !== ent; });
      SP.bubbles.push({ who: ent, html: r.html, tr: r.tr, text: t, until: YN.game.clock + Math.max(2.5, t.length * 0.08) });
      if (ent.def.voice) for (var i = 0; i < Math.min(6, t.length / 3); i++) setTimeout(function () { YN.audio.blip(ent.def.voice); }, i * 70);
      if (YN.ui) YN.ui.bubbles.refresh();
    },
    update: function () {
      var c = YN.game.clock, before = SP.bubbles.length;
      SP.bubbles = SP.bubbles.filter(function (b) { return b.until > c && (b.who === 'player' || (b.who.present !== false)); });
      if (SP.bubbles.length !== before && YN.ui) YN.ui.bubbles.refresh();
    },
    clear: function () { SP.bubbles = []; if (YN.ui) YN.ui.bubbles.refresh(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
