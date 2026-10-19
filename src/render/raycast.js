/* =========================================================================
 *  Vue subjective (pseudo-3D par lancer de rayons) et variante filaire.
 *  Sol projeté case par case, murs texturés, sprites en panneaux.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var W = 320, H = 240, FOV = 1.15;
  var zbuf = new Float32Array(W), avgCache = {}, texCache = {}, floorImg = null, buf = null, bx = null;

  /* texture d'une case : la matière peinte du sol ou du mur, à 32 px */
  function tileTex(rt, ch, v) {
    var k = rt.lookKey + '|' + ch + '|' + (v || 0);
    if (texCache[k]) return texCache[k];
    var info = YN.tileInfo(ch), mat = YN.tiles.material(rt.look, info.kind) || { p: 'flat', c: ['#555'] };
    var t = YN.paint.mk(32, 32), fn = YN.paint.MAT[mat.p] || YN.paint.MAT.flat;
    try { fn(t.x, { wx0: (v || 0) * 3, wy0: 0, w: 1, h: 1, tpx: 32, seed: 7 + (v || 0) }, mat.c || ['#555'], mat); } catch (e) { t.x.fillStyle = '#555'; t.x.fillRect(0, 0, 32, 32); }
    if (info.wall || info.tall) { t.x.fillStyle = 'rgba(0,0,0,0.18)'; t.x.fillRect(0, 28, 32, 4); t.x.fillStyle = 'rgba(255,255,255,0.08)'; t.x.fillRect(0, 0, 32, 2); }
    texCache[k] = t.c; return t.c;
  }
  function decorTex(look, opt, fr) { var d = YN.decor.get(look, opt, fr || 0, 40); return d ? d.c : null; }

  function avgColor(rt, ch) {
    var k = rt.lookKey + '|' + ch;
    if (avgCache[k]) return avgCache[k];
    var c = tileTex(rt, ch, 0), d = c.getContext('2d').getImageData(0, 0, 32, 32).data, r = 0, g = 0, b = 0;
    for (var i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    var n = d.length / 4;
    avgCache[k] = [r / n, g / n, b / n];
    return avgCache[k];
  }

  YN.raycast = {
    FOV: FOV,
    solidAt: function (rt, x, y) {
      var info = YN.tileInfo(rt.tile(x, y));
      if (info.wall || info.void || info.tall || info.obj) return { tile: true };
      var m = rt.markAt(x, y);
      if (m && m.solid && m.look) return { mark: m };
      return null;
    },
    draw: function (out, rt, g, OW, OH) {
      // rendu interne basse définition, agrandi ensuite (grain voulu)
      OW = OW || out.canvas.width; OH = OH || out.canvas.height;
      var nW = Math.max(160, Math.round(240 * OW / OH));
      if (!buf || W !== nW) { W = nW; buf = YN.paint.mk(W, H); bx = buf.x; zbuf = new Float32Array(W); floorImg = null; }
      var x = bx;
      var p = g.player, P = p.fps, rs = 1;
      var wire = rt.view === 'wire' || rt.style.renderer === 'wire';
      var fog = rt.style.fog || rt.bg || '#000', fogC = U.hexToRgb(fog);
      var fogDist = rt.style.fogDist || 9;
      var dirX = Math.cos(P.a), dirY = Math.sin(P.a);
      var plane = Math.tan(FOV / 2), planeX = -dirY * plane, planeY = dirX * plane;
      // ---- sol et plafond ----
      if (!floorImg) floorImg = x.createImageData(W, H);
      var d = floorImg.data;
      var ceil = U.hexToRgb(rt.style.ceil || '#101018');
      for (var y = 0; y < H; y++) {
        var isFloor = y > H / 2;
        var rowDist = (H / 2) / Math.max(0.5, Math.abs(y - H / 2));
        var f = U.clamp(rowDist / fogDist, 0, 1);
        if (!isFloor || wire) {
          var cr = wire ? [0, 0, 0] : ceil;
          for (var xx = 0; xx < W; xx++) { var i = (y * W + xx) * 4; d[i] = U.lerp(cr[0], fogC[0], f); d[i + 1] = U.lerp(cr[1], fogC[1], f); d[i + 2] = U.lerp(cr[2], fogC[2], f); d[i + 3] = 255; }
          continue;
        }
        var rx0 = dirX - planeX, ry0 = dirY - planeY, rx1 = dirX + planeX, ry1 = dirY + planeY;
        var stepX = rowDist * (rx1 - rx0) / W, stepY = rowDist * (ry1 - ry0) / W;
        var fx = P.x + rowDist * rx0, fy = P.y + rowDist * ry0;
        for (var x2 = 0; x2 < W; x2++) {
          var tx = Math.floor(fx), ty = Math.floor(fy), ch = rt.tile(tx, ty), c = avgColor(rt, ch);
          var chk = ((tx + ty) & 1) ? 0.92 : 1;
          var j = (y * W + x2) * 4;
          d[j] = U.lerp(c[0] * chk, fogC[0], f); d[j + 1] = U.lerp(c[1] * chk, fogC[1], f); d[j + 2] = U.lerp(c[2] * chk, fogC[2], f); d[j + 3] = 255;
          fx += stepX; fy += stepY;
        }
      }
      x.putImageData(floorImg, 0, 0);
      // ---- murs ----
      for (var col = 0; col < W; col++) {
        var camX = 2 * col / W - 1, rdx = dirX + planeX * camX, rdy = dirY + planeY * camX;
        var mx = Math.floor(P.x), my = Math.floor(P.y);
        var ddx = Math.abs(1 / (rdx || 1e-9)), ddy = Math.abs(1 / (rdy || 1e-9));
        var sx, sy, sdx, sdy, side = 0, hit = null, steps = 0;
        if (rdx < 0) { sx = -1; sdx = (P.x - mx) * ddx; } else { sx = 1; sdx = (mx + 1 - P.x) * ddx; }
        if (rdy < 0) { sy = -1; sdy = (P.y - my) * ddy; } else { sy = 1; sdy = (my + 1 - P.y) * ddy; }
        while (!hit && steps++ < 48) {
          if (sdx < sdy) { sdx += ddx; mx += sx; side = 0; } else { sdy += ddy; my += sy; side = 1; }
          hit = YN.raycast.solidAt(rt, mx, my);
        }
        var dist = side === 0 ? (mx - P.x + (1 - sx) / 2) / (rdx || 1e-9) : (my - P.y + (1 - sy) / 2) / (rdy || 1e-9);
        dist = Math.max(0.05, dist);
        zbuf[col] = hit ? dist : 99;
        if (!hit) continue;
        var lineH = Math.floor(H / dist * (rt.style.wallH || 1)), y0 = Math.floor(H / 2 - lineH / 2 + (rt.style.horizon || 0));
        var wallX = side === 0 ? P.y + dist * rdy : P.x + dist * rdx; wallX -= Math.floor(wallX);
        var ff = U.clamp(dist / fogDist, 0, 1);
        if (wire) {
          x.fillStyle = rt.style.wireColor || '#40ffa0';
          var edge = wallX < 0.04 || wallX > 0.96;
          x.globalAlpha = 1 - ff;
          if (edge) x.fillRect(col, y0, 1, lineH); else { x.fillRect(col, y0, 1, 1); x.fillRect(col, y0 + lineH, 1, 1); }
          x.globalAlpha = 1;
          continue;
        }
        var tex;
        if (hit.mark) tex = decorTex(hit.mark.look, hit.mark.lookOpt, 0) || tileTex(rt, rt.tile(mx, my), 0);
        else tex = tileTex(rt, rt.tile(mx, my), (YN.rng.cell(mx, my, rt.seed) * 3) | 0);
        var tw = tex.width, th = tex.height;
        var texX = Math.floor(wallX * tw); if ((side === 0 && rdx > 0) || (side === 1 && rdy < 0)) texX = tw - texX - 1;
        x.drawImage(tex, texX, 0, 1, th, col, y0, 1, lineH);
        var shade = (side ? 0.25 : 0) + ff * 0.85;
        if (shade > 0.01) { x.globalAlpha = Math.min(1, shade); x.fillStyle = ff > 0.3 ? fog : '#000'; x.fillRect(col, y0, 1, lineH); x.globalAlpha = 1; }
      }
      // ---- sprites (PNJ, marques non murales, sorcières) ----
      var spr = [];
      rt.marks.forEach(function (m) {
        if (!m.active || m.hidden || !m.look || (m.solid && YN.raycast.solidAt(rt, m.x, m.y) && YN.raycast.solidAt(rt, m.x, m.y).mark === m)) return;
        spr.push({ x: m.x + 0.5, y: m.y + 0.5, img: decorTex(m.look, m.lookOpt, Math.floor(YN.render.t * 2)) });
      });
      rt.ents.forEach(function (e) { if (e.visible && e.alphaNow > 0.05) spr.push({ x: e.fx + 0.5, y: e.fy + 0.5, img: YN.entities.sprite(e, Math.floor(YN.render.t * 2)), a: e.alphaNow }); });
      var ws = YN.witches ? YN.witches.drawList(rt.id) : [];
      if (YN.priestess) ws = ws.concat(YN.priestess.drawList(rt.id));
      ws.forEach(function (w) { spr.push({ x: w.x + 0.5, y: w.y + 0.5, img: w.img, a: w.alpha }); });
      spr.forEach(function (s) { s.d = (s.x - P.x) * (s.x - P.x) + (s.y - P.y) * (s.y - P.y); });
      spr.sort(function (a, b) { return b.d - a.d; });
      var inv = 1 / (planeX * dirY - dirX * planeY);
      for (var k = 0; k < spr.length; k++) {
        var S = spr[k]; if (!S.img) continue;
        var rx = S.x - P.x, ry = S.y - P.y;
        var tX = inv * (dirY * rx - dirX * ry), tY = inv * (-planeY * rx + planeX * ry);
        if (tY <= 0.1) continue;
        var scx = Math.floor((W / 2) * (1 + tX / tY));
        var sh = Math.abs(Math.floor(H / tY)) * Math.min(1.6, S.img.height / (S.img.width * 1.1)), sw = sh * S.img.width / S.img.height;
        var top = Math.floor(H / 2 + H / tY / 2 - sh);
        var left = Math.floor(scx - sw / 2);
        var fogK = U.clamp(Math.sqrt(S.d) / fogDist, 0, 1);
        for (var c2 = Math.max(0, left); c2 < Math.min(W, left + sw); c2++) {
          if (tY >= zbuf[c2]) continue;
          var tx2 = Math.floor((c2 - left) / sw * S.img.width);
          x.globalAlpha = (S.a === undefined ? 1 : S.a) * (1 - fogK * 0.8);
          x.drawImage(S.img, tx2, 0, 1, S.img.height, c2, top, 1, sh);
        }
        x.globalAlpha = 1;
      }
      out.save(); out.imageSmoothingEnabled = false; out.drawImage(buf.c, 0, 0, OW, OH); out.restore();
      void rs;
    },
    /* cible devant la caméra (interaction) */
    facing: function (rt, P) {
      var tx = Math.floor(P.x + Math.cos(P.a) * 0.9), ty = Math.floor(P.y + Math.sin(P.a) * 0.9);
      return [tx, ty];
    },
    clearCache: function () { avgCache = {}; texCache = {}; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
