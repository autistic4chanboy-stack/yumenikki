/* =========================================================================
 *  LA PROTAGONISTE EN PIXEL ART (dessinée à la main, case de 20 px).
 *  Têtes, corps, jupes et jambes sont des grilles assemblées ; quatre vues
 *  (face, dos, profil — la gauche est le profil retourné), marche en
 *  quatre temps (pas, passage, pas, passage) avec un pixel de rebond.
 *  Les accessoires des effets restent dessinés en vectoriel puis aplatis
 *  en pixels par YN.paint.crisp, et le tout reçoit un contour d'un pixel.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint, S = YN.spr;

  var HEAD = {
    front: [
      '....HHHHHHHH....',
      '..HHHHHHHHHHHH..',
      '.HHhhhHHHHHHHHH.',
      '.HYYhHHHHHHHHHH.',
      'HHYYHHHHHHHHHHHH',
      'HHHSHHHSHHHSHHHH',
      'HHSSSSSSSSSSSSHH',
      'HHSEESSSSSSEESHH',
      'HHSEESSSSSSEESHH',
      'HHSPSSSSSSSSPSHH',
      'HHHSSSSssSSSSHHH',
      'HHHHsSSSSSSsHHHH',
      '.HHHHHsSSsHHHHH.'
    ],
    back: [
      '....HHHHHHHH....',
      '..HHHHHHHHHHHH..',
      '.HHHHHHHHHhhhHH.',
      '.HHHHHHHHHHhYYH.',
      'HHHHHHHHHHHHYYHH',
      'HHHHHHHHHHHHHHHH',
      'HHHhHHHHHHHHhHHH',
      'HHHhHHHHHHHHhHHH',
      'HHHHHHHHHHHHHHHH',
      'HHHHhHHHHHHhHHHH',
      'HHHHHHHHHHHHHHHH',
      'HHHHHHHHHHHHHHHH',
      '.HHHHHHHHHHHHHH.'
    ],
    side: [
      '....HHHHHHH.....',
      '..HHHHHHHHHHH...',
      '.HHHHHHHhhhHHH..',
      '.HHHHHHHHHhHHHH.',
      'HHHHHHHHHHHHHHH.',
      'HHHHHHHHHSHHSHH.',
      'HHHHHHHSSSSSSSH.',
      'HHHHHHHSSSSSESS.',
      'HHHHHHHSSSSSESS.',
      'HHHHHHHSSSSPSSS.',
      'HHHHHHHHSSSSSsS.',
      'HHHHHHHHsSSSSS..',
      '.HHHHHHHHsSSs...'
    ]
  };
  var BODY = {
    front: [
      '...wwwBBBBwww...',
      '..BBBBBBBBBBBB..',
      '.BwBBBBBBBBBBBb.',
      '.BwbBBBBBBBBbBb.',
      '.BBbBBBBBBBBbBb.',
      '.BBbBBBBBBBBbbb.',
      '.bbbbBBBBBBbbbb.',
      '.SS.bbbbbbbb.SS.'
    ],
    back: [
      '...BBBBBBBBBB...',
      '..BBBBBBBBBBBB..',
      '.BBBBBBBBBBBBBb.',
      '.BBbBBBBBBBBbBb.',
      '.BBbBBBBBBBBbBb.',
      '.BBbBBBBBBBBbbb.',
      '.bbbbBBBBBBbbbb.',
      '.SS.bbbbbbbb.SS.'
    ],
    side: [
      '.....wBBBBw.....',
      '....BBBBBBBB....',
      '....BBBBBBBBB...',
      '....BBbBBBBBB...',
      '....BBbBBBBBB...',
      '....BBbbBBBBB...',
      '....bbbbbbbbb...',
      '......SS........'
    ]
  };
  var HAND_SIDE = { idle: '......SS........', a: '.......SS.......', b: '.....SS.........' };
  var SKIRT = {
    front: ['....NNNNNNNN....', '...NNnNNNNnNN...', '..NNnNNNNNNnNN..', '..nnnnnnnnnnnn..'],
    side: ['.....NNNNNN.....', '....NNNNNNNN....', '....NNnNNNNNN...', '....nnnnnnnnn...']
  };
  var LEGS = {
    front: {
      idle: ['.....SS..SS.....', '.....WW..WW.....', '.....WW..WW.....', '....RRR..RRR....'],
      a: ['.....SS..SS.....', '.....WW..WW.....', '....RRR..WW.....', '.........RRR....'],
      b: ['.....SS..SS.....', '.....WW..WW.....', '.....WW..RRR....', '....RRR.........']
    },
    side: {
      idle: ['......SSS.......', '......WWW.......', '......WWW.......', '......RRRR......'],
      a: ['......SSS.......', '.....WW.WW......', '....WW...WW.....', '...RRR....RRR...'],
      b: ['......SSS.......', '......WWW.......', '......WWRR......', '.....RRRR.......']
    }
  };

  function palOf(pal) {
    var G = pal || S.GIRL;
    return {
      H: G.hair, h: G.hairHi, Y: G.clip, S: G.skin, s: G.skinSh, E: G.eye, P: G.blush,
      B: G.sweater, b: G.sweaterSh, w: G.sweaterHi, N: G.skirt, n: P.sh(G.skirt, -0.3), W: G.sock, R: G.shoe
    };
  }
  /* vue (4 directions) depuis les 8 directions de la marche */
  function view4(dir) {
    if (dir === 'down') return ['front', false];
    if (dir === 'up') return ['back', false];
    if (dir === 'left' || dir === 'upleft' || dir === 'downleft') return ['side', true];
    return ['side', false];
  }

  var W = 40, H = 58, AX = 20, AY = 54, cache = {}, cacheN = 0;

  function drawBase(x, v, step, pal, blink, flip) {
    var x0 = AX - 8, top = AY - 29, bob = (step === 'a' || step === 'b') ? 1 : 0;
    var kind = v === 'back' ? 'front' : v;
    var legs = LEGS[kind === 'side' ? 'side' : 'front'][step];
    var head = HEAD[v].slice();
    if (blink && v === 'front') { head[7] = head[7].replace(/E/g, 'S'); head[8] = head[8].replace(/EE/g, 'ss'); }
    if (blink && v === 'side') { head[7] = head[7].replace(/E/g, 'S'); head[8] = head[8].replace(/E/g, 's'); }
    var body = BODY[v].slice();
    if (v === 'side') body[7] = HAND_SIDE[step === 'a' ? 'a' : step === 'b' ? 'b' : 'idle'];
    else if (step === 'a') body[7] = '.SS.bbbbbbbb....';
    else if (step === 'b') body[7] = '....bbbbbbbb.SS.';
    if ((step === 'a' || step === 'b') && v !== 'side') {
      // la main qui recule passe derrière la manche
      if (step === 'a') body[6] = '.bbbbBBBBBBbbbb.'; else body[6] = '.bbbbBBBBBBbbbb.';
    }
    P.paintGrid(x, legs, pal, x0, top + 25, flip);
    P.paintGrid(x, SKIRT[kind === 'side' ? 'side' : 'front'], pal, x0, top + 21 + bob, flip);
    P.paintGrid(x, body, pal, x0, top + 13 + bob, flip);
    P.paintGrid(x, head, pal, x0, top + bob, flip);
  }

  /* accessoire vectoriel → pixels, dans le repère de la protagoniste */
  function accLayer(fn, vw, ph, walk, t, bob) {
    var L = P.mk(W, H);
    L.x.translate(AX, AY + bob); L.x.scale(20, 21.5);
    try { fn(L.x, vw, ph, walk, t, 0.05, 0); } catch (e) { YN.warn('accessory: ' + e); }
    P.crisp(L.c, { thr: 100 });
    return L.c;
  }

  S.girl = function (dir, frame, opt) {
    opt = opt || {};
    var moving = !!opt.moving, ph = opt.phase || 0;
    var step = moving ? ['a', 'idle', 'b', 'idle'][Math.floor(U.mod(ph, 1) * 4) % 4] : 'idle';
    var vv = view4(dir), v = vv[0], flip = vv[1];
    var t = opt.t || 0, blink = !moving && U.mod(t, 3.7) < 0.13;
    var acc = opt.hiding ? 'blanketHide' : opt.acc, animK = S.ACC_ANIM[acc] ? Math.floor(t * 6) % 12 : 0;
    var key = 'PG|' + v + flip + '|' + step + '|' + (blink ? 1 : 0) + '|' + (opt.form || '') + '|' + (acc || '') + '|' + (opt.palKey || '') + '|' + animK;
    var c = cache[key]; if (c) return c;
    var cv = P.mk(W, H), x = cv.x, pal = palOf(opt.pal);
    var vw = S.viewOf(dir), bob = (step === 'a' || step === 'b') ? 1 : 0;
    if (opt.form && S.FORMS[opt.form]) {
      var L = P.mk(W, H); L.x.translate(AX, AY); L.x.scale(20, 20);
      try { S.FORMS[opt.form](L.x, vw, ph, moving ? 1 : 0, t, opt.pal || S.GIRL, 0.05); } catch (e) { YN.warn('form ' + opt.form + ': ' + e); }
      P.crisp(L.c, { thr: 100 }); x.drawImage(L.c, 0, 0);
    } else {
      var tA = animK / 6;
      if (acc && S.ACC_BACK[acc]) x.drawImage(accLayer(S.ACC_BACK[acc], vw, ph, moving ? 1 : 0, tA, bob), 0, 0);
      if (acc !== 'blanketHide') drawBase(x, v, step, pal, blink, flip);
      if (acc && S.ACC[acc]) {
        var a2 = accLayer(function (xx, vw2, ph2, w2, t2, lw2) { if (vw2.m < 0 && !S.ACC_NOFLIP[acc]) xx.scale(-1, 1); S.ACC[acc](xx, vw2, ph2, w2, t2, lw2, 0); }, vw, ph, moving ? 1 : 0, tA, bob);
        x.drawImage(a2, 0, 0);
      }
    }
    P.outline(cv.c, P.INK);
    var out = P.mk(W, H);
    P.pxShadow(out.x, AX, AY - 1, 7, 2, 0.28);
    out.x.drawImage(cv.c, 0, 0);
    out.c.ax = AX; out.c.ay = AY;
    if (cacheN > 1600) { cache = {}; cacheN = 0; }
    var fin = P.toGpu ? P.toGpu(out.c) : out.c;
    cache[key] = fin; cacheN++;
    return fin;
  };

  /* planche de contrôle (développement) */
  S.girlSheet = function (scale) {
    scale = scale || 4;
    var dirs = ['down', 'up', 'right', 'left'], cv = P.mk(W * 4 * scale, H * dirs.length * scale);
    cv.x.imageSmoothingEnabled = false; cv.x.fillStyle = '#6a5a7a'; cv.x.fillRect(0, 0, cv.c.width, cv.c.height);
    dirs.forEach(function (d, j) { for (var i = 0; i < 4; i++) { var g = S.girl(d, 0, { moving: i > 0, phase: (i - 1) / 4 + 0.01 }); cv.x.drawImage(g, i * W * scale, j * H * scale, W * scale, H * scale); } });
    return cv.c;
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* icônes des menus : petites, aplaties, contour d'un pixel, agrandies sans lissage */
(function (root) {
  'use strict';
  var YN = root.YN, P = YN.paint, S = YN.spr, iconV = S.icon, ic = {};
  S.icon = function (icon, size) {
    size = size || 64;
    var key = JSON.stringify(icon) + '|' + size;
    if (ic[key]) return ic[key];
    var src = iconV(icon, 22), sm = P.mk(24, 24);
    sm.x.drawImage(src, 1, 1);
    P.crisp(sm.c, { thr: 90, k: 7 }); P.outline(sm.c, P.INK);
    var k = Math.max(1, Math.floor(size / 24)), up = P.mk(24 * k, 24 * k);
    up.x.imageSmoothingEnabled = false; up.x.drawImage(sm.c, 0, 0, 24 * k, 24 * k);
    ic[key] = up.c;
    return up.c;
  };
})(typeof window !== 'undefined' ? window : globalThis);
