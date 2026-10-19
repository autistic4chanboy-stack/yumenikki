/* Génère le wiki autonome wiki/dream_archive.html à partir des données du jeu.
 * Usage : node tools/build_wiki.js
 * Le wiki n'invente rien : tout vient de data/ (mondes, effets, habitants, arcs,
 * passages, conditions). Les spoilers sont masqués par défaut. */
'use strict';
var fs = require('fs'), path = require('path');
var L = require('./load.js');
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN, U = YN.util;
YN.save.fresh(); YN.save.beginDream({});
YN.net.build();
var W = YN.data.worlds, E = YN.data.entities;

/* ---------------- conditions → phrases ---------------- */
var DATES = { feteDesMeres: 'on Mother’s Day (last Sunday of May, real date)', parentsDay: 'on May 8, 어버이날 (real date)', fullMoon: 'on a full-moon night (real date)', twinMinute: 'when the time repeats itself (11:11, 22:22…)', sunday: 'on a Sunday (real)', friday13: 'on a Friday the 13th (real)', night: 'at night (22:00–06:00, real time)', lunch: 'between 12:00 and 13:00, real time', wolf: 'between 3:00 and 4:00 in the morning (real time)', h2371: 'between 0:11 and 0:20, real time', h23: 'between 23:00 and midnight, real time', christmas: 'on December 24 and 25 (real dates)' };
function effName(id) { var e = YN.effectById(id); return e ? e.name + ' (' + id + ')' : id; }
function wName(id) { return W[id] ? W[id].name + ' (' + id + ')' : id; }
function eName(id) { return E[id] ? E[id].name : id; }
function list(v) { return Array.isArray(v) ? v : [v]; }
function condText(c) {
  if (!c) return '';
  if (typeof c === 'function') return 'a special condition';
  if (Array.isArray(c)) return c.map(condText).filter(Boolean).join(' and ');
  var out = [];
  U.keys(c).forEach(function (k) {
    var v = c[k];
    switch (k) {
      case 'effect': out.push('having ' + list(v).map(effName).join(', ')); break;
      case 'anyEffect': out.push('having one of: ' + v.map(effName).join(', ')); break;
      case 'noEffect': out.push('not having ' + effName(v)); break;
      case 'equipped': out.push(list(v).map(effName).join(' or ') + ' equipped'); break;
      case 'notEquipped': out.push(effName(v) + ' not equipped'); break;
      case 'flag': out.push('after: ' + list(v).join(', ')); break;
      case 'notFlag': out.push('before: ' + v); break;
      case 'dark': out.push(v ? 'bedroom light off' : 'bedroom light on'); break;
      case 'snow': out.push(v ? 'window open (snow)' : 'no snow'); break;
      case 'wind': out.push('wind'); break;
      case 'doorAjar': out.push(v ? 'bedroom door ajar' : 'bedroom door closed'); break;
      case 'roomLight': out.push('bedroom lamp ' + (v ? 'on' : 'off')); break;
      case 'roomWindow': out.push('window ' + (v ? 'open' : 'closed')); break;
      case 'roomDoor': out.push('door ' + (v ? 'ajar' : 'closed')); break;
      case 'remainingLt': out.push('less than ' + U.fmtTime(v) + ' of dream left'); break;
      case 'remainingGt': out.push('more than ' + U.fmtTime(v) + ' of dream left'); break;
      case 'elapsedGt': out.push('after ' + U.fmtTime(v) + ' of dreaming'); break;
      case 'phase': out.push('dream phase: ' + list(v).join(' or ')); break;
      case 'remainingMod': out.push('during the last ' + v.under + ' seconds of every ' + v.every + '-second stretch'); break;
      case 'realHour': out.push('between ' + v[0] + ':00 and ' + v[1] + ':00 (real time)'); break;
      case 'realTime': out.push('between ' + v[0] + ' and ' + v[1] + ' (real time)'); break;
      case 'realDate': out.push(list(v).map(function (n) { return DATES[n] || n; }).join(' or ')); break;
      case 'weekday': out.push('real weekday no. ' + list(v).join(', ') + ' (0 = Sunday)'); break;
      case 'visits': out.push(U.keys(v).map(function (w) { return v[w] + ' visits to ' + wName(w); }).join(', ')); break;
      case 'visited': out.push('having visited ' + list(v).map(wName).join(', ')); break;
      case 'dreams': out.push('after ' + v + ' nights'); break;
      case 'effectsCount': case 'savedEffects': out.push('at least ' + v + ' effects'); break;
      case 'eggs': out.push(v + ' effects laid in the nests'); break;
      case 'quest': out.push(U.keys(v).map(function (q) { return 'arc ' + q + ': ' + list(v[q]).join(' / '); }).join(', ')); break;
      case 'questLog': out.push(U.keys(v).map(function (q) { return 'arc ' + q + ' has gone through “' + list(v[q]).join(' / ') + '”'; }).join(', ')); break;
      case 'met': out.push('having met ' + list(v).map(eName).join(', ')); break;
      case 'talks': out.push(U.keys(v).map(function (n) { return v[n] + ' conversations with ' + eName(n); }).join(', ')); break;
      case 'item': out.push('carrying ' + U.keys(v).map(function (i) { return v[i] + ' × ' + ((YN.data.items[i] || {}).name || i); }).join(', ')); break;
      case 'pill': out.push(v ? 'blue pill taken' : 'no pill'); break;
      case 'white': out.push('white pill taken'); break;
      case 'deepVisited': out.push('after a visit at depth 3 or deeper'); break;
      case 'motherVisits': out.push(v + ' visits from the mother'); break;
      case 'secret': out.push('after the secret “' + v + '”'); break;
      case 'temp': out.push('during this dream, after an action on the spot'); break;
      case 'tempGte': out.push('during this dream, after several actions'); break;
      case 'debug': out.push('character mode'); break;
      case 'witchHere': out.push('a witch present'); break;
      case 'priestessHere': out.push('the Priestess present'); break;
      case 'corruptionGte': out.push('corrupted world (≥ ' + v + ')'); break;
      case 'any': out.push('(' + v.map(condText).join(') or (') + ')'); break;
      case 'all': out.push(v.map(condText).join(' and ')); break;
      case 'not': out.push('not (' + condText(v) + ')'); break;
      case 'fn': out.push('a special condition'); break;
      case 'hint': case 'why': break;
      default: out.push(k);
    }
  });
  return out.filter(Boolean).join(', ');
}
function isReal(c) { var s = JSON.stringify(c || {}, function (k, v) { return typeof v === 'function' ? 'fn' : v; }); return /realHour|realTime|realDate|weekday/.test(s); }

