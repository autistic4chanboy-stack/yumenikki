/* =========================================================================
 *  ATELIER DES MONDES SECRETS (W041–W200)
 *  Une fiche compacte devient un monde complet : carte (générée ou
 *  dessinée), retour vers le monde parent, portes vers les mondes enfants,
 *  décor parsemé avec leurs textes, habitants (identifiants N2xx…),
 *  énigme et effet, biscuit, fiche d'encyclopédie.
 *
 *  fiche = { id, name, depth, tier, back, backLook, gen | map, look, style,
 *            music, amb, dark, weather, tall, wrap, inf, doors:[{to,cond,look,label}],
 *            decor:[{look,n,lines,opt,solid}], signs:[{look,lines,glyphs}],
 *            npcs:[{name,look,lines,behavior,...}], effect:{id, how...},
 *            mech:[...], info:{...}, extra:{...champs bruts du monde} }
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var NEXT = 300;
  var LOOKS = YN.kit.LOOK;

  function lookOf(l) { if (!l) return LOOKS.void; if (typeof l === 'string') return LOOKS[l] || LOOKS.void; return l; }

  YN.kit.secret = function (f) {
    var place = [], npcs = [], mech = (f.mech || []).slice();
    // monde infini : les choses se posent autour du point d'arrivée (16,16)
    var INF = [[16, 12], [16, 20], [12, 16], [20, 16], [16, 9], [16, 23], [9, 16], [23, 16], [16, 14], [18, 16], [14, 16], [16, 18]], infI = 0;
    var at = function (a) { if (a) return a; return f.inf ? INF[(infI++) % INF.length] : 'random-any'; };
    if (f.back) place.push({ id: 'back', type: f.backType || 'door', to: f.back, arrive: f.backArrive, look: f.backLook === undefined ? 'door' : f.backLook, lookOpt: f.backOpt || { style: 'wood', c: ['#4a4a5a'] }, at: f.backAt ? f.backAt : at(), essential: true, label: f.backLabel || 'the way back' });
    (f.doors || []).forEach(function (d, i) {
      place.push({ id: d.id || ('to' + d.to), type: d.type || 'door', to: d.to, arrive: d.arrive, look: d.look === undefined ? 'door' : d.look, lookOpt: d.opt || { style: 'wood', c: ['#3a3a4a'] }, cond: d.cond, at: at(d.at), label: d.label, lockedText: d.locked, essential: d.essential, secret: d.secret, oneway: d.oneway });
    });
    (f.decor || []).forEach(function (d, k) {
      for (var i = 0; i < (d.n || 1); i++) place.push({ id: d.id ? (d.n > 1 ? d.id + i : d.id) : undefined, type: d.type || 'decor', look: d.look, lookOpt: d.opt, lines: d.lines, cycle: d.cycle !== false, at: d.at && (d.n || 1) === 1 ? d.at : at(), solid: d.solid !== false, use: d.use, light: d.light, animated: d.animated, cond: d.cond, glyphs: d.glyphs, item: d.item, once: d.once, listen: d.listen });
    });
    (f.signs || []).forEach(function (s) { place.push({ type: s.glyphs ? 'inscription' : 'sign', look: s.look || (s.glyphs ? 'glyphstone' : 'sign'), glyphs: s.glyphs, lines: s.lines || ['Signs are carved here.'], at: at(s.at) }); });
    // effet
    if (f.effect) {
      var e = f.effect;
      if (e.how === 'find' || !e.how) place.push({ id: e.mark || ('eff' + e.id), type: 'effect', give: e.id, look: e.look || 'sparkle', lookOpt: e.opt, cond: e.cond, need: e.need, at: at(e.at), getLines: e.lines, lines: e.notYet, animated: true });
      else if (e.how === 'mech') mech.push(Object.assign({ give: e.id }, e.mech));
      // 'npc' : l'effet est donné par les lignes d'un habitant (voir f.npcs)
    }
    if (f.cookie !== false) { var key = 'ck_' + f.id, t = {}; t[key] = true; place.push({ id: 'cookie', type: 'cookie', look: 'cookie', cond: { not: { temp: t } }, use: [{ temp: t }], at: at() }); }
    // habitants
    (f.npcs || []).forEach(function (n) {
      var id = n.id || ('N' + (NEXT++));
      var ed = Object.assign({ id: id, world: f.id, kind: 'creature', behavior: 'wander', radius: 3, speed: 1.4 }, n);
      delete ed.at; delete ed.count;
      YN.defEntity(ed);
      for (var c = 0; c < (n.count || 1); c++) npcs.push({ id: id, at: n.at || at(), appear: n.appearHere });
    });
    var def = Object.assign({
      id: f.id, name: f.name, depth: f.depth, tier: f.tier || 'hard', core: false, status: 'implemented', region: f.region || ('P' + f.depth),
      secretLevel: f.secretLevel || Math.min(5, f.depth), style: Object.assign({ view: 'top' }, f.style || {}),
      look: lookOf(f.look), tall: f.tall, music: f.music === undefined ? f.id.toLowerCase() : f.music, amb: f.amb, dark: f.dark, darkAmount: f.darkAmount, weather: f.weather,
      wrap: f.wrap, loop: f.loop, inf: f.inf, gen: f.gen, map: f.map, marks: f.marks || {}, place: place.concat(f.place || []), npcs: npcs.concat(f.npcList || []), mech: mech,
      variants: f.variants, links: f.links, bg: f.bg, outdoor: f.outdoor, playerLight: f.playerLight, noPlayerLight: f.noPlayerLight, totalDark: f.totalDark,
      fall: f.fall, gravity: f.gravity, radio: f.radio, asciiText: f.asciiText, spawnRule: f.spawnRule, conveyorDir: f.conveyorDir, freeze: f.freeze, mapPost: f.mapPost, lookFn: f.lookFn,
      info: f.info || {}
    }, f.extra || {});
    YN.defWorld(def);
    return def;
  };

  /* petites fabriques de cartes */
  YN.kit.ring = function (w, h, wall, floor, inner) {
    var g = YN.kit.grid(w, h, ' '); g.ellipse(w / 2 - 0.5, h / 2 - 0.5, w / 2 - 1, h / 2 - 1, floor || '.');
    if (inner) g.ellipse(w / 2 - 0.5, h / 2 - 0.5, w / 5, h / 5, inner);
    return g.rows();
  };
  YN.kit.hall = function (w, h, wall, floor) { var g = YN.kit.grid(w, h, ' '); g.box(0, 0, w, h, wall || '#', floor || '.'); return g.rows(); };
  YN.kit.corridor = function (len, wide, wall, floor) { var g = YN.kit.grid(len, wide + 2, ' '); g.box(0, 0, len, wide + 2, wall || '#', floor || '.'); return g.rows(); };
})(typeof window !== 'undefined' ? window : globalThis);
