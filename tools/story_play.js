/* Joue chaque histoire de bout en bout (sans navigateur) : elle doit pouvoir se terminer.
 * Usage : node tools/story_play.js [--list]
 * Pour chacune : on la confie à un monde qui lui va, on parle, puis selon la sorte on
 * suit l'habitant, on ramasse les objets, on dit le mot, ou on parcourt chaque fin des choix. */
'use strict';
var L = require('./load.js');
var SB = L.load({ skip: /src\/main\.js$/ }), YN = SB.YN, G = YN.game, U = YN.util, ST = YN.stories;
var list = process.argv.indexOf('--list') >= 0;
SB.setTimeout = function (f) { f(); return 0; };
var said = [], choicePath = null;
YN.ui.dialog.queue = function (l, c, d) { (l || []).forEach(function (x) { said.push(x); }); if (d) d(); };
YN.ui.dialog.choose = function (labels, cb) { var i = choicePath && choicePath.length ? choicePath.shift() : 0; cb(Math.min(i, labels.length - 1)); };
YN.ui.effectGet = function () {}; G.toast = function () {}; YN.ui.hud.refresh = function () {};
var W = YN.data.worlds, themeOf = function (k) { return YN.furnish.themeOf(W[k]); };
var worlds = U.keys(W).filter(function (k) { var d = W[k], v = (d.style && d.style.view) || 'top'; return /^W\d{3}$/.test(k) && (d.depth || 0) >= 1 && (d.depth || 0) <= 4 && v === 'top' && !d.inf; });
var fails = [], ok = 0, endings = 0;
function setup(s) {
  YN.save.fresh(); YN.save.beginDream({}); G.state = 'dream';
  var wh = s.where || {}, dp = wh.depth || [1, 4];
  var cand = worlds.filter(function (k) { var d = W[k].depth || 1; return d >= dp[0] && d <= dp[1] && (wh.themes || []).indexOf(themeOf(k)) >= 0; });
  if (!cand.length) cand = worlds.filter(function (k) { var d = W[k].depth || 1; return d >= dp[0] && d <= dp[1]; });
  var w = cand[(s.id.length * 7) % cand.length];
  YN.save.dream.storyPlan = { byWorld: {}, list: [{ id: s.id, world: w }] }; YN.save.dream.storyPlan.byWorld[w] = s.id;
  var rt = G.rt = YN.world.build(w); G.trans = null;
  var e = rt.ents.filter(function (x) { return x.storyId === s.id; })[0];
  return { rt: rt, e: e, w: w };
}
function play(s, path) {
  said = []; choicePath = path ? path.slice() : null;
  var o = setup(s), rt = o.rt, e = o.e;
  if (!e) return 'pas d’habitant dans ' + o.w;
  G.placePlayer(e.x, e.y);
  YN.entities.talk(e, G);
  if (s.kind === 'fetch') {
    var items = rt.marks.filter(function (m) { return m.def.storyItem === s.id; });
    if (items.length !== s.fetch.items.length) return items.length + ' objet(s) posé(s) sur ' + s.fetch.items.length + ' dans ' + o.w;
    items.forEach(function (m) { G.useMark(m); }); YN.entities.talk(e, G);
  }
  if (s.kind === 'word') YN.speech.dispatch(s.word.words[0], false);
  if (s.kind === 'follow') {
    var last = [e.x, e.y], prev = [e.x, e.y];
    for (var i = 0; i < 9000 && ST.state(s.id).stage !== 'done'; i++) {
      if (e.x !== last[0] || e.y !== last[1]) { prev = last; last = [e.x, e.y]; }
      var p = G.player; p.x = prev[0]; p.y = prev[1]; p.fx = prev[0]; p.fy = prev[1]; p.px = prev[0] + 0.5; p.py = prev[1] + 0.62;
      YN.entities.update(rt, 1 / 30, G); ST.tick(1 / 30);
    }
  }
  var st = ST.state(s.id);
  if (st.stage !== 'done') return 'pas terminée (étape ' + st.stage + ') dans ' + o.w;
  var bad = said.filter(function (l) { return !l || (typeof l !== 'string' && typeof l.t !== 'string' && typeof l.t !== 'function'); }); if (bad.length) return 'réplique vide : ' + JSON.stringify(bad[0]).slice(0, 160) + ' dans ' + o.w;
  return null;
}
/* tous les chemins d'un arbre de choix (jusqu'à 40) */
function paths(s) {
  var out = [], c = s.choice;
  (function walk(id, acc) { if (out.length >= 40) return; var nd = c.nodes[id]; if (!nd) { out.push(acc.slice()); return; } nd.choices.forEach(function (ch, i) { walk(ch.to, acc.concat([i])); }); })(c.start, []);
  return out;
}
YN.data.stories.forEach(function (s) {
  var err = null;
  try {
    if (s.kind === 'choice') { var ps = paths(s); for (var i = 0; i < ps.length && !err; i++) { err = play(s, ps[i]); if (!err) endings++; } }
    else err = play(s);
  } catch (ex) { err = 'erreur : ' + (ex.stack || ex).toString().split('\n').slice(0, 2).join(' '); }
  if (err) fails.push(s.id + ' (' + s.kind + ') : ' + err); else ok++;
});
console.log('Histoires jouées : ' + YN.data.stories.length + ' · terminées : ' + ok + ' · fins de dialogue parcourues : ' + endings + ' · échecs : ' + fails.length);
fails.slice(0, list ? 999 : 20).forEach(function (f) { console.log('  ' + f); });
process.exitCode = fails.length ? 1 : 0;
