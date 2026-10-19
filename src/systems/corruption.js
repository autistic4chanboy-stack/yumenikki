/* =========================================================================
 *  Corruption : couche réversible posée sur le monde (jamais sur sa
 *  définition). Locale (sorcières, disparaît en sortant) ou persistante
 *  (Prêtresse, 1 à 5, décroît au réveil, stabilisable par l'ancre).
 *  Les marques essentielles ne sont JAMAIS touchées.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var PROFILES = {
    station: { shift: 'engraving', tint: 'hue-rotate(160deg)', note: 'the clocks and the announcements go wrong' },
    forest: { shift: 'charcoal', tint: 'hue-rotate(-50deg) saturate(1.4)', note: 'the trees walk' },
    mono: { shift: 'pixel16', tint: 'invert(1)', note: 'black and white trade places' },
    school: { shift: 'crayon', tint: 'sepia(0.6)', note: 'the blackboards rub themselves out' },
    city: { shift: 'silhouette', tint: 'hue-rotate(90deg)', note: 'the windows light up in the wrong order' },
    house: { shift: 'watercolor', tint: 'saturate(0.5)', note: 'the furniture changes rooms' },
    nk: { shift: 'mono', tint: 'contrast(1.4) saturate(1.6)', note: 'loudspeakers grow on the walls' },
    sk: { shift: 'surveillance', tint: 'hue-rotate(200deg)', note: 'the screens watch' },
    water: { shift: 'watercolor', tint: 'hue-rotate(40deg)', note: 'the water climbs the walls' },
    generic: { shift: 'charcoal', tint: 'hue-rotate(120deg)', note: 'the world rewrites itself' }
  };

  var C = YN.corruption = {
    PROFILES: PROFILES,
    profileOf: function (rt) {
      var p = rt.def.corruption;
      if (p && PROFILES[p]) return PROFILES[p];
      var r = rt.style.renderer;
      if (r === 'mono') return PROFILES.mono;
      return PROFILES.generic;
    },
    apply: function (rt) {
      var lvl = YN.save.perm ? YN.save.corruption(rt.id) : 0;
      // annule d'abord toute modification de corruption précédente
      rt.clearLayer('corr');
      rt.marks.forEach(function (m) { if (m.corrHidden) { m.hidden = false; m.corrHidden = false; } if (m.corrMoved) { m.ox = m.def.ox || 0; m.oy = m.def.oy || 0; m.corrMoved = false; } });
      rt.ents.forEach(function (e) { e.frozenByC = false; e.hostileOverride = null; });
      if (rt.styleOrig) { rt.style = rt.styleOrig; rt.styleOrig = null; }
      rt.controlsMirrorC = false;
      rt.corrPersist = lvl;
      rt.corrLevel = Math.max(lvl, Math.round(rt.corrLocal || 0));
      if (!lvl) return;
      var r = YN.rng.make(rt.seed + lvl * 101 + (YN.save.dream ? YN.save.dream.no : 0));
      var nonEss = rt.marks.filter(function (m) { return !m.essential && !m.def.essential && m.active; });
      if (lvl >= 2) {
        var doors = nonEss.filter(function (m) { return YN.DOOR_TYPES[m.type]; });
        if (doors.length) { var d = r.pick(doors); d.hidden = true; d.corrHidden = true; }
        nonEss.filter(function (m) { return m.type === 'decor'; }).forEach(function (m) { if (r.chance(0.35)) { m.ox = r.int(-1, 1) * 0.5; m.oy = r.int(-1, 1) * 0.5; m.corrMoved = true; } });
      }
      if (lvl >= 3 && !rt.inf) {
        for (var k = 0; k < 6 + lvl * 2; k++) {
          var x = r.int(1, rt.w - 2), y = r.int(1, rt.h - 2), ch = rt.tile(x, y), inf = YN.tileInfo(ch);
          if (rt.markAt(x, y, true)) continue;
          if (inf.wall && !inf.void && C.safeToOpen(rt, x, y)) rt.setTemp(x, y, '.', 'corr');
        }
        rt.ents.forEach(function (e) { if (!e.def.major && r.chance(0.5)) e.frozenByC = true; });
      }
      if (lvl >= 4) {
        rt.styleOrig = rt.style;
        rt.style = Object.assign({}, rt.style, { renderer: C.profileOf(rt).shift, post: null });
        rt.ents.forEach(function (e) { if (!e.def.major && r.chance(0.4)) e.hostileOverride = { kind: 'time', amount: 30 }; });
        rt.controlsMirrorC = r.chance(0.5);
      }
      if (lvl >= 5) {
        nonEss.forEach(function (m) { if (m.type === 'decor' || m.type === 'sign') { m.hidden = true; m.corrHidden = true; } });
      }
    },
    /* n'ouvre un mur que s'il ne crée pas de raccourci hors de la carte */
    safeToOpen: function (rt, x, y) {
      var n = 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var i = YN.tileInfo(rt.tile(x + d[0], y + d[1])); if (i.void) n += 10; if (i.pass) n++; });
      return n >= 1 && n < 10;
    },
    update: function (rt, dt) {
      var lvl = Math.max(rt.corrPersist || 0, Math.round(rt.corrLocal || 0));
      if (YN.priestess && YN.priestess.isIn(rt.id)) lvl = Math.max(lvl, Math.min(5, (rt.corrPersist || 0) + 1));
      rt.corrLevel = lvl;
      rt.controlsMirror = !!(rt.controlsMirrorC || (rt.mirrorUntil && YN.game.clock < rt.mirrorUntil));
      var prof = C.profileOf(rt);
      rt.cssFilter = (rt.corrPersist >= 3 && prof.tint && !(YN.save.settings && YN.save.settings.reduceDistortion)) ? prof.tint.replace(/\d+deg/, function (m) { return Math.round(parseInt(m, 10) * (rt.corrPersist - 2) / 3) + 'deg'; }) : '';
      if (YN.save.dream && YN.save.dream.white) rt.cssFilter = (rt.cssFilter ? rt.cssFilter + ' ' : '') + 'saturate(0.45)';
      // inversion d'effets au niveau 3+ (règle visible : l'icône tremble)
      YN.game.effectInverted = rt.corrLevel >= 3 && Math.floor(YN.game.clock / 8) % 3 === 2;
      void dt;
    },

    /* ---------- surcouche visuelle ---------- */
    drawOverlay: function (x, rt, t, W, H, tpx) {
      var lvl = rt.corrLevel || 0, kinds = rt.witchKinds || [], st = YN.save.settings || {};
      var src = x.canvas, w = W || src.width, h = H || src.height, rs = (tpx || YN.render.ts()) / 16;
      var calm = st.reduceDistortion;
      var r = YN.rng.make(Math.floor(t * 3) + 17);
      if (lvl >= 1 && !calm && r.chance(0.08 * lvl)) { // tranches décalées
        for (var i = 0; i < lvl; i++) { var y = r.int(0, h - 8 * rs), hh = r.int(2, 8) * rs; x.drawImage(src, 0, y, w, hh, r.int(-6, 6) * rs, y, w, hh); }
      }
      if (lvl >= 2) { // caviardages
        x.fillStyle = '#000';
        for (var k = 0; k < lvl * 2; k++) { if (!r.chance(0.5)) continue; x.fillRect(r.int(0, w), r.int(0, h), r.int(10, 40) * rs, 3 * rs); }
      }
      if (lvl >= 3 && !calm) { // bandes inversées
        x.save(); x.globalCompositeOperation = 'difference'; x.fillStyle = '#fff';
        for (var j = 0; j < lvl - 2; j++) if (r.chance(0.4)) x.fillRect(0, r.int(0, h), w, r.int(1, 4) * rs);
        x.restore();
      }
      if (lvl >= 5) { x.fillStyle = 'rgba(0,0,0,0.25)'; for (var q = 0; q < h; q += 6 * rs) x.fillRect(0, q, w, 2 * rs); }
      if (kinds.indexOf('silent') >= 0) { x.fillStyle = 'rgba(200,200,210,' + Math.min(0.35, (rt.corrLocal || 0) * 0.2) + ')'; x.fillRect(0, 0, w, h); }
      if (kinds.indexOf('seam') >= 0 || rt.tears) {
        x.strokeStyle = 'rgba(20,0,0,0.75)'; x.lineWidth = rs;
        var tr = YN.rng.make(rt.seed + 5);
        for (var s = 0; s < 3; s++) {
          var x0 = tr.int(0, w), y0 = tr.int(0, h), x1 = x0 + tr.int(-80, 80) * rs, y1 = y0 + tr.int(40, 120) * rs;
          x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
          x.strokeStyle = 'rgba(230,220,210,0.8)';
          for (var u = 0; u < 1; u += 0.08) { var px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u; x.beginPath(); x.moveTo(px - 3 * rs, py - 2 * rs); x.lineTo(px + 3 * rs, py + 2 * rs); x.stroke(); }
          x.strokeStyle = 'rgba(20,0,0,0.75)';
        }
      }
      if (kinds.indexOf('copy') >= 0 && !calm) { x.globalAlpha = 0.18; x.drawImage(src, 6 * rs, 0); x.globalAlpha = 1; }
      if (kinds.indexOf('voyager') >= 0 && !calm) { for (var v = 0; v < h; v += 8 * rs) x.drawImage(src, 0, v, w, 4 * rs, Math.sin(t + v * 0.05) * 2 * rs, v, w, 4 * rs); }
      if (rt.priestessSigns) { // l'œil fermé barré sur les murs
        x.strokeStyle = 'rgba(160,90,255,0.55)'; x.lineWidth = rs;
        var sr = YN.rng.make(rt.seed + 99);
        for (var e = 0; e < 5; e++) {
          var cx = sr.int(20, w - 20), cy = sr.int(20, h - 20);
          x.beginPath(); x.ellipse(cx, cy, 7 * rs, 3 * rs, 0, 0, Math.PI); x.stroke();
          x.beginPath(); x.moveTo(cx - 9 * rs, cy + 4 * rs); x.lineTo(cx + 9 * rs, cy - 4 * rs); x.stroke();
        }
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