/* ---------------- couleurs des cases ---------------- */
var KCOL = YN.debug && YN.debug.COLORS ? YN.debug.COLORS : {};
function matColor(look, kind) { var m = look && look[kind]; if (m && m.c && m.c.length) { var c = m.c[0]; if (typeof c === 'string' && c.indexOf('rgba(0,0,0,0)') < 0) return c; } return null; }

var worlds = [], edges = [];
U.keys(W).forEach(function (id) {
  var d = W[id], info = d.info || {};
  var o = { id: id, name: d.name, depth: d.depth || 0, tier: d.tier || 'hub', core: !!d.core, region: d.region || '', secretLevel: d.secretLevel || 0,
    inf: !!d.inf, wrap: !!d.wrap, loop: !!d.loop, outdoor: !!d.outdoor, dark: d.dark || 0, music: typeof d.music === 'string' ? d.music : null,
    view: (d.style && d.style.view) || 'top', renderer: (d.style && d.style.renderer) || 'pixel', spawn: d.spawnRule ? condText(d.spawnRule.cond) + (d.spawnRule.chance !== undefined ? ' · ' + Math.round(d.spawnRule.chance * 100) + '% chance' : '') + (d.spawnRule.still ? ' · stand still for ' + d.spawnRule.still + ' s' : '') : null,
    gen: d.gen ? d.gen.type + (d.gen.perDream ? ' (changes every night)' : '') + (d.gen.shifting ? ' (rearranges itself)' : '') : null, debugWorld: !!d.debugWorld,
    summary: info.summary || '', art: info.art || '', rules: info.rules || [], secrets: info.secrets || [], lore: info.lore || '', time: info.time || [], role: info.role || '', help: info.help || '',
    effects: YN.data.effects.filter(function (e) { return e.world === id; }).map(function (e) { return e.id; }),
    npcs: U.keys(E).filter(function (k) { return E[k].world === id || (E[k].worlds && E[k].worlds[id] !== undefined); }) };
  // vignette
  try {
    var rt = YN.world.build(id);
    if (rt && !rt.inf && rt.w && rt.h && rt.w * rt.h < 20000) {
      var look = rt.look || d.look || {}, pal = {}, letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rows = [], pi = 0, colIx = {};
      for (var y = 0; y < rt.h; y++) {
        var r = '';
        for (var x = 0; x < rt.w; x++) {
          var ch = rt.tile(x, y), ti = YN.tileInfo(ch);
          if (ti.void || ch === ' ') { r += ' '; continue; }
          var col = matColor(look, ti.kind) || (ti.wall ? (matColor(look, 'wall') || KCOL.wall) : null) || KCOL[ti.kind] || (ti.pass ? '#4a4a58' : '#8a8aa8');
          if (!(col in colIx)) { if (pi >= letters.length) col = Object.keys(colIx)[0]; else { colIx[col] = letters[pi]; pal[letters[pi]] = col; pi++; } }
          r += colIx[col];
        }
        rows.push(r);
      }
      o.thumb = { w: rt.w, h: rt.h, rows: rows, pal: pal, bg: (d.look && d.look.bg) || d.bg || null,
        marks: rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] || m.type === 'effect' || m.type === 'soul'; }).map(function (m) { return [m.x, m.y, m.type === 'effect' ? 'e' : m.type === 'soul' ? 'a' : (m.def.secret ? 's' : (m.def.cond || m.def.lock) ? 'c' : 'd')]; }) };
      o.souls = rt.marks.filter(function (m) { return m.type === 'soul'; }).map(function (m) { return (m.def.lines || []).map(function (l) { if (typeof l === 'string') return { t: l }; if (!l || typeof l.t !== 'string') return null; return { t: l.t, lang: l.lang || '', tr: l.tr || '' }; }).filter(Boolean).concat(m.def.glyphs ? [{ t: '[carved signs]' }] : []); });
      o.annex = !!d.annex; o.size = [rt.w, rt.h];
    }
  } catch (e) { o.thumbErr = String(e.message || e); }
  worlds.push(o);
  (YN.net.edges[id] || []).forEach(function (e) {
    if (!W[e.to] && e.to !== 'WAKE') return;
    edges.push({ from: id, to: e.to, kind: e.kind || 'door', cond: condText(e.cond), real: isReal(e.cond), secret: !!e.secret, oneway: !!e.oneway, spawn: !!e.spawn, debug: !!e.debugOnly, note: e.note || '' });
  });
});
// dédoublonnage des arêtes identiques
var seenE = {}; edges = edges.filter(function (e) { var k = e.from + '>' + e.to + '|' + e.cond + '|' + e.kind; if (seenE[k]) return false; seenE[k] = 1; return true; });

