/* =========================================================================
 *  TERRAIN PAR BLOCS (8×8 cases) — rendu illustré haute définition.
 *  - sols superposés avec bords organiques (nature) ou nets (intérieur)
 *  - eau : berge humide, dégradé de profondeur, écume, nénuphars ;
 *    les reflets animés sont ajoutés à chaque image par le moteur
 *  - trous, bords de vide (falaises)
 *  - murs et haies en relief : dessus + face, une bande par rangée pour
 *    que la joueuse passe derrière ; ombres de contact et ombres portées
 *  Les blocs sont mis en cache (LRU) et reconstruits si une case change.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;
  var CS = 8, M = 3, uidN = 0;

  function mk(w, h) { return P.mk(w, h); }
  function smoothstep(a, b, v) { var t = U.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  var T = YN.terrain = {
    CS: CS, cache: {}, order: [], max: 220, tpx: 64,
    uid: function (rt) { if (!rt._uid) rt._uid = ++uidN; return rt._uid; },
    key: function (rt, cx, cy) { return T.uid(rt) + ':' + T.tpx + ':' + cx + ',' + cy; },
    clear: function () { T.cache = {}; T.order = []; },
    invalidate: function (rt, x, y) {
      var cx = Math.floor(x / CS), cy = Math.floor(y / CS);
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var c = T.cache[T.key(rt, cx + dx, cy + dy)]; if (c) c.stale = true; }
    },
    get: function (rt, cx, cy, allowBuild) {
      var k = T.key(rt, cx, cy), c = T.cache[k];
      if (c && !c.stale) return c;
      if (!allowBuild) return c || null;
      try { c = (rt.view === 'side') ? T.buildSide(rt, cx, cy) : T.build(rt, cx, cy); }
      catch (e) { YN.warn('terrain ' + rt.id + ' ' + cx + ',' + cy + ': ' + (e.stack || e)); c = { ground: mk(4, 4).c, strips: [], water: null, failed: true }; }
      if (P.PIX && !c.failed) {
        P.crisp(c.ground, { thr: 128, quant: false });
        c.strips.forEach(function (sp) { P.crisp(sp.c, { thr: 128, quant: false }); });
        if (c.water) P.binarize(c.water, 128);
      }
      if (!c.failed && P.toGpu) { c.ground = P.toGpu(c.ground); c.strips.forEach(function (sp) { sp.c = P.toGpu(sp.c); }); if (c.water) c.water = P.toGpu(c.water); }
      if (!T.cache[k]) T.order.push(k);
      T.cache[k] = c;
      while (T.order.length > T.max) { var old = T.order.shift(); delete T.cache[old]; }
      return c;
    },

    cls: function (ch) {
      var i = YN.tileInfo(ch);
      if (i.void) return 'void';
      if (i.pit) return 'pit';
      if (i.water || i.kind === 'shallow' || i.lily) return 'water';
      if (i.wall) return 'wall';
      return 'ground';
    },
    groundKind: function (rt, ch) {
      var i = YN.tileInfo(ch);
      if (i.tall || i.obj || i.invis || i.wall || i.water || i.kind === 'shallow' || i.lily || i.pit || i.void) return YN.tileInfo(rt.underTile || '.').kind;
      return i.kind;
    },
    mat: function (rt, kind) { return YN.tiles.material(rt.look, kind) || { p: 'flat', c: ['#444'] }; },

    /* masque doux : rectangle du monde [X0, X0+tw) × [Y0, Y0+th) ; I(tx,ty) indicateur */
    mask: function (I0, X0, Y0, tw, th, tpx, mode, seed) {
      // l'indicateur ne dépend que de la case : on le calcule une fois par case (au lieu de milliers de fois)
      var bx0 = Math.floor(X0) - 3, by0 = Math.floor(Y0) - 3, bw = Math.ceil(tw) + 7, bh = Math.ceil(th) + 7, memo = new Float32Array(bw * bh).fill(-1);
      var I = function (tx, ty) { var ix0 = tx - bx0, iy0 = ty - by0; if (ix0 < 0 || iy0 < 0 || ix0 >= bw || iy0 >= bh) return I0(tx, ty); var k0 = iy0 * bw + ix0, v0 = memo[k0]; if (v0 < 0) { v0 = I0(tx, ty); memo[k0] = v0; } return v0; };
      var W = tw * tpx, H = th * tpx, res = P.PIX ? 0.5 : (mode === 'hard' ? 0.5 : 0.34);
      var mw = Math.ceil(W * res), mh = Math.ceil(H * res), sx = tw / mw, sy = th / mh;
      var t = mk(mw, mh), img = t.x.createImageData(mw, mh), d = img.data, any = false, all = true;
      var e = mode === 'organic' ? 0.11 : mode === 'rounded' ? 0.06 : 0.02;
      for (var j = 0; j < mh; j++) for (var i = 0; i < mw; i++) {
        var wx = X0 + (i + 0.5) * sx, wy = Y0 + (j + 0.5) * sy, v;
        if (mode === 'hard') v = I(Math.floor(wx), Math.floor(wy));
        else {
          if (mode === 'organic') { var ox = (YN.rng.noise2(wx * 1.7, wy * 1.7, seed) - 0.5) * 0.42, oy = (YN.rng.noise2(wx * 1.7 + 31, wy * 1.7, seed + 5) - 0.5) * 0.42; wx += ox; wy += oy; }
          var gx = wx - 0.5, gy = wy - 0.5, ix = Math.floor(gx), iy = Math.floor(gy), fx = U.smooth(gx - ix), fy = U.smooth(gy - iy);
          var a = I(ix, iy), b = I(ix + 1, iy), c = I(ix, iy + 1), dd = I(ix + 1, iy + 1);
          v = smoothstep(0.5 - e, 0.5 + e, (a + (b - a) * fx) * (1 - fy) + (c + (dd - c) * fx) * fy);
        }
        if (v > 0.01) any = true; if (v < 0.99) all = false;
        var k = (j * mw + i) * 4; d[k] = d[k + 1] = d[k + 2] = 255; d[k + 3] = v * 255;
      }
      if (!any) return null;
      t.x.putImageData(img, 0, 0);
      var out = mk(W, H); out.x.imageSmoothingEnabled = mode !== 'hard'; out.x.imageSmoothingQuality = 'high';
      out.x.drawImage(t.c, 0, 0, W, H);
      if (P.PIX && mode !== 'hard') P.binarize(out.c, 128);
      out.all = all;
      return out;
    },
    paintMasked: function (dst, area, mat, mask, dx, dy) {
      var W = area.w * area.tpx, H = area.h * area.tpx, tmp = mk(W, H);
      var fn = P.MAT[mat.p] || P.MAT.flat;
      try { fn(tmp.x, area, mat.c || ['#444'], mat); } catch (e) { tmp.x.fillStyle = '#f0f'; tmp.x.fillRect(0, 0, W, H); YN.warn('material ' + mat.p + ': ' + e); }
      if (mask && !mask.all) { tmp.x.globalCompositeOperation = 'destination-in'; tmp.x.drawImage(mask.c, dx || 0, dy || 0); if (P.PIX && mat.edgeLine !== false) P.edgeDarken(tmp.c, 0.22); }
      dst.drawImage(tmp.c, 0, 0);
    },
    tint: function (maskCanvas, color) { var t = mk(maskCanvas.width, maskCanvas.height); t.x.drawImage(maskCanvas, 0, 0); t.x.globalCompositeOperation = 'source-in'; t.x.fillStyle = color; t.x.fillRect(0, 0, t.c.width, t.c.height); return t.c; },
    blurTint: function (dst, maskCanvas, color, alpha, blur, dx, dy, op) {
      if (P.PIX) { dst.save(); dst.globalAlpha = Math.min(0.45, alpha); if (op) dst.globalCompositeOperation = op; dst.drawImage(T.tint(maskCanvas, color), Math.round(dx || 0), Math.round(dy || 0)); dst.restore(); return; }
      dst.save(); dst.globalAlpha = alpha; if (op) dst.globalCompositeOperation = op; dst.filter = 'blur(' + Math.max(0.5, blur) + 'px)';
      dst.drawImage(T.tint(maskCanvas, color), dx || 0, dy || 0); dst.restore();
    },

    /* ================= BLOC VUE DE DESSUS ================= */
    build: function (rt, cx, cy) {
      var tpx = T.tpx, W = CS * tpx, x0 = cx * CS, y0 = cy * CS, seed = (rt.seed & 0xffff) || 7;
      var area = { wx0: x0, wy0: y0, w: CS, h: CS, tpx: tpx, seed: seed };
      // grille locale avec marges
      var gw = CS + 2 * M, gch = [], gcl = [], gkd = [];
      var kinds = {}, has = {}, wallKinds = {};
      for (var ly = 0; ly < gw; ly++) {
        gch.push([]); gcl.push([]); gkd.push([]);
        for (var lx = 0; lx < gw; lx++) {
          var ch = rt.tile(x0 + lx - M, y0 + ly - M), cl = T.cls(ch), gk = T.groundKind(rt, ch);
          gch[ly].push(ch); gcl[ly].push(cl); gkd[ly].push(gk);
          if (lx >= M - 1 && ly >= M - 1 && lx <= CS + M && ly <= CS + M) {
            if (cl !== 'void') kinds[gk] = true;
            has[cl] = true;
            if (cl === 'wall') wallKinds[YN.tileInfo(ch).kind] = true;
          }
        }
      }
      var at = function (arr, tx, ty) { var lx = tx - x0 + M, ly = ty - y0 + M; if (lx < 0 || ly < 0 || lx >= gw || ly >= gw) return null; return arr[ly][lx]; };
      var ind = function (fn) { return function (tx, ty) { return fn(tx, ty) ? 1 : 0; }; };
      var G = mk(W, W), gx = G.x;
      var chunk = { cx: cx, cy: cy, ground: G.c, strips: [], water: null, tpx: tpx };

      // ---- 1. sol de base puis autres sols, par priorité ----
      var order = U.keys(kinds).sort(function (a, b) { return (P.PRIORITY[a] === undefined ? 4 : P.PRIORITY[a]) - (P.PRIORITY[b] === undefined ? 4 : P.PRIORITY[b]); });
      var baseKind = kinds.floor ? 'floor' : (order[0] || 'floor');
      T.paintMasked(gx, area, T.mat(rt, baseKind), null);
      order.forEach(function (k) {
        if (k === baseKind) return;
        var mat = T.mat(rt, k), mode = mat.edge || P.EDGE[mat.p] || 'hard';
        var m = T.mask(ind(function (tx, ty) { return at(gcl, tx, ty) !== 'void' && at(gkd, tx, ty) === k; }), x0, y0, CS, CS, tpx, mode, seed + k.length * 13);
        if (!m) return;
        if (mode !== 'hard') T.blurTint(gx, m.c, '#000000', 0.18, tpx / 22, tpx * 0.02, tpx * 0.05);
        T.paintMasked(gx, area, mat, m);
      });
      // ---- 2. eau ----
      if (has.water) T.water(rt, chunk, gx, area, at, gch, gcl, seed);
      // ---- 3. trous ----
      if (has.pit) {
        var pm = T.mask(ind(function (tx, ty) { return at(gcl, tx, ty) === 'pit'; }), x0, y0, CS, CS, tpx, 'rounded', seed + 99);
        if (pm && P.PIX) {
          var hole2 = mk(W, W); hole2.x.drawImage(pm.c, 0, 0); hole2.x.globalCompositeOperation = 'source-in'; hole2.x.fillStyle = '#05040a'; hole2.x.fillRect(0, 0, W, W);
          hole2.x.globalCompositeOperation = 'source-atop'; hole2.x.drawImage(T.tint(pm.c, '#2a2238'), 0, -Math.round(tpx * 0.3)); hole2.x.drawImage(T.tint(pm.c, '#05040a'), 0, -Math.round(tpx * 0.15) + 2);
          gx.drawImage(hole2.c, 0, 0);
        } else if (pm) {
          var hole = mk(W, W); hole.x.drawImage(pm.c, 0, 0); hole.x.globalCompositeOperation = 'source-in';
          hole.x.fillStyle = '#040308'; hole.x.fillRect(0, 0, W, W);
          hole.x.globalCompositeOperation = 'source-atop'; hole.x.globalAlpha = 0.7; hole.x.filter = 'blur(' + (tpx / 7) + 'px)';
          hole.x.drawImage(T.tint(pm.c, '#3a3050'), 0, -tpx * 0.3);
          gx.drawImage(hole.c, 0, 0);
        }
      }
      // ---- 4. vide : découpe + falaises ----
      if (has.void) {
        var vEdge = rt.def.voidEdge || rt.style.voidEdge || (rt.style.tallWalls ? 'hard' : 'rounded');
        var vm = T.mask(ind(function (tx, ty) { return at(gcl, tx, ty) === 'void'; }), x0, y0, CS, CS, tpx, vEdge, seed + 7);
        var sm = T.mask(ind(function (tx, ty) { var c2 = at(gcl, tx, ty); return c2 !== null && c2 !== 'void'; }), x0, y0 - 1, CS, CS + 1, tpx, vEdge, seed + 7);
        if (vm) {
          gx.globalCompositeOperation = 'destination-out'; gx.drawImage(vm.c, 0, 0); gx.globalCompositeOperation = 'source-over';
          if (sm && rt.style.cliffH !== 0 && !(rt.style.tallWalls && rt.style.cliffH === undefined)) {
            var drop = Math.round(tpx * (rt.style.cliffH || 0.45)), cl2 = mk(W, W + tpx);
            cl2.x.drawImage(sm.c, 0, 0);
            var done = 1; while (done < drop) { var s = Math.min(done, drop - done); cl2.x.drawImage(cl2.c, 0, s); done += s; }
            cl2.x.globalCompositeOperation = 'destination-out'; cl2.x.drawImage(sm.c, 0, 0);
            cl2.x.globalCompositeOperation = 'source-in';
            var baseC = (T.mat(rt, baseKind).c || ['#444'])[0], cc = rt.style.cliff || P.sh(baseC, -0.5);
            if (P.PIX) { cl2.x.fillStyle = cc; cl2.x.fillRect(0, 0, W, W + tpx); }
            else { var cg = cl2.x.createLinearGradient(0, 0, 0, W + tpx); cg.addColorStop(0, cc); cg.addColorStop(1, P.sh(cc, -0.3)); cl2.x.fillStyle = cg; cl2.x.fillRect(0, 0, W, W + tpx); }
            gx.drawImage(cl2.c, 0, -tpx);
          }
        }
      }
      // ---- 5. murs ----
      U.keys(wallKinds).forEach(function (wk) { T.walls(rt, chunk, gx, area, at, gch, gcl, wk, seed); });
      return chunk;
    },

    /* ---------- l'eau ---------- */
    water: function (rt, chunk, gx, area, at, gch, gcl, seed) {
      if (P.PIX) return T.waterPix(rt, chunk, gx, area, at, gch, gcl, seed);
      var tpx = area.tpx, W = CS * tpx, x0 = area.wx0, y0 = area.wy0;
      var isW = function (tx, ty) { var c = at(gcl, tx, ty); if (c === 'water') return 1; if (c === 'pit') { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (at(gcl, tx + dx, ty + dy) === 'water') return 1; } return 0; };
      var wm = T.mask(isW, x0, y0, CS, CS, tpx, 'organic', seed + 21);
      if (!wm) return;
      var mat = T.mat(rt, 'water'), c = mat.c || ['#2f6aa8', '#2a5e96', '#4c8ac4', '#8fc0ea'];
      var mid = c[0], deep = c[1] || P.sh(c[0], -0.25), light = c[2] || P.sh(c[0], 0.2), foam = c[3] || '#cfe6f8';
      T.blurTint(gx, wm.c, '#1e180e', 0.5, tpx * 0.14, 0, 0);
      var body = mk(W, W), bx = body.x;
      bx.drawImage(wm.c, 0, 0); bx.globalCompositeOperation = 'source-in'; bx.fillStyle = light; bx.fillRect(0, 0, W, W);
      bx.globalCompositeOperation = 'source-atop';
      // profondeur : on érode le masque par flou + seuil
      // profondeur calculée avec une marge de 2 cases (pas de couture entre blocs)
      var isWX = function (tx, ty) { var c = rt.tile(tx, ty), ci = T.cls(c); if (ci === 'water') return 1; return 0; };
      var dm = T.mask(function (tx, ty) { var n = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) n += isWX(tx + dx, ty + dy); return n >= 8 ? 1 : 0; }, x0 - 2, y0 - 2, CS + 4, CS + 4, tpx, 'organic', seed + 22);
      if (dm) { bx.save(); bx.filter = 'blur(' + (tpx * 0.35) + 'px)'; bx.drawImage(T.tint(dm.c, mid), -2 * tpx, -2 * tpx); bx.restore(); }
      var dm2 = T.mask(function (tx, ty) { var n = 0; for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) n += isWX(tx + dx, ty + dy); return n >= 24 ? 1 : 0; }, x0 - 2, y0 - 2, CS + 4, CS + 4, tpx, 'organic', seed + 24);
      if (dm2) { bx.save(); bx.filter = 'blur(' + (tpx * 0.6) + 'px)'; bx.drawImage(T.tint(dm2.c, deep), -2 * tpx, -2 * tpx); bx.restore(); }
      var shm = T.mask(function (tx, ty) { var ch = at(gch, tx, ty); return ch && YN.tileInfo(ch).kind === 'shallow' ? 1 : 0; }, x0, y0, CS, CS, tpx, 'organic', seed + 23);
      if (shm) { bx.globalAlpha = 0.5; bx.drawImage(T.tint(shm.c, P.sh(light, 0.2)), 0, 0); bx.globalAlpha = 1; }
      bx.strokeStyle = 'rgba(255,255,255,0.14)'; bx.lineWidth = Math.max(1, tpx / 40); bx.lineCap = 'round';
      P.eachTile(area, 0, function (tx, ty, px, py, r) { if (r.chance(0.55)) { var sx = px + r.next() * tpx, sy = py + r.next() * tpx, l = tpx * (0.15 + r.next() * 0.25); bx.beginPath(); bx.moveTo(sx, sy); bx.quadraticCurveTo(sx + l / 2, sy - tpx * 0.04, sx + l, sy); bx.stroke(); } });
      // écume le long de la berge
      var wmUp = T.mask(isW, x0, y0 - 1, CS, CS + 1, tpx, 'organic', seed + 21);
      var edge = mk(W, W); edge.x.drawImage(wm.c, 0, 0); edge.x.globalCompositeOperation = 'destination-out'; edge.x.filter = 'blur(' + (tpx * 0.04) + 'px)';
      if (wmUp) edge.x.drawImage(wmUp.c, 0, -tpx + tpx * 0.07); else edge.x.drawImage(wm.c, 0, tpx * 0.07);
      edge.x.filter = 'none'; edge.x.globalCompositeOperation = 'source-in'; edge.x.fillStyle = P.rgba(foam, 0.7); edge.x.fillRect(0, 0, W, W);
      bx.globalCompositeOperation = 'source-over'; bx.drawImage(edge.c, 0, 0);
      gx.drawImage(body.c, 0, 0);
      // nénuphars
      for (var ty = y0; ty < y0 + CS; ty++) for (var tx = x0; tx < x0 + CS; tx++) {
        var ch2 = at(gch, tx, ty); if (!ch2 || !YN.tileInfo(ch2).lily) continue;
        var cxp = (tx - x0 + 0.5) * tpx, cyp = (ty - y0 + 0.5) * tpx, r2 = P.rng(tx, ty, 4), rr = tpx * 0.38;
        P.ellipse(gx, cxp + rr * 0.1, cyp + rr * 0.2, rr * 1.02, rr * 0.8, 'rgba(10,30,40,0.35)');
        gx.save(); gx.translate(cxp, cyp); gx.rotate(r2.next() * 6.28);
        var lg = gx.createRadialGradient(-rr * 0.3, -rr * 0.3, 0, 0, 0, rr); lg.addColorStop(0, '#74c878'); lg.addColorStop(1, '#2f7a3c');
        gx.beginPath(); gx.moveTo(0, 0); gx.arc(0, 0, rr, 0.35, Math.PI * 2 - 0.05); gx.closePath(); gx.fillStyle = lg; gx.fill();
        gx.strokeStyle = 'rgba(20,60,30,0.5)'; gx.lineWidth = Math.max(1, tpx / 50);
        for (var v = 0; v < 6; v++) { var an = 0.45 + v * 1.0; gx.beginPath(); gx.moveTo(0, 0); gx.lineTo(Math.cos(an) * rr * 0.9, Math.sin(an) * rr * 0.9); gx.stroke(); }
        gx.restore();
        if (r2.chance(0.6)) P.flower(gx, cxp + rr * 0.2, cyp - rr * 0.1, tpx * 0.1, '#f4b8d0', '#f8e070');
      }
      chunk.water = wm.c;
    },

    /* ---------- l'eau, en pixel art ---------- */
    waterPix: function (rt, chunk, gx, area, at, gch, gcl, seed) {
      var tpx = area.tpx, W = CS * tpx, x0 = area.wx0, y0 = area.wy0, H = P.pxhash, rgb = P.pxrgb, sh = P.pxsh;
      var isW = function (tx, ty) { var c = at(gcl, tx, ty); if (c === 'water') return 1; if (c === 'pit') { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (at(gcl, tx + dx, ty + dy) === 'water') return 1; } return 0; };
      var wm = T.mask(isW, x0, y0, CS, CS, tpx, 'organic', seed + 21); if (!wm) return;
      var mat = T.mat(rt, 'water'), c = mat.c || ['#2f6aa8', '#2a5e96', '#4c8ac4', '#8fc0ea'];
      var mid = rgb(c[0]), deep = rgb(c[1] || '#25508a'), light = rgb(c[2] || '#4c8ac4'), foam = rgb(c[3] || '#cfe6f8');
      // berge humide : deux pixels sombres au-dessus de l'eau
      gx.save(); gx.globalAlpha = 0.55; gx.drawImage(T.tint(wm.c, '#1e180e'), 0, -2); gx.restore();
      var isWX = function (tx, ty) { return T.cls(rt.tile(tx, ty)) === 'water' ? 1 : 0; };
      var dm = T.mask(function (tx, ty) { var n = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) n += isWX(tx + dx, ty + dy); return n >= 8 ? 1 : 0; }, x0, y0, CS, CS, tpx, 'organic', seed + 22);
      var dm2 = T.mask(function (tx, ty) { var n = 0; for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) n += isWX(tx + dx, ty + dy); return n >= 24 ? 1 : 0; }, x0, y0, CS, CS, tpx, 'organic', seed + 24);
      var shm = T.mask(function (tx, ty) { var ch = at(gch, tx, ty); return ch && YN.tileInfo(ch).kind === 'shallow' ? 1 : 0; }, x0, y0, CS, CS, tpx, 'organic', seed + 23);
      var get = function (m) { return m ? m.x.getImageData(0, 0, W, W).data : null; };
      var dW = get(wm), d1 = get(dm), d2 = get(dm2), dS = get(shm);
      var out = mk(W, W), img = out.x.createImageData(W, W), o = img.data, glints = [];
      var inW = function (px, py) { return px >= 0 && py >= 0 && px < W && py < W ? dW[(py * W + px) * 4 + 3] > 127 : true; };
      for (var py = 0; py < W; py++) for (var px = 0; px < W; px++) {
        var k = (py * W + px) * 4; if (dW[k + 3] < 128) continue;
        var col = light;
        if (d1 && d1[k + 3] > 127) col = mid;
        if (d2 && d2[k + 3] > 127) col = deep;
        if (dS && dS[k + 3] > 127) col = sh(light, 0.12);
        var wx = x0 * tpx + px, wy = y0 * tpx + py;
        if (!inW(px, py - 1)) col = foam; else if (!inW(px, py - 2)) col = sh(light, 0.25);
        else if (!inW(px - 1, py) || !inW(px + 1, py)) col = sh(light, 0.1);
        else if ((wy % 5) === 0 && H(Math.floor(wx / 6), Math.floor(wy / 5), seed) < 0.16) col = sh(col, 0.18);
        o[k] = col[0]; o[k + 1] = col[1]; o[k + 2] = col[2]; o[k + 3] = 255;
        if ((px % 7) === 3 && (py % 9) === 4 && H(wx, wy, seed + 5) < 0.35 && col !== foam) glints.push([px, py]);
      }
      out.x.putImageData(img, 0, 0);
      gx.drawImage(out.c, 0, 0);
      // nénuphars
      for (var ty = y0; ty < y0 + CS; ty++) for (var tx = x0; tx < x0 + CS; tx++) {
        var ch2 = at(gch, tx, ty); if (!ch2 || !YN.tileInfo(ch2).lily) continue;
        var cxp = (tx - x0) * tpx + tpx / 2, cyp = (ty - y0) * tpx + tpx / 2, r2 = P.rng(tx, ty, 4), R = Math.round(tpx * 0.36), notch = r2.next() * 6.28;
        for (var yy = -R; yy <= R; yy++) for (var xx = -R; xx <= R; xx++) {
          var dd = xx * xx + yy * yy; if (dd > R * R) continue;
          var an = Math.atan2(yy, xx), da = Math.abs(((an - notch + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (da < 0.35 && dd > 2) continue;
          gx.fillStyle = dd > (R - 1) * (R - 1) ? '#1f5a2c' : (xx + yy < -R * 0.4 ? '#7ac87a' : '#4a9a50');
          gx.fillRect(Math.round(cxp + xx), Math.round(cyp + yy * 0.8), 1, 1);
        }
        if (r2.chance(0.6)) { gx.fillStyle = '#f4b8d0'; gx.fillRect(cxp - 1, cyp - 2, 3, 2); gx.fillRect(cxp, cyp - 3, 1, 1); gx.fillStyle = '#f8e070'; gx.fillRect(cxp, cyp - 2, 1, 1); }
      }
      chunk.water = wm.c; chunk.glints = glints;
    },

    /* ---------- murs en relief ---------- */
    WALLH: { hedge: 0.62, brick: 0.7, stone: 0.55, panel: 1.1, wallpaper: 1.25, concrete: 0.9, glass: 1.0, paper: 0.9, flat: 0.8, board: 1.0, mirror: 1.0, rock: 0.5, flesh: 0.6, cloud: 0.4, metal: 0.9, wood: 0.8 },
    walls: function (rt, chunk, gx, area, at, gch, gcl, wk, seed) {
      var tpx = area.tpx, W = CS * tpx, x0 = area.wx0, y0 = area.wy0;
      var mat = T.mat(rt, wk), pat = mat.p || 'brick';
      var isWall = function (tx, ty) { var ch = at(gch, tx, ty); if (!ch) return 0; var inf = YN.tileInfo(ch); return inf.wall && inf.kind === wk ? 1 : 0; };
      var anyWall = function (tx, ty) { var ch = at(gch, tx, ty); return !!ch && !!YN.tileInfo(ch).wall; };
      var mode = mat.edge || (pat === 'hedge' || pat === 'rock' || pat === 'flesh' || pat === 'cloud' ? 'organic' : pat === 'stone' ? 'rounded' : 'hard');
      // masque étendu : une case au-dessus et à gauche (ombres qui débordent)
      var em = T.mask(isWall, x0 - 1, y0 - 1, CS + 1, CS + 1, tpx, mode, seed + 41 + wk.length);
      if (!em) return;
      var wfm = rt.look && rt.look.wallface, interior = !!(rt.style.tallWalls || pat === 'wallpaper' || pat === 'panel' || (wfm && (wfm.p === 'wallpaper' || wfm.p === 'panel')));
      // en plein air, les murs de brique, de pierre ou de béton sont des immeubles : façade haute et fenêtres
      var building = T.isBuilding(rt, mat, pat, interior);
      var H = mat.h !== undefined ? mat.h : (rt.style.wallH !== undefined ? rt.style.wallH : (rt.style.tallWalls ? 1.3 : building ? 1.5 : (T.WALLH[pat] || 0.7)));
      var skirt = (wfm && wfm.skirt) || mat.skirt || (rt.look && rt.look.floor && rt.look.floor.p === 'wood' ? P.sh(rt.look.floor.c[1] || '#6a4a30', -0.25) : '#e8e4dc');
      var Hp = Math.round(H * tpx), EW = (CS + 1) * tpx;
      // ombre portée douce (lumière venant d'en haut à gauche)
      T.blurTint(gx, em.c, '#0a0614', 0.26, tpx * 0.18, -tpx + tpx * 0.22, -tpx + tpx * 0.3);
      var top = building ? T.roof(rt, area, mat) : T.paintWall(rt, area, mat, 'top'), face = T.paintWall(rt, area, mat, 'face', H);
      var emd = em.x.getImageData(0, 0, EW, EW).data;
      // le sol sous les murs prend la couleur du dessus : aucun jour entre deux rangées
      var gt = mk(W, W); gt.x.drawImage(top.c, 0, 0); gt.x.globalCompositeOperation = 'destination-in'; gt.x.drawImage(em.c, -tpx, -tpx); gx.drawImage(gt.c, 0, 0);
      for (var r = -1; r < CS; r++) {
        var row = y0 + r, hasRow = false;
        for (var tx = x0 - 1; tx <= x0 + CS; tx++) if (isWall(tx, row)) { hasRow = true; break; }
        if (!hasRow) continue;
        var SH = tpx + Hp + 2, bandY = (r + 1) * tpx; // dans le masque étendu
        var fm = mk(W, SH), fmi = fm.x.createImageData(W, SH), fd = fmi.data, faceAny = false;
        var xm = mk(W, SH), xmi = xm.x.createImageData(W, SH), xd = xmi.data, extAny = false;
        for (var px = 0; px < W; px++) {
          var ti = x0 + Math.floor(px / tpx);
          if (!isWall(ti, row) && !isWall(ti - 1, row) && !isWall(ti + 1, row)) continue;
          if (anyWall(ti, row + 1)) continue;
          var ybot = -1, ex = px + tpx;
          for (var yy = tpx - 1; yy >= 0; yy--) if (emd[((bandY + yy) * EW + ex) * 4 + 3] > 128) { ybot = yy; break; }
          if (ybot < 0) continue;
          var below = at(gcl, ti, row + 1);
          if (below === 'void' || below === null) {
            // bord du monde : mur à plat (pas soulevé, pas de face) — on retire la colonne de la bande
            for (var ey = 0; ey < SH; ey++) { var k2 = (ey * W + px) * 4; xd[k2] = xd[k2 + 1] = xd[k2 + 2] = 255; xd[k2 + 3] = 255; }
            extAny = true; continue;
          }
          for (var fy = ybot; fy < Math.min(SH, ybot + Hp); fy++) { var k = (fy * W + px) * 4; fd[k] = fd[k + 1] = fd[k + 2] = 255; fd[k + 3] = 255; }
          faceAny = true;
        }
        if (faceAny) fm.x.putImageData(fmi, 0, 0);
        if (extAny) xm.x.putImageData(xmi, 0, 0);
        // ombre de contact au pied du mur (sur le sol de ce bloc)
        if (faceAny) T.blurTint(gx, fm.c, '#05030a', 0.5, tpx * 0.1, 0, (row - y0) * tpx - Hp + tpx * 0.14);
        if (r < 0) continue; // la rangée du dessus n'appartient pas à ce bloc
        var strip = mk(W, SH), sx = strip.x;
        if (faceAny) {
          var fc = mk(W, SH); fc.x.drawImage(face.c, 0, U.mod(r * tpx, face.c.height - SH), W, SH, 0, 0, W, SH);
          fc.x.globalCompositeOperation = 'destination-in'; fc.x.drawImage(fm.c, 0, 0);
          fc.x.globalCompositeOperation = 'source-atop';
          if (P.PIX) { fc.x.fillStyle = 'rgba(0,0,0,0.22)'; fc.x.fillRect(0, tpx - 1 + Math.round(Hp * 0.78), W, SH); fc.x.fillStyle = 'rgba(0,0,0,0.16)'; fc.x.fillRect(0, tpx - 1 + Math.round(Hp * 0.9), W, SH); fc.x.fillStyle = 'rgba(255,255,255,0.12)'; fc.x.fillRect(0, tpx - 1, W, 1); }
          else { var sg = fc.x.createLinearGradient(0, tpx * 0.7, 0, SH); sg.addColorStop(0, 'rgba(255,255,255,0.1)'); sg.addColorStop(0.65, 'rgba(0,0,0,0.1)'); sg.addColorStop(1, 'rgba(0,0,0,0.42)');
          fc.x.fillStyle = sg; fc.x.fillRect(0, 0, W, SH); }
          if (building) T.windows(fc.x, rt, x0, row, W, tpx, Hp, seed);
          if (interior) {
            // plinthe en bas, moulure en haut
            var bb = Math.max(3, Math.round(tpx * 0.14)), ybase = tpx - 1 + Hp - bb;
            fc.x.fillStyle = skirt; fc.x.fillRect(0, ybase, W, bb); fc.x.fillStyle = P.sh(skirt, 0.2); fc.x.fillRect(0, ybase, W, 1); fc.x.fillStyle = P.sh(skirt, -0.3); fc.x.fillRect(0, ybase + bb - 1, W, 1);
            fc.x.fillStyle = 'rgba(0,0,0,0.25)'; fc.x.fillRect(0, ybase - Math.max(1, tpx / 40), W, Math.max(1, tpx / 40));
            fc.x.fillStyle = P.rgba(P.sh(skirt, 0.1), 0.8); fc.x.fillRect(0, tpx - 1, W, Math.max(2, tpx * 0.05));
            fc.x.fillStyle = 'rgba(0,0,0,0.18)'; fc.x.fillRect(0, tpx - 1 + Math.max(2, tpx * 0.05), W, Math.max(1, tpx / 30));
          }
          sx.drawImage(fc.c, 0, 0);
        }

        var tp = mk(W, tpx); tp.x.drawImage(top.c, 0, r * tpx, W, tpx, 0, 0, W, tpx);
        tp.x.globalCompositeOperation = 'destination-in'; tp.x.drawImage(em.c, tpx, bandY, W, tpx, 0, 0, W, tpx);
        var lip = mk(W, tpx); lip.x.drawImage(em.c, tpx, bandY, W, tpx, 0, 0, W, tpx); lip.x.globalCompositeOperation = 'source-in'; lip.x.fillStyle = mat.lip || 'rgba(255,250,235,0.32)'; lip.x.fillRect(0, 0, W, tpx);
        sx.drawImage(lip.c, 0, Math.max(1, tpx / 30));
        sx.drawImage(tp.c, 0, 0);
        if (extAny) { sx.save(); sx.globalCompositeOperation = 'destination-out'; sx.drawImage(xm.c, 0, 0); sx.restore(); }
        // dessus : légère ombre intérieure en haut (épaisseur)
        if (!P.PIX) { sx.save(); sx.globalCompositeOperation = 'source-atop'; var ig = sx.createLinearGradient(0, 0, 0, tpx); ig.addColorStop(0, 'rgba(0,0,0,0.12)'); ig.addColorStop(0.3, 'rgba(0,0,0,0)'); sx.fillStyle = ig; sx.fillRect(0, 0, W, tpx); sx.restore(); }
        chunk.strips.push({ row: row, c: strip.c, oy: -H });
      }
    },
    isBuilding: function (rt, mat, pat, interior) {
      if (rt.style.buildings === false || interior || mat.noBuilding) return false;
      if (rt.style.buildings) return true;
      if (!rt.def.outdoor || !P.PIX) return false;
      if (!(pat === 'brick' || pat === 'concrete' || pat === 'stone' || pat === 'metal' || pat === 'glass')) return false;
      var th = rt.furnishTheme || (YN.furnish ? YN.furnish.themeOf(rt.def) : '');
      return th === 'city' || th === 'north' || th === 'korea' || th === 'office' || th === 'institution';
    },
    /* toit d'immeuble : sombre, en dalles, quelques équipements */
    roof: function (rt, area, mat) {
      var tpx = area.tpx, W = CS * tpx, t = mk(W, W), x = t.x, c = mat.c || ['#6a6a78', '#5a5a66', '#48485a'];
      var b = new P.PixBuf(x, { wx0: area.wx0, wy0: area.wy0, w: CS, h: CS, tpx: tpx, seed: area.seed + 11 });
      var base = P.pxsh(P.pxrgb(mat.topColor || c[2] || c[0]), -0.42), line = P.pxsh(base, -0.25), hi = P.pxsh(base, 0.1);
      b.each(function (px, py, gx, gy) { var ix = ((gx % tpx) + tpx) % tpx, iy = ((gy % tpx) + tpx) % tpx; b.px(px, py, (ix === 0 || iy === 0) ? line : (P.pxhash(gx >> 1, gy >> 1, 5) < 0.04 ? hi : base)); });
      // un muret d'une case de large garde sa pierre : ce n'est pas un toit
      var isW = function (tx, ty) { var ch = rt.tile(tx, ty); return !!ch && !!YN.tileInfo(ch).wall; };
      var stoneC = P.pxrgb(c[0]), stoneD = P.pxsh(stoneC, -0.3), stoneL = P.pxsh(stoneC, 0.12);
      b.tiles(function (px, py, tx, ty) {
        if (!isW(tx, ty) || (isW(tx - 1, ty) || isW(tx + 1, ty)) && (isW(tx, ty - 1) || isW(tx, ty + 1))) return;
        for (var yy = 0; yy < tpx; yy++) for (var xx = 0; xx < tpx; xx++) { var gx = Math.round(tx * tpx) + xx, gy = Math.round(ty * tpx) + yy, bw = Math.round(tpx / 2), bh = Math.max(4, Math.round(tpx / 4)), row = Math.floor(gy / bh), off = (row & 1) ? Math.round(bw / 2) : 0; var ix2 = ((gx + off) % bw + bw) % bw, iy2 = ((gy % bh) + bh) % bh; b.px(px + xx, py + yy, (ix2 === bw - 1 || iy2 === bh - 1) ? stoneD : iy2 === 0 ? stoneL : stoneC); }
      }, 0);
      b.tiles(function (px, py, tx, ty, r) {
        if (!isW(tx, ty) || !((isW(tx - 1, ty) || isW(tx + 1, ty)) && (isW(tx, ty - 1) || isW(tx, ty + 1)))) return;
        var v = P.pxhash(tx, ty, 77);
        if (v < 0.05) { b.rect(px + 4, py + 4, tpx - 8, tpx - 8, P.pxsh(base, 0.22)); b.rect(px + 5, py + 5, tpx - 10, 2, P.pxsh(base, 0.4)); b.rect(px + 4, py + tpx - 5, tpx - 8, 1, P.pxsh(base, -0.35)); }
        else if (v < 0.08) { b.rect(px + 6, py + 5, tpx - 12, tpx - 10, [70, 86, 96]); b.rect(px + 7, py + 6, tpx - 14, 2, [110, 130, 140]); }
        else if (v < 0.1) { for (var k = 0; k < 3; k++) b.rect(px + 5 + k * 4, py + 7, 2, tpx - 14, P.pxsh(base, -0.3)); }
      }, 0);
      b.put();
      return t;
    },
    /* fenêtres d'une façade (dessinées sur la bande de face d'une rangée de murs) */
    windows: function (x, rt, x0, row, W, tpx, Hp, seed) {
      var night = rt.darkness > 0.45 || /\b(night|dusk|evening)\b/.test(U.norm(rt.def.name || '')), y0 = tpx - 1;
      var ww = Math.max(5, Math.round(tpx * 0.36)), wh = Math.max(6, Math.round(tpx * 0.42)), rows = Math.max(1, Math.floor((Hp - 4) / (wh + 4)));
      x.save(); x.globalCompositeOperation = 'source-atop';
      for (var cx = 0; cx < W; cx += tpx) {
        var tx = x0 + cx / tpx, wl = function (ax, ay) { var ch = rt.tile(ax, ay); return !!ch && !!YN.tileInfo(ch).wall; };
        if (!wl(tx, row) || !(wl(tx - 1, row) || wl(tx + 1, row))) continue; // pas de fenêtre au bout d'un muret
        for (var k = 0; k < rows; k++) {
          var h = P.pxhash(tx, row * 7 + k, seed + 913), wy = y0 + 3 + k * (wh + 4), wx = cx + Math.round((tpx - ww) / 2);
          if (h < 0.12) continue; // un pan de mur aveugle
          var lit = h > (night ? 0.55 : 0.82), warm = P.pxhash(tx, row + k, seed + 5) < 0.7;
          var glass = lit ? (warm ? '#f2d488' : '#a8d0f0') : (night ? '#141a26' : '#2a3442');
          x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(wx - 1, wy - 1, ww + 2, wh + 2);
          x.fillStyle = glass; x.fillRect(wx, wy, ww, wh);
          if (lit) { x.fillStyle = warm ? '#fff0c0' : '#e0f0ff'; x.fillRect(wx + 1, wy + 1, Math.max(1, ww - 3), 1); if (P.pxhash(tx, k, seed + 9) < 0.4) { x.fillStyle = 'rgba(80,40,30,0.55)'; x.fillRect(wx, wy, Math.round(ww / 3), wh); } }
          else { x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(wx + 1, wy + 1, 1, Math.round(wh / 2)); }
          x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(wx - 1, wy + wh + 1, ww + 2, 1);
          if (ww >= 6) { x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(wx + Math.floor(ww / 2), wy, 1, wh); }
        }
      }
      x.restore();
    },
    /* textures de mur : dessus / face */
    paintWall: function (rt, area, mat, part, H) {
      var tpx = area.tpx, W = CS * tpx, extra = Math.round((H || 1) * tpx) + tpx + 2, HH = part === 'face' ? W + extra : W;
      var t = mk(W, HH), x = t.x, c = mat.c || ['#6a6a78', '#5a5a66', '#48485a'], p = mat.p;
      if (part === 'face' && rt.look && rt.look.wallface && !mat.ownFace) { p = rt.look.wallface.p || p; c = rt.look.wallface.c || c; }
      if (P.PIX) {
        var b = new P.PixBuf(x, { wx0: area.wx0, wy0: 0, w: CS, h: HH / tpx, tpx: tpx, seed: area.seed + (part === 'face' ? 3 : 0) });
        if (part === 'top') {
          if (p === 'hedge') P.PXFACE.hedge(b, [P.sh(c[0], 0.12), c[0], c[1], c[1]]);
          else if (p === 'rock') { b.put(); P.MAT.cobble(x, { wx0: area.wx0, wy0: area.wy0, w: CS, h: HH / tpx, tpx: tpx, seed: area.seed }, c); return t; }
          else if (p === 'flesh' || p === 'cloud') { b.put(); P.MAT[p](x, { wx0: area.wx0, wy0: area.wy0, w: CS, h: HH / tpx, tpx: tpx, seed: area.seed }, c); return t; }
          else { var tc = P.pxrgb(mat.topColor || P.sh(c[2] || P.sh(c[0], -0.35), rt.style.tallWalls ? -0.45 : -0.15)); b.fill(tc); if (!rt.style.tallWalls && (p === 'brick' || p === 'stone' || p === 'concrete')) P.PXFACE.stone(b, [P.sh(c[0], 0.08)]); }
        } else (P.PXFACE[p] || P.PXFACE.flat)(b, c);
        b.put();
        return t;
      }
      var c0 = c[0], c1 = c[1] || P.sh(c0, -0.2), c2 = c[2] || P.sh(c0, -0.35);
      var a = { wx0: area.wx0, wy0: area.wy0, w: CS, h: HH / tpx, tpx: tpx, seed: area.seed + (part === 'face' ? 3 : 0) };
      if (part === 'top') {
        if (p === 'hedge') {
          P.MAT.grass(x, a, [P.sh(c0, 0.05), c1, P.sh(c0, 0.3), c2], { sparse: true });
          P.eachTile(a, 1, function (tx, ty, px, py, r) { for (var i = 0; i < 8; i++) P.ball(x, px + r.next() * tpx, py + r.next() * tpx, tpx * 0.13, tpx * 0.11, r.pick([c0, P.sh(c0, 0.2), c1]), { hi: 0.28, lo: -0.3 }); });
        } else if (p === 'rock') P.MAT.cobble(x, a, c);
        else if (p === 'flesh' || p === 'cloud') P.MAT[p](x, a, c);
        else if (mat.topColor || rt.style.tallWalls || p === 'wallpaper' || p === 'panel') { x.fillStyle = mat.topColor || P.sh(c2, -0.45); x.fillRect(0, 0, W, HH); P.blotches(x, a, '#000000', 0.4, a.seed, 0.15); }
        else if (p === 'brick' || p === 'stone' || p === 'concrete') P.MAT.stone(x, a, [P.sh(c0, 0.1), P.sh(c2, -0.2)]);
        else (P.MAT[p] || P.MAT.flat)(x, a, c);
        return t;
      }
      switch (p) {
        case 'hedge':
          x.fillStyle = c1; x.fillRect(0, 0, W, HH);
          P.blotches(x, a, c2, 0.4, a.seed, 0.6);
          P.eachTile(a, 1, function (tx, ty, px, py, r) { for (var i = 0; i < 11; i++) P.ball(x, px + r.next() * tpx, py + r.next() * tpx, tpx * 0.1, tpx * 0.09, r.pick([c1, P.sh(c1, 0.16), c2]), { hi: 0.22, lo: -0.35 }); });
          break;
        case 'brick': {
          x.fillStyle = P.sh(c2, -0.2); x.fillRect(0, 0, W, HH);
          var bh = tpx / 4, bw = tpx / 2;
          for (var row = 0; row * bh < HH + bh; row++) for (var col = -1; col * bw < W + bw; col++) {
            var bx = col * bw + (row % 2) * bw / 2, by = row * bh, sh = (P.cell(col + area.wx0 * 2, row, a.seed) - 0.5) * 0.2;
            var gg = x.createLinearGradient(0, by, 0, by + bh); gg.addColorStop(0, P.sh(c0, sh + 0.08)); gg.addColorStop(1, P.sh(c0, sh - 0.1));
            x.fillStyle = gg; P.rr(x, bx + 1, by + 1, bw - 2, bh - 2, 2); x.fill();
          }
          break; }
        case 'stone': case 'concrete': {
          x.fillStyle = P.sh(c2, -0.25); x.fillRect(0, 0, W, HH);
          var s2 = tpx / 3;
          for (var r2 = 0; r2 * s2 < HH + s2; r2++) for (var k = -1; k < CS * 2 + 2; k++) {
            var w2 = tpx * (0.42 + P.cell(k, r2, a.seed) * 0.4), bx2 = k * tpx * 0.62 + (r2 % 2) * tpx * 0.3, col2 = P.sh(c0, (P.cell(k, r2, 3) - 0.5) * 0.25);
            var g3 = x.createLinearGradient(0, r2 * s2, 0, (r2 + 1) * s2); g3.addColorStop(0, P.sh(col2, 0.1)); g3.addColorStop(1, P.sh(col2, -0.12));
            P.rr(x, bx2 + 2, r2 * s2 + 2, w2 - 3, s2 - 3, tpx * 0.08); x.fillStyle = g3; x.fill();
          }
          break; }
        case 'wallpaper': case 'panel': {
          var wf = (rt.look && rt.look.wallface) || { c: c };
          T.wallpaperFace(x, a, wf.c || c, HH);
          break; }
        case 'glass': {
          var gg2 = x.createLinearGradient(0, 0, W, HH); gg2.addColorStop(0, P.rgba(c0, 0.75)); gg2.addColorStop(1, P.rgba(c1, 0.85)); x.fillStyle = gg2; x.fillRect(0, 0, W, HH);
          x.fillStyle = 'rgba(255,255,255,0.25)'; for (var q = 0; q < W; q += tpx) x.fillRect(q + tpx * 0.2, 0, tpx * 0.08, HH);
          break; }
        case 'board': { x.fillStyle = '#6a4a2a'; x.fillRect(0, 0, W, HH); x.fillStyle = c0 || '#26402e'; x.fillRect(0, 0, W, HH); P.blotches(x, a, '#ffffff', 0.6, a.seed, 0.08); break; }
        case 'mirror': { var mg = x.createLinearGradient(0, 0, W * 0.3, HH); mg.addColorStop(0, '#d8e4f0'); mg.addColorStop(1, '#8090a8'); x.fillStyle = mg; x.fillRect(0, 0, W, HH); break; }
        default: (P.MAT[p] || P.MAT.flat)(x, a, [c1, c2, c0]);
      }
      return t;
    },
    wallpaperFace: function (x, a, c, HH) {
      var tpx = a.tpx, W = a.w * tpx;
      x.fillStyle = c[0]; x.fillRect(0, 0, W, HH);
      P.blotches(x, a, P.sh(c[0], -0.08), 0.3, a.seed, 0.4);
      x.fillStyle = P.rgba(c[1] || P.sh(c[0], -0.15), 0.55);
      for (var i = Math.floor(a.wx0 * 3); i < (a.wx0 + a.w) * 3 + 1; i++) {
        var px = i * tpx / 3 - a.wx0 * tpx;
        x.fillRect(px, 0, Math.max(1, tpx / 32), HH);
        for (var j = 0; j * tpx / 3 < HH; j++) if ((i + j) % 2 === 0) P.flower(x, px + tpx / 6, j * tpx / 3 + tpx / 6, tpx * 0.04, P.rgba(c[1] || '#c8a890', 0.75), P.rgba(c[2] || '#8a6a50', 0.75));
      }
    },

    /* ================= BLOC VUE DE CÔTÉ ================= */
    buildSide: function (rt, cx, cy) {
      var tpx = T.tpx, W = CS * tpx, x0 = cx * CS, y0 = cy * CS, seed = (rt.seed & 0xffff) || 7;
      var area = { wx0: x0, wy0: y0, w: CS, h: CS, tpx: tpx, seed: seed };
      var solid = function (tx, ty) { var i = YN.tileInfo(rt.tile(tx, ty)); return (i.wall || i.tall || i.obj) ? 1 : 0; };
      var G = mk(W, W), gx = G.x, chunk = { cx: cx, cy: cy, ground: G.c, strips: [], water: null, tpx: tpx };
      var sm = T.mask(solid, x0, y0, CS, CS, tpx, rt.def.sideEdge || 'rounded', seed);
      if (sm) {
        var mat = T.mat(rt, 'wall');
        var p = mat.p === 'hedge' ? 'moss' : (mat.p === 'brick' || mat.p === 'stone' ? 'stone' : mat.p);
        T.paintMasked(gx, area, { p: P.MAT[p] ? p : 'flat', c: mat.c }, sm);
        gx.save(); gx.globalCompositeOperation = 'source-atop'; T.blurTint(gx, sm.c, '#ffffff', 0.18, tpx * 0.1, 0, tpx * 0.08, 'destination-out'); gx.restore();
        var fl = (T.mat(rt, 'floor').c || ['#5a9a4a'])[0];
        for (var ty = y0; ty < y0 + CS; ty++) for (var tx = x0; tx < x0 + CS; tx++) {
          if (!solid(tx, ty) || solid(tx, ty - 1)) continue;
          var px = (tx - x0) * tpx, py = (ty - y0) * tpx;
          var cg = gx.createLinearGradient(0, py, 0, py + tpx * 0.3); cg.addColorStop(0, P.sh(fl, 0.25)); cg.addColorStop(1, fl);
          gx.fillStyle = cg; P.rr(gx, px - 1, py - tpx * 0.04, tpx + 2, tpx * 0.3, tpx * 0.08); gx.fill();
          var r = P.rng(tx, ty, 5); for (var b = 0; b < 6; b++) P.blade(gx, px + r.next() * tpx, py + tpx * 0.02, tpx * (0.08 + r.next() * 0.1), (r.next() - 0.5) * tpx * 0.08, P.sh(fl, r.chance(0.5) ? 0.3 : -0.2), Math.max(1, tpx / 40));
        }
      }
      for (var jj = y0; jj < y0 + CS; jj++) for (var ii = x0; ii < x0 + CS; ii++) {
        var inf = YN.tileInfo(rt.tile(ii, jj)), px2 = (ii - x0) * tpx, py2 = (jj - y0) * tpx;
        if (inf.oneway) P.box(gx, px2, py2, tpx, tpx * 0.14, tpx * 0.1, '#b08a5a', '#7a5a38');
        else if (inf.ladder) { gx.fillStyle = '#8a6a3a'; gx.fillRect(px2 + tpx * 0.2, py2, tpx * 0.08, tpx); gx.fillRect(px2 + tpx * 0.72, py2, tpx * 0.08, tpx); for (var k = 0; k < 4; k++) gx.fillRect(px2 + tpx * 0.2, py2 + k * tpx / 4 + tpx * 0.1, tpx * 0.6, tpx * 0.06); }
        else if (inf.hazard) { gx.fillStyle = '#c8c8d0'; for (var s = 0; s < 4; s++) { gx.beginPath(); gx.moveTo(px2 + s * tpx / 4, py2 + tpx); gx.lineTo(px2 + s * tpx / 4 + tpx / 8, py2 + tpx * 0.55); gx.lineTo(px2 + (s + 1) * tpx / 4, py2 + tpx); gx.fill(); } }
        else if (inf.water) { gx.fillStyle = 'rgba(70,130,200,0.55)'; gx.fillRect(px2, py2, tpx, tpx); }
      }
      return chunk;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
