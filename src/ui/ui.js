/* =========================================================================
 *  Interface (DOM superposé au canevas) : HUD, compte à rebours, dialogues,
 *  bulles, messages, fondus, sursauts, résumés de réveil et de capture.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  var UI = YN.ui = {
    stack: [], // panneaux modaux ouverts
    el: el, $: $,
    init: function () {
      UI.root = $('ui'); UI.menus = $('menus');
      UI.hud.build(); UI.dialog.build();
      UI.toastEl = $('toast'); UI.fadeEl = $('fade');
      document.addEventListener('keydown', UI.onKey, true);
      YN.bus.on('resize', function () { UI.bubbles.refresh(); UI.applyScale(); });
      UI.applyScale();
    },
    applyScale: function () {
      var s = (YN.save.settings && YN.save.settings.uiScale) || 1;
      document.documentElement.style.setProperty('--ui', String(s));
      var sc = YN.render.scale || 2;
      document.documentElement.style.setProperty('--px', (Math.max(1.6, sc) / 2.5).toFixed(3));
    },
    modalOpen: function () { return UI.stack.length > 0 || UI.dialog.open; },
    push: function (panel) { UI.stack.push(panel); YN.input.releaseAll(); },
    pop: function (panel) {
      var i = UI.stack.indexOf(panel); if (i >= 0) UI.stack.splice(i, 1);
      if (panel && panel.node && panel.node.parentNode) panel.node.parentNode.removeChild(panel.node);
      if (panel && panel.onClose) { try { panel.onClose(); } catch (e) { YN.warn('onClose: ' + e); } }
      YN.input.releaseAll(); YN.input.clearHits();
    },
    top: function () { return UI.stack[UI.stack.length - 1]; },
    onKey: function (e) {
      if (YN.input.typing) {
        if (e.code === 'Escape' && UI._typingEsc) { e.preventDefault(); UI._typingEsc(); }
        return;
      }
      var t = UI.top();
      if (t && t.onKey) { if (t.onKey(e) !== false) { e.preventDefault(); e.stopPropagation(); } return; }
      if (UI.dialog.open) { if (UI.dialog.onKey(e) !== false) { e.preventDefault(); e.stopPropagation(); } }
    },

    /* ---------- messages ---------- */
    toast: function (msg, sec) {
      var t = UI.toastEl; if (!t) return;
      t.textContent = msg; t.classList.add('show');
      clearTimeout(UI._toastT);
      UI._toastT = setTimeout(function () { t.classList.remove('show'); }, (sec || 1.8) * 1000);
    },
    worldName: function () { /* les mondes ne disent jamais leur nom */ },

    /* ---------- fondus ---------- */
    fade: {
      inOut: function (sec, color, mid, end) {
        var f = UI.fadeEl; f.style.background = color || '#000';
        f.style.transition = 'opacity ' + sec + 's ease'; f.style.opacity = '1';
        setTimeout(function () {
          try { mid && mid(); } catch (e) { YN.warn('transition: ' + (e.stack || e)); }
          UI.fade.whenReady(function () { f.style.opacity = '0'; setTimeout(function () { end && end(); }, sec * 1000); });
        }, sec * 1000);
      },
      whenReady: function (go) { var t0 = Date.now(); (function wait() { var R = YN.render; if (!YN.game.rt || !R || R.viewReady || Date.now() - t0 > 900) { go(); return; } setTimeout(wait, 16); })(); },
      out: function (sec) { var f = UI.fadeEl; f.style.transition = 'opacity ' + (sec || 0.5) + 's ease'; f.style.opacity = '0'; },
      black: function () { var f = UI.fadeEl; f.style.transition = 'none'; f.style.background = '#000'; f.style.opacity = '1'; }
    },

    /* ---------- HUD ---------- */
    hud: {
      build: function () {
        var h = $('hud');
        h.innerHTML = '<div id="timer" class="timer">10:00</div>' +
          '<div id="hud-left"><div id="cookies"></div><div id="eq"></div><div id="unsaved" title="not kept"></div></div>' +
          '<div id="pinch"><div></div></div><div id="bells"></div><div id="depth"></div>';
        UI.hud.timerEl = $('timer');
      },
      refresh: function () {
        var S = YN.save, G = YN.game;
        var inDream = !!S.dream;
        var tv = !YN.save.settings || YN.save.settings.timerVisible;
        UI.hud.timerEl.style.display = inDream && tv ? '' : 'none';
        var c = S.perm ? S.cookies() : 0, ch = '';
        for (var i = 0; i < c; i++) ch += '<span class="cookie' + (YN.priestess && YN.priestess.locked() ? ' cracked' : '') + '"></span>';
        $('cookies').innerHTML = ch;
        var eq = G.equipped(), d = eq && YN.effectById(eq);
        $('eq').innerHTML = d ? '<img src="' + YN.spr.iconURL(d.icon) + '" class="' + (G.effectSuppressed > 0 ? 'off' : '') + (G.effectInverted ? ' shake' : '') + '" alt="">' : '';
        var n = S.dream ? S.dream.effects.length + S.dream.notes.length + U.keys(S.dream.quests).length : 0;
        $('unsaved').innerHTML = n ? '<span class="dot"></span>' + n : '';
        var dep = G.rt ? G.rt.depth : 0, dd = '';
        if (inDream) for (var k = 1; k <= 5; k++) dd += '<i class="' + (k <= dep ? 'on' : '') + '"></i>';
        $('depth').innerHTML = dd;
      },
      tick: function () {
        var S = YN.save;
        if (!S.dream) return;
        var r = S.dream.remaining, el2 = UI.hud.timerEl;
        var txt = U.fmtTime(r);
        if (el2.textContent !== txt) el2.textContent = txt;
        el2.classList.toggle('low', r < 60);
        el2.classList.toggle('pill', !!S.dream.pill);
        el2.classList.toggle('double', !!(YN.game.rt && YN.game.rt.depth >= 5));
        el2.classList.toggle('glitch', !!(YN.game.rt && YN.game.rt.depth >= 3 && Math.random() < 0.01));
      },
      pinch: function (k) { var p = $('pinch'); p.style.display = k > 0 ? 'block' : 'none'; p.firstChild.style.width = Math.round(U.clamp(k, 0, 1) * 100) + '%'; },
      pulseTimer: function (sec) { var e = UI.hud.timerEl; e.classList.remove('plus', 'minus'); void e.offsetWidth; e.classList.add(sec > 0 ? 'plus' : 'minus'); },
      priestessBells: function (n) { var b = $('bells'); b.innerHTML = n ? new Array(n + 1).join('<i></i>') : ''; },
      priestessLock: function (on) { document.body.classList.toggle('plock', !!on); UI.hud.refresh(); }
    },

    /* ---------- dialogues ---------- */
    dialog: {
      open: false, q: [], cur: null, shown: 0, choices: null, sel: 0, onDone: null, ctx: null,
      build: function () {
        var d = $('dialog');
        d.innerHTML = '<div class="who"></div><div class="text"></div><div class="tr"></div><div class="choices"></div><div class="more">▼</div>';
        d.addEventListener('click', function () { UI.dialog.advance(); });
        UI.dialog.node = d;
      },
      queue: function (lines, ctx, onDone) {
        var D = UI.dialog;
        if (!lines || !lines.length) { if (onDone) onDone(); return; }
        lines = lines.map(function (l) { return typeof l === 'string' ? { t: l } : l; });
        if (D.open) { D.q = D.q.concat(lines); if (onDone) { var prev = D.onDone; D.onDone = function () { if (prev) prev(); onDone(); }; } return; }
        D.q = lines.slice(); D.onDone = onDone || null; D.ctx = ctx || {}; D.open = true;
        D.node.classList.add('show');
        YN.input.releaseAll();
        D.next();
      },
      next: function () {
        var D = UI.dialog;
        if (!D.q.length) { D.close(); return; }
        D.cur = D.q.shift();
        if (typeof D.cur.t === 'function') { try { var rv = D.cur.t(); D.cur = Object.assign({}, D.cur, rv && typeof rv === 'object' ? rv : { t: rv }); } catch (e) { D.cur = { t: '…' }; } }
        var garble = 0;
        if (YN.game.rt && YN.witches && YN.witches.anyIn(YN.game.rt.id)) garble = Math.min(0.25, (YN.game.rt.corrLocal || 0) * 0.12);
        var r = YN.lang.render(D.cur, { garble: garble });
        D.rendered = r;
        D.node.querySelector('.who').textContent = D.cur.who || '';
        D.node.querySelector('.who').style.display = D.cur.who ? '' : 'none';
        D.node.querySelector('.tr').innerHTML = r.tr ? U.escape(r.tr) : '';
        D.node.querySelector('.choices').innerHTML = '';
        D.node.className = 'show' + (D.cur.lang && D.cur.lang !== 'fr' ? ' lang-' + D.cur.lang : '') + (D.cur.style ? ' ' + D.cur.style : '');
        D.full = r.html; D.shown = 0; D.typing = true;
        D.textNode = D.node.querySelector('.text');
        D.textNode.innerHTML = '';
        D.plainLen = r.html.replace(/<[^>]+>/g, '').length;
        clearInterval(D.timer);
        var voice = D.cur.voice;
        D.timer = setInterval(function () {
          D.shown += 2;
          if (voice && D.shown % 4 === 0) YN.audio.blip(voice);
          if (D.shown >= D.plainLen) { D.shown = D.plainLen; D.typing = false; clearInterval(D.timer); }
          D.textNode.innerHTML = D.partial(D.full, D.shown);
        }, 1000 / 40);
      },
      /* tronque un HTML simple au n-ième caractère visible */
      partial: function (html, n) {
        var out = '', count = 0, i = 0;
        while (i < html.length && count < n) {
          if (html[i] === '<') { var j = html.indexOf('>', i); out += html.slice(i, j + 1); i = j + 1; continue; }
          if (html[i] === '&') { var k = html.indexOf(';', i); out += html.slice(i, k + 1); i = k + 1; count++; continue; }
          out += html[i]; i++; count++;
        }
        // referme les balises ouvertes
        var open = (out.match(/<(span|svg|b|i|em)[^>]*>/g) || []).length - (out.match(/<\/(span|svg|b|i|em)>/g) || []).length;
        for (var o = 0; o < open; o++) out += '</span>';
        return out;
      },
      advance: function () {
        var D = UI.dialog;
        if (D.choices) return;
        if (D.typing) { D.shown = D.plainLen; D.typing = false; clearInterval(D.timer); D.textNode.innerHTML = D.full; return; }
        YN.audio.sfx('menu_move', { vol: 0.4 });
        D.next();
      },
      choose: function (labels, cb) {
        var D = UI.dialog;
        if (!D.open) { D.open = true; D.node.classList.add('show'); D.node.querySelector('.text').innerHTML = ''; D.node.querySelector('.who').style.display = 'none'; D.node.querySelector('.tr').innerHTML = ''; }
        D.choices = { labels: labels, cb: cb }; D.sel = 0;
        D.renderChoices();
      },
      renderChoices: function () {
        var D = UI.dialog, box = D.node.querySelector('.choices');
        box.innerHTML = '';
        D.choices.labels.forEach(function (l, i) {
          var b = el('div', 'choice' + (i === D.sel ? ' sel' : ''), U.escape(l));
          b.addEventListener('click', function (ev) { ev.stopPropagation(); D.sel = i; D.pick(); });
          box.appendChild(b);
        });
      },
      pick: function () {
        var D = UI.dialog, c = D.choices; D.choices = null;
        D.node.querySelector('.choices').innerHTML = '';
        YN.audio.sfx('menu_ok');
        var keepOpen = D.q.length > 0;
        if (!keepOpen) { D.open = false; D.node.classList.remove('show'); }
        c.cb(D.sel);
        if (!D.open && D.q.length) { D.open = true; D.node.classList.add('show'); D.next(); }
        if (!UI.dialog.open) YN.input.clearHits();
      },
      onKey: function (e) {
        var D = UI.dialog, code = e.code;
        if (D.choices) {
          if (code === 'ArrowUp' || code === 'KeyW') { D.sel = (D.sel + D.choices.labels.length - 1) % D.choices.labels.length; D.renderChoices(); YN.audio.sfx('menu_move'); }
          else if (code === 'ArrowDown' || code === 'KeyS') { D.sel = (D.sel + 1) % D.choices.labels.length; D.renderChoices(); YN.audio.sfx('menu_move'); }
          else if (code === 'Space' || code === 'Enter' || code === 'NumpadEnter') D.pick();
          return;
        }
        if (code === 'Space' || code === 'Enter' || code === 'NumpadEnter' || code === 'Escape' || code === 'KeyE') D.advance();
      },
      close: function () {
        var D = UI.dialog;
        clearInterval(D.timer);
        D.open = false; D.node.classList.remove('show'); D.cur = null;
        YN.input.clearHits(); YN.input.releaseAll();
        var f = D.onDone; D.onDone = null;
        if (f) f();
      }
    },

    /* ---------- bulles ---------- */
    bubbles: {
      refresh: function () {
        var box = $('bubbles'); if (!box) return;
        var list = (YN.speech ? YN.speech.bubbles : []).concat(YN.witches && YN.witches.bubbles ? YN.witches.bubbles.filter(function (b) { return b.until > YN.game.clock && b.a.world === (YN.game.rt && YN.game.rt.id); }) : []);
        box.innerHTML = '';
        list.forEach(function (b) {
          var d = el('div', 'bubble' + (b.who === 'player' ? ' me' : '') + (b.a ? ' witch' : ''));
          d.innerHTML = b.html || U.escape(b.text);
          if (b.tr) d.innerHTML += '<div class="btr">' + U.escape(b.tr) + '</div>';
          d._b = b; box.appendChild(d);
        });
        UI.bubbles.position();
      },
      position: function () {
        var box = $('bubbles'); if (!box || !YN.game.rt) return;
        var G = YN.game, rt = G.rt;
        for (var i = 0; i < box.children.length; i++) {
          var d = box.children[i], b = d._b, wx, wy;
          if (b.who === 'player') { wx = G.player.fx; wy = G.player.fy; if (rt.view === 'side') { wx = G.player.side.px / 16; wy = G.player.side.py / 16 + 0.5; } }
          else if (b.a) { wx = b.a.fx; wy = b.a.fy; }
          else { wx = b.who.fx; wy = b.who.fy; }
          var p = YN.render.toCss(rt, wx + 0.5, wy - 1.4);
          d.style.left = Math.round(p[0]) + 'px'; d.style.top = Math.round(p[1]) + 'px';
        }
      }
    },

    /* ---------- obtention d'un effet ---------- */
    effectGet: function (d) {
      var panel = { node: el('div', 'panel effectget') };
      panel.node.innerHTML = '<img src="' + YN.spr.iconURL(d.icon) + '" alt=""><div class="en">' + U.escape(d.name) + '</div><div class="ed">' + U.escape(d.desc || '') + '</div>';
      UI.root.appendChild(panel.node);
      panel.onKey = function (e) { if (['Space', 'Enter', 'Escape', 'NumpadEnter', 'KeyE'].indexOf(e.code) >= 0) UI.pop(panel); };
      panel.node.addEventListener('click', function () { UI.pop(panel); });
      UI.push(panel);
      UI.hud.refresh();
    },

    /* ---------- réveil et capture ---------- */
    wakeSummary: function (s, reason) {
      UI.hud.refresh();
      if (!s) return;
      var parts = [];
      if (s.effects.length) parts.push(s.effects.map(function (id) { var d = YN.effectById(id); return d ? '<img src="' + YN.spr.iconURL(d.icon) + '" title="' + U.escape(d.name) + '">' : ''; }).join(''));
      var msg = reason === 'timeout' ? 'The dream’s time has run out.' : reason === 'pinch' ? 'She woke herself up.' : 'She wakes up.';
      UI.banner('<div class="t1">' + msg + '</div>' + (parts.length ? '<div class="icons">' + parts.join('') + '</div>' : '') + '<div class="t2">What she found tonight is kept.</div>', 3.6);
    },
    captureSummary: function (lost) {
      UI.hud.refresh();
      var n = lost ? lost.effects.length : 0;
      UI.banner('<div class="t1">…</div><div class="t2">This dream closed over her.' + (n ? ' ' + n + ' unkept effect' + (n > 1 ? 's' : '') + ' lost.' : '') + '<br>What was already kept is still there.</div>', 4.5);
    },
    banner: function (html, sec) {
      var b = el('div', 'banner', html);
      UI.root.appendChild(b);
      setTimeout(function () { b.classList.add('show'); }, 30);
      setTimeout(function () { b.classList.remove('show'); setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 900); }, (sec || 3) * 1000);
    },

    /* ---------- sursaut ---------- */
    jumpscare: function (who, done) {
      var c = $('scare'), x = c.getContext('2d'), st = YN.save.settings || {};
      var soft = st.jumpscare === 0, noFlash = st.reduceFlash;
      c.width = 320; c.height = 240; c.style.display = 'block';
      YN.audio.sfx(who === 'priestess' ? 'priestess_grab' : 'jumpscare');
      YN.input.rumble(soft ? 150 : 450, soft ? 0.3 : 1);
      var line = YN.lang.witchLine(who === 'priestess' ? 'priestess' : who);
      var t0 = performance.now(), dur = who === 'priestess' ? 2600 : 1300;
      var face = YN.spr.witch(who === 'priestess' ? 'priestess' : who, 1, 'hunt');
      function draw() {
        var t = (performance.now() - t0) / dur;
        x.fillStyle = who === 'priestess' ? '#f4f2ea' : '#000'; x.fillRect(0, 0, 320, 240);
        var sc = soft ? 3 + t * 1.2 : 4 + t * 3, jit = soft ? 0 : (Math.random() - 0.5) * 8;
        x.imageSmoothingEnabled = false;
        x.drawImage(face, 160 - face.width * sc / 2 + jit, 130 - face.height * sc / 2 + jit, face.width * sc, face.height * sc);
        if (who === 'priestess') { // l'écran se barre ligne par ligne
          x.fillStyle = '#000'; var rows = Math.floor(t * 14);
          for (var r = 0; r < rows; r++) x.fillRect(0, r * 17, 320, 11);
          x.fillStyle = '#f4f2ea'; x.font = 'bold 11px monospace'; x.textAlign = 'center';
          if (t > 0.35) x.fillText('EVERYTHING IS FINE', 160, 120 + Math.sin(t * 20) * 2);
        } else {
          if (!noFlash && !soft && t < 0.15) { x.fillStyle = 'rgba(255,255,255,' + (0.6 - t * 4) + ')'; x.fillRect(0, 0, 320, 240); }
          for (var s = 0; s < (soft ? 3 : 14); s++) { var yy = Math.random() * 240; x.drawImage(c, 0, yy, 320, 6, (Math.random() - 0.5) * 30, yy, 320, 6); }
          x.fillStyle = soft ? '#c8c8c8' : '#ff3040'; x.font = 'bold 13px serif'; x.textAlign = 'center';
          x.fillText(line, 160, 225);
        }
        if (t < 1) requestAnimationFrame(draw);
        else { c.style.display = 'none'; UI.fade.black(); done(); }
      }
      draw();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
