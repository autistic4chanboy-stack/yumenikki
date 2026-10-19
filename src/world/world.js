/* =========================================================================
 *  Monde en cours d'exécution (runtime) construit à partir d'une définition.
 *  La définition n'est JAMAIS modifiée : variantes (chambre), corruption,
 *  modifications temporaires et debug vivent dans des couches séparées.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var DOOR_TYPES = { door: 1, stairs: 1, elevator: 1, train: 1, bed: 1, inner: 1, fall: 1, path: 1, secret: 1, portal: 1, hole: 1, ladder: 1 };
  var SOLID_DEFAULT = { door: 1, stairs: 0, elevator: 1, train: 1, bed: 1, inner: 1, fall: 0, path: 0, secret: 1, portal: 1, hole: 0, ladder: 1,
    effect: 1, sign: 1, inscription: 1, decor: 1, switch: 1, hide: 1, anchor: 1, phone: 1, clock: 1, tv: 1, arcade: 1, pedestal: 1, mirror: 1,
    item: 0, cookie: 0, trigger: 0, listen: 0, light: 0, sound: 0, spawn: 0, custom: 1, block: 1, plate: 0, nest: 1, chest: 1, note: 1, board: 1 };
  YN.DOOR_TYPES = DOOR_TYPES;
  SOLID_DEFAULT.soul = 1;

  /* transforme les couleurs d'une matière (neige, nuit, aplati...) */
  function mapMat(mat, fn) { if (!mat) return mat; var m = U.copy(mat); if (m.c) m.c = m.c.map(function (c) { return typeof c === 'string' && c[0] === '#' ? fn(c) : c; }); if (m.face) m.face = fn(m.face); return m; }

  function resolveLook(def, vflags) {
    var base = def.look && def.look._base ? YN.themes[def.look._base] || {} : {};
    var look = {};
    var kinds = U.keys(YN.DEFAULT_KIND);
    kinds.forEach(function (k) { if (base[k]) look[k] = base[k]; });
    U.keys(base).forEach(function (k) { if (k !== 'bg' && typeof base[k] === 'object') look[k] = base[k]; });
    if (def.look) U.keys(def.look).forEach(function (k) { if (k !== '_base' && k !== 'bg' && typeof def.look[k] === 'object') look[k] = def.look[k]; });
    var bg = (def.look && def.look.bg) || base.bg || def.bg || '#000';
    var variants = def.variants || {};
    if (vflags.snow && def.snowLook !== false) {
      ['floor', 'floor2', 'floor3', 'leafg', 'leafb', 'flowers', 'dirt', 'quiet', 'soil', 'floor4', 'floor5'].forEach(function (k) {
        var m = look[k] || YN.DEFAULT_KIND[k];
        look[k] = mapMat(m, function (c) { return U.mix(c, '#eef3f8', 0.72); });
      });
      ['wall', 'wall2', 'tall'].forEach(function (k) { if (look[k]) look[k] = mapMat(look[k], function (c) { return U.mix(c, '#dfe8f0', 0.25); }); });
    }
    ['dark', 'snow', 'doorAjar', 'white'].forEach(function (v) {
      if (vflags[v] && variants[v] && variants[v].look) U.keys(variants[v].look).forEach(function (k) { look[k] = variants[v].look[k]; });
    });
    if (vflags.custom) vflags.custom.forEach(function (cv) { if (cv.look) U.keys(cv.look).forEach(function (k) { look[k] = cv.look[k]; }); });
    if (def.lookFn) { try { var lf = def.lookFn(vflags) || {}; U.keys(lf).forEach(function (k) { look[k] = lf[k]; }); } catch (e) { YN.warn(def.id + ' lookFn: ' + e); } }
    look._base = def.look && def.look._base;
    return { look: look, bg: bg };
  }

  function parseMap(rows) {
    var h = rows.length, w = 0;
    for (var i = 0; i < h; i++) w = Math.max(w, rows[i].length);
    return { w: w, h: h, rows: rows };
  }

  var WD = YN.world = {
    DOOR_TYPES: DOOR_TYPES,
    seedFor: function (def) {
      var s = YN.rng.hash(def.id + ':' + ((def.gen && def.gen.seed) || (def.inf && def.inf.seed) || ''));
      if ((def.depth || 0) >= 3 && !(def.gen && def.gen.stable)) s ^= ((YN.save.dream ? YN.save.dream.no : 1) * 2654435761) >>> 0;
      if (def.gen && def.gen.perDream && YN.save.dream) s ^= (YN.save.dream.no * 40503) >>> 0;
      if (def.gen && def.gen.dayNight && YN.cond.roomFelt(def.depth || 0).dark) s ^= 0x9e3779b9; // le Dédale change avec la nuit
      if (def.vast) s ^= ((YN.save.temp('vast:' + def.id) || 1) * 2246822519) >>> 0; // monde immense : retiré à chaque visite
      if (def.gen && def.gen.shifting) s ^= Math.imul((YN.save.temp('shift_' + def.id) || 0) + 1, 2654435761) >>> 0; // le rêve changeant
      return s >>> 0;
    },
    /* produit les lignes de la carte (dessinée ou générée) */
    rowsFor: function (def, seed) {
      if (def.map) {
        var mr = def.map.slice();
        if (def.mapPost) { try { mr = def.mapPost(mr, YN.rng.make(seed), def) || mr; } catch (e) { YN.warn(def.id + ' mapPost: ' + (e.stack || e)); } }
        return mr;
      }
      if (def.gen) {
        var g = def.gen, r = YN.rng.make(seed), fn = YN.gen[g.type];
        if (!fn) { YN.warn(def.id + ': unknown generator ' + g.type); return ['#####', '#...#', '#####']; }
        var rows = fn(g.w || 40, g.h || 30, r, g.opts || g);
        if (g.post) rows = g.post(rows, r) || rows;
        (g.stamps || []).forEach(function (s) {
          var x = s.at[0], y = s.at[1];
          if (x === 'center') x = Math.floor(rows[0].length / 2 - s.piece[0].length / 2);
          if (y === 'center') y = Math.floor(rows.length / 2 - s.piece.length / 2);
          if (x < 0) x = rows[0].length + x - s.piece[0].length;
          if (y < 0) y = rows.length + y - s.piece.length;
          rows = YN.gen.stamp(rows, s.piece, x, y);
        });
        return rows;
      }
      return null;
    },

    build: function (id, opts) {
      opts = opts || {};
      var def = YN.data.worlds[id];
      if (!def) { YN.warn('unknown world: ' + id); return null; }
      var depth = def.depth || 0;
      var felt = YN.cond.roomFelt(depth);
      var vflags = { dark: felt.dark, snow: felt.snow, wind: felt.wind, doorAjar: felt.doorAjar, white: !!(YN.save.dream && YN.save.dream.white), custom: [] };
      U.keys(def.variants || {}).forEach(function (k) {
        var v = def.variants[k];
        if (['dark', 'snow', 'doorAjar', 'white'].indexOf(k) < 0 && v.cond && YN.cond.check(v.cond)) vflags.custom.push(v);
      });
      var seed = WD.seedFor(def);
      var rt = {
        id: id, def: def, depth: depth, seed: seed, felt: felt, vflags: vflags,
        wrap: !!def.wrap, inf: null, t: 0,
        marks: [], ents: [], mechs: [], over: {}, hiddenMarks: {},
        corrLevel: 0, corrLocal: 0, corrPersist: 0,
        weather: {}, windNow: 0, lightsExtra: []
      };
      // ---- cases ----
      if (def.inf) {
        rt.inf = YN.inf.make(def, seed);
        rt.w = 1 << 20; rt.h = 1 << 20;
      } else {
        var rows = WD.rowsFor(def, seed) || ['#'];
        if (def.vast && YN.gen.vast) rt.vastPieces = (YN.gen.vast.last || []).slice(); // lieux à part de la grande carte
        var pm = parseMap(rows);
        rt.w = pm.w; rt.h = pm.h;
        rt.base = new Array(pm.h);
        var markPos = [];
        for (var y = 0; y < pm.h; y++) {
          var row = rows[y] || '', out = '';
          for (var x = 0; x < pm.w; x++) {
            var ch = row[x] === undefined ? (def.pad || ' ') : row[x];
            if (YN.isMarkChar(ch)) {
              markPos.push([ch, x, y]);
              var md = def.marks && def.marks[ch];
              ch = (md && md.floor) || def.markFloor || WD.inferFloor(rows, x, y);
            }
            out += ch;
          }
          rt.base[y] = out;
        }
        rt.markPos = markPos;
      }
      // ---- remplacements de variantes (glace, congères...) ----
      var repl = {};
      if (vflags.snow && def.freeze !== false) { repl['~'] = '&'; }
      ['dark', 'snow', 'doorAjar', 'white'].forEach(function (v) { if (vflags[v] && def.variants && def.variants[v] && def.variants[v].tiles) U.keys(def.variants[v].tiles).forEach(function (k) { repl[k] = def.variants[v].tiles[k]; }); });
      vflags.custom.forEach(function (cv) { if (cv.tiles) U.keys(cv.tiles).forEach(function (k) { repl[k] = cv.tiles[k]; }); });
      rt.repl = repl;
      // ---- apparence ----
      var L = resolveLook(def, vflags);
      rt.look = L.look; rt.bg = L.bg;
      rt.lookKey = id + (vflags.snow ? '|s' : '') + (vflags.custom.length ? '|c' + vflags.custom.length : '');
      var style = Object.assign({ renderer: 'hd', view: 'top' }, def.style || {});
      ['dark', 'snow', 'doorAjar', 'white'].forEach(function (v) { if (vflags[v] && def.variants && def.variants[v] && def.variants[v].style) Object.assign(style, def.variants[v].style); });
      vflags.custom.forEach(function (cv) { if (cv.style) Object.assign(style, cv.style); });
      if (def.styles && def.styles.length) { var shiftN = YN.save.temp('shift_' + id) || 0; Object.assign(style, def.styles[shiftN % def.styles.length]); }
      if (def.lookShift && def.lookShift.length) { var ls = def.lookShift[(YN.save.temp('shift_' + id) || 0) % def.lookShift.length]; U.keys(ls).forEach(function (k) { rt.look[k] = ls[k]; }); rt.lookKey += '|sh' + (YN.save.temp('shift_' + id) || 0); }
      rt.style = style; rt.view = style.view || 'top';
      rt.underTile = def.underTile || '.';
      rt.music = def.music === undefined ? 'generic' : def.music;
      if (vflags.dark && def.musicDark !== undefined) rt.music = def.musicDark;
      if (vflags.snow && def.musicSnow !== undefined) rt.music = def.musicSnow;
      ['dark', 'snow', 'doorAjar', 'white'].forEach(function (v) { if (vflags[v] && def.variants && def.variants[v] && def.variants[v].music !== undefined) rt.music = def.variants[v].music; });
      vflags.custom.forEach(function (cv) { if (cv.music !== undefined) rt.music = cv.music; });
      rt.amb = def.amb || null;
      // ---- obscurité et météo ----
      var baseDark = def.dark || 0;
      if (felt.dark && depth > 0) baseDark = Math.max(baseDark, (def.darkAmount === undefined ? 0.84 : def.darkAmount) * (felt.dim || 1));
      if (def.night) baseDark = Math.max(baseDark, def.dark || 0.8);
      if (depth === 0 && felt.dark) baseDark = Math.max(baseDark, def.darkAmount === undefined ? 0.75 : def.darkAmount);
      rt.darkness = baseDark;
      rt.weather = Object.assign({}, def.weather || {});
      if (felt.snow && def.snowWeather !== false) rt.weather.snow = true;
      if (felt.wind) rt.weather.wind = (rt.weather.wind || 0) + (felt.snow ? 0.5 : 0.3);
      if (felt.dark && def.outdoor) rt.style.stars = true;
      vflags.custom.forEach(function (cv) { if (cv.weather) Object.assign(rt.weather, cv.weather); if (cv.dark !== undefined) rt.darkness = cv.dark; });
      // ---- méthodes ----
      WD.attachMethods(rt);
      // ---- cachettes : faux murs, chemins noirs (avant les marques) ----
      if (YN.secrets) { try { YN.secrets.carve(rt); } catch (e) { YN.warn(id + ' secrets: ' + (e.stack || e)); } }
      // ---- marques ----
      if (rt.markPos) rt.markPos.forEach(function (mp) {
        var md = (def.marks && def.marks[mp[0]]) || null;
        if (mp[0] === '@') rt.spawnAt = [mp[1], mp[2]];
        if (!md) { if (mp[0] !== '@') YN.warn(id + ': mark “' + mp[0] + '” has no definition'); return; }
        WD.addMark(rt, md, mp[1], mp[2], mp[0]);
      });
      // les cases des marques fixes sont réservées : une marque posée au hasard avant elles ne s'y met pas
      rt._reserved = {}; (def.place || []).forEach(function (pd) { if (Array.isArray(pd.at)) { var rx = pd.at[0] < 0 ? rt.w + pd.at[0] : pd.at[0], ry = pd.at[1] < 0 ? rt.h + pd.at[1] : pd.at[1]; rt._reserved[rx + ',' + ry] = 1; if (DOOR_TYPES[pd.type]) rt._reserved[rx + ',' + (ry + 1)] = 1; } });
      // devant une porte (où l'on se présente), rien ne se pose au hasard
      rt.marks.forEach(function (m0) { if (DOOR_TYPES[m0.type]) rt._reserved[m0.x + ',' + (m0.y + 1)] = 1; });
      (def.place || []).forEach(function (pd, i) {
        rt._placing = pd; var at = WD.resolveAt(rt, pd.at, i); rt._placing = null;
        if (at) WD.addMark(rt, pd, at[0], at[1], pd.ch || null);
        else if (!rt.inf && pd.at) YN.warn(id + ': position not found for mark ' + (pd.id || pd.type || '?'));
      });
      ['dark', 'snow', 'doorAjar', 'white'].forEach(function (v) {
        if (vflags[v] && def.variants && def.variants[v] && def.variants[v].place) def.variants[v].place.forEach(function (pd, i) { var at = WD.resolveAt(rt, pd.at, i); if (at) WD.addMark(rt, pd, at[0], at[1], null); });
      });
      vflags.custom.forEach(function (cv) { (cv.place || []).forEach(function (pd, i) { var at = WD.resolveAt(rt, pd.at, i); if (at) WD.addMark(rt, pd, at[0], at[1], null); }); });
      // ---- mondes à apparition (portes qui surgissent selon une règle) ----
      if (YN.spawns) { try { YN.spawns.apply(rt); } catch (e) { YN.warn('spawns: ' + e); } }
      WD.markFronts(rt);
      // ---- marques posées au hasard : on les ramène à portée de pas ----
      WD.thinSouls(rt);
      if (YN.furnish && !rt.inf) { try { YN.furnish.apply(rt); } catch (e) { YN.warn(id + ' furnishing: ' + (e.stack || e)); } }
      // ambiance légère quand le monde n'a pas de météo : poussière dedans, feuilles ou lucioles dehors
      if (!U.keys(rt.weather || {}).length && (depth > 0) && !def.noAmbient) {
        var th0 = rt.furnishTheme || (YN.furnish ? YN.furnish.themeOf(def) : '');
        rt.ambientKind = th0 === 'nature' ? (rt.darkness > 0.45 ? 'fireflies' : 'leaves') : th0 === 'snow' ? 'snow' : th0 === 'water' ? 'motes' : th0 === 'beach' ? null : 'motes';
      }
      if (YN.secrets) { try { YN.secrets.populate(rt); YN.secrets.paintedDoor(rt); } catch (e) { YN.warn(id + ' secrets: ' + (e.stack || e)); } }
      if (YN.vast && rt.vastPieces) { try { YN.vast.populate(rt); } catch (e) { YN.warn(id + ' vast: ' + (e.stack || e)); } }
      if (YN.collect) { try { YN.collect.onBuild(rt); } catch (e) { YN.warn(id + ' collections: ' + (e.stack || e)); } }
      if (YN.stories) { try { YN.stories.placeItems(rt); } catch (e) { YN.warn(id + ' stories: ' + (e.stack || e)); } }
      if (!rt.inf && rt.view !== 'side') { try { WD.fixReach(rt); } catch (e) { YN.warn('placement: ' + e); } }
      if (!rt.inf && rt.view === 'top') { try { WD.placeDoors(rt); } catch (e) { YN.warn('doors: ' + (e.stack || e)); } }
      if (!rt.inf && rt.view === 'top') { try { WD.settleDoors(rt); } catch (e) { YN.warn('furniture: ' + e); } }
      if (!rt.inf && rt.view !== 'side') { try { WD.hangWallDecor(rt); } catch (e) { YN.warn('wall decor: ' + e); } }
      if (!rt.inf && rt.view === 'top') { try { WD.breakBarriers(rt); } catch (e) { YN.warn(id + ' barriers: ' + (e.stack || e)); } }
      if (YN.secrets && !rt.inf && rt.view === 'top') { try { YN.secrets.finalCheck(rt); } catch (e) { YN.warn(id + ' final check: ' + (e.stack || e)); } }
      // ---- mécaniques ----
      (def.mech || []).forEach(function (m) {
        var impl = YN.mech[m.type];
        if (!impl) { YN.warn(id + ': unknown mechanic ' + m.type); return; }
        var inst = { type: m.type, impl: impl, p: m, s: {} };
        rt.mechs.push(inst);
        try { if (impl.init) impl.init(rt, m, inst.s); } catch (e) { YN.warn(id + ' mech ' + m.type + ' init: ' + (e.stack || e)); }
      });
      // ---- entités ----
      if (YN.entities) YN.entities.spawnFor(rt);
      if (YN.stories) { try { YN.stories.spawn(rt); } catch (e) { YN.warn(id + ' stories: ' + (e.stack || e)); } }
      WD.reeval(rt, true);
      if (YN.corruption) YN.corruption.apply(rt);
      rt.mechDraw = WD.mechHook(rt, 'draw');
      rt.mechDrawBg = WD.mechHook(rt, 'drawBg');
      rt.mechDrawGround = WD.mechHook(rt, 'drawGround');
      return rt;
    },

    /* Les marques posées au hasard (portes, effets, objets) doivent être atteignables
       à pied depuis la porte de retour ; sinon on les déplace (tirage stable). */
    /* un objet mural posé au hasard (fenêtre, cadre, dessin…) est accroché au mur le plus proche */
    /* grille d'occupation des marques (actives, visibles) : combien de marques, combien de solides par case */
    markGrid: function (rt) {
      var w = rt.w, h = rt.h, any = new Uint16Array(w * h), sol = new Uint16Array(w * h);
      var future = function (m) { return !m.active && DOOR_TYPES[m.type] && (m.def.spawned || m.def.cond); }; // une porte qui n'apparaît que plus tard occupe déjà sa case
      rt.marks.forEach(function (m) { if ((!m.active && !future(m)) || m.hidden || m.x < 0 || m.y < 0 || m.x >= w || m.y >= h) return; var k = m.y * w + m.x; any[k]++; if (m.solid && m.active) sol[k]++; });
      return { any: any, sol: sol, w: w, h: h,
        move: function (m, nx, ny) { var on = (m.active || future(m)) && !m.hidden; if (on && m.x >= 0 && m.y >= 0 && m.x < w && m.y < h) { var k0 = m.y * w + m.x; any[k0]--; if (m.solid && m.active) sol[k0]--; } m.x = nx; m.y = ny; if (on && nx >= 0 && ny >= 0 && nx < w && ny < h) { var k1 = ny * w + nx; any[k1]++; if (m.solid && m.active) sol[k1]++; } },
        has: function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && any[y * w + x] > 0; } };
    },
    /* passage case par case, calculé d'un coup (pour les parcours de carte) : who = 'player' (faux murs compris) ou 'npc' */
    passGrid: function (rt, who) {
      var w = rt.w, h = rt.h, g = new Uint8Array(w * h), blk = new Uint8Array(w * h);
      rt.marks.forEach(function (m) { if (!m.active || m.hidden || m.x < 0 || m.y < 0 || m.x >= w || m.y >= h) return; if (m.solid || (m.def.block && who === 'player') || (m.def.smallOnly && who === 'player')) blk[m.y * w + m.x] = 1; });
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var k = y * w + x, i = YN.tileInfo(rt.tile(x, y)); var ok = !!i.pass || (who === 'player' && rt.fake && rt.fake[k] === 1); if (ok && i.hazard && who === 'npc') ok = false; g[k] = ok && !blk[k] ? 1 : 0; }
      return g;
    },
    /* un lieu fermé (maison, école, bureau…) : ses murs se dessinent de face */
    indoor: function (rt) {
      var def = rt.def, lk = def.look || {};
      if (def.outdoor || rt.vastPieces) return false;
      if (lk.wallface || (def.style && def.style.tallWalls)) return true;
      var th = YN.furnish ? YN.furnish.themeOf(def, rt) : '';
      return th === 'home' || th === 'institution' || th === 'office';
    },
    /* dans un lieu fermé, une porte posée au hasard va contre un mur (jamais seule au milieu d'une pièce),
       à portée de pas, sans couper un couloir ni se coller à une autre porte */
    DOOR_WALL: { door: 1, elevator: 1, inner: 1, secret: 1, portal: 1 },
    settleDoors: function (rt) {
      if (!WD.indoor(rt)) return;
      var AG = (YN.furnish && YN.furnish.AGAINST) || {};
      var todo = rt.marks.filter(function (m) { var rnd = (typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0) || m.def.spawned; return m.active && rnd && !m.def.free && m.type === 'decor' && m.solid && AG[m.look] && !m.def.furnished; }); // meubles d'intérieur des fiches (les portes : placeDoors)
      if (!todo.length) return;
      var w = rt.w, h = rt.h;
      var wallAt = function (x, y) { if (x < 0 || y < 0 || x >= w || y >= h) return false; return !!YN.tileInfo(rt.tile(x, y)).wall; };
      todo = todo.filter(function (m) { return !wallAt(m.x, m.y - 1) && !wallAt(m.x - 1, m.y) && !wallAt(m.x + 1, m.y); });
      todo.sort(function (a, b) { return (WD.DOOR_WALL[b.type] ? 1 : 0) - (WD.DOOR_WALL[a.type] ? 1 : 0); }); // les portes d'abord
      if (!todo.length) return;
      var anchor = rt.marks.filter(function (m) { return DOOR_TYPES[m.type] && m.def.essential && todo.indexOf(m) < 0; })[0];
      var start = anchor ? WD.besideMark(rt, anchor) : (rt.spawnAt || WD.nearestOpen(rt, w >> 1, h >> 1));
      if (!start || start[0] < 0 || start[1] < 0 || start[0] >= w || start[1] >= h) return;
      var PG = WD.passGrid(rt, 'npc'), seen = new Uint8Array(w * h), q = [start], qi = 0;
      seen[start[1] * w + start[0]] = 1;
      while (qi < q.length) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var nx = c[0] + [1, -1, 0, 0][k], ny = c[1] + [0, 0, 1, -1][k]; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; var kk = ny * w + nx; if (seen[kk] || !PG[kk]) continue; seen[kk] = 1; q.push([nx, ny]); } }
      var MG = WD.markGrid(rt), cand = [], cut = WD.cutAny(rt);
      var ok = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && seen[y * w + x] === 1; };
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        if (!ok(x, y) || WD.choke(rt, x, y) || cut[y * w + x] || (rt.fake && rt.fake[y * w + x]) || (rt._fronts && rt._fronts[y * w + x]) || MG.has(x, y) || U.dist(x, y, start[0], start[1]) < 2) continue;
        // contre le mur du fond d'abord ; sinon contre un mur de côté, la case devant restant libre
        var pen = -1;
        if (wallAt(x, y - 1) && ok(x, y + 1) && !MG.has(x - 1, y) && !MG.has(x + 1, y) && !MG.has(x, y + 1)) pen = 0;
        else if ((wallAt(x - 1, y) && ok(x + 1, y) && !MG.has(x + 1, y)) || (wallAt(x + 1, y) && ok(x - 1, y) && !MG.has(x - 1, y))) { if (!MG.has(x, y - 1) && !MG.has(x, y + 1)) pen = 10; }
        if (pen >= 0) cand.push(x, y, pen);
      }
      todo.forEach(function (m) {
        var best = -1, bk = 1e12;
        for (var i = 0; i < cand.length; i += 3) {
          var cx = cand[i], cy = cand[i + 1]; if (cx < 0) continue;
          var d = Math.abs(cx - m.x) + Math.abs(cy - m.y) * 1.2 + cand[i + 2]; if (d > 48) continue;
          if (d < bk) { bk = d; best = i; }
        }
        if (best < 0) return;
        var bx = cand[best], by = cand[best + 1];
        MG.move(m, bx, by);
        // plus de porte juste à côté
        for (var j = 0; j < cand.length; j += 3) if (cand[j] >= 0 && Math.abs(cand[j] - bx) <= 2 && Math.abs(cand[j + 1] - by) <= 2) cand[j] = -1;
      });
    },
    /* cases de passage indispensables (points d'articulation) : un objet solide y couperait le lieu en deux */
    cutCells: function (rt, tilesOnly) {
      var w = rt.w, h = rt.h, N = w * h, wrap = rt.wrap, PG;
      if (tilesOnly) { PG = new Uint8Array(N); for (var ty = 0; ty < h; ty++) for (var tx = 0; tx < w; tx++) { var tk = ty * w + tx; PG[tk] = (YN.tileInfo(rt.tile(tx, ty)).pass || (rt.fake && rt.fake[tk] === 1)) ? 1 : 0; } } else PG = WD.passGrid(rt, 'player');
      var disc = new Int32Array(N).fill(-1), low = new Int32Array(N), parent = new Int32Array(N).fill(-1), cut = new Uint8Array(N), it = new Uint8Array(N), stack = new Int32Array(N), time = 0;
      var nb = function (k, i) { var x = k % w, y = (k / w) | 0; if (i === 0) x++; else if (i === 1) x--; else if (i === 2) y++; else y--; if (wrap) { x = (x + w) % w; y = (y + h) % h; } else if (x < 0 || y < 0 || x >= w || y >= h) return -1; var j = y * w + x; return PG[j] ? j : -1; };
      for (var s0 = 0; s0 < N; s0++) {
        if (!PG[s0] || disc[s0] >= 0) continue;
        var sp = 0, kids = 0; stack[sp++] = s0; disc[s0] = low[s0] = time++;
        while (sp) {
          var k = stack[sp - 1];
          if (it[k] < 4) { var j = nb(k, it[k]++); if (j < 0) continue; if (disc[j] < 0) { parent[j] = k; disc[j] = low[j] = time++; stack[sp++] = j; if (k === s0) kids++; } else if (j !== parent[k] && disc[j] < low[k]) low[k] = disc[j]; }
          else { sp--; var pk = parent[k]; if (pk >= 0) { if (low[k] < low[pk]) low[pk] = low[k]; if (pk !== s0 && low[k] >= disc[pk]) cut[pk] = 1; } }
        }
        if (kids > 1) cut[s0] = 1;
      }
      return cut;
    },
    /* plusieurs objets posés au hasard peuvent faire un barrage (sièges et fenêtres en travers d'un couloir) :
       si une porte, un effet ou un objet important devient injoignable, on écarte les objets qui bordent la zone atteinte */
    breakBarriers: function (rt) {
      var w = rt.w, h = rt.h, back = rt.marks.filter(function (m) { return DOOR_TYPES[m.type] && m.def.essential; })[0], a;
      try { a = WD.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos; } catch (e) { return; }
      if (!a || a[0] < 0 || a[1] < 0 || a[0] >= w || a[1] >= h) return;
      var important = function (m) { return DOOR_TYPES[m.type] || m.type === 'effect' || m.def.essential || m.def.give || m.type === 'item' || m.def.collectSet || m.def.storyItem; };
      var random = function (m) { return (typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0) || m.def.furnished || m.def.spawned; };
      var wr = function (x, y) { if (rt.wrap) return [U.mod(x, w), U.mod(y, h)]; return [x, y]; };
      var flood = function (ok) { var seen = new Uint8Array(w * h), q = [a], qi = 0; seen[a[1] * w + a[0]] = 1; while (qi < q.length) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var n = wr(c[0] + [1, -1, 0, 0][k], c[1] + [0, 0, 1, -1][k]); if (n[0] < 0 || n[1] < 0 || n[0] >= w || n[1] >= h) continue; var kk = n[1] * w + n[0]; if (seen[kk] || !ok(kk, n[0], n[1])) continue; seen[kk] = 1; q.push(n); } } return { seen: seen, cells: q }; };
      // la même zone sur la carte nue : ce qu'on devrait pouvoir atteindre si rien ne barrait le chemin
      var bare = flood(function (kk, x, y) { return YN.tileInfo(rt.tile(x, y)).pass || (rt.fake && rt.fake[kk] === 1); });
      for (var it = 0; it < 6; it++) {
        var PG = WD.passGrid(rt, 'player'), R = flood(function (kk) { return PG[kk] === 1; }), seen = R.seen;
        var near = function (m) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var n = wr(m.x + dx, m.y + dy); if (n[0] >= 0 && n[1] >= 0 && n[0] < w && n[1] < h && seen[n[1] * w + n[0]]) return true; } return false; };
        var lost = rt.marks.filter(function (m) { return (m.active || DOOR_TYPES[m.type]) && !m.def.unreachOk && important(m) && !near(m); }); // une porte qui n'apparaît que plus tard doit aussi être joignable
        var boxed = R.cells.length < 40 && R.cells.length < bare.cells.length * 0.5; // l'arrivée enfermée dans un recoin
        if (!lost.length && !boxed) return;
        var blockers = rt.marks.filter(function (m) { return m.active && m.solid && m !== back && random(m) && (boxed || !important(m)) && m.x >= 0 && m.y >= 0 && m.x < w && m.y < h && YN.tileInfo(rt.tile(m.x, m.y)).pass && !seen[m.y * w + m.x] && near(m); });
        if (!blockers.length) return;
        var cut = WD.cutAny(rt), MG = WD.markGrid(rt), used = new Uint8Array(w * h), pool = boxed ? bare.cells : R.cells;
        var roomy = function (x, y) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var n = wr(x + dx, y + dy); if (n[0] < 0 || n[1] < 0 || n[0] >= w || n[1] >= h || !PG[n[1] * w + n[0]] || used[n[1] * w + n[0]] || MG.has(n[0], n[1])) return false; } return true; };
        var moved = 0;
        blockers.forEach(function (b) {
          var best = -1, bd = 1e9;
          for (var i = 0; i < pool.length; i++) { var cc = pool[i], k2 = cc[1] * w + cc[0]; if (cut[k2] || (rt._fronts && rt._fronts[k2]) || !roomy(cc[0], cc[1]) || U.dist(cc[0], cc[1], a[0], a[1]) < 3 || (boxed && seen[k2])) continue; var d = Math.abs(cc[0] - b.x) + Math.abs(cc[1] - b.y); if (d < bd) { bd = d; best = i; } }
          if (best < 0) { if (!important(b)) { b.solid = false; moved++; } return; } // plus de place : il devient traversable
          var t = pool[best]; MG.move(b, t[0], t[1]); moved++;
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var n = wr(t[0] + dx, t[1] + dy); if (n[0] >= 0 && n[1] >= 0 && n[0] < w && n[1] < h) used[n[1] * w + n[0]] = 1; }
        });
        if (!moved) return;
      }
    },
    /* la grande partie du lieu, sans passer par un faux mur : une porte posée au hasard n'atterrit pas dans une cachette */
    inMain: function (rt, x, y) {
      var w = rt.w, h = rt.h;
      if (!rt._main || rt._mainBase !== rt.base) {
        var comp = new Int32Array(w * h).fill(-1), sizes = [], best = -1;
        for (var y0 = 0; y0 < h; y0++) for (var x0 = 0; x0 < w; x0++) {
          var k0 = y0 * w + x0; if (comp[k0] >= 0 || !YN.tileInfo(rt.baseTile(x0, y0)).pass || rt.fake[k0]) continue;
          var id = sizes.length, q = [k0], qi = 0; comp[k0] = id;
          while (qi < q.length) { var k = q[qi++], cx = k % w, cy = (k / w) | 0; for (var d = 0; d < 4; d++) { var nx = cx + [1, -1, 0, 0][d], ny = cy + [0, 0, 1, -1][d]; if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; var nk = ny * w + nx; if (comp[nk] >= 0 || rt.fake[nk] || !YN.tileInfo(rt.baseTile(nx, ny)).pass) continue; comp[nk] = id; q.push(nk); } }
          sizes.push(q.length); if (best < 0 || q.length > sizes[best]) best = id;
        }
        rt._main = { comp: comp, best: best }; rt._mainBase = rt.base;
      }
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      return rt._main.comp[y * w + x] === rt._main.best;
    },
    /* LES PORTES POSÉES AU HASARD (portes, ascenseurs, escaliers, passages latéraux, portes qui apparaissent plus tard…)
       vont à un endroit qui a du sens : dans un lieu fermé contre un mur ; dehors sur un sol dégagé, pas dans un buisson
       ni contre l'eau ; toujours avec une case libre devant pour s'y présenter ; jamais collées à une autre porte ni à
       l'arrivée ; réparties sur la carte ; les passages latéraux plutôt vers les bords. Les portes placées à la main,
       celles des cachettes et les tableaux-portes ne bougent pas ; celles « random-hidden » restent dans leur recoin. */
    DOOR_FLOOR: { stairs: 1, ladder: 1 },
    placeDoors: function (rt) {
      var w = rt.w, h = rt.h, isDoor = function (m) { return WD.DOOR_WALL[m.type] || WD.DOOR_FLOOR[m.type] || m.type === 'bed'; };
      var rnd = function (m) { return (typeof m.def.at === 'string' && (m.def.at === 'random' || m.def.at === 'random-any')) || m.def.spawned; };
      var todo = rt.marks.filter(function (m) { return isDoor(m) && rnd(m) && !m.def.secretDoor && !m.def.painted && !m.def.free && m.x >= 0 && m.y >= 0 && m.x < w && m.y < h; });
      if (!todo.length) return;
      var back = rt.marks.filter(function (m) { return DOOR_TYPES[m.type] && m.def.essential; })[0];
      todo.sort(function (a, b) { return (b === back ? 1 : 0) - (a === back ? 1 : 0); }); // la porte du retour d'abord : c'est elle qui décide de l'arrivée
      var indoor = WD.indoor(rt), r = YN.rng.make((rt.seed ^ 0x5bd1e995) >>> 0);
      var wr = function (x, y) { return rt.wrap ? [U.mod(x, w), U.mod(y, h)] : [x, y]; };
      var tinfo = function (x, y) { var c = wr(x, y); if (c[0] < 0 || c[1] < 0 || c[0] >= w || c[1] >= h) return null; return YN.tileInfo(rt.tile(c[0], c[1])); };
      var wallAt = function (x, y) { var t = tinfo(x, y); return !!(t && t.wall); };
      var ground = function (x, y) { var t = tinfo(x, y); if (!t || !t.pass || t.water || t.hazard || t.slide || t.pit || t.ladder || t.kind === 'bridge') return false; var c = wr(x, y); return !(rt.fake && rt.fake[c[1] * w + c[0]]); };
      var MG = WD.markGrid(rt), cut = WD.cutAny(rt);
      var solidAt = function (x, y) { var c = wr(x, y); return c[0] >= 0 && c[1] >= 0 && c[0] < w && c[1] < h && MG.sol[c[1] * w + c[0]] > 0; };
      // les portes qui ne bougent pas, et celles déjà placées : on garde ses distances
      var placed = rt.marks.filter(function (m) { return isDoor(m) && todo.indexOf(m) < 0 && m.x >= 0 && m.y >= 0; }).map(function (m) { return [m.x, m.y]; });
      var cheb = function (ax, ay, bx, by) { var dx = Math.abs(ax - bx), dy = Math.abs(ay - by); if (rt.wrap) { dx = Math.min(dx, w - dx); dy = Math.min(dy, h - dy); } return Math.max(dx, dy); };
      var region = function (start) {
        if (!start || start[0] < 0 || start[1] < 0 || start[0] >= w || start[1] >= h) return null;
        var PG = WD.passGrid(rt, 'npc'), seen = new Uint8Array(w * h), q = [start], qi = 0; seen[start[1] * w + start[0]] = 1;
        while (qi < q.length) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var n = wr(c[0] + [1, -1, 0, 0][k], c[1] + [0, 0, 1, -1][k]); if (n[0] < 0 || n[1] < 0 || n[0] >= w || n[1] >= h) continue; var kk = n[1] * w + n[0]; if (seen[kk] || !PG[kk]) continue; seen[kk] = 1; q.push(n); } }
        return { seen: seen, cells: q };
      };
      var anchorDone = !back || todo.indexOf(back) < 0;
      var startOf = function () { return back && anchorDone ? WD.besideMark(rt, back) : (rt.spawnAt || (back ? WD.besideMark(rt, back) : WD.nearestOpen(rt, w >> 1, h >> 1))); };
      var R = null, arrival = null, cand = [];
      var buildCand = function () {
        var st = startOf(); R = region(st); arrival = st; cand = [];
        if (!R) return;
        var cells = R.cells, step = cells.length > 6000 ? Math.ceil(cells.length / 6000) : 1;
        for (var i = 0; i < cells.length; i += step) {
          var x = cells[i][0], y = cells[i][1], k = y * w + x;
          if (!ground(x, y) || cut[k] || WD.choke(rt, x, y) || MG.has(x, y)) continue;
          // une case libre devant (en dessous), dans la zone qu'on atteint
          var f = wr(x, y + 1); if (f[1] >= h || !R.seen[f[1] * w + f[0]] || solidAt(f[0], f[1])) continue;
          if (MG.has(x - 1, y) || MG.has(x + 1, y) || MG.has(f[0], f[1])) continue;
          var blk = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && (!ground(x + dx, y + dy) || solidAt(x + dx, y + dy))) blk++;
          var pen = 0;
          if (indoor) { if (wallAt(x, y - 1)) pen = 0; else if (wallAt(x - 1, y) || wallAt(x + 1, y)) pen = 4; else continue; }
          else { if (blk > 3) continue; pen = blk * 1.5; }
          var open = 0; if (!indoor) for (var oy = -2; oy <= 2; oy++) for (var ox = -2; ox <= 2; ox++) if (ground(x + ox, y + oy)) open++;
          cand.push([x, y, pen, open, 0]);
        }
      };
      buildCand();
      var block = function (x, y) { for (var q = 0; q < cand.length; q++) if (!cand[q][4] && cheb(cand[q][0], cand[q][1], x, y) <= 1) cand[q][4] = 1; };
      todo.forEach(function (m) {
        if (!cand.length) return;
        var isBack = m === back, lateral = !!m.def.lateral, best = -1, bs = -1e9;
        for (var pass = 0; pass < 3 && best < 0; pass++) {
          var minD = [3, 2, 1][pass], minA = [4, 3, 2][pass];
          for (var i = 0; i < cand.length; i++) {
            var c = cand[i]; if (c[4]) continue;
            var dmin = 99; for (var j = 0; j < placed.length; j++) { var d0 = cheb(c[0], c[1], placed[j][0], placed[j][1]); if (d0 < dmin) dmin = d0; }
            if (dmin < minD) continue;
            var da = isBack || !arrival ? 99 : cheb(c[0], c[1], arrival[0], arrival[1]); if (da < minA) continue;
            var edge = lateral ? Math.min(c[0], w - 1 - c[0]) / Math.max(1, w / 2) : 0; // un passage latéral, plutôt vers un bord
            var sc = Math.min(dmin, 14) * 2 + Math.min(da, 10) * 0.6 - c[2] + c[3] * 0.12 - edge * 10 + r.next() * 3;
            if (sc > bs) { bs = sc; best = i; }
          }
        }
        if (best < 0) return;
        var c2 = cand[best]; MG.move(m, c2[0], c2[1]); placed.push([c2[0], c2[1]]); block(c2[0], c2[1]);
        if (isBack) { anchorDone = true; buildCand(); placed.forEach(function (p) { block(p[0], p[1]); }); }
      });
      WD.markFronts(rt);
    },
    /* la case devant chaque porte (où l'on se présente) : rien de solide ne s'y pose ensuite */
    markFronts: function (rt) {
      if (rt.inf || !rt.base) { rt._fronts = null; return; } // monde infini : pas de grille
      var w = rt.w, h = rt.h, f = rt._fronts = new Uint8Array(w * h);
      rt.marks.forEach(function (m) { if (!DOOR_TYPES[m.type] || m.x < 0 || m.y < 0 || m.x >= w || m.y >= h) return; var y = rt.wrap ? U.mod(m.y + 1, h) : m.y + 1; if (y < h) f[y * w + m.x] = 1; });
    },
    /* passage obligatoire sur la carte nue ou avec ses objets solides */
    cutAny: function (rt) { var a = WD.cutCells(rt, true), b = WD.cutCells(rt); for (var i = 0; i < a.length; i++) a[i] |= b[i]; return a; },
    hangWallDecor: function (rt) {
      var w = rt.w, h = rt.h;
      var todo = rt.marks.filter(function (m) { return m.look && typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0 && YN.decor.isWall(m.look) && !YN.DOOR_TYPES[m.type]; });
      if (!todo.length) return;
      var wallAt = function (x, y) { if (x < 0 || y < 0 || x >= w || y >= h) return false; return YN.tileInfo(rt.tile(x, y)).wall; };
      var MG = WD.markGrid(rt), cand = [];
      var cut = WD.cutAny(rt), near = new Uint8Array(w * h);
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) if (YN.tileInfo(rt.tile(x, y)).pass && wallAt(x, y - 1)) cand.push(x, y);
      todo.forEach(function (m) {
        if (wallAt(m.x, m.y - 1)) return;
        var best = -1, bk = 1e12;
        for (var c = 0; c < cand.length; c += 2) {
          var nx = cand[c], ny = cand[c + 1], dx = nx - m.x, dy = ny - m.y, r = Math.max(Math.abs(dx), Math.abs(dy));
          if (r < 1 || r >= 60 || MG.has(nx, ny) || (m.solid && (cut[ny * w + nx] || near[ny * w + nx] || (rt._fronts && rt._fronts[ny * w + nx])))) continue;
          var sc = Math.abs(dx) * 3 + Math.abs(dy) + ((MG.has(nx - 1, ny) || MG.has(nx + 1, ny)) ? 50 : 0), key = r * 1e6 + sc; // l'anneau le plus proche d'abord, puis le meilleur score
          if (key < bk) { bk = key; best = c; }
        }
        if (best >= 0) { MG.move(m, cand[best], cand[best + 1]); if (m.solid) for (var ny2 = cand[best + 1] - 1; ny2 <= cand[best + 1] + 1; ny2++) for (var nx2 = cand[best] - 1; nx2 <= cand[best] + 1; nx2++) if (nx2 >= 0 && ny2 >= 0 && nx2 < w && ny2 < h) near[ny2 * w + nx2] = 1; } // deux objets solides côte à côte pourraient boucher un passage
      });
    },
    /* une case de couloir étroit : un objet ou un habitant solide y couperait le passage */
    choke: function (rt, x, y) {
      var w = rt.w, h = rt.h;
      var tp = function (a, b) { if (rt.wrap) { a = U.mod(a, w); b = U.mod(b, h); } if (a < 0 || b < 0 || a >= w || b >= h) return false; return YN.tileInfo(rt.tile(a, b)).pass; };
      var l = tp(x - 1, y), r = tp(x + 1, y), u = tp(x, y - 1), d = tp(x, y + 1);
      return (l && r && !u && !d) || (u && d && !l && !r) || (l + r + u + d) <= 1;
    },
    fixReach: function (rt) {
      var random = rt.marks.filter(function (m) { return m.def.at === 'random-any' || m.def.at === 'random' || m.def.at === 'random-hidden' || m.def.spawned; });
      if (!random.length) return;
      var anchor = rt.marks.filter(function (m) { return DOOR_TYPES[m.type] && m.def.essential && random.indexOf(m) < 0; })[0] || rt.marks.filter(function (m) { return DOOR_TYPES[m.type] && m.def.essential; })[0];
      if (anchor && random.indexOf(anchor) >= 0 && anchor.solid) WD.unblockAnchor(rt, anchor); // la porte de retour posée au hasard dans un goulet couperait le lieu dès l'arrivée
      var start = anchor ? WD.besideMark(rt, anchor) : (rt.spawnAt || WD.nearestOpen(rt, Math.floor(rt.w / 2), Math.floor(rt.h / 2)));
      var w = rt.w, h = rt.h;
      if (start[0] < 0 || start[1] < 0 || start[0] >= w || start[1] >= h) return;
      var wrapC = function (x, y) { if (rt.wrap) return [U.mod(x, w), U.mod(y, h)]; return [x, y]; };
      var tpass = function (x, y) { if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x < 0 || y < 0 || x >= w || y >= h) return false; return passG[y * w + x] === 1; };
      var MG = WD.markGrid(rt), passG = new Uint8Array(w * h);
      for (var py = 0; py < h; py++) for (var px = 0; px < w; px++) passG[py * w + px] = YN.tileInfo(rt.tile(px, py)).pass ? 1 : 0;
      var free = function (x, y) { var k = y * w + x; return passG[k] === 1 && MG.sol[k] === 0; };
      // un couloir d'une case : un objet solide y couperait le passage
      var choke = function (x, y) { var l = tpass(x - 1, y), r = tpass(x + 1, y), u = tpass(x, y - 1), d = tpass(x, y + 1); return (l && r && !u && !d) || (u && d && !l && !r) || (l + r + u + d) <= 1; };
      var roomy = function (x, y) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (!tpass(x + dx, y + dy)) return false; return true; };
      var r = YN.rng.make(rt.seed + 4243), cutT = null;
      for (var pass = 0; pass < 4; pass++) {
        var seen = new Uint8Array(w * h), q = [start], qi = 0, cells = [], hiddenCells = null;
        seen[start[1] * w + start[0]] = 1;
        while (qi < q.length) {
          var c = q[qi++]; cells.push(c);
          for (var k = 0; k < 4; k++) {
            var nx = c[0] + [1, -1, 0, 0][k], ny = c[1] + [0, 0, 1, -1][k];
            if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            if (seen[ny * w + nx] || !free(nx, ny)) continue;
            seen[ny * w + nx] = 1; q.push([nx, ny]);
          }
        }
        if (cells.length < 4) return;
        var near = function (m) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var x = m.x + dx, y = m.y + dy; if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x >= 0 && y >= 0 && x < w && y < h && seen[y * w + x]) return true; } return false; };
        if (!cutT) cutT = WD.cutCells(rt, true); // passages obligatoires de la carte (entrée d'une pièce, virage d'un couloir)
        var good = cells.filter(function (c) { return roomy(c[0], c[1]); });
        var pool = good.length > 8 ? good : cells;
        var moved = false;
        random.forEach(function (m) {
          var blocks = m.solid && (choke(m.x, m.y) || (m.x >= 0 && m.y >= 0 && m.x < w && m.y < h && cutT[m.y * w + m.x] === 1));
          if (near(m) && !blocks) return;
          var hid = m.def.at === 'random-hidden', pl = pool;
          if (hid) { if (!hiddenCells) hiddenCells = cells.filter(function (c) { var b0 = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && !tpass(c[0] + dx, c[1] + dy)) b0++; return b0 >= 4; }); if (hiddenCells.length > 3) pl = hiddenCells; }
          for (var t = 0; t < 60; t++) {
            var c2 = pl[r.int(Math.min(pl.length - 1, 3), pl.length - 1)];
            if (MG.has(c2[0], c2[1])) continue;
            if (U.dist(c2[0], c2[1], start[0], start[1]) < 2) continue;
            if (m.solid && (choke(c2[0], c2[1]) || cutT[c2[1] * w + c2[0]] === 1 || (rt._fronts && rt._fronts[c2[1] * w + c2[0]]))) continue;
            MG.move(m, c2[0], c2[1]); moved = true; break;
          }
        });
        if (!moved) break;
      }
    },
    unblockAnchor: function (rt, m) {
      var w = rt.w, h = rt.h; if (m.x < 0 || m.y < 0 || m.x >= w || m.y >= h) return;
      var cut = WD.cutCells(rt, true); if (!cut[m.y * w + m.x]) return; // un cul-de-sac ne coupe rien : seul un vrai passage obligatoire compte
      var MG = WD.markGrid(rt), seen = new Uint8Array(w * h), q = [[m.x, m.y]], qi = 0; seen[m.y * w + m.x] = 1;
      var open = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && YN.tileInfo(rt.tile(x, y)).pass; };
      while (qi < q.length && qi < 4000) {
        var c = q[qi++], x = c[0], y = c[1];
        if ((x !== m.x || y !== m.y) && !cut[y * w + x] && !MG.has(x, y) && (open(x, y + 1) || open(x, y - 1))) { MG.move(m, x, y); return; }
        for (var k = 0; k < 4; k++) { var nx = x + [1, -1, 0, 0][k], ny = y + [0, 0, 1, -1][k]; if (!open(nx, ny) || seen[ny * w + nx]) continue; seen[ny * w + nx] = 1; q.push([nx, ny]); }
      }
    },
    mechHook: function (rt, name) {
      var list = rt.mechs.filter(function (m) { return m.impl[name]; });
      if (!list.length) return null;
      return function (x) { for (var i = 0; i < list.length; i++) { try { list[i].impl[name](rt, x, list[i].s, list[i].p); } catch (e) { YN.warn(rt.id + ' ' + list[i].type + '.' + name + ': ' + e); } } };
    },
    mechCall: function (rt, name, a, b, c) {
      var handled = false;
      for (var i = 0; i < rt.mechs.length; i++) {
        var m = rt.mechs[i];
        if (m.impl[name]) {
          try { if (m.impl[name](rt, m.s, m.p, a, b, c)) handled = true; } catch (e) { YN.warn(rt.id + ' ' + m.type + '.' + name + ': ' + (e.stack || e)); }
        }
      }
      return handled;
    },

    /* sol sous une marque : le sol voisin le plus fréquent (évite les carrés dépareillés) */
    inferFloor: function (rows, x, y) {
      var count = {}, best = '.', bn = 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(function (d) {
        var r = rows[y + d[1]], c = r && r[x + d[0]];
        if (!c || YN.isMarkChar(c)) return;
        var inf = YN.tileInfo(c); if (!inf.pass || inf.ladder) return;
        count[c] = (count[c] || 0) + 1;
        if (count[c] > bn) { bn = count[c]; best = c; }
      });
      return best;
    },
    resolveAt: function (rt, at, i) {
      if (!at) return null;
      if (Array.isArray(at)) {
        var x = at[0] < 0 ? rt.w + at[0] : at[0], y = at[1] < 0 ? rt.h + at[1] : at[1];
        return [x, y];
      }
      if (typeof at === 'string') {
        if (at === 'random-hidden' && rt.inf) {
          // monde infini : un recoin pas trop loin de l'arrivée
          var ri = YN.rng.make(rt.seed + 7151 * (i + 1));
          for (var q0 = 0; q0 < 300; q0++) { var ix = 16 + ri.int(-14, 14), iy = 16 + ri.int(-14, 14); if (Math.abs(ix - 16) + Math.abs(iy - 16) < 6) continue; if (YN.tileInfo(rt.tile(ix, iy)).pass) return [ix, iy]; }
          return [20, 16];
        }
        if (at === 'random-hidden') {
          // un recoin : une case libre entourée de murs ou d'obstacles sur au moins cinq côtés
          var rh = YN.rng.make(rt.seed + 5153 * (i + 1));
          // les recoins ne dépendent que des cases : calculés une fois par monde (les grandes cartes rescannaient tout à chaque objet)
          if (!rt._nooks || rt._nooksBase !== rt.base) {
            var cand = [];
            for (var yy0 = 1; yy0 < rt.h - 1; yy0++) for (var xx0 = 1; xx0 < rt.w - 1; xx0++) {
              if (!YN.tileInfo(rt.baseTile(xx0, yy0)).pass) continue;
              var blk = 0; for (var dy0 = -1; dy0 <= 1; dy0++) for (var dx0 = -1; dx0 <= 1; dx0++) if ((dx0 || dy0) && !YN.tileInfo(rt.baseTile(xx0 + dx0, yy0 + dy0)).pass) blk++;
              if (blk >= 5 && !WD.choke(rt, xx0, yy0)) cand.push([xx0, yy0, blk]);
            }
            cand.sort(function (p1, p2) { return p2[2] - p1[2]; }); rt._nooks = cand; rt._nooksBase = rt.base;
          }
          var nk = rt._nooks;
          if (nk.length) { var top = nk.slice(0, Math.max(6, Math.round(nk.length * 0.35))); for (var tr = 0; tr < 24; tr++) { var c0 = top[rh.int(0, top.length - 1)]; if (!rt.markAt(c0[0], c0[1]) && !(rt._reserved && rt._reserved[c0[0] + ',' + c0[1]])) return [c0[0], c0[1]]; } }
          return WD.resolveAt(rt, 'random-any', i);
        }
        if (at === 'random' || at.indexOf('random') === 0) {
          var r = YN.rng.make(rt.seed + 7919 * (i + 1));
          for (var k = 0; k < 600; k++) {
            var xx = r.int(1, rt.w - 2), yy = r.int(1, rt.h - 2);
            if (rt.baseTile(xx, yy) === '.' || (at === 'random-any' && YN.tileInfo(rt.baseTile(xx, yy)).pass)) {
              if (!rt.markAt(xx, yy) && !(rt._reserved && rt._reserved[xx + ',' + yy]) && !(rt.fake && rt._placing && DOOR_TYPES[rt._placing.type] && !WD.inMain(rt, xx, yy))) return [xx, yy];
            }
          }
          return null;
        }
        var m = rt.findMark(at);
        if (m) return [m.x, m.y];
        if (rt.markPos) for (var j = 0; j < rt.markPos.length; j++) if (rt.markPos[j][0] === at) return [rt.markPos[j][1], rt.markPos[j][2]];
      }
      if (at.near) { var b = WD.resolveAt(rt, at.near, i); if (b) return [b[0] + (at.dx || 0), b[1] + (at.dy || 0)]; }
      return null;
    },

    /* une porte « conditionnelle » qui a un texte de refus est visible et verrouillée,
       pas cachée : on voit la porte, elle ne s'ouvre pas encore */
    /* les panneaux et pierres gravées deviennent des âmes : elles donnent leur message puis se défont.
       (la Salle des effets garde ses gravures ; md.keepSign garde un vrai panneau) */
    SOUL_LOOKS: { sign: 1, glyphstone: 1, glyph: 1, soul: 1 },
    /* les âmes sont rares : au plus une âme de lore par monde, dans un monde sur trois environ,
       et seulement une nuit sur trois. Les âmes d'anciens panneaux (indices) et celles qu'une
       énigme utilise restent toujours. */
    SOUL_WORLD_RATE: 0.35, SOUL_NIGHT_RATE: 0.34,
    thinSouls: function (rt) {
      var lore = rt.marks.filter(function (m) { return m.type === 'soul' && !m.def._wasSign && !m.def.soulNightly && !m.def.keepSoul; });
      if (!lore.length) return;
      var h = YN.rng.hash('ames:' + rt.id), night = YN.save.dream ? YN.save.dream.no : 0;
      var worldHas = (h % 1000) / 1000 < WD.SOUL_WORLD_RATE;
      var tonight = (YN.rng.hash('ames:' + rt.id + ':' + night) % 1000) / 1000 < WD.SOUL_NIGHT_RATE;
      var keep = worldHas && tonight ? lore[YN.rng.hash('ame:' + rt.id + ':' + night) % lore.length] : null;
      rt.marks = rt.marks.filter(function (m) { return lore.indexOf(m) < 0 || m === keep; });
    },
    soulKey: function (rt, md) { return 'soul:' + rt.id + ':' + (md.id || YN.rng.hash(JSON.stringify([md.lines || md.text || '', md.glyphs || ''], function (k, v) { return typeof v === 'function' ? String(v) : v; })).toString(36)); },
    soulForm: function (rt, md) {
      var t = md.type || 'decor';
      if (md.keepSign || md._soul) return md;
      var isSign = t === 'sign' || (t === 'inscription' && rt.id !== 'EFFECTROOM') || (t === 'decor' && md.look === 'sign');
      if (!isSign && t !== 'soul') return md;
      var key = WD.soulKey(rt, md);
      // une âme dont une énigme du monde a besoin revient chaque nuit (elle ne se défait que pour ce rêve)
      var mechJson = rt.def._mechJson || (rt.def._mechJson = JSON.stringify(rt.def.mech || [], function (k, v) { return typeof v === 'function' ? '' : v; }));
      var nightly = !!md.nightly || (!!md.id && mechJson.indexOf('"' + md.id + '"') >= 0);
      var hide = nightly ? { temp: (function () { var o = {}; o[key] = true; return o; })() } : { flag: key };
      return Object.assign({}, md, { type: 'soul', look: 'soul', lookOpt: Object.assign({ v: YN.rng.hash(key) % 5 }, md.soulOpt || {}), solid: false, animated: true, light: md.light || 1.4, alpha: 0.82,
        soulKey: key, soulNightly: nightly, hideIf: md.hideIf ? { any: [md.hideIf, hide] } : hide, cycle: false, _soul: true, _wasSign: t !== 'soul' });
    },
    lockForm: function (md) {
      var txt = md.locked || md.lockedText;
      if (!md.cond || !txt || md.lock || !DOOR_TYPES[md.type || 'decor']) return md;
      return Object.assign({}, md, { lock: { if: md.cond, text: txt }, lockedText: txt, cond: null, _lockFrom: true });
    },
    addMark: function (rt, md, x, y, ch) {
      md = WD.lockForm(md);
      var sm = WD.soulForm(rt, md);
      if (sm !== md && sm._wasSign && md.look && !WD.SOUL_LOOKS[md.look]) {
        // l'objet (tableau, affiche, plaque…) reste ; l'âme se tient devant lui
        var obj = WD.addMark(rt, Object.assign({}, md, { type: 'decor', lines: null, text: null, use: null, glyphs: null, listen: null, _soul: true, keptObject: true }), x, y, ch);
        var spot = null, tries = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, 2], [0, -1]];
        for (var k = 0; k < tries.length && !spot; k++) { var sx = x + tries[k][0], sy = y + tries[k][1]; if (sx >= 0 && sy >= 0 && sx < rt.w && sy < rt.h && YN.tileInfo(rt.tile(sx, sy)).pass && !rt.markAt(sx, sy)) spot = [sx, sy]; }
        if (spot) WD.addMark(rt, Object.assign({}, sm, { id: (md.id || 'sign') + '_ame', at: md.at }), spot[0], spot[1], null);
        return obj;
      }
      md = sm;
      var type = md.type || 'decor';
      var m = {
        id: rt.id + ':' + (md.id || ((ch || type) + '@' + x + ',' + y)),
        key: md.id || ch || type, ch: ch, type: type, x: x, y: y, def: md,
        look: md.look === undefined ? null : md.look, lookOpt: md.lookOpt || null,
        solid: md.solid !== undefined ? !!md.solid : !!SOLID_DEFAULT[type],
        active: true, hidden: false, animated: !!md.animated,
        light: md.light || 0, essential: !!md.essential || (type === 'door' && md.essential !== false && !md.cond && !md._lockFrom),
        cond: md.cond || null, ox: md.ox || 0, oy: md.oy || 0, zy: md.zy, alpha: md.alpha,
        dark: md.dark, // apparence spéciale dans le noir
        state: {}
      };
      if (md.state) m.state = U.copy(md.state);
      rt.marks.push(m);
      return m;
    },

    /* réévalue les conditions (temps, chambre, quêtes) — appelé régulièrement */
    reeval: function (rt, first) {
      for (var i = 0; i < rt.marks.length; i++) {
        var m = rt.marks[i];
        var was = m.active;
        m.active = !m.def.cond || YN.cond.check(m.def.cond, { mark: m, rt: rt });
        if (m.def.hideIf && YN.cond.check(m.def.hideIf, { mark: m, rt: rt })) m.active = false;
        if ((m.type === 'item' || m.type === 'cookie') && (m.state.taken || YN.save.temp('took:' + rt.id + ':' + (m.def.id || m.key || (m.x + ',' + m.y))))) { m.active = false; m.state.taken = true; }
        if (!first && was !== m.active) {
          YN.bus.emit('markToggle', rt, m);
          if (m.active && m.def.appearSfx) YN.audio.sfx(m.def.appearSfx);
        }
        if (m.def.lookIf) { // apparence conditionnelle [{cond, look, lookOpt}]
          var lk = null;
          for (var k = 0; k < m.def.lookIf.length; k++) if (YN.cond.check(m.def.lookIf[k].cond, { mark: m })) { lk = m.def.lookIf[k]; break; }
          m.look = lk ? (lk.look !== undefined ? lk.look : m.def.look) : m.def.look;
          m.lookOpt = lk ? (lk.lookOpt || m.def.lookOpt) : m.def.lookOpt;
        }
      }
      if (YN.entities) YN.entities.reeval(rt, first);
    },

    attachMethods: function (rt) {
      rt.baseTile = function (x, y) {
        if (rt.inf) return rt.inf.tile(x, y);
        if (rt.wrap) { x = U.mod(x, rt.w); y = U.mod(y, rt.h); }
        if (y < 0 || y >= rt.h || x < 0 || x >= rt.w) return rt.def.outside || ' ';
        return rt.base[y][x];
      };
      rt.tile = function (x, y) {
        var xx = x, yy = y;
        if (rt.wrap && !rt.inf) { xx = U.mod(x, rt.w); yy = U.mod(y, rt.h); }
        if (rt._ovN) { var k = xx + ',' + yy; if (k in rt.over) return rt.over[k]; } // pas de clé à fabriquer s'il n'y a aucune case modifiée
        var ch = rt.baseTile(xx, yy);
        var r = rt.repl[ch];
        return r === undefined ? ch : r;
      };
      rt.setTemp = function (x, y, ch, layer) {
        if (rt.wrap && !rt.inf) { x = U.mod(x, rt.w); y = U.mod(y, rt.h); }
        if (!((x + ',' + y) in rt.over)) rt._ovN = (rt._ovN || 0) + 1;
        rt.over[x + ',' + y] = ch;
        if (YN.terrain) YN.terrain.invalidate(rt, x, y);
        if (layer) { rt.overLayer = rt.overLayer || {}; rt.overLayer[x + ',' + y] = layer; }
      };
      rt.clearTemp = function (x, y) { if ((x + ',' + y) in rt.over) rt._ovN = Math.max(0, (rt._ovN || 0) - 1); delete rt.over[x + ',' + y]; if (rt.overLayer) delete rt.overLayer[x + ',' + y]; if (YN.terrain) YN.terrain.invalidate(rt, x, y); };
      rt.clearLayer = function (layer) { if (!rt.overLayer) return; U.keys(rt.overLayer).forEach(function (k) { if (rt.overLayer[k] === layer) { delete rt.over[k]; delete rt.overLayer[k]; var p = k.split(','); if (YN.terrain) YN.terrain.invalidate(rt, +p[0], +p[1]); } }); rt.recountOver(); };
      rt.recountOver = function () { rt._ovN = Object.keys(rt.over).length; };
      rt.norm = function (x, y) { return rt.wrap && !rt.inf ? [U.mod(x, rt.w), U.mod(y, rt.h)] : [x, y]; };
      rt.markAt = function (x, y, all) {
        var p = rt.norm(x, y);
        for (var i = rt.marks.length - 1; i >= 0; i--) {
          var m = rt.marks[i];
          if (m.x === p[0] && m.y === p[1] && m.active && (all || !m.hidden)) return m;
        }
        return null;
      };
      rt.marksAt = function (x, y) {
        var p = rt.norm(x, y), out = [];
        for (var i = 0; i < rt.marks.length; i++) { var m = rt.marks[i]; if (m.x === p[0] && m.y === p[1] && m.active && !m.hidden) out.push(m); }
        return out;
      };
      rt.findMark = function (key) {
        for (var i = 0; i < rt.marks.length; i++) { var m = rt.marks[i]; if (m.key === key || m.ch === key || m.id === key || m.def.id === key) return m; }
        return null;
      };
      rt.entAt = function (x, y) {
        var p = rt.norm(x, y);
        for (var i = 0; i < rt.ents.length; i++) { var e = rt.ents[i]; if (e.visible && e.solid && e.x === p[0] && e.y === p[1]) return e; }
        return null;
      };
      rt.findEnt = function (id) { for (var i = 0; i < rt.ents.length; i++) if (rt.ents[i].def.id === id) return rt.ents[i]; return null; };
      /* passage pour une entité (who = 'player' | 'npc' | 'witch') */
      rt.passable = function (x, y, who, caps) {
        var pbody = who === 'pbody'; if (pbody) who = 'player'; // corps de la joueuse : les êtres sont gérés à part (cercles)
        if (!rt.wrap && !rt.inf && (x < 0 || y < 0 || x >= rt.w || y >= rt.h)) return false;
        var ch = rt.tile(x, y), info = YN.tileInfo(ch);
        caps = caps || {};
        var ok = !!info.pass;
        if (!ok) {
          if (info.water && (caps.swim || caps.float || caps.fly)) ok = true;
          if (info.pit && (caps.float || caps.fly)) ok = true;
          if (info.thin && caps.flat) ok = true;
          if (info.secret && (caps.reveal || caps.ghost) && who === 'player') ok = true;
          if (info.paper && caps.doodle) ok = true;
          if (info.mirror && caps.mirrorwalk) ok = true;
          if (info.invis && caps.ghost) ok = true;
          if (who === 'witch' && (info.water || info.pit) && caps.witchFloat) ok = true;
          if (who === 'player' && rt.fake && x >= 0 && y >= 0 && x < rt.w && y < rt.h && rt.fake[y * rt.w + x]) ok = true; // faux mur, chemin noir : elle seule passe
        }
        if (ok && info.hazard && who === 'npc') ok = false;
        if (!ok) return false;
        var marks = rt.marksAt(x, y);
        for (var i = 0; i < marks.length; i++) {
          var m = marks[i];
          if (m.solid && !(who === 'witch' && DOOR_TYPES[m.type])) return false;
          if (m.def.smallOnly && !caps.small && who === 'player') return false;
          if (m.def.block && who === 'player' && !YN.cond.check(m.def.block.unless)) return false;
        }
        if (who !== 'ghost' && !pbody) {
          var e = rt.entAt(x, y);
          if (e && who !== 'witch') return false;
        }
        return true;
      };
      rt.tallDecor = function (ch, x, y) {
        var t = (rt.def.tall && rt.def.tall[ch]) || WD.DEFAULT_TALL[ch];
        if (!t) return null;
        var look = t.look, opt = t.opt;
        if (t.vary) { var v = t.vary[Math.floor(YN.rng.cell(x, y, rt.seed + 11) * t.vary.length)]; look = v.look || look; opt = v.opt || opt; }
        if (rt.vflags.snow && t.snowOpt) opt = Object.assign({}, opt, t.snowOpt);
        if (rt.inf && rt.def.inf.landmarkDecor && ch === rt.def.inf.landmarks) {
          var lm = rt.def.inf.landmarkDecor; var pick = lm[Math.floor(YN.rng.cell(Math.floor(x / 32), Math.floor(y / 32), rt.seed + 3) * lm.length)];
          look = pick.look; opt = pick.opt;
        }
        if (opt && opt.seed === undefined) opt = Object.assign({ seed: (x * 31 + y * 17) & 255 }, opt); else if (!opt) opt = { seed: (x * 31 + y * 17) & 255 };
        return YN.decor.get(look, opt, YN.decor.animated(look) ? Math.floor(YN.render.t * 6) : 0);
      };
    },
    DEFAULT_TALL: {
      '^': { look: 'tree' }, 'o': { look: 'rock' }, 'f': { look: 'fence' }, 'j': { look: 'jar' },
      '{': { look: 'bush' }, '}': { look: 'stump' }
    },

    /* arrivée : marque (caractère, id), coordonnées, porte de retour, point d'apparition */
    arrival: function (rt, arrive, fromId) {
      var pos = null, face = null;
      if (Array.isArray(arrive)) pos = arrive.slice();
      else if (typeof arrive === 'string') {
        var m = rt.findMark(arrive);
        if (m) { pos = [m.x, m.y]; face = m.def.face; if (m.solid || DOOR_TYPES[m.type]) pos = WD.besideMark(rt, m); }
        else if (rt.markPos) { for (var i = 0; i < rt.markPos.length; i++) if (rt.markPos[i][0] === arrive) { pos = [rt.markPos[i][1], rt.markPos[i][2]]; break; } }
      }
      if (!pos && fromId) {
        for (var j = 0; j < rt.marks.length; j++) {
          var mk = rt.marks[j];
          if (DOOR_TYPES[mk.type] && mk.def.to === fromId && mk.active) { pos = WD.besideMark(rt, mk); face = mk.def.face; break; }
        }
      }
      if (!pos && rt.def.spawn) pos = typeof rt.def.spawn === 'string' ? WD.arrival(rt, rt.def.spawn).pos : rt.def.spawn.slice();
      if (!pos && rt.spawnAt) pos = rt.spawnAt.slice();
      if (!pos) pos = rt.inf ? [16, 16] : [Math.floor(rt.w / 2), Math.floor(rt.h / 2)];
      if (!WD.standable(rt, pos[0], pos[1])) pos = WD.nearestOpen(rt, pos[0], pos[1]);
      return { pos: pos, face: face };
    },
    besideMark: function (rt, m) {
      var order = m.def.exitDir ? [m.def.exitDir] : [];
      order = order.concat(['down', 'up', 'right', 'left']);
      var D = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
      // la case devant la porte doit mener quelque part (pas un cul-de-sac que la porte elle-même referme)
      var room = function (x0, y0) { var seen = {}, q = [[x0, y0]], qi = 0; seen[x0 + ',' + y0] = 1; while (qi < q.length && q.length < 40) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var nx = c[0] + [1, -1, 0, 0][k], ny = c[1] + [0, 0, 1, -1][k]; if (rt.wrap) { nx = U.mod(nx, rt.w); ny = U.mod(ny, rt.h); } var key = nx + ',' + ny; if (seen[key] || (nx === m.x && ny === m.y) || !WD.standable(rt, nx, ny)) continue; seen[key] = 1; q.push([nx, ny]); } } return q.length; };
      var best = null, bn = -1;
      for (var i = 0; i < order.length; i++) {
        var d = D[order[i]], x = m.x + d[0], y = m.y + d[1];
        if (!WD.standable(rt, x, y)) continue;
        var n0 = room(x, y); if (n0 >= 40) return [x, y];
        if (n0 > bn) { bn = n0; best = [x, y]; }
      }
      if (best && bn >= 4) return best;
      var DG = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
      for (var j = 0; j < 4; j++) if (WD.standable(rt, m.x + DG[j][0], m.y + DG[j][1])) return [m.x + DG[j][0], m.y + DG[j][1]];
      return WD.nearestOpen(rt, m.x, m.y);
    },
    /* une case où l'on peut apparaître : franchissable, et pas un faux mur ni un chemin noir */
    standable: function (rt, x, y) { return rt.passable(x, y, 'player', {}) && !(YN.secrets && YN.secrets.isFake(rt, x, y)); },
    nearestOpen: function (rt, x0, y0) {
      for (var r = 1; r < 40; r++) for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        if (WD.standable(rt, x0 + dx, y0 + dy)) return [x0 + dx, y0 + dy];
      }
      return [x0, y0];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
