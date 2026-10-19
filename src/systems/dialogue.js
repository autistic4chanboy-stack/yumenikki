/* =========================================================================
 *  Dialogues écrits à la main : branches conditionnelles évaluées de haut
 *  en bas (la première qui convient parle), choix, actions, nœuds nommés.
 *  Les étapes et relations modifiées ne sont validées qu'au réveil.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var D = YN.dialogue = {
    active: null,
    start: function (id, ent, ctx) {
      var def = YN.data.dialogues[id];
      if (!def) { YN.warn('unknown dialogue: ' + id); return; }
      ctx = Object.assign({ ent: ent, dlg: id }, ctx || {});
      var br = D.pick(def, ctx, id);
      if (!br) { YN.ui.dialog.queue([{ t: '…', who: def.who }], ctx); return; }
      D.play(def, br, ctx, id);
    },
    pick: function (def, ctx, id) {
      var list = def.branches || [];
      for (var i = 0; i < list.length; i++) {
        var b = list[i];
        if (b.if && !YN.cond.check(b.if, ctx)) continue;
        if (b.once && YN.save.flag('dlg:' + id + ':' + b.once)) continue;
        return b;
      }
      return null;
    },
    norm: function (def, lines) {
      return (lines || []).filter(function (l) { return !(l && l.if) || YN.cond.check(l.if); }).map(function (l) {
        var o = typeof l === 'string' ? { t: l } : Object.assign({}, l);
        if (o.who === undefined) o.who = def.who; if (!o.voice) o.voice = def.voice; if (!o.lang && def.lang) o.lang = def.lang;
        return o;
      });
    },
    play: function (def, node, ctx, id) {
      if (node.once) YN.save.setFlag('dlg:' + id + ':' + node.once, true);
      if (node.pre) YN.act.run(node.pre, ctx);
      var lines = D.norm(def, node.lines);
      YN.ui.dialog.queue(lines, ctx, function () {
        if (node.do) YN.act.run(node.do, ctx);
        var ch = (node.choices || []).filter(function (c) { return !c.if || YN.cond.check(c.if, ctx); });
        if (ch.length) {
          YN.ui.dialog.choose(ch.map(function (c) { return c.t; }), function (i) {
            var c = ch[i];
            if (c.do) YN.act.run(c.do, ctx);
            var after = function () { if (c.go) { var n = def.nodes && def.nodes[c.go]; if (n) D.play(def, n, ctx, id); } };
            if (c.lines) YN.ui.dialog.queue(D.norm(def, c.lines), ctx, after); else after();
          });
        } else if (node.go) {
          var n2 = def.nodes && def.nodes[node.go]; if (n2) D.play(def, n2, ctx, id);
        }
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
