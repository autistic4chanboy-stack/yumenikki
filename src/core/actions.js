/* =========================================================================
 *  Actions génériques déclenchées par les données (marques, dialogues,
 *  énigmes, événements). Une action = un objet { clé: valeur }.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var A = YN.act = {
    run: function (list, ctx) {
      if (!list) return;
      if (!Array.isArray(list)) list = [list];
      ctx = ctx || {};
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (!a) continue;
        if (typeof a === 'function') { try { a(ctx); } catch (e) { YN.warn('action-fn : ' + (e.stack || e)); } continue; }
        if (a.if && !YN.cond.check(a.if, ctx)) { if (a.else) A.run(a.else, ctx); continue; }
        A.one(a, ctx);
      }
    },
    one: function (a, ctx) {
      var S = YN.save, G = YN.game;
      for (var k in a) {
        if (!Object.prototype.hasOwnProperty.call(a, k) || k === 'if' || k === 'else') continue;
        var v = a[k];
        switch (k) {
          case 'set': U.keys(v).forEach(function (f) { S.setFlag(f, v[f]); }); break;
          case 'setNow': U.keys(v).forEach(function (f) { S.setFlag(f, v[f], true); }); break;
          case 'unset': (Array.isArray(v) ? v : [v]).forEach(function (f) { S.setFlag(f, null); }); break;
          case 'inc': U.keys(v).forEach(function (f) { S.setFlag(f, (S.flag(f) || 0) + v[f]); }); break;
          case 'temp': U.keys(v).forEach(function (t) { S.temp(t, v[t]); }); break;
          case 'tempInc': U.keys(v).forEach(function (t) { S.temp(t, (S.temp(t) || 0) + v[t]); }); break;
          case 'rel': U.keys(v).forEach(function (n) { S.addRel(n, v[n]); }); break;
          case 'quest': U.keys(v).forEach(function (q) { S.setQuest(q, v[q]); if (G) G.questNotice(q, v[q]); }); break;
          case 'give': if (G) G.giveEffect(v, ctx); else S.grantEffect(v); break;
          case 'cookie': if (G) G.giveCookie(v); else S.addCookie(); break;
          case 'item': U.keys(v).forEach(function (it) { S.addItem(it, v[it]); if (G && v[it] > 0) G.toast(YN.lang.itemName(it)); }); break;
          case 'collect': if (YN.collect) (Array.isArray(v) ? v : [v]).forEach(function (sid) { YN.collect.grantNext(sid) || YN.collect.grantNext('coins'); }); break; // une pièce de collection (coins, pages, photos, cranes)
          case 'note': S.addNote(v); break;
          case 'secret': S.setSecret(v); break;
          case 'sfx': if (typeof v === 'object') YN.audio.sfx(v.id, v); else YN.audio.sfx(v); break;
          case 'msg': if (YN.ui) YN.ui.dialog.queue([{ t: v }]); break;
          case 'lines': if (YN.ui) YN.ui.dialog.queue(v, ctx); break;
          case 'dialog': if (YN.dialogue) YN.dialogue.start(v, ctx.ent || null, ctx); break;
          case 'toast': if (G) G.toast(v); break;
          case 'time': if (G) G.addTime(v); break;
          case 'teleport': if (G) G.warp(v.world, v.arrive, v.fx); break;
          case 'wake': if (G) G.wake(v === true ? 'event' : v); break;
          case 'corrupt': if (G && G.rt) S.addCorruption(v.world || G.rt.id, v.n || v); break;
          case 'stabilize': if (G && G.rt) { S.stabilize(v === true ? G.rt.id : v, 5); if (YN.corruption) YN.corruption.apply(G.rt); } break;
          case 'tile': if (G && G.rt) (Array.isArray(v) ? v : [v]).forEach(function (t) { G.rt.setTemp(t.x, t.y, t.ch, t.layer || 'act'); }); break;
          case 'show': if (G && G.rt) (Array.isArray(v) ? v : [v]).forEach(function (id) { var m = G.rt.findMark(id); if (m) { m.forceActive = true; m.def = Object.assign({}, m.def, { cond: null }); m.active = true; } }); break;
          case 'hide': if (G && G.rt) (Array.isArray(v) ? v : [v]).forEach(function (id) { var m = G.rt.findMark(id); if (m) m.active = false; }); break;
          case 'music': YN.audio.playMusic(v, { fade: 2 }); break;
          case 'stopMusic': YN.audio.stopMusic(v); break;
          case 'shake': YN.render.cam.shake = v; break;
          case 'fx': if (YN.render) YN.render.addFx(Object.assign({ x: G.player.x, y: G.player.y }, v)); break;
          case 'ending': if (G) G.ending(v); break;
          case 'witch': if (YN.witches) YN.witches.summon(v); break;
          case 'priestess': if (YN.priestess) YN.priestess.summon(v === true ? {} : v); break;
          case 'egg': if (G) G.depositEgg(v); break;
          case 'pill': if (S.perm) { S.perm.pills[v.kind] = U.clamp((S.perm.pills[v.kind] || 0) + v.n, 0, v.kind === 'blue' ? 5 : 7); } break;
          case 'room': if (S.perm) { U.keys(v).forEach(function (r) { S.perm.room[r] = v[r]; if (S.dream) S.dream.room[r] = v[r]; }); } break;
          case 'reeval': if (G && G.rt) YN.world.reeval(G.rt); break;
          case 'emit': YN.bus.emit(v.ev || v, v.a, v.b); break;
          case 'mech': if (G && G.rt) YN.world.mechCall(G.rt, 'onAction', v, ctx); break;
          case 'npc': if (G && G.rt) U.keys(v).forEach(function (id) { var e = G.rt.findEnt(id); if (e) Object.assign(e.state, v[id]); }); break;
          case 'say': if (YN.speech) YN.speech.npcBubble(ctx.ent, v); break;
          case 'fn': try { v(ctx); } catch (e) { YN.warn('act.fn : ' + (e.stack || e)); } break;
          case 'wait': break;
          default: YN.warn('unknown action: ' + k);
        }
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
