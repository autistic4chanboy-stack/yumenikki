/* =========================================================================
 *  HISTOIRES — des habitants qui racontent, demandent, emmènent, écoutent.
 *  Les histoires sont écrites dans data/stories/*.js (YN.addStory). Chaque
 *  nuit, quelques-unes sont confiées à des mondes qui leur vont (thème,
 *  profondeur). Une histoire finie ne revient jamais : rien ne se répète.
 *   · follow : l'habitant marche vers un endroit (une cachette, l'eau, un
 *              recoin, très loin) ; il attend si on traîne.
 *   · fetch  : il a perdu une à quatre choses, posées quelque part dans ce monde.
 *   · choice : une conversation à embranchements ; chaque fin est différente.
 *   · word   : il n'entend qu'un mot ; à deviner (touche T pour parler).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  YN.data.stories = YN.data.stories || [];
  YN.addStory = function (s) { YN.data.stories.push(s); };

  var D4 = [[1, 0, 'right'], [-1, 0, 'left'], [0, 1, 'down'], [0, -1, 'up']];
  var AFTER = ['%s is humming something now.', '%s looks lighter, somehow.', '%s nods at her like an old friend.', '%s doesn’t need anything any more.', '%s is looking at the sky. There is no sky.'];
  // distance qui tient compte des mondes qui bouclent sur eux-mêmes
  function wd(rt, ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; if (rt && rt.wrap) { dx = U.mod(dx + rt.w / 2, rt.w) - rt.w / 2; dy = U.mod(dy + rt.h / 2, rt.h) - rt.h / 2; } return Math.sqrt(dx * dx + dy * dy); }
  function H(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }

  var ST = YN.stories = {
    byId: function (id) { if (!ST._idx) { ST._idx = {}; YN.data.stories.forEach(function (s) { ST._idx[s.id] = s; }); } return ST._idx[id] || null; },
    done: function () { var p = YN.save.perm; if (!p) return {}; return p.storiesDone || (p.storiesDone = {}); },
    state: function (id) { var D = YN.save.dream; if (!D) return null; D.stories = D.stories || {}; return D.stories[id] || (D.stories[id] = { stage: 'new', got: [] }); },

    /* ---------- le plan de la nuit ---------- */
    plan: function () {
      var D = YN.save.dream; if (!D) return null;
      if (D.storyPlan) return D.storyPlan;
      var r = YN.rng.make((H('stories') ^ Math.imul(D.no || 1, 40503) ^ ((YN.save.perm && YN.save.perm.created) || 3)) >>> 0);
      var done = ST.done(), all = YN.data.stories.slice(), fresh = all.filter(function (s) { return !done[s.id]; });
      var pool = U.shuffle(fresh.length >= 4 ? fresh : all, r), W = YN.data.worlds, used = {}, plan = { byWorld: {}, list: [] };
      var worlds = U.keys(W).filter(function (k) { var d = W[k], v = (d.style && d.style.view) || 'top'; return /^W\d{3}$/.test(k) && (d.depth || 0) >= 1 && (d.depth || 0) <= 4 && v === 'top' && !d.inf; });
      var themeOf = function (k) { return YN.furnish && YN.furnish.themeOf ? YN.furnish.themeOf(W[k]) : 'home'; };
      var want = 5 + ((D.no || 1) % 3);
      for (var i = 0; i < pool.length && plan.list.length < want; i++) {
        var s = pool[i], wh = s.where || {}, th = wh.themes || [], dp = wh.depth || [1, 4];
        var ok = worlds.filter(function (k) { var d = W[k].depth || 1; return !used[k] && d >= dp[0] && d <= dp[1] && th.indexOf(themeOf(k)) >= 0; });
        if (!ok.length) ok = worlds.filter(function (k) { var d = W[k].depth || 1; return !used[k] && d >= dp[0] && d <= dp[1]; });
        if (!ok.length) continue;
        var w = ok[r.int(0, ok.length - 1)]; used[w] = 1;
        plan.byWorld[w] = s.id; plan.list.push({ id: s.id, world: w });
      }
      D.storyPlan = plan;
      return plan;
    },
    storyFor: function (rt) { var pl = ST.plan(); if (!pl) return null; var id = pl.byWorld[rt.id]; if (!id || ST.done()[id] && ST.state(id).stage !== 'done') return null; return ST.byId(id); },

    /* les cellules qu'un habitant atteint depuis l'arrivée */
    reach: function (rt, from, who) {
      var w = rt.w, h = rt.h, dist = new Int32Array(w * h).fill(-1), par = new Int32Array(w * h).fill(-1), q = [from[1] * w + from[0]], qi = 0, cells = [], PG = YN.world.passGrid(rt, who === 'npc' ? 'npc' : 'player');
      if (from[0] < 0 || from[1] < 0 || from[0] >= w || from[1] >= h) return { dist: dist, par: par, cells: cells, w: w };
      dist[q[0]] = 0;
      while (qi < q.length) {
        var k = q[qi++], x = k % w, y = (k / w) | 0; cells.push(k);
        for (var j = 0; j < 4; j++) {
          var nx = x + D4[j][0], ny = y + D4[j][1];
          if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          var nk = ny * w + nx; if (dist[nk] >= 0) continue;
          if (!PG[nk]) continue;
          dist[nk] = dist[k] + 1; par[nk] = k; q.push(nk);
        }
      }
      return { dist: dist, par: par, cells: cells, w: w };
    },
    arrivalOf: function (rt) { try { var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0]; return YN.world.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos; } catch (e) { return null; } },

    /* ---------- dans la construction du monde : les choses perdues (marques, avant le placement à portée) ---------- */
    placeItems: function (rt) {
      var s = ST.storyFor(rt); if (!s || s.kind !== 'fetch' || rt.inf) return;
      var st = ST.state(s.id); if (st.stage === 'done') return;
      (s.fetch.items || []).forEach(function (it, i) {
        if (st.got.indexOf(i) >= 0) return;
        var d = { id: 'sti_' + s.id + '_' + i, type: 'decor', look: it.look, lookOpt: { c: [it.color || '#d8d0c0'] }, at: i % 2 ? 'random-any' : 'random-hidden', solid: false, flat: true, animated: true, storyItem: s.id, storyIdx: i,
          use: [function (ctx) { ST.pick(ctx.mark); }] };
        var at = YN.world.resolveAt(rt, d.at, 600 + i * 17); if (at) YN.world.addMark(rt, d, at[0], at[1], null);
      });
    },
    /* ---------- après les habitants : celui de l'histoire ---------- */
    spawn: function (rt) {
      var s = ST.storyFor(rt); if (!s || rt.inf) return;
      var st = ST.state(s.id); if (st.stage === 'done' && st.left) return;
      var a = ST.arrivalOf(rt) || rt.spawnAt || YN.world.nearestOpen(rt, rt.w >> 1, rt.h >> 1); if (!a) return;
      var R = ST.reach(rt, a, 'npc'), cand = [];
      R.cells.forEach(function (k) {
        var d = R.dist[k]; if (d < 8 || d > 90) return;
        var x = k % R.w, y = (k / R.w) | 0, open = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < R.w && yy < rt.h && R.dist[yy * R.w + xx] >= 0) open++; }
        if (open >= 8 && !rt.markAt(x, y)) cand.push(k);
      });
      if (!cand.length) cand = R.cells.filter(function (k) { return R.dist[k] >= 4; });
      if (!cand.length) cand = R.cells.slice(1);
      if (!cand.length) { var q = YN.world.nearestOpen(rt, a[0] + 2, a[1]); if (q) cand = [q[1] * R.w + q[0]]; }
      if (!cand.length) return;
      var r = YN.rng.make(H(s.id + rt.id) ^ ((YN.save.dream && YN.save.dream.no) || 0)), k0 = st.pos && rt.passable(st.pos[0], st.pos[1], 'npc', {}) ? st.pos[1] * R.w + st.pos[0] : cand[r.int(0, cand.length - 1)];
      var e = YN.entities.add(rt, ST.defFor(s), k0 % R.w, (k0 / R.w) | 0, {});
      e.storyId = s.id; e.present = true; e.visible = true;
      if (st.stage === 'leading' || st.stage === 'arrived') st.stage = 'met'; // on reprend la marche à la prochaine parole
    },
    defFor: function (s) {
      ST._defs = ST._defs || {};
      if (ST._defs[s.id]) return ST._defs[s.id];
      var who = s.who || {}, look = Object.assign({ t: 'humanoid' }, who.look || {});
      var d = { id: 'story_' + s.id, name: who.name || 'Someone', kind: /^(cat|dog|rabbit|bird|owl|frog|snail|fish|moth|bee|deer|worm)$/.test(look.t) ? 'animal' : 'human', look: look, lang: who.lang || 'en',
        behavior: 'static', solid: true, alwaysActive: true, speed: 1.7, silentTalk: true, storyId: s.id, info: { role: 'A story.' },
        onTalk: [function (ctx) { ST.talk(ctx.ent); }] };
      ST._defs[s.id] = d; return d;
    },

    /* ---------- répliques ---------- */
    say: function (s, arr, done) {
      var name = (s.who && s.who.name) || '';
      var ls = (arr || []).map(function (l) { return typeof l === 'string' ? { t: l, who: '' } : Object.assign({ who: name }, l); });
      if (!ls.length) { if (done) done(); return; }
      YN.ui.dialog.queue(ls, {}, done || null);
    },

    /* ---------- parler à l'habitant ---------- */
    talk: function (e) {
      var s = ST.byId(e.storyId || e.def.storyId); if (!s || !YN.game.inDream()) return;
      var st = ST.state(s.id), G = YN.game;
      if (st.stage === 'done') { YN.ui.dialog.queue([{ t: AFTER[H(s.id) % AFTER.length].replace('%s', s.who.name), who: '' }], {}); return; }
      var first = st.stage === 'new'; if (first) st.stage = 'met';
      if (s.kind === 'choice') { ST.say(s, first ? s.intro : s.again, function () { ST.node(s, e, s.choice.start); }); return; }
      if (s.kind === 'word') { ST.say(s, first ? s.intro.concat(s.word.hint || []) : s.again); return; }
      if (s.kind === 'fetch') {
        var n = (s.fetch.items || []).length, got = st.got.length;
        if (first) { ST.say(s, s.intro); return; }
        if (got >= n) { ST.say(s, s.fetch.done, function () { ST.finish(s, e, s.reward, 'done'); }); return; }
        ST.say(s, got > 0 ? (s.fetch.partial || s.again) : s.again); return;
      }
      if (s.kind === 'follow') {
        if (st.stage === 'leading') { ST.say(s, s.follow.wait); return; }
        if (st.stage === 'arrived') { ST.arrive(s, e); return; }
        ST.say(s, first ? s.intro.concat(s.follow.start) : s.follow.start, function () { ST.lead(s, e); });
      }
    },
    node: function (s, e, id) {
      var c = s.choice, nd = c.nodes[id];
      if (!nd) { var en = c.endings[id]; if (!en) return; ST.say(s, en.say, function () { ST.finish(s, e, en.reward || 'none', id); }); return; }
      ST.say(s, nd.say, function () {
        YN.ui.dialog.choose(nd.choices.map(function (ch) { return ch.label; }), function (i) { var ch = nd.choices[i]; if (ch) setTimeout(function () { ST.node(s, e, ch.to); }, 30); });
      });
    },
    pick: function (m) {
      var s = ST.byId(m.def.storyItem), st = s && ST.state(s.id); if (!s || !st) return;
      m.active = false; if (st.got.indexOf(m.def.storyIdx) >= 0) return;
      st.got.push(m.def.storyIdx); YN.audio.sfx('pickup');
      var it = s.fetch.items[m.def.storyIdx], found = s.fetch.found || [];
      YN.ui.dialog.queue([{ t: found[(st.got.length - 1) % Math.max(1, found.length)] || ('She picks up ' + it.name + '.'), who: '' }], {});
      YN.game.toast(it.name.charAt(0).toUpperCase() + it.name.slice(1), 2.5);
    },
    finish: function (s, e, reward, ending) {
      var st = ST.state(s.id); st.stage = 'done'; ST.done()[s.id] = ending || 'done';
      ST.reward(s, e, reward, function () { if (s.lore && reward !== 'lore') ST.say(s, s.lore); });
      e.state.leaveAt = YN.game.clock + 8; // il s'en va peu après
      try { YN.save.write(); } catch (ex) { /* plus tard */ }
    },
    reward: function (s, e, kind, then) {
      var G = YN.game, C = YN.collect;
      var next = function () { if (then) then(); };
      switch (kind) {
        case 'coin': if (!(C && (C.grantNext('coins') || C.grantNext('cranes')))) G.toast('…'); next(); break;
        case 'page': if (!(C && (C.grantNext('pages') || C.grantNext('coins')))) G.toast('…'); next(); break;
        case 'photo': if (!(C && (C.grantNext('photos') || C.grantNext('coins')))) G.toast('…'); next(); break;
        case 'cookie': G.giveCookie(); next(); break;
        case 'secret': ST.revealSecret(G.rt, e); next(); break;
        case 'lore': ST.say(s, s.lore && s.lore.length ? s.lore : ['She will remember this. She doesn’t know why.'], then); break;
        default: next();
      }
    },
    revealSecret: function (rt, e) {
      var sp = (rt.secretSpots || []).filter(function (c) { return !c.seen; });
      var p = YN.game.player, best = null, bd = 1e9;
      sp.forEach(function (c) { var d = U.dist(c.from[0], c.from[1], p.x, p.y); if (d < bd) { bd = d; best = c; } });
      if (best) { best.seen = true; YN.render.addFx({ type: 'fakes', x: best.door ? best.door[0] : best.from[0], y: best.door ? best.door[1] : best.from[1], life: 20, r: 6 }); YN.game.toast('Somewhere near, a wall is thinner than it looks.', 3.5); }
      else if (rt.paintedDoor) { var a = rt.paintedDoor.at; YN.render.addFx({ type: 'reveal', x: a[0], y: a[1], life: 6, color: '#f0e8c8' }); YN.game.toast('One of the pictures here is a door.', 3.5); }
      else YN.game.toast('Something here is not what it looks like.', 3);
      YN.audio.sfx('reveal');
    },

    /* ---------- suivre ---------- */
    lead: function (s, e) {
      var rt = YN.game.rt, st = ST.state(s.id), R = ST.reach(rt, [e.x, e.y], 'npc'), w = R.w, target = null;
      var pickFar = function (min, max) { var best = -1, bd = -1; R.cells.forEach(function (k) { var d = R.dist[k]; if (d >= min && d <= max && d > bd) { bd = d; best = k; } }); return best; };
      var to = s.follow.to;
      if (to === 'secret') { var sp = (rt.secretSpots || []).filter(function (c) { return R.dist[c.from[1] * w + c.from[0]] > 0; }).sort(function (a, b) { return R.dist[a.from[1] * w + a.from[0]] - R.dist[b.from[1] * w + b.from[0]]; })[0]; if (sp) { target = sp.from[1] * w + sp.from[0]; st.secret = sp.door || sp.from; } }
      if (to === 'water' && target === null) { var wb = -1, wd = 1e9; R.cells.forEach(function (k) { var x = k % w, y = (k / w) | 0, d = R.dist[k]; if (d < 6 || d >= wd) return; for (var j = 0; j < 4; j++) { var ti = YN.tileInfo(rt.tile(x + D4[j][0], y + D4[j][1])); if (ti.water || ti.kind === 'shallow') { wd = d; wb = k; break; } } }); if (wb >= 0) target = wb; }
      if (to === 'corner' && target === null) { var cb = -1, cd = -1; R.cells.forEach(function (k) { var x = k % w, y = (k / w) | 0, d = R.dist[k]; if (d < 10 || d > 70) return; var bl = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && !rt.passable(x + dx, y + dy, 'npc', {})) bl++; if (bl >= 5 && d > cd) { cd = d; cb = k; } }); if (cb >= 0) target = cb; }
      if (target === null) { var f = pickFar(18, 60); if (f < 0) f = pickFar(6, 9999); if (f >= 0) target = f; }
      if (target === null) { st.stage = 'arrived'; ST.arrive(s, e); return; }
      var path = [], k2 = target; while (k2 >= 0 && R.dist[k2] > 0) { path.push(k2); k2 = R.par[k2]; } path.reverse();
      st.path = path.map(function (k) { return [k % w, (k / w) | 0]; }); st.stage = 'leading'; st.waitCd = 0;
      e.def = Object.assign({}, e.def, { face: false });
    },
    arrive: function (s, e) {
      var st = ST.state(s.id); if (st.told && st.stage === 'done') return; st.told = true;
      ST.say(s, s.follow.arrive, function () { if (s.follow.to === 'secret' && st.secret) { var c = (YN.game.rt.secretSpots || []).filter(function (q) { return (q.door || q.from) === st.secret; })[0]; if (c) c.seen = true; YN.render.addFx({ type: 'fakes', x: st.secret[0], y: st.secret[1], life: 12, r: 3 }); } ST.finish(s, e, s.reward || 'none', 'arrived'); });
    },

    /* ---------- chaque image ---------- */
    tick: function (dt) {
      var G = YN.game, rt = G && G.rt; if (!rt || !rt.ents || !G.inDream() || G.paused) return;
      var p = G.player;
      for (var i = 0; i < rt.ents.length; i++) {
        var e = rt.ents[i]; if (!e.storyId) continue;
        var s = ST.byId(e.storyId), st = ST.state(e.storyId); if (!s || !st) continue;
        if (e.state.leaveAt && G.clock > e.state.leaveAt) { YN.render.addFx({ type: 'spark', x: e.x, y: e.y, life: 0.9, color: '#e8e0f8' }); e.present = false; e.visible = false; e.deleted = true; st.left = true; continue; } // l'histoire finie, il s'en va
        st.pos = [e.x, e.y];
        if (st.stage !== 'leading' || e.moving) continue;
        var d = wd(rt, e.fx, e.fy, p.fx, p.fy);
        if (d > 6) { st.waitCd -= dt; if (st.waitCd <= 0) { st.waitCd = 6; var wl = s.follow.wait || []; if (wl.length && YN.speech) YN.speech.npcBubble(e, wl[(H(s.id) + (st.waits = (st.waits || 0) + 1)) % wl.length]); } e.dir = YN.entities.dirTo(e, p.x, p.y); continue; }
        if (!st.path || !st.path.length) { st.stage = 'arrived'; e.dir = YN.entities.dirTo(e, p.x, p.y); continue; }
        var nx = st.path[0];
        if (nx[0] === e.x && nx[1] === e.y) { st.path.shift(); continue; }
        if (p.x === nx[0] && p.y === nx[1]) continue; // elle est sur le chemin : il attend
        var dir = null; for (var j = 0; j < 4; j++) { var q = rt.norm(e.x + D4[j][0], e.y + D4[j][1]); if (q[0] === nx[0] && q[1] === nx[1]) dir = D4[j][2]; }
        if (!dir) { st.path = null; continue; }
        YN.entities.step(rt, e, dir); st.path.shift();
      }
      // arrivé, on attend qu'elle approche
      rt.ents.forEach(function (e) { if (!e.storyId) return; var st = ST.state(e.storyId); if (st && st.stage === 'arrived' && !st.told && wd(rt, e.fx, e.fy, p.fx, p.fy) < 2.5) { st.told = true; ST.arrive(ST.byId(e.storyId), e); } });
    },

    /* ---------- un mot entendu ---------- */
    hear: function (n) {
      var G = YN.game, rt = G.rt; if (!rt || !G.inDream()) return false;
      var hit = false;
      rt.ents.forEach(function (e) {
        if (!e.storyId || !e.present) return; var s = ST.byId(e.storyId); if (!s || s.kind !== 'word') return;
        var st = ST.state(s.id); if (st.stage === 'done' || st.stage === 'new') return;
        if (wd(rt, e.fx, e.fy, G.player.fx, G.player.fy) > 7) return;
        var ok = (s.word.words || []).some(function (w) { var ww = U.norm(w); return ww && (n === ww || (' ' + n + ' ').indexOf(' ' + ww + ' ') >= 0 || (ww.length >= 4 && n.indexOf(ww) >= 0)); });
        if (ok) { hit = true; ST.say(s, s.word.heard, function () { ST.finish(s, e, s.reward || 'none', 'heard'); }); }
        else if (s.word.wrong && s.word.wrong.length && !(st.wrongCd > G.clock) && wd(rt, e.fx, e.fy, G.player.fx, G.player.fy) < 3.5) { st.wrongCd = G.clock + 15; ST.say(s, [s.word.wrong[(st.wrongs = (st.wrongs || 0) + 1) % s.word.wrong.length]]); }
      });
      return hit;
    },

    hook: function () {
      var G = YN.game; if (!G || G._storiesHooked) return; G._storiesHooked = true;
      var up = G.update; G.update = function (dt) { var r = up.apply(G, arguments); try { ST.tick(dt || 0); } catch (ex) { YN.warn('stories: ' + (ex.stack || ex)); } return r; };
      if (YN.speech) YN.speech.listen(function (n) { return ST.hear(n); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
