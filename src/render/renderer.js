/* =========================================================================
 *  MOTEUR DE RENDU ILLUSTRÉ
 *  Canevas plein écran (résolution réelle, limitée pour les performances).
 *  Caméra en coordonnées du monde (cases). Couches :
 *   fond → sol (blocs) → reflets de l'eau → [bandes de murs + sprites
 *   triés par rangée] → effets → lumière → météo → corruption → finitions.
 *  Styles : pixel (rendu basse définition agrandi), filtres de couleur,
 *  papier (fusain, aquarelle, crayon), psychédélique (ondulation).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;

  var Rn = YN.render = {
    screen: null, sx: null, W: 1280, H: 720, tpx: 64, dpr: 1, scale: 1,
    cam: { x: 0, y: 0, shake: 0, init: false, lx: 0, ly: 0 },
    t: 0, frameNo: 0, fps: 60, _fa: 0, _fn: 0, particles: [], cssFilter: '',
    low: null, lowX: null, pixelMode: 0, viewH: 11.5,

    init: function (canvas) {
      Rn.screen = canvas; Rn.sx = canvas.getContext('2d');
      root.addEventListener('resize', Rn.resize);
      Rn.resize();
    },
    quality: function () { var s = YN.save && YN.save.settings; return s && s.quality !== undefined ? s.quality : 1; },
    /* le canevas a la résolution du jeu (≈ 240 à 270 pixels de haut) ;
       le navigateur l'agrandit d'un facteur entier, sans lissage */
    resize: function () {
      var c = Rn.screen; if (!c) return;
      var cw = root.innerWidth, ch = root.innerHeight; if (!cw || !ch) return;
      var dpr = root.devicePixelRatio || 1, devH = ch * dpr;
      var want = (YN.save && YN.save.settings && YN.save.settings.pixelH) || 250;
      var k = Math.max(1, Math.round(devH / want));
      var lw = Math.ceil(cw * dpr / k), lh = Math.ceil(ch * dpr / k);
      c.width = lw; c.height = lh;
      c.style.width = (lw * k / dpr) + 'px'; c.style.height = (lh * k / dpr) + 'px';
      Rn.W = lw; Rn.H = lh; Rn.k = k; Rn.dpr = dpr; Rn.cssK = k / dpr; Rn.scale = k / dpr;
      Rn.sx = c.getContext('2d'); Rn.sx.imageSmoothingEnabled = false;
      var ui = document.getElementById('ui');
      if (ui) { ui.style.width = cw + 'px'; ui.style.height = ch + 'px'; }
      Rn.tpx = P.TILE; if (YN.terrain) YN.terrain.tpx = P.TILE;
      Rn.vig = null; Rn.mask = null;
      YN.bus.emit('resize', cw, ch, k);
    },
    setZoom: function (viewH) { Rn.viewH = viewH; },
    setPixel: function () { },

    /* ---------- coordonnées ---------- */
    wrapD: function (d, size) { return U.mod(d + size / 2, size) - size / 2; },
    ts: function () { return Rn.curT || Rn.tpx; },
    /* centre de vue arrondi au pixel : rien ne « nage » d'un demi-pixel */
    view: function () { return { x: Rn.vx !== undefined ? Rn.vx : Rn.cam.x, y: Rn.vy !== undefined ? Rn.vy : Rn.cam.y }; },
    toScreen: function (rt, wx, wy) {
      var c = Rn.view(), dx = wx - c.x, dy = wy - c.y, t = Rn.curT || Rn.tpx;
      if (rt && rt.wrap && !rt.inf) { dx = Rn.wrapD(dx, rt.w); dy = Rn.wrapD(dy, rt.h); }
      return [dx * t + Math.floor((Rn.curW || Rn.W) / 2), dy * t + Math.floor((Rn.curH || Rn.H) / 2)];
    },
    toCss: function (rt, wx, wy) {
      var p;
      if (rt && (rt.view === 'fps' || rt.view === 'wire')) p = [Rn.W / 2, Rn.H * 0.55];
      else p = Rn.toScreen(rt, wx, wy);
      return [p[0] * (Rn.cssK || 1), p[1] * (Rn.cssK || 1)];
    },
    updateCamera: function (rt, dt, instant) {
      var g = YN.game, p = g.player, c = Rn.cam;
      var tx = p.px, ty = p.py - 0.6;
      if (rt.view === 'side') { tx = p.side.px / 16 + 0.5; ty = p.side.py / 16 + 0.6; }
      var smooth = YN.save.settings && YN.save.settings.camera === 1;
      if (smooth) { c.lx = U.lerp(c.lx, (p.vx || 0) * 0.3, Math.min(1, dt * 1.8)); c.ly = U.lerp(c.ly, (p.vy || 0) * 0.3, Math.min(1, dt * 1.8)); tx += c.lx; ty += c.ly; }
      else { c.lx = 0; c.ly = 0; }
      if (g.camOverride) { tx = g.camOverride.x; ty = g.camOverride.y; }
      var t = Rn.tpx, vw = Rn.W / t, vh = Rn.H / t;
      if (!rt.wrap && !rt.inf) {
        var top = -(rt.style.topPad === undefined ? 1.4 : rt.style.topPad), bot = rt.h + 0.4;
        tx = rt.w <= vw ? rt.w / 2 : U.clamp(tx, vw / 2, rt.w - vw / 2);
        ty = bot - top <= vh ? (bot + top) / 2 : U.clamp(ty, top + vh / 2, bot - vh / 2);
      }
      if (instant || !c.init || !smooth) { c.x = rt.wrap && !rt.inf ? U.mod(tx, rt.w) : tx; c.y = rt.wrap && !rt.inf ? U.mod(ty, rt.h) : ty; c.init = true; }
      else {
        var k = 1 - Math.pow(0.003, dt);
        if (rt.wrap && !rt.inf) { var ddx = Rn.wrapD(tx - c.x, rt.w), ddy = Rn.wrapD(ty - c.y, rt.h); c.x = U.mod(c.x + ddx * k, rt.w); c.y = U.mod(c.y + ddy * k, rt.h); }
        else { c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; }
      }
      if (c.shake > 0) c.shake = Math.max(0, c.shake - dt * 2);
    },

    /* ================= IMAGE ================= */
    frame: function (dt) {
      var g = YN.game, rt = g && g.rt;
      Rn.frameStart = performance.now(); Rn.buildMs = 0;
      if (rt !== Rn.lastRt) { Rn.lastRt = rt; Rn.firstFrames = 0; Rn.anyDrawn = false; Rn.warm = !!rt; Rn.viewReady = false; }
      Rn.missing = 0; // morceaux de carte ou décors pas encore prêts dans cette image
      Rn.t += dt; Rn.frameNo++;
      Rn._fa += dt; Rn._fn++; if (Rn._fa > 0.5) { Rn.fps = Math.round(Rn._fn / Rn._fa); Rn._fa = 0; Rn._fn = 0; }
      var s = Rn.sx;
      if (!rt) { s.fillStyle = '#000'; s.fillRect(0, 0, Rn.W, Rn.H); return; }
      Rn.updateCamera(rt, dt);
      var ctx = s, W = Rn.W, H = Rn.H;
      ctx.imageSmoothingEnabled = false;
      Rn.curW = W; Rn.curH = H; Rn.curT = Rn.tpx;
      Rn.vx = Math.round(Rn.cam.x * Rn.tpx) / Rn.tpx; Rn.vy = Math.round(Rn.cam.y * Rn.tpx) / Rn.tpx;
      ctx.save();
      var shake = Rn.cam.shake > 0 && YN.save.settings && YN.save.settings.cameraFx && !YN.save.settings.reduceMotion ? Rn.cam.shake * Rn.curT * 0.12 : 0;
      if (shake) ctx.translate(Math.round((Math.random() - 0.5) * shake), Math.round((Math.random() - 0.5) * shake));
      if (YN.debug && YN.debug.ascii) YN.debug.drawAscii(ctx, rt, W, H, Rn.curT);
      else if (rt.view === 'fps' || rt.view === 'wire') YN.raycast.draw(ctx, rt, g, W, H);
      else Rn.drawWorld(ctx, rt, g, W, H, dt);
      ctx.restore();
      if (!(YN.debug && YN.debug.ascii)) {
        Rn.drawFx(ctx, rt, g, dt, W, H);
        Rn.drawLight(ctx, rt, g, W, H);
        Rn.drawWeather(ctx, rt, dt, W, H);
        if (YN.corruption) YN.corruption.drawOverlay(ctx, rt, Rn.t, W, H, Rn.curT);
      }
      Rn.curW = Rn.curH = Rn.curT = 0;
      Rn.post(s, rt);
      Rn.endWarm();
    },
    warmBudget: 12, // ms de préparation par image pendant le fondu
    endWarm: function () { Rn.viewReady = !Rn.missing; if (Rn.viewReady) Rn.warm = false; },
    post: function (s, rt) {
      var st = rt.style, W = Rn.W, H = Rn.H, set = YN.save.settings || {};
      var paper = st.paper || ({ charcoal: 1, watercolor: 1, crayon: 1, engraving: 1, painting: 1, collage: 1 })[st.renderer];
      if (paper && !(YN.debug && YN.debug.ascii)) { s.save(); s.globalCompositeOperation = 'multiply'; s.globalAlpha = st.renderer === 'charcoal' ? 0.85 : 0.5; s.fillStyle = s.createPattern(P.gpu(P.paperTex(256)), 'repeat'); s.fillRect(0, 0, W, H); s.restore(); }
      if (st.renderer === 'psychedelic' || st.psy) Rn.psyPost(s, rt, W, H, set);
      if (!Rn.vig || Rn.vig.width !== W || Rn.vig.height !== H) {
        Rn.vig = P.mk(W, H, true).c; var vx = Rn.vig.getContext('2d');
        var gr = vx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.38, W / 2, H / 2, Math.max(W, H) * 0.72);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.38)'); vx.fillStyle = gr; vx.fillRect(0, 0, W, H);
      }
      s.drawImage(Rn.vig, 0, 0);
      if (!set.reduceMotion && st.grain) { s.save(); s.globalAlpha = st.grain; s.globalCompositeOperation = 'overlay'; s.fillStyle = s.createPattern(P.gpu(P.grainTex(256)), 'repeat'); s.translate((Math.random() * 256) | 0, (Math.random() * 256) | 0); s.fillRect(-256, -256, W + 512, H + 512); s.restore(); }
      var f = Rn.styleFilter(rt);
      if (YN.game.cssFilter) { var gf = YN.game.cssFilter(); if (gf) f = (f ? f + ' ' : '') + gf; }
      if (f !== Rn.cssFilter) { Rn.cssFilter = f; Rn.screen.style.filter = f; }
    },
    /* PSYCHÉDÉLIQUE — chaque monde choisit sa recette (style.psy), sinon l'ondulation d'origine.
       { hue: degrés/s, sat, wave, vwave, freq, breathe, tunnel, mirror, ghost, bands, blobs, speed }
       « Réduire la distorsion » coupe ondes, respiration, tunnel et symétrie ; « Réduire les flashs » ralentit les couleurs. */
    PSY_DEFAULT: { wave: 1 },
    psyRecipe: function (rt) { return rt.style.psy || Rn.PSY_DEFAULT; },
    psyPost: function (s, rt, W, H, set) {
      var p = Rn.psyRecipe(rt), t = Rn.t * (p.speed || 1), calm = set.reduceMotion ? 0.35 : 1, still = !!set.reduceDistortion;
      var needCopy = (!still && (p.wave || p.vwave || p.breathe || p.mirror)) || p.ghost;
      if (needCopy) {
        // une seule copie de l'écran, puis tout se redessine depuis cette copie (se recopier soi-même bande par bande coûtait ~400 ms)
        if (!Rn.psy || Rn.psy.c.width !== W || Rn.psy.c.height !== H) Rn.psy = P.mk(W, H, true);
        Rn.psy.x.clearRect(0, 0, W, H); Rn.psy.x.drawImage(Rn.screen, 0, 0);
      }
      var src = needCopy ? Rn.psy.c : null, y, x;
      if (!still) {
        if (p.wave) { var sh = Math.max(4, Math.round(H / 90)), fq = p.freq || 0.012, am = W * 0.008 * p.wave * calm; for (y = 0; y < H; y += sh) s.drawImage(src, 0, y, W, sh, Math.round(Math.sin(y * fq + t * 1.2) * am), y, W, sh); }
        else if (p.vwave) { var sw = Math.max(4, Math.round(W / 120)), fv = p.freq || 0.01, av = H * 0.01 * p.vwave * calm; for (x = 0; x < W; x += sw) s.drawImage(src, x, 0, sw, H, x, Math.round(Math.sin(x * fv + t * 0.9) * av), sw, H); }
        else if (p.breathe) { var z = 1 + (0.5 + 0.5 * Math.sin(t * 0.8)) * 0.035 * p.breathe * calm; s.drawImage(src, Math.round(W * (1 - z) / 2), Math.round(H * (1 - z) / 2), Math.round(W * z), Math.round(H * z)); }
        if (p.mirror) { s.save(); s.globalAlpha = Math.min(0.5, 0.24 * p.mirror); s.translate(W, 0); s.scale(-1, 1); s.drawImage(src, 0, 0); s.restore(); }
        if (p.tunnel) {
          if (!Rn.psyPrev || Rn.psyPrev.c.width !== W || Rn.psyPrev.c.height !== H || Rn.psyWorld !== rt.id) { Rn.psyPrev = P.mk(W, H, true); Rn.psyWorld = rt.id; Rn.psyPrev.x.drawImage(Rn.screen, 0, 0); }
          var zt = 1.035, rot = 0.006 * Math.sin(t * 0.3);
          s.save(); s.globalAlpha = Math.min(0.6, 0.32 * p.tunnel * calm); s.translate(W / 2, H / 2); s.rotate(rot); s.drawImage(Rn.psyPrev.c, -W * zt / 2, -H * zt / 2, W * zt, H * zt); s.restore();
        }
      }
      if (p.ghost) { var gx = Math.round((2 + Math.sin(t * 1.3) * 2) * Math.max(1, W / 640) * p.ghost); s.save(); s.globalCompositeOperation = 'screen'; s.globalAlpha = Math.min(0.5, 0.22 * p.ghost); s.filter = 'hue-rotate(160deg)'; s.drawImage(src, gx, 0); s.drawImage(src, -gx, 0); s.restore(); }
      if (p.bands) {
        var hb = (t * (set.reduceFlash ? 6 : 30)) % 360, gb = s.createLinearGradient(0, 0, W, H);
        for (var i = 0; i <= 6; i++) gb.addColorStop(i / 6, 'hsl(' + Math.round((hb + i * 60) % 360) + ',90%,55%)');
        s.save(); s.globalCompositeOperation = 'soft-light'; s.globalAlpha = Math.min(0.7, 0.4 * p.bands); s.fillStyle = gb; s.fillRect(0, 0, W, H); s.restore();
      }
      if (p.blobs) {
        s.save(); s.globalCompositeOperation = 'screen'; s.globalAlpha = Math.min(0.45, 0.2 * p.blobs);
        for (var b = 0; b < 3; b++) {
          var bx = W * (0.5 + 0.42 * Math.sin(t * (0.17 + b * 0.07) + b * 2.1)), by = H * (0.5 + 0.4 * Math.cos(t * (0.13 + b * 0.05) + b)), br = Math.max(W, H) * (0.28 + 0.08 * Math.sin(t * 0.4 + b));
          var gr2 = s.createRadialGradient(bx, by, 0, bx, by, br), hu = Math.round((t * (set.reduceFlash ? 4 : 18) + b * 120) % 360);
          gr2.addColorStop(0, 'hsla(' + hu + ',95%,60%,1)'); gr2.addColorStop(1, 'hsla(' + hu + ',95%,60%,0)'); s.fillStyle = gr2; s.fillRect(0, 0, W, H);
        }
        s.restore();
      }
      if (p.tunnel && !still && Rn.psyPrev) { Rn.psyPrev.x.clearRect(0, 0, W, H); Rn.psyPrev.x.drawImage(Rn.screen, 0, 0); }
    },
    styleFilter: function (rt) {
      var r = rt.style.renderer, f = rt.style.filter || '';
      var map = { mono: 'grayscale(1) contrast(1.35)', charcoal: 'grayscale(1) contrast(1.25)', engraving: 'grayscale(1) sepia(0.35) contrast(1.4)', sepia: 'sepia(0.85) contrast(1.05)', photo: 'sepia(0.55) contrast(1.1) saturate(0.8)', watercolor: 'saturate(0.85) brightness(1.06) contrast(0.92)', crayon: 'saturate(1.25) contrast(1.05)', silhouette: 'contrast(1.6) saturate(1.3) brightness(0.9)', surveillance: 'grayscale(1) contrast(1.2) brightness(0.9)', realistic: 'contrast(1.08) saturate(1.05)', painting: 'saturate(1.2) contrast(1.05)', pattern: 'contrast(1.1)' };
      if (map[r]) f = map[r] + (f ? ' ' + f : '');
      if (r === 'psychedelic' || rt.style.psy) {
        var p = Rn.psyRecipe(rt), hs = p.hue === undefined ? 25 : p.hue, set = YN.save.settings || {};
        if (set.reduceFlash) hs = Math.min(hs, 6);
        var pf = (hs ? 'hue-rotate(' + Math.round(Rn.t * hs % 360) + 'deg) ' : '') + 'saturate(' + (p.sat || 1.5) + ')' + (p.contrast ? ' contrast(' + p.contrast + ')' : '');
        f = pf + (f ? ' ' + f : '');
      }
      return f;
    },

    /* ================= LE MONDE ================= */
    drawWorld: function (x, rt, g, W, H, dt) {
      var T = YN.terrain, t = Rn.curT, cam = Rn.view(), st = rt.style;
      if (st.sky) { var gr = x.createLinearGradient(0, 0, 0, H); st.sky.forEach(function (c, i) { gr.addColorStop(i / Math.max(1, st.sky.length - 1), c); }); x.fillStyle = gr; }
      else x.fillStyle = rt.bg || '#000';
      x.fillRect(0, 0, W, H);
      if (st.stars) Rn.drawStars(x, W, H, t);
      if (rt.view === 'side' && st.parallax) Rn.drawParallax(x, rt, W, H, t);
      if (rt.mechDrawBg) rt.mechDrawBg(x, rt);
      var CS = T.CS, vw = W / t, vh = H / t, x0 = cam.x - vw / 2, y0 = cam.y - vh / 2;
      var cx0 = Math.floor(x0 / CS), cx1 = Math.floor((x0 + vw) / CS), cy0 = Math.floor((y0 - 1.5) / CS), cy1 = Math.floor((y0 + vh + 1.5) / CS);
      var budget = Rn.buildBudget === undefined ? 4 : Rn.buildBudget, strips = [], water = [];
      var nx = Math.ceil(rt.w / CS), ny = Math.ceil(rt.h / CS);
      for (var cy = cy0; cy <= cy1; cy++) for (var cx = cx0; cx <= cx1; cx++) {
        var wcx = cx, wcy = cy;
        if (rt.wrap && !rt.inf) { wcx = U.mod(cx, nx); wcy = U.mod(cy, ny); }
        else if (!rt.inf && (cx * CS > rt.w + 2 || cy * CS > rt.h + 2 || (cx + 1) * CS < -2 || (cy + 1) * CS < -3)) continue;
        var ch = T.get(rt, wcx, wcy, false);
        // un morceau manquant se peint ici, mais jamais plus de ~10 ms de peinture par image (sauf à l'arrivée)
        if (!ch || ch.stale) { if ((budget > 0 || !ch) && (Rn.buildMs < (Rn.warm ? Rn.warmBudget : 10) || (!ch && !Rn.anyDrawn && !Rn.warm))) { budget--; var tb = performance.now(); ch = T.get(rt, wcx, wcy, true) || ch; Rn.buildMs += performance.now() - tb; } }
        if (!ch) { Rn.missing++; continue; }
        var sx = Math.round((cx * CS - cam.x) * t) + Math.floor(W / 2), sy = Math.round((cy * CS - cam.y) * t) + Math.floor(H / 2), k = t / T.tpx;
        x.drawImage(ch.ground, sx, sy, CS * t, CS * t);
        if (ch.water) water.push([ch, sx, sy]);
        for (var i = 0; i < ch.strips.length; i++) {
          var sp = ch.strips[i], row = sp.row + (cy - wcy) * CS;
          strips.push({ row: row, img: sp.c, sx: sx, sy: Math.round((row + sp.oy - cam.y) * t) + Math.floor(H / 2), w: sp.c.width * k, h: sp.c.height * k });
        }
      }
      Rn.anyDrawn = true;
      Rn.prefetch(rt, cx0, cx1, cy0, cy1, nx, ny);
      Rn.drawWater(x, water, t);
      Rn.drawGroundFx(x, rt, g, t);
      if (rt.mechDrawGround) rt.mechDrawGround(x, rt);
      var list = Rn.collect(rt, g, x0, y0, vw, vh, t);
      list.sort(function (a, b) { return a.y - b.y; });
      strips.sort(function (a, b) { return a.row - b.row; });
      var si = 0, pd = null, hidden = false;
      var drawStrip = function (s0) { x.drawImage(s0.img, Math.floor(s0.sx), Math.round(s0.sy), s0.w, s0.h); if (pd && !hidden && s0.sx < pd.px + pd.w * 0.65 && s0.sx + s0.w > pd.px + pd.w * 0.35 && s0.sy < pd.py + pd.h * 0.75 && s0.sy + s0.h * 0.6 > pd.py + pd.h * 0.25) hidden = true; };
      for (var j = 0; j < list.length; j++) {
        var d = list[j];
        while (si < strips.length && strips[si].row <= Math.floor(d.y)) drawStrip(strips[si++]);
        if (d.player) pd = d;
        else if (pd && !hidden && d.px < pd.px + pd.w * 0.7 && d.px + d.w > pd.px + pd.w * 0.3 && d.py < pd.py + pd.h * 0.8 && d.py + d.h > pd.py + pd.h * 0.4) hidden = true;
        if (d.alpha !== undefined && d.alpha < 1) x.globalAlpha = Math.max(0, d.alpha);
        if (d.fx) Rn.drawFxSprite(x, d, g); else x.drawImage(d.img, Math.round(d.px), Math.round(d.py), d.w, d.h);
        x.globalAlpha = 1;
      }
      while (si < strips.length) drawStrip(strips[si++]);
      if (hidden && pd) { x.globalAlpha = 0.42; x.drawImage(pd.img, Math.round(pd.px), Math.round(pd.py), pd.w, pd.h); x.globalAlpha = 1; }
      if (rt.mechDraw) rt.mechDraw(x, rt);
    },
    /* habitants (et effets) qui se tordent à l'affichage : look.fx = { jitter, glitch, flicker, trail, loom, hue, stretch }
       « Reduce motion » coupe tremblements, glitchs et traînées ; « Reduce flashes » coupe le clignotement */
    drawFxSprite: function (x, d, g) {
      var f = d.fx, set = YN.save.settings || {}, t = Rn.t, e = d.ent, calm = !!set.reduceMotion, seed = e ? (e.fxSeed = e.fxSeed || (YN.rng.hash(String(e.id || e.def.id)) % 97)) : 7;
      var px = Math.round(d.px), py = Math.round(d.py), w = d.w, h = d.h, a = x.globalAlpha, u = Math.max(1, Math.round((Rn.curT || Rn.tpx) / 20));
      if (f.flicker && !set.reduceFlash) { var fl = Math.sin(t * 11 + seed) * Math.sin(t * 2.3 + seed * 1.7); if (fl > 0.55) a *= 0.12; }
      if (f.loom && e && g && g.player) { var dd = U.dist(e.fx, e.fy, g.player.fx || g.player.px, g.player.fy || g.player.py), k = U.clamp(1 - dd / 5, 0, 1), sc = 1 + k * k * 0.45 * f.loom; px -= Math.round((w * sc - w) / 2); py -= Math.round(h * sc - h); w *= sc; h *= sc; }
      if (f.stretch && !calm) { var st = 1 + (0.5 + 0.5 * Math.sin(t * 1.4 + seed)) * 0.12 * f.stretch; py -= Math.round(h * st - h); h *= st; }
      if (f.jitter && !calm && Math.sin(t * 7 + seed) > 0.2) { px += (((Math.random() * 3) | 0) - 1) * u; py += (((Math.random() * 3) | 0) - 1) * u; }
      if (f.trail && !calm) {
        for (var k2 = 3; k2 >= 1; k2--) { x.globalAlpha = a * (0.16 + 0.06 * (3 - k2)); if (f.hue || f.trail === 'psy') x.filter = 'hue-rotate(' + Math.round(U.mod(t * 120 + k2 * 100, 360)) + 'deg) saturate(1.8)'; x.drawImage(d.img, px + Math.round(Math.sin(t * 2 + k2 * 1.3) * k2 * 2 * u), py + Math.round(Math.cos(t * 1.6 + k2) * k2 * u), w, h); }
        x.filter = 'none';
      }
      x.globalAlpha = a;
      if (f.hue) x.filter = 'hue-rotate(' + Math.round(U.mod(t * 90 * f.hue + seed * 40, 360)) + 'deg) saturate(1.6)';
      if (f.glitch && !calm && U.mod(Math.floor(t * 10) + seed, 11) === 0) {
        var n = 4, sh = Math.ceil(h / n), sw2 = d.img.width / w, shs = d.img.height / h;
        for (var i = 0; i < n; i++) { var off = (((Math.random() * 5) | 0) - 2) * 2 * u; x.drawImage(d.img, 0, Math.floor(i * sh * shs), d.img.width, Math.ceil(sh * shs), px + off, py + i * sh, w, sh); }
        void sw2;
      } else x.drawImage(d.img, px, py, w, h);
      if (f.hue) x.filter = 'none';
      x.globalAlpha = 1;
    },
    drawStars: function (x, W, H, t) {
      var r = YN.rng.make(7);
      for (var i = 0; i < 140; i++) {
        var px = U.mod(r.next() * W * 2 - Rn.cam.x * t * 0.08, W), py = U.mod(r.next() * H * 2 - Rn.cam.y * t * 0.08, H), tw = 0.5 + 0.5 * Math.sin(Rn.t * (0.5 + r.next() * 2) + i);
        var sz = (r.next() < 0.1 ? 2.4 : 1.3) * Math.max(1, t / 50);
        x.fillStyle = 'rgba(255,250,240,' + (0.3 + tw * 0.6) + ')'; x.fillRect(px, py, sz, sz);
      }
    },
    drawWater: function (x, list, t) {
      if (!list.length) return;
      if (P.PIX) {
        list.forEach(function (it) {
          var g = it[0].glints || [];
          for (var i = 0; i < g.length; i++) {
            var ph = (g[i][0] * 7 + g[i][1] * 13) % 17, v = Math.sin(Rn.t * 1.3 + ph);
            if (v < 0.35) continue;
            var dx = Math.round(Math.sin(Rn.t * 0.6 + ph) * 2);
            x.fillStyle = v > 0.8 ? 'rgba(235,248,255,0.85)' : 'rgba(200,230,255,0.55)';
            x.fillRect(it[1] + g[i][0] + dx, it[2] + g[i][1], v > 0.8 ? 4 : 2, 1);
          }
        });
        return;
      }
      var T = YN.terrain, cw = T.CS * T.tpx;
      if (!Rn.wtmp || Rn.wtmp.c.width !== cw) Rn.wtmp = P.mk(cw, cw, true);
      var w = Rn.wtmp, pat = w.x.createPattern(P.gpu(P.causticTex(256)), 'repeat');
      list.forEach(function (it) {
        var ch = it[0];
        w.x.globalCompositeOperation = 'source-over'; w.x.clearRect(0, 0, cw, cw);
        w.x.drawImage(ch.water, 0, 0); w.x.globalCompositeOperation = 'source-in';
        var sc = T.tpx / 48, ox = Rn.t * 10 * sc + ch.cx * cw, oy = Rn.t * 4 * sc + ch.cy * cw;
        if (pat.setTransform && root.DOMMatrix) pat.setTransform(new DOMMatrix().translateSelf(-U.mod(ox, 256 * sc), -U.mod(oy, 256 * sc)).scaleSelf(sc, sc));
        w.x.fillStyle = pat; w.x.fillRect(0, 0, cw, cw);
        x.save(); x.globalAlpha = 0.14 + 0.05 * Math.sin(Rn.t * 0.7); x.globalCompositeOperation = 'screen';
        x.drawImage(w.c, Math.floor(it[1]), Math.floor(it[2]), Math.ceil(T.CS * t) + 1, Math.ceil(T.CS * t) + 1); x.restore();
      });
    },
    drawParallax: function (x, rt, W, H, t) {
      (rt.style.parallax || []).forEach(function (L, l) {
        var f = L.f || 0.3, base = H * (L.y || 0.6); x.fillStyle = L.c;
        x.beginPath(); x.moveTo(0, H);
        for (var px = 0; px <= W + 8; px += 8) { var wx = px / t + Rn.cam.x * f; x.lineTo(px, base - YN.rng.noise2(wx * (L.freq || 0.25), l * 10, rt.seed) * (L.amp || 2.5) * t); }
        x.lineTo(W, H); x.closePath(); x.fill();
      });
    },

    /* ---------- ce qui est trié par profondeur ---------- */
    collect: function (rt, g, x0, y0, vw, vh, t) {
      var out = [], fr = Math.floor(Rn.t * 6), cam = Rn.view(), T = YN.terrain;
      var inView = function (wx, wy) { var dx = wx - cam.x, dy = wy - cam.y; if (rt.wrap && !rt.inf) { dx = Rn.wrapD(dx, rt.w); dy = Rn.wrapD(dy, rt.h); } return Math.abs(dx) < vw / 2 + 3 && dy > -vh / 2 - 1 && dy < vh / 2 + 4; };
      var place = function (img, ax, ay, fx, fy, scale) { var p = Rn.toScreen(rt, fx, fy), k = (scale || 1) * t / T.tpx; return { px: Math.round(p[0] - ax * k), py: Math.round(p[1] - ay * k), w: Math.round(img.width * k), h: Math.round(img.height * k) }; };
      var tx0 = Math.floor(x0) - 2, tx1 = Math.ceil(x0 + vw) + 2, ty0 = Math.floor(y0) - 1, ty1 = Math.ceil(y0 + vh) + 4;
      for (var ty = ty0; ty <= ty1; ty++) for (var tx = tx0; tx <= tx1; tx++) {
        var ch = rt.tile(tx, ty), info = YN.tileInfo(ch);
        if (!(info.tall || info.obj)) continue;
        var dec = rt.tallDecor(ch, tx, ty);
        if (!dec) continue;
        var pl = place(dec.c, dec.ax, dec.ay, tx + 0.5, ty + 0.92); pl.img = dec.c; pl.y = ty + 0.9; out.push(pl);
      }
      for (var i = 0; i < rt.marks.length; i++) {
        var m = rt.marks[i];
        if (!m.active || m.hidden || !m.look) continue;
        if (m.def.hiddenUntilReveal && !m.revealed && !(g.revealUntil > g.clock)) continue;
        if (!inView(m.x + 0.5, m.y + 0.5)) continue;
        var dd = YN.decor.get(m.look, m.lookOpt, (m.animated || YN.decor.animated(m.look)) ? fr : 0, T.tpx);
        if (!dd) continue;
        var wall = YN.decor.isWall(m.look);
        var p2 = place(dd.c, dd.ax, dd.ay, m.x + 0.5 + (m.ox || 0), m.y + 0.92 + (m.oy || 0));
        p2.img = dd.c; p2.y = m.y + (m.zy !== undefined ? m.zy : (wall ? 0.995 : 0.9)); p2.alpha = m.alpha; out.push(p2);
      }
      for (var j = 0; j < rt.ents.length; j++) {
        var e = rt.ents[j];
        if (!e.visible || e.alphaNow <= 0.01) continue;
        var ex = e.fx + 0.5 + (e.jx || 0), ey = e.fy + 0.9 + (e.jy || 0);
        if (!inView(ex, ey)) continue;
        var img = YN.entities.sprite(e, fr); if (!img) continue;
        var p3 = place(img, img.ax || img.width / 2, img.ay || img.height, ex, ey + (e.def.oy || 0) - (e.jz || 0)); p3.img = img; p3.y = e.fy + 0.88 + (e.jy || 0); p3.alpha = e.alphaNow; var lk3 = e.state.look || e.def.look; if (lk3 && lk3.fx) { p3.fx = lk3.fx; p3.ent = e; } out.push(p3);
      }
      var pl2 = g.player;
      if (!pl2.invisible) {
        var pimg = g.playerSprite(), sc = pl2.small ? 0.55 : 1;
        var fx2 = rt.view === 'side' ? pl2.side.px / 16 + 0.5 : pl2.px, fy2 = rt.view === 'side' ? pl2.side.py / 16 + 1.45 : pl2.py;
        var p4 = place(pimg, pimg.ax, pimg.ay, fx2, fy2 - (pl2.z || 0), sc); p4.img = pimg; p4.y = fy2 - 0.05; p4.player = true; p4.alpha = pl2.alpha; var pfx = YN.effects && YN.game.equipped && YN.effects.look(YN.game.equipped()).fx; if (pfx) p4.fx = pfx; out.push(p4);
      }
      var ws = YN.witches ? YN.witches.drawList(rt.id) : [];
      if (YN.priestess) ws = ws.concat(YN.priestess.drawList(rt.id));
      ws.forEach(function (w) { var p5 = place(w.img, w.img.ax, w.img.ay, w.x + 0.5, w.y + 0.9); p5.img = w.img; p5.y = w.y + 0.9; p5.alpha = w.alpha; out.push(p5); });
      return out;
    },

    /* ---------- météo ---------- */
    drawWeather: function (x, rt, dt, W, H) {
      var w = rt.weather || {}, reduce = YN.save.settings && YN.save.settings.reduceMotion, sc = (Rn.curT || Rn.tpx) / 64;
      var kind = w.snow ? 'snow' : w.rain ? 'rain' : w.ash ? 'ash' : w.petals ? 'petals' : w.dust ? 'dust' : w.leaves ? 'leaves' : w.motes ? 'motes' : w.fireflies ? 'fireflies' : null;
      if (!kind && w.none !== true && rt.ambientKind) kind = rt.ambientKind;
      var Q = Rn.particles;
      if (!kind) { Q.length = 0; return; }
      var want = Math.round({ snow: 170, rain: 230, ash: 70, petals: 50, dust: 60, leaves: 30, motes: 26, fireflies: 14 }[kind] * (reduce ? 0.4 : 1));
      while (Q.length < want) Q.push({ x: Math.random(), y: Math.random(), z: 0.4 + Math.random() * 0.9, s: Math.random() });
      if (Q.length > want) Q.length = want;
      var wind = (w.wind || 0) + (rt.windNow || 0);
      for (var i = 0; i < Q.length; i++) {
        var q = Q[i], z = q.z;
        if (kind === 'snow') { q.y += (0.05 + q.s * 0.05) * dt * z; q.x += (Math.sin(Rn.t * 0.8 + q.s * 9) * 0.01 + wind * 0.06) * dt * z; x.fillStyle = z > 0.9 ? '#ffffff' : '#c8d4ec'; var zs = z > 1.1 ? 2 : 1; x.fillRect(Math.round(q.x * W), Math.round(q.y * H), zs, zs); }
        else if (kind === 'rain') { q.y += (0.9 + q.s * 0.4) * dt * z; q.x += wind * 0.2 * dt; x.strokeStyle = 'rgba(180,200,240,' + (0.25 + z * 0.3) + ')'; x.lineWidth = Math.max(1, sc * z * 1.5); x.beginPath(); x.moveTo(q.x * W, q.y * H); x.lineTo(q.x * W + wind * 6 * sc, q.y * H + 18 * sc * z); x.stroke(); }
        else if (kind === 'ash') { q.y += 0.02 * dt * z; q.x += Math.sin(Rn.t * 0.4 + q.s * 9) * 0.006 * dt; x.fillStyle = '#4a4a4a'; x.fillRect(Math.round(q.x * W), Math.round(q.y * H), 1, 1); }
        else if (kind === 'petals' || kind === 'leaves') { q.y += 0.04 * dt * z; q.x += (Math.sin(Rn.t + q.s * 6) * 0.02 + 0.015) * dt * z; x.save(); x.translate(q.x * W, q.y * H); x.rotate(Rn.t * (1 + q.s) + q.s * 6); x.fillStyle = kind === 'petals' ? (q.s > 0.5 ? '#f8b8d0' : '#fff0f4') : (q.s > 0.5 ? '#c8803a' : '#a85a28'); x.beginPath(); x.ellipse(0, 0, 4 * sc * z, 2 * sc * z, 0, 0, 6.28); x.fill(); x.restore(); }
        else if (kind === 'motes') { q.y += Math.sin(Rn.t * 0.25 + q.s * 9) * 0.002 * dt - 0.002 * dt; q.x += Math.cos(Rn.t * 0.2 + q.s * 5) * 0.002 * dt; x.fillStyle = 'rgba(255,248,230,' + (0.18 + 0.2 * Math.max(0, Math.sin(Rn.t * 0.9 + q.s * 20))).toFixed(3) + ')'; x.fillRect(Math.round(q.x * W), Math.round(q.y * H), 1, 1); }
        else if (kind === 'fireflies') { q.y += Math.sin(Rn.t * 0.7 + q.s * 9) * 0.01 * dt; q.x += Math.cos(Rn.t * 0.5 + q.s * 7) * 0.01 * dt; var fa = Math.max(0, Math.sin(Rn.t * 1.3 + q.s * 30)); if (fa > 0.05) { x.fillStyle = 'rgba(220,255,140,' + (0.85 * fa).toFixed(3) + ')'; var fx2 = Math.round(q.x * W), fy2 = Math.round(q.y * H); x.fillRect(fx2, fy2, 2, 2); x.fillStyle = 'rgba(220,255,140,' + (0.25 * fa).toFixed(3) + ')'; x.fillRect(fx2 - 1, fy2 - 1, 4, 4); } }
        else if (kind === 'dust') { q.y += Math.sin(Rn.t * 0.3 + q.s * 9) * 0.003 * dt; q.x += 0.006 * dt * z; x.fillStyle = 'rgba(255,240,200,' + (q.s > 0.6 ? 0.55 : 0.3) + ')'; x.fillRect(Math.round(q.x * W), Math.round(q.y * H), 1, 1); }
        if (q.y > 1.02) { q.y = -0.02; q.x = Math.random(); }
        if (q.x > 1.02) q.x = -0.02; if (q.x < -0.02) q.x = 1.02;
      }
    },

    /* ---------- obscurité et lumières ---------- */
    drawLight: function (x, rt, g, W, H) {
      var dark = g.darknessLevel();
      if (dark <= 0.01) return;
      var lw = W, lh = H, DV = 1;
      if (!Rn.mask || Rn.mask.c.width !== lw || Rn.mask.c.height !== lh) Rn.mask = P.mk(lw, lh, true);
      var m = Rn.mask.x, t = (Rn.curT || Rn.tpx);
      m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, lw, lh);
      m.fillStyle = rt.style.darkColor || 'rgb(4,4,14)'; m.globalAlpha = Math.min(1, dark); m.fillRect(0, 0, lw, lh); m.globalAlpha = 1;
      m.globalCompositeOperation = 'destination-out';
      var lights = g.lights(), glows = [];
      for (var i = 0; i < lights.length; i++) {
        var L = lights[i], p = L.px !== undefined ? [L.px, L.py] : Rn.toScreen(rt, L.x + 0.5, L.y + 0.4);
        var px = Math.round(p[0] / DV), py = Math.round(p[1] / DV), rad = Math.round(L.r * t * (1 + (L.flicker ? (Math.floor(Rn.t * 8 + i) % 2) * 0.05 : 0)));
        if (px < -rad || py < -rad || px > lw + rad || py > lh + rad) continue;
        var gr = m.createRadialGradient(px, py, 0, px, py, rad), A = L.a || 1;
        // anneaux nets : quatre paliers de lumière
        [[0, 1], [0.42, 1], [0.42, 0.72], [0.64, 0.72], [0.64, 0.45], [0.84, 0.45], [0.84, 0.2], [1, 0.2]].forEach(function (q) { gr.addColorStop(q[0], 'rgba(0,0,0,' + A * q[1] + ')'); });
        m.fillStyle = gr; m.beginPath(); m.arc(px, py, rad, 0, Math.PI * 2); m.fill();
        if (L.glow !== false && L.r > 0.8 && !L.player) glows.push([p[0], p[1], rad * 3, L.color || '#ffd890']);
      }
      m.globalCompositeOperation = 'source-over';
      x.drawImage(Rn.mask.c, 0, 0);
      x.save(); x.globalCompositeOperation = 'lighter';
      glows.forEach(function (gl) { var gg = x.createRadialGradient(gl[0], gl[1], 0, gl[0], gl[1], gl[2] * 0.6); gg.addColorStop(0, P.rgba(gl[3], 0.16 * dark)); gg.addColorStop(1, P.rgba(gl[3], 0)); x.fillStyle = gg; x.fillRect(gl[0] - gl[2], gl[1] - gl[2], gl[2] * 2, gl[2] * 2); });
      x.restore();
    },

    /* ---------- traces au sol (pas dans la neige, ronds dans l'eau) ---------- */
    /* reflets sur l'eau : petits traits clairs qui naissent, glissent et s'effacent */
    /* prépare les morceaux autour de la vue, dans le sens de la marche, s'il reste du temps dans l'image */
    prefetch: function (rt, cx0, cx1, cy0, cy1, nx, ny) {
      var T = YN.terrain, g = YN.game, p = g.player, now = performance.now();
      if (Rn.warm) return;
      if (now - Rn.frameStart > 6 || Rn.buildMs > 4) return;
      var vx = p.vx || 0, vy = p.vy || 0, best = null, bs = 1e9, R = 2;
      for (var cy = cy0 - R; cy <= cy1 + R; cy++) for (var cx = cx0 - R; cx <= cx1 + R; cx++) {
        if (cx >= cx0 && cx <= cx1 && cy >= cy0 && cy <= cy1) continue;
        var wcx = cx, wcy = cy;
        if (rt.wrap && !rt.inf) { wcx = U.mod(cx, nx); wcy = U.mod(cy, ny); }
        else if (!rt.inf && (cx < 0 || cy < 0 || cx >= nx || cy >= ny)) continue;
        var c0 = T.get(rt, wcx, wcy, false); if (c0 && !c0.stale) continue;
        var mx = (cx0 + cx1) / 2, my = (cy0 + cy1) / 2, dx = cx - mx, dy = cy - my;
        var sc = Math.abs(dx) + Math.abs(dy) - (dx * vx + dy * vy) * 0.6;
        if (sc < bs) { bs = sc; best = [wcx, wcy]; }
      }
      if (best) { var tb = performance.now(); T.get(rt, best[0], best[1], true); Rn.buildMs += performance.now() - tb; }
    },
    drawWaterGlints: function (x, rt, t) {
      if (YN.save.settings && YN.save.settings.reduceMotion) return;
      var W = Rn.curW || Rn.W, H = Rn.curH || Rn.H, x0 = Math.floor(Rn.vx - W / t / 2) - 1, y0 = Math.floor(Rn.vy - H / t / 2) - 1, x1 = x0 + Math.ceil(W / t) + 2, y1 = y0 + Math.ceil(H / t) + 2;
      var T = Rn.t, sw = Math.max(2, Math.round(t * 0.18));
      for (var ty = y0; ty <= y1; ty++) for (var tx = x0; tx <= x1; tx++) {
        var ch = rt.tile(tx, ty); if (!ch) continue; var ti = YN.tileInfo(ch); if (!ti.water) continue;
        for (var k = 0; k < 2; k++) {
          var h = P.pxhash ? P.pxhash(tx * 3 + k, ty, 17) : ((tx * 31 + ty * 17 + k) % 97) / 97, per = 2.6 + h * 2.2, ph = ((T + h * per) % per) / per;
          if (ph > 0.55) continue;
          var a = Math.sin(ph / 0.55 * Math.PI), p = Rn.toScreen(rt, tx + 0.15 + (h * 7 % 1) * 0.6 + ph * 0.18, ty + 0.25 + (h * 13 % 1) * 0.5);
          x.fillStyle = 'rgba(235,245,255,' + (0.5 * a).toFixed(3) + ')'; x.fillRect(Math.round(p[0]), Math.round(p[1]), sw, 1);
          if (a > 0.7) x.fillRect(Math.round(p[0]) + 1, Math.round(p[1]) - 1, Math.max(1, sw - 2), 1);
        }
      }
    },
    drawGroundFx: function (x, rt, g, t) {
      Rn.drawWaterGlints(x, rt, t);
      var fx = g.fx;
      for (var i = 0; i < fx.length; i++) {
        var f = fx[i]; if (f.type !== 'print' && f.type !== 'ripple') continue;
        var k = f.t / f.life, p = Rn.toScreen(rt, f.x + 0.5, f.y + 0.5);
        x.save();
        if (f.type === 'ripple') {
          x.strokeStyle = 'rgba(230,245,255,' + (0.55 * (1 - k)) + ')'; x.lineWidth = Math.max(1, t / 40);
          x.beginPath(); x.ellipse(p[0], p[1], t * (0.12 + k * 0.45), t * (0.05 + k * 0.2), 0, 0, 6.28); x.stroke();
          if (k < 0.5) { x.beginPath(); x.ellipse(p[0], p[1], t * (0.05 + k * 0.3), t * (0.02 + k * 0.12), 0, 0, 6.28); x.stroke(); }
        } else {
          var d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], upleft: [-0.7, -0.7], upright: [0.7, -0.7], downleft: [-0.7, 0.7], downright: [0.7, 0.7] }[f.dir] || [0, 1];
          var a = Math.atan2(d[1], d[0]) + Math.PI / 2, side = f.side ? 1 : -1;
          x.translate(p[0] - d[1] * side * t * 0.07, p[1] + d[0] * side * t * 0.07); x.rotate(a);
          x.fillStyle = 'rgba(90,110,150,' + (0.32 * (1 - k * k)) + ')';
          x.beginPath(); x.ellipse(0, 0, t * 0.045, t * 0.075, 0, 0, 6.28); x.fill();
        }
        x.restore();
      }
    },

    /* ---------- effets passagers ---------- */
    drawFx: function (x, rt, g, dt, W, H) {
      var fx = g.fx, t = Rn.curT || Rn.tpx;
      for (var i = fx.length - 1; i >= 0; i--) {
        var f = fx[i]; f.t += dt;
        if (f.t > f.life) { fx.splice(i, 1); continue; }
        if (f.type === 'print' || f.type === 'ripple') continue;
        var k = f.t / f.life, p = f.screen ? [f.x * W, f.y * H] : Rn.toScreen(rt, f.x + 0.5, f.y + 0.5);
        x.save();
        if (f.type === 'ring') { x.strokeStyle = f.color || 'rgba(255,255,255,0.9)'; x.globalAlpha = 1 - k; x.lineWidth = Math.max(1, t / 28); x.beginPath(); x.arc(p[0], p[1], ((f.r0 || 4) + k * (f.r || 40)) / 16 * t, 0, Math.PI * 2); x.stroke(); }
        else if (f.type === 'spark') { x.fillStyle = f.color || '#fff8d0'; x.globalAlpha = 1 - k; for (var s = 0; s < 8; s++) { var a = s / 8 * 6.28 + f.t * 2; x.beginPath(); x.arc(p[0] + Math.cos(a) * k * t * 0.8, p[1] + Math.sin(a) * k * t * 0.8 - k * t * 0.4, t / 30, 0, 6.28); x.fill(); } }
        else if (f.type === 'note') { x.globalAlpha = 1 - k; x.fillStyle = f.color || '#e0e0ff'; x.font = Math.round(t * 0.45) + 'px Georgia'; x.fillText(f.text || '♪', p[0] + Math.sin(f.t * 4) * t * 0.2, p[1] - k * t * 1.2 - t * 0.8); }
        else if (f.type === 'flash') { if (!(YN.save.settings && YN.save.settings.reduceFlash)) { x.globalAlpha = (1 - k) * (f.a || 0.6); x.fillStyle = f.color || '#fff'; x.fillRect(0, 0, W, H); } }
        else if (f.type === 'reveal') { x.globalAlpha = Math.sin(k * Math.PI) * 0.8; x.strokeStyle = f.color || '#a0ffe0'; x.lineWidth = Math.max(1, t / 30); x.strokeRect(p[0] - t * 0.5, p[1] - t * 0.5, t, t); }
        else if (f.type === 'arrow') { x.globalAlpha = 1 - k * 0.6; x.fillStyle = f.color || 'rgba(255,255,220,0.9)'; x.translate(p[0], p[1] - t * 1.3); x.rotate({ up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 }[f.dir] || 0); x.beginPath(); x.moveTo(t * 0.35, 0); x.lineTo(-t * 0.18, -t * 0.25); x.lineTo(-t * 0.18, t * 0.25); x.fill(); }
        else if (f.type === 'wisp') { // une petite lueur qui file dans une direction (les effets qui « montrent » quelque chose)
          var v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[f.dir] || [0, 0], dd = Math.sqrt(k) * 2.6 * t, ps = Math.max(1, Math.round(t / 10));
          x.fillStyle = f.color || '#fff4c8';
          for (var q = 0; q < 4; q++) { var kk = Math.max(0, Math.sqrt(k) - q * 0.06) * 2.6 * t; x.globalAlpha = (1 - k) * (1 - q * 0.22); x.fillRect(Math.round(p[0] + v[0] * kk + Math.sin(f.t * 9 + q) * ps), Math.round(p[1] - t * 0.6 + v[1] * kk), ps, ps); }
        }
        else if (f.type === 'fakes') {
          var R2 = f.r || 9, gx = Math.round(f.x), gy = Math.round(f.y);
          x.globalAlpha = Math.sin(Math.min(1, k * 1.2) * Math.PI) * 0.85; x.strokeStyle = f.color || '#f0e8c8'; x.lineWidth = Math.max(1, t / 28);
          for (var fy0 = gy - R2; fy0 <= gy + R2; fy0++) for (var fx0 = gx - R2; fx0 <= gx + R2; fx0++) { if (!(YN.secrets && YN.secrets.isFake(rt, fx0, fy0))) continue; var sp2 = Rn.toScreen(rt, fx0, fy0); x.setLineDash([2, 2]); x.strokeRect(sp2[0] + 1, sp2[1] + 1, t - 2, t - 2); x.setLineDash([]); }
        }
        else if (f.type === 'walls') {
          var R = f.r || 6, cx = Math.round(f.x), cy = Math.round(f.y);
          x.globalAlpha = (1 - k) * 0.9; x.strokeStyle = f.color || '#9fd8ff'; x.lineWidth = Math.max(1, t / 32);
          for (var yy = cy - R; yy <= cy + R; yy++) for (var xx = cx - R; xx <= cx + R; xx++) {
            if ((xx - cx) * (xx - cx) + (yy - cy) * (yy - cy) > R * R * Math.min(1, k * 2.5)) continue;
            var inf = YN.tileInfo(rt.tile(xx, yy)); if (inf.pass && !inf.void) continue;
            var sp = Rn.toScreen(rt, xx, yy); x.strokeRect(sp[0] + 1, sp[1] + 1, t - 2, t - 2);
          }
        }
        x.restore();
      }
    },
    addFx: function (o) { o.t = 0; o.life = o.life || 1; YN.game.fx.push(o); if (YN.game.fx.length > 140) YN.game.fx.shift(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
