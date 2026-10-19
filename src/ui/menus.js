/* =========================================================================
 *  Écrans et menus : avertissement, titre, schéma, pause, effets, journal,
 *  paramètres, parole, mélodie, cadran, radio, carte, confirmation.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, UI = YN.ui, el = UI.el;

  /* panneau générique navigable au clavier */
  UI.panel = function (o) {
    var p = { node: el('div', 'panel ' + (o.cls || '')), sel: 0, items: o.items || [], o: o };
    var inner = '';
    if (o.title) inner += '<h2>' + o.title + '</h2>';
    if (o.html) inner += '<div class="pbody">' + o.html + '</div>';
    inner += '<div class="pitems"></div>';
    p.node.innerHTML = inner;
    (o.into || UI.menus).appendChild(p.node);
    p.render = function () {
      var box = p.node.querySelector('.pitems'); box.innerHTML = '';
      p.items.forEach(function (it, i) {
        if (it.hidden) return;
        var b = el('div', 'item' + (i === p.sel ? ' sel' : '') + (it.disabled ? ' dis' : ''), it.label);
        b.addEventListener('click', function () { if (it.disabled) return; p.sel = i; p.activate(); });
        b.addEventListener('mousemove', function () { if (!it.disabled && p.sel !== i) { p.sel = i; p.render(); } });
        box.appendChild(b);
      });
    };
    p.move = function (d) {
      var n = p.items.length; if (!n) return;
      for (var k = 0; k < n; k++) { p.sel = (p.sel + d + n) % n; if (!p.items[p.sel].disabled && !p.items[p.sel].hidden) break; }
      YN.audio.sfx('menu_move'); p.render();
    };
    p.activate = function () { var it = p.items[p.sel]; if (!it || it.disabled) return; YN.audio.sfx('menu_ok'); YN.audio.unlock(); it.fn(p); };
    p.close = function () { UI.pop(p); };
    p.onKey = function (e) {
      if (o.onKey && o.onKey(e, p) === true) return;
      var c = e.code;
      if (c === 'ArrowUp' || c === 'KeyW') p.move(-1);
      else if (c === 'ArrowDown' || c === 'KeyS') p.move(1);
      else if (c === 'Enter' || c === 'Space' || c === 'NumpadEnter') p.activate();
      else if (c === 'Escape' || c === 'Backspace') { if (o.onBack) { YN.audio.sfx('menu_back'); o.onBack(p); } }
      else return false;
    };
    while (p.items[p.sel] && (p.items[p.sel].disabled || p.items[p.sel].hidden)) p.sel++;
    p.render();
    UI.push(p);
    return p;
  };
  UI.confirm = function (msg, yes, no) {
    UI.panel({ cls: 'confirm', html: '<p>' + msg + '</p>', items: [{ label: 'Yes', fn: function (p) { p.close(); yes && yes(); } }, { label: 'No', fn: function (p) { p.close(); no && no(); } }], onBack: function (p) { p.close(); no && no(); } });
  };

  /* ---------- avertissement (à accepter) ---------- */
  UI.warning = function (next) {
    var html = '<div class="warn-text">' +
      '<p>This game deals with difficult themes: <b>censorship and dictatorship</b>, <b>the neglect of a child</b> and what it leaves behind, <b>bullying</b>, <b>suicide</b>.</p>' +
      '<p>Nothing is shown explicitly, but these subjects are there. The game also contains disturbing images, sudden <b>jump scares</b> and visual effects (which can be toned down in the settings).</p>' +
      '<p class="help">If you are going through a hard time, you are not alone. US: <b>988</b> (Suicide &amp; Crisis Lifeline, free, 24/7) · UK &amp; Ireland: <b>116 123</b> (Samaritans, free, 24/7) · South Korea: <b>109</b> (suicide prevention, 24/7) · France: <b>3114</b> (24/7). Elsewhere: findahelpline.com</p>' +
      '</div>';
    UI.panel({ cls: 'warning', title: 'Before you begin', html: html, items: [
      { label: 'I understand, I want to continue', fn: function (p) { p.close(); YN.session.accepted = true; next(); } },
      { label: 'Quit', fn: function () { document.body.innerHTML = '<div class="bye">Take care of yourself.</div>'; } }
    ] });
  };

  /* ---------- titre ---------- */
  UI.title = function () {
    var hasSave = YN.save.exists();
    YN.audio.playMusic('title', { fade: 3 });
    var p = UI.panel({ cls: 'title', html: '<div class="logo"><div class="l1">YUME NIKKI</div><div class="l2">The Dream Archive</div><div class="l3">— dream diary —</div></div>', items: [
      { label: 'Continue', disabled: !hasSave, fn: function (pp) { pp.close(); YN.save.load(); if (YN.save.loadIssues.length) YN.warn('loading: ' + YN.save.loadIssues.join(', ')); YN.game.continueGame(); } },
      { label: 'New game', fn: function (pp) {
        var go = function () { pp.close(); UI.schemaScreen(true, function () { YN.game.newGame(); }); };
        if (hasSave) UI.confirm('Starting a new game will erase your current progress.', go); else go();
      } },
      { label: 'How to play', fn: function () { UI.schemaScreen(false); } },
      { label: 'Settings', fn: function () { UI.settings(); } },
      { label: 'Encyclopedia (dream_archive.html)', fn: function () { root.open('wiki/dream_archive.html', '_blank'); } },
      { label: 'Credits', fn: function () { UI.credits(); } }
    ] });
    if (YN.save.corruptedOnLoad) UI.toast('The main save was damaged: the backup copy was used.', 4);
    return p;
  };

  /* ---------- schéma de la boucle ---------- */
  UI.schemaScreen = function (mandatory, then) {
    var html = '<div class="schema-wrap"></div><p class="schema-note">The rest reveals itself.</p>';
    var p = UI.panel({ cls: 'schema-panel', title: 'A dream', html: html, items: [
      { label: mandatory ? 'Begin' : 'Close', fn: function (pp) { pp.close(); if (then) then(); } }
    ], onBack: mandatory ? null : function (pp) { pp.close(); }, onKey: function (e, pp) {
      var w = pp.node.querySelector('.schema-wrap');
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { w.scrollTop += 60; return true; }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { w.scrollTop -= 60; return true; }
    } });
    var wrapN = p.node.querySelector('.schema-wrap'); if (wrapN) wrapN.appendChild(YN.schema.canvas());
    return p;
  };

  /* ---------- pause ---------- */
  UI.pause = {
    open: function () {
      YN.game.paused = true;
      var S = YN.save, inDream = !!S.dream;
      var info = inDream ? '<div class="pinfo">The dream is paused. ' + U.fmtTime(S.dream.remaining) + '</div>' : '<div class="pinfo">Awake.</div>';
      UI.panel({ cls: 'pause', title: 'Pause', html: info, items: [
        { label: 'Resume', fn: function (p) { p.close(); YN.game.paused = false; } },
        { label: 'Effects', hidden: !inDream, fn: function (p) { p.close(); YN.game.paused = false; UI.effectsMenu.open(); } },
        { label: 'How to play', fn: function () { UI.schemaScreen(false); } },
        { label: 'Settings', fn: function () { UI.settings(); } },
        { label: 'Fullscreen', fn: function () { UI.fullscreen(); } },
        { label: 'Back to title', fn: function (p) {
          var go = function () { p.close(); YN.game.paused = false; YN.game.state = 'title'; YN.game.rt = null; YN.audio.stopMusic(1); UI.title(); };
          if (inDream) UI.confirm('The current dream will stay paused: you can resume it with “Continue”.', function () { YN.game.snapshot(); go(); }); else go();
        } }
      ], onBack: function (p) { p.close(); YN.game.paused = false; } });
    }
  };
  UI.fullscreen = function () {
    var d = document.documentElement;
    if (!document.fullscreenElement) { if (d.requestFullscreen) d.requestFullscreen().catch(function () { }); }
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  /* ---------- effets ---------- */
  UI.effectsMenu = {
    open: function () {
      if (!YN.game.inDream()) return; // les effets n'existent que dans les rêves
      var S = YN.save, list = S.ownedEffects(), G = YN.game;
      var eq = G.equipped();
      var p = { node: el('div', 'panel effects'), sel: Math.max(0, list.indexOf(eq)) };
      var cols = 6;
      p.render = function () {
        var h = '<h2>Effects <span class="cnt">' + list.length + '</span></h2><div class="grid">';
        if (!list.length) h += '<div class="empty">Nothing yet.</div>';
        list.forEach(function (id, i) {
          var d = YN.effectById(id), st = S.effectState(id);
          h += '<div class="eff' + (i === p.sel ? ' sel' : '') + (id === eq ? ' on' : '') + (st === 'dream' ? ' unsaved' : '') + '" data-i="' + i + '"><img src="' + YN.spr.iconURL(d.icon) + '" alt=""></div>';
        });
        h += '</div>';
        var cur = list[p.sel] && YN.effectById(list[p.sel]);
        h += '<div class="edesc">' + (cur ? '<b>' + U.escape(cur.name) + '</b>' + (S.effectState(cur.id) === 'dream' ? ' <span class="ns">(not kept yet)</span>' : '') + '<br>' + U.escape(cur.desc || '') : '') + '</div>';
        h += '<div class="hint">Enter: wear / remove · Esc: close</div>';
        p.node.innerHTML = h;
        Array.prototype.forEach.call(p.node.querySelectorAll('.eff'), function (n) { n.addEventListener('click', function () { p.sel = +n.dataset.i; p.toggle(); }); });
        var selN = p.node.querySelector('.eff.sel'); if (selN && selN.scrollIntoView) selN.scrollIntoView({ block: 'nearest' });
      };
      p.toggle = function () {
        var id = list[p.sel]; if (!id) return;
        if (G.equipped() === id) { S.perm.equipped = null; YN.audio.sfx('menu_back'); }
        else { S.perm.equipped = id; YN.audio.sfx('reveal'); var d = YN.effectById(id); if (d.onEquip) YN.act.run(d.onEquip); }
        G.player.floating = false; G.player.hiding = false; G.player.statue = false;
        G.player.small = !!(YN.effectById(id) && YN.effectById(id).caps && YN.effectById(id).caps.indexOf('small') >= 0 && S.perm.equipped === id);
        eq = G.equipped(); G.lightChanged();
        UI.pop(p); UI.hud.refresh();
      };
      p.onKey = function (e) {
        var c = e.code, n = list.length;
        if (c === 'Escape' || c === 'Tab' || c === 'KeyI') { UI.pop(p); return; }
        if (!n) return;
        if (c === 'ArrowRight' || c === 'KeyD') p.sel = (p.sel + 1) % n;
        else if (c === 'ArrowLeft' || c === 'KeyA') p.sel = (p.sel + n - 1) % n;
        else if (c === 'ArrowDown' || c === 'KeyS') p.sel = Math.min(n - 1, p.sel + cols);
        else if (c === 'ArrowUp' || c === 'KeyW') p.sel = Math.max(0, p.sel - cols);
        else if (c === 'Enter' || c === 'Space' || c === 'NumpadEnter') { p.toggle(); return; }
        else return false;
        YN.audio.sfx('menu_move'); p.render();
      };
      UI.root.appendChild(p.node); p.render(); UI.push(p);
    }
  };

  /* ---------- paramètres ---------- */
  UI.settings = function () {
    var s = YN.save.settings;
    var defs = [
      ['master', 'Master volume', 'range'], ['music', 'Music', 'range'], ['sfx', 'Sound effects', 'range'], ['ambience', 'Ambience', 'range'], ['voice', 'Voices', 'range'],
      ['jumpscare', 'Jump scares', 'choice', ['soft', 'normal']], ['reduceFlash', 'Reduce flashes', 'bool'], ['reduceMotion', 'Reduce motion', 'bool'],
      ['reduceDistortion', 'Reduce distortion', 'bool'], ['darkAssist', 'Help in the dark', 'bool'], ['timerVisible', 'Show the countdown', 'bool'],
      ['camera', 'Camera', 'choice', ['direct', 'smooth']], ['cameraFx', 'Camera shake', 'bool'], ['pixelMove', 'Pixel movement', 'bool'], ['translate', 'Translate speech', 'choice', ['never', 'with the Earpiece', 'always']], ['uiScale', 'Interface size', 'scale'], ['pixelPerfect', 'Sharp pixels', 'bool'], ['showFps', 'Frames per second', 'bool']
    ];
    function label(d) {
      var v = s[d[0]];
      if (d[2] === 'range') return d[1] + ' <span class="val">' + Math.round(v * 100) + '%</span>';
      if (d[2] === 'bool') return d[1] + ' <span class="val">' + (v ? 'on' : 'off') + '</span>';
      if (d[2] === 'choice') return d[1] + ' <span class="val">' + d[3][v] + '</span>';
      if (d[2] === 'scale') return d[1] + ' <span class="val">' + Math.round(v * 100) + '%</span>';
      return d[1];
    }
    function change(d, dir) {
      var k = d[0];
      if (d[2] === 'range') s[k] = U.clamp(Math.round((s[k] + dir * 0.1) * 10) / 10, 0, 1);
      else if (d[2] === 'bool') s[k] = !s[k];
      else if (d[2] === 'choice') s[k] = (s[k] + (dir || 1) + d[3].length) % d[3].length;
      else if (d[2] === 'scale') s[k] = U.clamp(Math.round((s[k] + dir * 0.1) * 10) / 10, 0.8, 1.6);
      YN.save.writeSettings(); YN.audio.applyVolumes(); UI.applyScale(); YN.render.resize(); UI.hud.refresh();
    }
    var items = defs.map(function (d) { return { label: label(d), fn: function (p) { change(d, 1); p.items[p.sel].label = label(d); p.render(); }, d: d }; });
    items.push({ label: 'Controls…', fn: function () { UI.controls(); } });
    items.push({ label: 'Controls: defaults', fn: function () { YN.input.resetMap(); UI.toast('Controls reset.'); } });
    items.push({ label: 'Export save', fn: function () { UI.exportSave(); } });
    items.push({ label: 'Import a save', fn: function () { UI.importSave(); } });
    items.push({ label: 'Delete save', fn: function () { UI.confirm('Permanently erase all progress?', function () { YN.save.wipe(); UI.toast('Save deleted.'); }); } });
    items.push({ label: 'Back', fn: function (p) { p.close(); } });
    UI.panel({ cls: 'settings', title: 'Settings', items: items, onBack: function (p) { p.close(); }, onKey: function (e, p) {
      var it = p.items[p.sel];
      if (it && it.d && (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyA' || e.code === 'KeyD')) { change(it.d, (e.code === 'ArrowLeft' || e.code === 'KeyA') ? -1 : 1); it.label = label(it.d); p.render(); YN.audio.sfx('menu_move'); return true; }
    } });
  };
  /* ---------- remappage des touches ---------- */
  UI.controls = function () {
    var I = YN.input, ACTS = [['up', 'Up'], ['down', 'Down'], ['left', 'Left'], ['right', 'Right'], ['act', 'Interact'], ['back', 'Back'], ['run', 'Run'], ['effect', 'Use effect'], ['effects', 'Effects list'], ['speak', 'Speak'], ['map', 'Map'], ['pinch', 'Pinch yourself']];
    var wait = null;
    var name = function (c) { return String(c || '?').replace('ArrowUp', '↑').replace('ArrowDown', '↓').replace('ArrowLeft', '←').replace('ArrowRight', '→').replace('Key', '').replace('Digit', '').replace('Numpad', 'Num ').replace('Arrow', '').replace('Escape', 'Esc').replace('ShiftLeft', 'Shift').replace('ShiftRight', 'R Shift').replace('Backquote', '`'); };
    var label = function (a) { return a[1] + ' <span class="val">' + (wait === a[0] ? '… press a key' : (I.map[a[0]] || []).map(name).join(' / ')) + '</span>'; };
    var items = ACTS.map(function (a) { return { label: label(a), fn: function (p) { wait = a[0]; p.items.forEach(function (it, i) { if (ACTS[i]) it.label = label(ACTS[i]); }); p.render(); }, a: a }; });
    items.push({ label: 'Defaults', fn: function (p) { I.resetMap(); p.items.forEach(function (it, i) { if (ACTS[i]) it.label = label(ACTS[i]); }); p.render(); UI.toast('Controls reset.'); } });
    items.push({ label: 'Back', fn: function (p) { p.close(); } });
    UI.panel({ cls: 'settings', title: 'Controls', items: items, onBack: function (p) { if (wait) { wait = null; p.items.forEach(function (it, i) { if (ACTS[i]) it.label = label(ACTS[i]); }); p.render(); return; } p.close(); }, onKey: function (e, p) {
      if (!wait) return false;
      var code = e.code; e.preventDefault && e.preventDefault();
      if (code !== 'Escape') {
        U.keys(I.map).forEach(function (k) { I.map[k] = (I.map[k] || []).filter(function (c) { return c !== code; }); });
        var cur = I.map[wait] || []; I.map[wait] = [code].concat(cur.slice(0, 1)); I.saveMap(); YN.audio.sfx('menu_ok');
      }
      wait = null; p.items.forEach(function (it, i) { if (ACTS[i]) it.label = label(ACTS[i]); }); p.render();
      return true;
    } });
  };
  UI.exportSave = function () {
    var txt = YN.store.get('yn_dream_archive_save') || '';
    UI.panel({ cls: 'io', title: 'Save', html: '<textarea readonly>' + U.escape(txt) + '</textarea><p>Copy this text to keep it.</p>', items: [{ label: 'Close', fn: function (p) { p.close(); } }], onBack: function (p) { p.close(); } });
  };
  UI.importSave = function () {
    var p = UI.panel({ cls: 'io', title: 'Import', html: '<textarea id="imp"></textarea>', items: [
      { label: 'Import', fn: function (pp) {
        var v = document.getElementById('imp').value.trim();
        try { var box = JSON.parse(v); if (YN.save.checksum(box.payload) !== box.sum) throw new Error('checksum'); YN.store.set('yn_dream_archive_save', v); YN.save.load(); UI.toast('Save imported.'); pp.close(); }
        catch (e) { UI.toast('Unreadable save.'); }
      } },
      { label: 'Cancel', fn: function (pp) { pp.close(); } }
    ], onBack: function (pp) { pp.close(); } });
    var ta = p.node.querySelector('textarea');
    ta.addEventListener('focus', function () { YN.input.typing = true; }); ta.addEventListener('blur', function () { YN.input.typing = false; });
  };
  UI.credits = function () {
    UI.panel({ cls: 'credits', title: 'Credits', html: '<p>A dreamlike exploration game, a loose homage to <i>Yume Nikki</i> (Kikiyama, 2004). No original material is reused: sprites, music and worlds are all generated by this project’s code.</p><p>The procedural music can be replaced: see <code>src/audio/music_config.js</code>.</p><p class="small">What you read here does not tell it all.</p>', items: [{ label: 'Back', fn: function (p) { p.close(); } }], onBack: function (p) { p.close(); } });
  };

  /* ---------- parler ---------- */
  UI.speak = {
    open: function (mode) {
      var p = { node: el('div', 'speak') };
      p.node.innerHTML = '<span class="lbl">' + (mode === 'write' ? 'She writes:' : 'She says:') + '</span><input type="text" maxlength="80" autocomplete="off" spellcheck="false">';
      UI.root.appendChild(p.node);
      var inp = p.node.querySelector('input');
      YN.input.typing = true;
      var close = function () { YN.input.typing = false; UI._typingEsc = null; UI.pop(p); };
      UI._typingEsc = close;
      inp.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.code === 'Enter' || e.code === 'NumpadEnter') { var v = inp.value; close(); if (mode === 'write') YN.bus.emit('write', v); else YN.speech.say(v); }
        else if (e.code === 'Escape') close();
      });
      p.onKey = function () { return false; };
      UI.push(p); YN.input.typing = true;
      setTimeout(function () { inp.focus(); }, 20);
    }
  };

  /* ---------- mélodie (5 notes) ---------- */
  var NOTE_NAMES = ['do', 're', 'mi', 'sol', 'la'], NOTE_ST = [0, 2, 4, 7, 9];
  UI.notepad = {
    open: function () {
      var p = { node: el('div', 'panel notepad'), seq: [], timer: null };
      p.node.innerHTML = '<div class="keys">' + NOTE_NAMES.map(function (n, i) { return '<div class="k" data-i="' + i + '"><b>' + (i + 1) + '</b>' + n + '</div>'; }).join('') + '</div><div class="seq"></div><div class="hint">1–5: play · Esc: stop</div>';
      UI.root.appendChild(p.node);
      var play = function (i) {
        YN.audio.sfx('chime', { note: NOTE_ST[i] });
        YN.render.addFx({ type: 'note', x: YN.game.player.x, y: YN.game.player.y, life: 1, text: '♪' });
        p.seq.push(i); p.node.querySelector('.seq').textContent = p.seq.map(function (k) { return NOTE_NAMES[k]; }).join(' ');
        var k = p.node.querySelector('.k[data-i="' + i + '"]'); k.classList.add('hit'); setTimeout(function () { k.classList.remove('hit'); }, 150);
        YN.game.noise(YN.game.player.x, YN.game.player.y, 3, 'music');
        clearTimeout(p.timer); p.timer = setTimeout(function () { submit(); }, 1600);
      };
      var submit = function () {
        if (!p.seq.length) return;
        var s = p.seq.slice(); p.seq = []; p.node.querySelector('.seq').textContent = '';
        var str = s.join('');
        if (YN.data.lullaby && str.indexOf(YN.data.lullaby) >= 0 && YN.priestess) YN.priestess.lullaby();
        YN.world.mechCall(YN.game.rt, 'onMelody', str, s);
        YN.bus.emit('melody', str);
      };
      Array.prototype.forEach.call(p.node.querySelectorAll('.k'), function (k) { k.addEventListener('click', function () { play(+k.dataset.i); }); });
      p.onKey = function (e) {
        var m = /^(Digit|Numpad)([1-5])$/.exec(e.code);
        if (m) { play(+m[2] - 1); return; }
        if (e.code === 'Escape' || e.code === 'KeyF') { clearTimeout(p.timer); submit(); UI.pop(p); return; }
        return false;
      };
      UI.push(p);
    }
  };

  /* ---------- cadran téléphonique ---------- */
  UI.dialpad = {
    open: function () {
      var p = { node: el('div', 'panel dialpad'), num: '' };
      p.render = function () { p.node.innerHTML = '<div class="num">' + (p.num || '…') + '</div><div class="hint">0–9: dial · Enter: call · Esc: hang up</div>'; };
      UI.root.appendChild(p.node); p.render();
      p.onKey = function (e) {
        var m = /^(Digit|Numpad)([0-9])$/.exec(e.code);
        if (m && p.num.length < 12) { p.num += m[2]; YN.audio.sfx('dial', { d: +m[2] }); p.render(); return; }
        if (e.code === 'Backspace') { p.num = p.num.slice(0, -1); p.render(); return; }
        if (e.code === 'Enter' || e.code === 'NumpadEnter') { var n = p.num; UI.pop(p); YN.phone.call(n); return; }
        if (e.code === 'Escape') { UI.pop(p); return; }
        return false;
      };
      UI.push(p);
    }
  };
  YN.phone = {
    call: function (n) {
      YN.audio.sfx('phone_ring', { vol: 0.4 });
      setTimeout(function () {
        if (YN.world.mechCall(YN.game.rt, 'onCall', n)) return;
        var e = YN.data.phone && YN.data.phone[n];
        if (e && (!e.cond || YN.cond.check(e.cond))) { YN.audio.sfx('phone_pick'); if (e.lines) UI.dialog.queue(e.lines); if (e.do) YN.act.run(e.do); }
        else UI.toast('No one picks up.');
      }, 900);
    }
  };

  /* ---------- radio ---------- */
  UI.radio = {
    open: function () {
      var p = { node: el('div', 'panel radio'), f: YN.save.temp('radioF') || 88.0 };
      var stat = YN.audio.texture('static', 0.06, YN.audio.bus && YN.audio.bus.amb);
      p.render = function () {
        var st = UI.radio.station(p.f);
        p.node.innerHTML = '<div class="freq">' + p.f.toFixed(1) + ' MHz</div><div class="bar"><i style="left:' + ((p.f - 87.5) / 20.5 * 100) + '%"></i></div><div class="voice">' + (st ? (function () { var rr = YN.lang.render(st.line); return rr.html + (rr.tr ? '<div class="tr">' + U.escape(rr.tr) + '</div>' : ''); })() : '<span class="noise">░▒░░▒░</span>') + '</div><div class="hint">← →: tune · Esc: switch off</div>';
        if (stat && stat.setVol) stat.setVol(st ? 0.01 : 0.06);
        if (st && st.do && !st._done) { st._done = true; YN.act.run(st.do); }
      };
      UI.root.appendChild(p.node); p.render();
      p.onKey = function (e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') { p.f = Math.max(87.5, Math.round((p.f - 0.1) * 10) / 10); }
        else if (e.code === 'ArrowRight' || e.code === 'KeyD') { p.f = Math.min(108, Math.round((p.f + 0.1) * 10) / 10); }
        else if (e.code === 'Escape' || e.code === 'KeyF') { YN.save.temp('radioF', p.f); if (stat) stat.stop(); UI.pop(p); return; }
        else return false;
        p.render();
      };
      UI.push(p);
    },
    station: function (f) {
      var key = f.toFixed(1), rt = YN.game.rt;
      var local = rt && rt.def.radio && rt.def.radio[key];
      if (local && (!local.cond || YN.cond.check(local.cond))) return local;
      var g = YN.data.radio && YN.data.radio[key];
      if (g && (!g.cond || YN.cond.check(g.cond))) return g;
      return null;
    }
  };

  /* ---------- carte (effet Carte) ---------- */
  UI.minimap = {
    on: false,
    toggle: function () { UI.minimap.on = !UI.minimap.on; var c = document.getElementById('minimap'); c.style.display = UI.minimap.on ? 'block' : 'none'; },
    draw: function () {
      if (!UI.minimap.on || !YN.game.rt) return;
      var rt = YN.game.rt, c = document.getElementById('minimap'), x = c.getContext('2d'), p = YN.game.player;
      var R = 40; c.width = R * 2; c.height = R * 2;
      x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(0, 0, R * 2, R * 2);
      for (var yy = -R; yy < R; yy++) for (var xx = -R; xx < R; xx++) {
        var inf = YN.tileInfo(rt.tile(p.x + xx, p.y + yy));
        if (inf.void) continue;
        x.fillStyle = inf.wall || inf.tall ? '#8a8aa0' : inf.water ? '#3060a0' : inf.pass ? '#2a2a38' : '#555';
        x.fillRect(xx + R, yy + R, 1, 1);
      }
      rt.marks.forEach(function (m) { if (m.active && !m.hidden && YN.DOOR_TYPES[m.type]) { x.fillStyle = '#f0d060'; x.fillRect(m.x - p.x + R - 1, m.y - p.y + R - 1, 2, 2); } });
      x.fillStyle = '#fff'; x.fillRect(R - 1, R - 1, 2, 2);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