/* ---------------- disposition de la carte (couches par profondeur) ---------------- */
var cols = {}; worlds.forEach(function (w) { var c = w.debugWorld ? 6 : w.depth; (cols[c] = cols[c] || []).push(w.id); });
U.keys(cols).forEach(function (c) { cols[c].sort(); });
var pos = {}; function place() { U.keys(cols).forEach(function (c) { cols[c].forEach(function (id, i) { pos[id] = [c * 300 + 60, i * 30 + 40]; }); }); }
place();
var nb = {}; edges.forEach(function (e) { (nb[e.to] = nb[e.to] || []).push(e.from); (nb[e.from] = nb[e.from] || []).push(e.to); });
for (var it = 0; it < 12; it++) {
  U.keys(cols).forEach(function (c) {
    var bary = {};
    cols[c].forEach(function (id) { var ys = (nb[id] || []).filter(function (n) { return pos[n] && pos[n][0] !== pos[id][0]; }).map(function (n) { return pos[n][1]; }); bary[id] = ys.length ? ys.reduce(function (a, b) { return a + b; }, 0) / ys.length : pos[id][1]; });
    cols[c].sort(function (a, b) { return bary[a] - bary[b]; });
  });
  place();
}
worlds.forEach(function (w) { w.pos = pos[w.id]; });

/* ---------------- autres données ---------------- */
var effects = YN.data.effects.map(function (e) { return { id: e.id, name: e.name, fam: e.fam, world: e.world, core: !!e.core, desc: e.desc || '', use: e.use || '', get: e.get || '', glyph: (e.icon && e.icon.glyph) || '', color: (e.icon && e.icon.c) || '' }; });
function langsOf(d) { var set = {}; if (d.lang) set[d.lang] = 1; JSON.stringify(d.lines || [], function (k, v) { if (k === 'lang') set[v] = 1; return typeof v === 'function' ? null : v; }); JSON.stringify(d.hears || [], function (k, v) { if (k === 'lang') set[v] = 1; return typeof v === 'function' ? null : v; }); return U.keys(set); }
function sampleLines(d) { var out = []; (d.lines || []).forEach(function (l) { if (out.length >= 3) return; if (typeof l === 'string') out.push(l); else if (l && typeof l.t === 'string') out.push(l.t + (l.tr ? ' — ' + l.tr : '')); else if (l && l.seq && typeof l.seq[0] === 'string') out.push(l.seq[0]); }); (d.ambientLines || []).forEach(function (l) { if (out.length >= 3) return; out.push(typeof l === 'string' ? l : (l.t + (l.tr ? ' — ' + l.tr : ''))); }); return out; }
var npcs = U.keys(E).sort().map(function (k) { var d = E[k], i = d.info || {}; return { id: k, name: d.name, world: d.world || '', worlds: d.worlds ? U.keys(d.worlds) : [], major: !!d.major, kind: d.kind || '', voice: d.kind === 'voice' || !!d.invisible, langs: langsOf(d), dialog: d.dialog || null, hostile: !!d.hostile, personality: i.personality || '', wants: i.wants || '', flaw: i.flaw || '', habits: i.habits || '', arc: i.arc || '', role: i.role || '', lore: i.lore || '', lines: sampleLines(d), appear: d.appear ? condText(d.appear) : '' }; });
var quests = (YN.data.quests || []).map(function (q) { return { id: q.id, name: q.name, giver: q.giver ? eName(q.giver) : '', world: q.world || '', reward: q.reward || '', stages: q.stages, ends: q.ends || [], derived: !!q.derived }; });
var endings = [
  { id: 'I', name: YN.endings.SEQ.I.name, how: 'Lay 30 effects in the nests of the Nexus. On the next waking, a draught: the bedroom’s glass door opens. On the terrace, at the railing, choose “Look at the sky”.', note: 'Handled without any explicit image, followed by a suicide-prevention message (helpline numbers).' },
  { id: 'II', name: YN.endings.SEQ.II.name, how: 'First, Ending I must be available (30 nests); then her voice must come back: the nameless people speak again (Q04), M.’s letter delivered to S. (Q03), Ondine out of the booth (Q08), the mother’s voice heard (W187, W190, Mother’s Day or five visits from the mother). Awake, in front of the bedroom door, speak to her (type a sentence). In the hallway, the hand near the table.', note: 'A lit kitchen, a sleeping mother, a blanket.' },
  { id: 'III', name: YN.endings.SEQ.III.name, how: 'Enter the sixth layer (W181 with the Diving Suit, or W182 under the drawing’s conditions), sleep in the seven beds (W184–W190), then lie down again in the last bed (W193).', note: '' },
  { id: 'IV', name: '█████', how: 'In character mode, “set 68” in front of a wall makes a door stand up (W191). Write — or say — END there.', note: 'Character mode is found in the Nexus, with the light off.' }
];
var witches = (YN.data.witches || []).map(function (w) { return { id: w.id, name: w.name, num: w.num, unlock: w.unlock, home: w.home, look: w.look, sound: w.sound, appear: w.appear, detect: w.detect, escape: w.escape, lang: w.lang }; });
var counts = YN.validate.counts();
var DATA = { built: new Date().toISOString().slice(0, 10), counts: counts, worlds: worlds, edges: edges, effects: effects, npcs: npcs, quests: quests, endings: endings, witches: witches };

/* ---------------- page ---------------- */
var tpl = fs.readFileSync(path.join(__dirname, 'wiki_template.html'), 'utf8');
var json = JSON.stringify(DATA).replace(/</g, '\\u003c');
var html = tpl.replace('/*__DATA__*/null', json);
fs.mkdirSync(path.join(L.ROOT, 'wiki'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'wiki', 'dream_archive.html'), html);
console.log('wiki/dream_archive.html: ' + worlds.length + ' places, ' + edges.length + ' passages, ' + effects.length + ' effects, ' + npcs.length + ' inhabitants, ' + quests.length + ' arcs — ' + Math.round(html.length / 1024) + ' KiB');
