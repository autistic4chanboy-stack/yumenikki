/* =========================================================================
 *  42 ORIGINS — application
 *  Relie l'éditeur, les moteurs, le débogueur (pas, par-dessus, sortir,
 *  retour, points d'arrêt, vitesse), les vues mémoire / processeur, la
 *  console et les missions. Sauvegarde locale du code et de la progression.
 * ========================================================================= */
(function () {
  'use strict';
  var O42 = window.O42, U = O42.util;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var LANG = {
    c: { file: 'main.c', name: 'C', icon: 'C' },
    py: { file: 'main.py', name: 'Python', icon: 'Py' },
    asm: { file: 'main.s', name: 'Assembleur x86-64', icon: 'ASM' },
    cobol: { file: 'main.cob', name: 'COBOL', icon: 'COB' },
    cyber: { file: 'charge.txt', name: 'Cybersécurité', icon: 'SEC', cyber: true }
  };
  var DOMAINS = ['c', 'py', 'asm', 'cobol', 'cyber'];
  var SPEEDS = [
    { l: '0,5 pas/s', ms: 2000 }, { l: '1 pas/s', ms: 1000 }, { l: '2 pas/s', ms: 500 }, { l: '4 pas/s', ms: 250 },
    { l: '8 pas/s', ms: 125 }, { l: '20 pas/s', ms: 50 }, { l: '60 pas/s', ms: 16 }, { l: '300 pas/s', ms: 0, per: 5 }, { l: 'instantané', ms: 0, per: Infinity }
  ];
  var FILES_DEFAULT = 'Bonjour depuis un fichier !\nDeuxième ligne.\n';

  /* ---------------------------------------------------------------- stockage */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('42o.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('42o.' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  var S = {
    lang: 'c', mode: 'missions', view: 'list', mid: 0, ex: 0,
    m: null, dirty: false, running: false, timer: null, raf: 0,
    bps: new Set(), lastLine: 0, compileErr: null,
    speed: store.get('speed', 3), live: store.get('live', false),
    progress: O42.profile.load(), unlocked: store.get('unlocked', false),
    hintsShown: {}, results: null, won: {}, sceneCache: {}, fails: {}, openCh: {}
  };

  /* ---------------------------------------------------------------- éléments */
  var ed, mem, cpu;
  var el = {};

  function init() {
    if (O42.finalizeMissions) O42.finalizeMissions();
    ['side', 'term', 'explain', 'status', 'stdin', 'file-txt', 'next-line', 'exit-badge', 'compile-msg', 'dirty', 'cpu', 'speed', 'speed-val', 'file-name', 'live', 'xp', 'toast', 'modal'].forEach(function (id) { el[id] = document.getElementById(id); });
    ed = new O42.Editor(document.getElementById('editor'), { onChange: onCode, onGutter: toggleBp });
    mem = new O42.MemView(document.getElementById('mem'));
    cpu = new O42.CpuView(el.cpu);

    $$('.langs button').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.lang, S.mode); }); });
    $$('.modes button').forEach(function (b) { b.addEventListener('click', function () { go(S.lang, b.dataset.mode); }); });
    $$('.tab').forEach(function (b) { b.addEventListener('click', function () { tab(b.dataset.tab); }); });
    $('#btn-run').addEventListener('click', function () { run(); });
    $('#btn-pause').addEventListener('click', pause);
    $('#btn-step').addEventListener('click', function () { act(stepInto); });
    $('#btn-over').addEventListener('click', function () { act(stepOver); });
    $('#btn-out').addEventListener('click', function () { act(stepOut); });
    $('#btn-back').addEventListener('click', function () { act(stepBack); });
    $('#btn-restart').addEventListener('click', function () { pause(); restart(); });
    $('#btn-validate').addEventListener('click', validate);
    $('#btn-replay').addEventListener('click', function () { replay(); });
    $('#btn-fresh').addEventListener('click', function () { pause(); restart(); });
    $('#btn-reset-code').addEventListener('click', function () { resetCode(false); });
    $('#btn-help').addEventListener('click', help);
    $('#btn-home').addEventListener('click', function () { O42.home.show(); });
    $('#btn-profile').addEventListener('click', function () { O42.home.profile(); });
    $('#btn-rank').addEventListener('click', function () { O42.home.leaderboard(); });
    var adv = document.getElementById('opt-adv');
    adv.checked = store.get('adv', false);
    document.body.classList.toggle('simple', !adv.checked);
    adv.addEventListener('change', function () {
      store.set('adv', adv.checked);
      document.body.classList.toggle('simple', !adv.checked);
      if (!adv.checked) { document.body.classList.remove('no-side'); store.set('noSide', false); }
      tabsFor(); setTimeout(function () { if (S.m) render({ scroll: false }); }, 30);
    });
    document.body.classList.toggle('no-side', store.get('noSide', false));
    $('#btn-side').addEventListener('click', function () {
      var on = !document.body.classList.contains('no-side');
      document.body.classList.toggle('no-side', on); store.set('noSide', on);
      setTimeout(function () { if (S.m) render({ scroll: false }); }, 50);
    });
    $('#brand').addEventListener('click', function (e) { e.preventDefault(); O42.home.show(); });
    var ow = document.getElementById('opt-wires'), ob = document.getElementById('opt-bytes');
    ow.checked = store.get('wires', true); ob.checked = store.get('bytes', false);
    mem.wires = ow.checked; mem.bytes = ob.checked;
    ow.addEventListener('change', function () { store.set('wires', ow.checked); mem.setOptions({ wires: ow.checked }); });
    ob.addEventListener('change', function () { store.set('bytes', ob.checked); mem.setOptions({ bytes: ob.checked }); });
    el.speed.value = S.speed;
    el.speed.addEventListener('input', function () { S.speed = +el.speed.value; store.set('speed', S.speed); speedLabel(); });
    speedLabel();
    el.live.checked = S.live;
    el.live.addEventListener('change', function () { S.live = el.live.checked; store.set('live', S.live); if (S.live) liveRun(); });
    el.stdin.addEventListener('input', function () { saveStdin(); markDirty(); });
    el['file-txt'].addEventListener('input', function () { store.set('file', el['file-txt'].value); markDirty(); });
    el['file-txt'].value = store.get('file', FILES_DEFAULT);
    document.addEventListener('keydown', keys);
    el.modal.addEventListener('click', function (e) { if (e.target === el.modal || e.target.closest('.close')) closeModal(); });
    window.addEventListener('hashchange', fromHash);

    fromHash();
    if (!store.get('welcomed', false)) welcome();
  }

  /* ---------------------------------------------------------------- navigation */
  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '').split('/');
    var lang = LANG[h[0]] ? h[0] : store.get('lang', 'c');
    var mode = h[1] === 'sandbox' ? 'sandbox' : h[1] === 'missions' ? 'missions' : store.get('mode', 'missions');
    var idx = h[2] !== undefined && h[2] !== '' ? +h[2] : null;
    open(lang, mode, idx);
  }
  function go(lang, mode, idx) {
    var h = '#' + lang + '/' + mode + (idx !== undefined && idx !== null ? '/' + idx : '');
    try { if (location.hash !== h) history.replaceState(null, '', h); } catch (e) { /* adresse non modifiable (page intégrée) */ }
    open(lang, mode, idx);
  }
  function open(lang, mode, idx) {
    pause();
    var langChanged = lang !== S.lang || !ed.lines;
    S.lang = lang; S.mode = mode;
    store.set('lang', lang); store.set('mode', mode);
    $$('.langs button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === lang); });
    $$('.modes button').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === mode); });
    el['file-name'].textContent = LANG[lang].file;
    el.cpu.hidden = lang !== 'asm';
    document.body.dataset.lang = lang;
    document.body.classList.toggle('cyber', lang === 'cyber');
    S.exam = null;
    var mt = document.getElementById('mem-title'), mi0 = document.getElementById('mem-ico');
    if (mt) { mt.textContent = lang === 'cyber' ? 'Cible' : 'Mémoire'; if (mi0) mi0.textContent = lang === 'cyber' ? '🎯' : '🧠'; }
    $('#btn-run span').textContent = lang === 'cyber' ? 'Lancer l’attaque' : 'Exécuter';
    S.results = null;
    S.m = null; S.compileErr = null; S.sceneCache = {};
    if (mode === 'missions') {
      var list = O42.missions[lang];
      if (idx !== null && idx !== undefined && list[idx] && unlocked(lang, idx)) { S.view = 'mission'; S.mid = idx; }
      else if (idx === null || idx === undefined) { S.view = 'list'; S.mid = store.get('mid.' + lang, firstTodo(lang)); }
      else { S.view = 'list'; S.mid = firstTodo(lang); }
      loadCode(missionKey(), mission().starter, mission().stdin || '');
    } else {
      S.view = 'sandbox';
      S.ex = idx !== null && idx !== undefined && O42.examples[lang][idx] ? idx : store.get('ex.' + lang, 0);
      var ex = O42.examples[lang][S.ex];
      loadCode('sb.' + lang + '.' + S.ex, ex.code, ex.stdin || '');
    }
    if (langChanged) mem.closed = {};
    side();
    tabsFor();
    xp();
    restart();
  }
  function mission() { return O42.missions[S.lang][S.mid]; }
  function missionKey() { return 'code.' + mission().id; }
  function codeKey() { return S.mode === 'missions' ? missionKey() : 'sb.' + S.lang + '.' + S.ex; }
  function loadCode(key, def, stdin) {
    S.bps = new Set(store.get('bp.' + key, []));
    ed.set(store.get(key, def), S.lang);
    el.stdin.value = store.get('in.' + key, stdin);
  }
  var saveT = 0;
  function saveCode() { clearTimeout(saveT); saveT = setTimeout(function () { store.set(codeKey(), ed.value()); }, 300); }
  function saveStdin() { store.set('in.' + codeKey(), el.stdin.value); }
  function resetCode() {
    var def = S.mode === 'missions' ? mission().starter : O42.examples[S.lang][S.ex].code;
    if (ed.value() !== def && !arguments[0]) { ask('Remettre le code de départ ? Tes modifications seront perdues.', 'Remettre', function () { resetCode(true); }); return; }
    ed.set(def, S.lang);
    store.set(codeKey(), def);
    el.stdin.value = S.mode === 'missions' ? (mission().stdin || '') : (O42.examples[S.lang][S.ex].stdin || '');
    saveStdin();
    pause(); restart();
  }
  function chapterOf(lang, k) { return O42.missions[lang].filter(function (m) { return m.ch === k; }); }
  function doneIn(lang, k) { return chapterOf(lang, k).filter(function (m) { return S.progress[m.id]; }).length; }
  /* un chapitre s'ouvre quand la moitié du précédent est réussie */
  function chapterOpen(lang, k) { return S.unlocked || k === 1 || doneIn(lang, k - 1) >= 5 || doneIn(lang, k) > 0; }
  function unlocked(lang, i) { var m = O42.missions[lang][i]; return !!m && chapterOpen(lang, m.ch); }
  function firstTodo(lang) { var l = O42.missions[lang]; for (var i = 0; i < l.length; i++) if (!S.progress[l[i].id] && unlocked(lang, i)) return i; return 0; }
  function xp() {
    var P = O42.profile, stars = P.total(S.progress);
    el.xp.textContent = '★ ' + stars;
    var av = document.getElementById('xp-av'); if (av) av.textContent = P.me().avatar;
  }

  /* ---------------------------------------------------------------- panneau latéral */
  function stars(n) { return '★★★★★'.slice(0, n) + '<i>' + '★★★★★'.slice(0, 5 - n) + '</i>'; }
  function side() {
    var h = '', L = S.lang;
    if (S.mode === 'missions' && S.view === 'list') {
      var list = O42.missions[L], done = list.filter(function (m) { return S.progress[m.id]; }).length, cur0 = firstTodo(L);
      var openCh = S.openCh[L] || (list[cur0] ? list[cur0].ch : 1);
      h += '<div class="side-card"><div class="side-h"><h2>Missions ' + LANG[L].name + '</h2><div class="grow"></div><span class="count">' + done + ' / ' + list.length + '</span></div>' +
        '<div class="progress"><i style="width:' + (100 * done / list.length) + '%"></i></div>' +
        '<button class="continue" id="m-continue" type="button">▶ Continuer : <b>' + U.esc(list[cur0].title) + '</b><span>chapitre ' + list[cur0].ch + ' · mission ' + list[cur0].ord + '</span></button>' +
        '<div class="chapters">';
      O42.chapters[L].forEach(function (c, ci) {
        var k = ci + 1, ms = [], dn = doneIn(L, k), open = chapterOpen(L, k);
        list.forEach(function (m, i) { if (m.ch === k) ms.push(i); });
        h += '<div class="chap' + (k === openCh ? ' open' : '') + (open ? '' : ' locked') + (dn === ms.length && ms.length ? ' full' : '') + '">' +
          '<button class="chap-h" data-k="' + k + '" type="button"><span class="chap-n">' + k + '</span><span class="chap-t"><b>' + U.esc(c.t) + '</b><span>' + (open ? U.esc(c.d) : '🔒 réussis 5 missions du chapitre ' + (k - 1) + ' pour l’ouvrir') + '</span></span>' +
          '<span class="chap-p"><i style="width:' + (ms.length ? 100 * dn / ms.length : 0) + '%"></i></span><span class="chap-c">' + dn + '/' + ms.length + '</span></button>';
        if (k === openCh && open) {
          h += '<div class="chap-b">';
          ms.forEach(function (i) {
            var m = list[i], ok = !!S.progress[m.id];
            h += '<button class="mrow' + (ok ? ' done' : '') + (i === cur0 ? ' cur' : '') + (m.final ? ' final' : '') + '" data-i="' + i + '" type="button"><span class="mr-n">' + (ok ? '✓' : m.ord) + '</span><span class="mr-t">' + U.esc(m.title) + (m.final ? ' <em>contrat final</em>' : '') + '</span><span class="mr-s">' + stars(m.stars) + '</span></button>';
          });
          var exUnlocked = O42.exam.unlocked(S.progress, L, k), exPassed = O42.exam.passed(S.progress, L, k);
          h += '<button class="examrow' + (exPassed ? ' done' : exUnlocked ? ' ready' : ' locked') + '" data-k="' + k + '" type="button"' + (exUnlocked ? '' : ' disabled') + '>' +
            '<span class="mr-n">🎖</span><span class="mr-t">Examen chronométré' + (exPassed ? ' <em>réussi</em>' : exUnlocked ? ' <em>prêt</em>' : '') + '</span><span class="mr-s">' + (exUnlocked ? '⏱ 3:00' : '🔒') + '</span></button>';
          h += '</div>';
        }
        h += '</div>';
      });
      h += '</div>' + (S.unlocked ? '' : '<button class="unlock-all" type="button" id="unlock-all">Tout débloquer (mode enseignant)</button>') + '</div>';
      el.side.innerHTML = h;
      $$('.mrow', el.side).forEach(function (b) { b.addEventListener('click', function () { go(L, 'missions', +b.dataset.i); }); });
      $$('.examrow:not([disabled])', el.side).forEach(function (b) { b.addEventListener('click', function () { O42.exam.start(L, +b.dataset.k); }); });
      $$('.chap-h', el.side).forEach(function (b) { b.addEventListener('click', function () { var k = +b.dataset.k; S.openCh[L] = S.openCh[L] === k ? -1 : k; side(); }); });
      $('#m-continue').addEventListener('click', function () { go(L, 'missions', cur0); });
      var ua = $('#unlock-all'); if (ua) ua.addEventListener('click', function () { S.unlocked = true; store.set('unlocked', true); side(); });
      return;
    }
    if (S.mode === 'missions') {
      var m = mission(), shown = S.hintsShown[m.id] || 0, res = S.results, all = O42.missions[L];
      var prevOk = S.mid > 0 && unlocked(L, S.mid - 1), nextOk = S.mid < all.length - 1 && unlocked(L, S.mid + 1);
      var chap = O42.chapters[L][m.ch - 1];
      h += '<div class="side-card mission"><div class="m-top"><button class="back" type="button" id="m-back">← Chapitres</button>' +
        '<div class="grow"></div>' +
        '<span class="m-nav"><button type="button" id="m-prev"' + (prevOk ? '' : ' disabled') + ' title="Mission précédente">‹</button><b>' + m.ch + '.' + m.ord + '</b><button type="button" id="m-next2"' + (nextOk ? '' : ' disabled') + ' title="Mission suivante">›</button></span></div>' +
        '<span class="m-job">Chapitre ' + m.ch + ' · ' + U.esc(chap ? chap.t : '') + (m.final ? ' · contrat final' : '') + '</span>' +
        '<h2 class="m-title">' + (S.progress[m.id] ? '✅ ' : '') + U.esc(m.title) + ' <span class="stars">' + stars(m.stars) + '</span></h2>' +
        (m.scene && m.scene !== 'terminal' ? '<div class="scene" id="scene"></div>' : '') +
        (m.story ? '<p class="story">' + m.story + '</p>' : '') +
        '<div class="goal"><h4>🎯 Objectif</h4>' + m.goal + '</div>' +
        '<ol class="howto"><li>Lis l’objectif</li><li>Complète le code</li><li>Teste : <b>▶</b> ou <b>⤓</b></li><li>Clique <b>✅ Valider</b></li></ol>' +
        (m.lesson ? '<details class="lesson"' + (m.ord === 1 ? ' open' : '') + '><summary>📘 Leçon</summary><div class="lesson-b">' + m.lesson + '</div></details>' : '') +
        '<div class="hints">' + m.hints.slice(0, shown).map(function (t, i) { return '<div class="hint"><b>Indice ' + (i + 1) + ' :</b> ' + U.esc(t) + '</div>'; }).join('') + '</div>' +
        '<div class="m-actions"><button class="go" id="m-validate" type="button">✅ Valider la mission</button>' +
        (shown < m.hints.length ? '<button id="m-hint" type="button">💡 Indice ' + (shown + 1) + '/' + m.hints.length + '</button>' : '') +
        (shown >= m.hints.length || (S.fails[m.id] || 0) >= 2 || S.progress[m.id] ? '<button id="m-sol" type="button">👁 Solution</button>' : '') + '</div>';
      if (res && !res.ok) {
        var nOk = res.results.filter(function (r) { return r.ok; }).length;
        h += '<div class="results"><div class="res-h">Pas encore : ' + nOk + ' test' + (nOk > 1 ? 's' : '') + ' réussi' + (nOk > 1 ? 's' : '') + ' sur ' + res.results.length + '</div>' + res.statics.map(function (s) { return '<div class="res ko">✖ ' + U.esc(s) + '</div>'; }).join('') + res.results.map(function (r) {
          var d = '';
          if (!r.ok && !r.skipped && r.expect !== undefined && r.got !== r.expect) d = '<div class="diff">' + (r.stdin ? '<span>entrée</span><code>' + U.esc(vis(r.stdin)) + '</code>' : '') + '<span>attendu</span><code>' + U.esc(vis(r.expect)) + '</code><span>obtenu</span><code>' + U.esc(vis(r.got)) + '</code></div>';
          return '<div class="res ' + (r.ok ? 'ok' : 'ko') + '">' + (r.ok ? '✔' : '✖') + ' <b>Test ' + r.n + '</b>' + (r.stdin && r.ok ? ' <span style="color:var(--dimmer)">(entrée ' + U.esc(vis(r.stdin).slice(0, 30)) + ')</span>' : '') + r.why.map(function (w) { return '<div class="why">' + U.esc(w) + '</div>'; }).join('') + d + '</div>';
        }).join('') + '</div>';
      }
      h += '</div>';
      el.side.innerHTML = h;
      $('#m-back').addEventListener('click', function () { S.openCh[L] = m.ch; go(L, 'missions'); });
      $('#m-prev').addEventListener('click', function () { go(L, 'missions', S.mid - 1); });
      $('#m-next2').addEventListener('click', function () { go(L, 'missions', S.mid + 1); });
      $('#m-validate').addEventListener('click', validate);
      var hb = $('#m-hint'); if (hb) hb.addEventListener('click', function () { S.hintsShown[m.id] = shown + 1; side(); renderScene(); });
      var sb = $('#m-sol'); if (sb) sb.addEventListener('click', function () {
        ask('Afficher une solution dans l’éditeur ? Ton code actuel sera remplacé (tu peux revenir au code de départ avec « Code initial »).', 'Afficher la solution', function () {
          ed.set(m.solution, L); store.set(codeKey(), m.solution); pause(); restart();
        });
      });
      renderScene();
      return;
    }
    // bac à sable
    h += '<div class="side-card"><div class="side-h"><h2>Bac à sable</h2><div class="grow"></div><span class="count">' + LANG[L].name + '</span></div>' +
      '<p class="city">Écris le code que tu veux et regarde ce qui se passe dans la mémoire, ligne par ligne. Coche <b>Direct</b> pour voir le résultat pendant que tu écris. Pars d’un exemple :</p><div class="ex-list">';
    O42.examples[L].forEach(function (ex, i) { h += '<button class="ex-btn' + (i === S.ex ? ' on' : '') + '" data-i="' + i + '" type="button"><b>' + U.esc(ex.t) + '</b><span>' + U.esc(ex.d) + '</span></button>'; });
    h += '</div></div><div class="side-card memo"><div class="side-h"><h2>Mémo</h2></div>' + O42.memos[L] + '</div>';
    el.side.innerHTML = h;
    $$('.ex-btn', el.side).forEach(function (b) { b.addEventListener('click', function () { store.set('ex.' + L, +b.dataset.i); go(L, 'sandbox', +b.dataset.i); }); });
  }
  function vis(s) { return String(s).replace(/\n/g, '⏎\n').replace(/\t/g, '→'); }

  /* ---------------------------------------------------------------- scène de mission */
  function renderScene() {
    var host = $('#scene');
    if (!host || S.mode !== 'missions') return;
    var m = mission(), fn = O42.scenes[m.scene] || O42.scenes.terminal;
    var ctx = sceneCtx(S.m, m);
    try { host.innerHTML = fn(ctx, m.sceneOpts || {}); }
    catch (e) { host.innerHTML = O42.scenes.terminal(ctx, {}); if (window.console) console.warn(e); }
    host.classList.toggle('win', !!ctx.win);
  }
  function sceneCtx(m, mi) {
    var lang = S.lang, cache = S.sceneCache;
    var t0 = mi.tests[0];
    var live = !!(m && m.done && !m.error && (t0.expect === undefined || m.stdout === t0.expect) && (t0.exit === undefined || m.exitCode === t0.exit) && (!t0.stdin || t0.stdin === el.stdin.value));
    var ctx = {
      m: m, lang: lang, out: m ? m.stdout : '', done: !!(m && m.done), error: m ? m.error : null, exit: m ? m.exitCode : null,
      win: !!S.won[mi.id] || live, stdin: el.stdin.value, step: m ? m.steps : 0
    };
    ctx.bytes = function (name) {
      if (!m) return cache['b:' + name] || null;
      var r = null;
      if (lang === 'py') { var pv = m.peekVar(name); if (pv && pv.k === 'str') r = U.utf8(pv.s); }
      else if (lang === 'c') {
        var v = m.peekVar(name);
        if (v && v.k === 'arr') { r = []; for (var i = 0; i < v.bytes.length; i++) { r.push(v.bytes[i]); if (!v.bytes[i]) break; } }
        else if (v && v.k === 'ptr' && v.str) r = v.str.concat([0]);
      } else {
        var a = m.peekVar(name);
        if (a && a.k === 'arr') { r = []; for (var j = 0; j < a.bytes.length; j++) { r.push(a.bytes[j]); if (!a.bytes[j]) break; } }
      }
      if (r) cache['b:' + name] = r;
      return r || cache['b:' + name] || null;
    };
    ctx.num = function (name) {
      if (!m || !name) return null;
      if (lang === 'asm') {
        if (O42.engines.asm.REG[name]) return Number(BigInt.asIntN(64, m.getReg(O42.engines.asm.REG[name])));
        var lb = m.prog.labels[name];
        if (lb) { var v8 = m.peek(lb.addr, 8); return v8 === null ? null : Number(BigInt.asIntN(64, v8)); }
        return null;
      }
      var v = m.peekVar(name);
      return v && v.v !== undefined ? v.v : null;
    };
    ctx.heap = function () {
      if (!m || !m.heap) return [];
      var R = m.heapR;
      return m.heap.blocks.map(function (b) {
        var o = b.a - R.base, bytes = Array.prototype.slice.call(R.buf, o, o + b.n), ints = null;
        if (b.hint && b.hint.k === 'int' && b.hint.size === 4) { ints = []; for (var k = 0; k + 4 <= b.n; k += 4) ints.push(R.ini[o + k] ? R.dv.getInt32(o + k, true) : null); }
        return { a: b.a, n: b.n, freed: b.freed, bytes: bytes, ints: ints };
      });
    };
    ctx.list = function (head, vo, no) {
      var out = [], p = ctx.num(head), seen = {};
      if (p === null && cache['l:' + head]) return cache['l:' + head];
      while (p && out.length < 12) {
        if (seen[p]) { out.cut = 'boucle !'; break; }
        seen[p] = 1;
        var b = m.heap.at(p);
        if (!b) { out.cut = 'adresse invalide'; break; }
        out.push({ a: p, v: m.peekI32(p + vo), freed: b.freed });
        if (b.freed) break;
        p = m.peekPtr(p + no);
      }
      if (p !== null) cache['l:' + head] = out;
      return out;
    };
    ctx.pyv = function (name) { if (!m || lang !== 'py') return cache['p:' + name] || null; var v = m.peekVar(name); if (v) cache['p:' + name] = v; return v || cache['p:' + name] || null; };
    ctx.same = function (a, b) {
      if (!m || lang !== 'py') return cache['same'] || false;
      var g = m.frames[0];
      if (!g || !g.vars.has(a) || !g.vars.has(b)) return cache['same'] || false;
      return (cache['same'] = g.vars.get(a) === g.vars.get(b));
    };
    ctx.stackDepth = function () { if (!m || lang !== 'asm') return 0; return Math.max(0, Math.round((m.spTop - Number(m.regs[4])) / 8)); };
    ctx.stackVals = function () {
      var out = [], n = ctx.stackDepth();
      for (var i = 0; i < n; i++) { var v = m.peek(m.spTop - 8 * (i + 1), 8); var x = v === null ? 0 : Number(BigInt.asIntN(64, v)); out.push(x >= 32 && x < 127 ? "'" + String.fromCharCode(x) + "'" : String(x).slice(0, 10)); }
      return out;
    };
    return ctx;
  }

  /* ---------------------------------------------------------------- machine */
  function opts() {
    var o = { stdin: el.stdin.value, files: { 'texte.txt': el['file-txt'].value } };
    if (S.lang === 'cyber' && S.mode === 'missions') o.cyber = mission().cyber;
    return o;
  }
  function fresh() {
    var m = O42.engines[S.lang].create(ed.value(), opts());
    if (m.compileError) { S.compileErr = m.compileError; return null; }
    S.compileErr = null;
    return m;
  }
  function restart() {
    stopTimers();
    S.dirty = false;
    S.lastLine = 0;
    S.sceneCache = {};
    mem.reset();
    S.m = fresh();
    render();
  }
  function replay() {
    var n = S.m ? S.m.steps : 0;
    pause();
    var m = fresh();
    S.dirty = false;
    if (!m) { S.m = null; render(); return; }
    while (m.steps < n && !m.done) m.step();
    S.m = m;
    mem.reset();
    render();
    toast('⟳ Rejoué jusqu’à l’étape ' + m.steps);
  }
  function ensure() {
    if (S.dirty) { replay(); return !!S.m; }
    if (!S.m) S.m = fresh();
    if (!S.m) { render(); return false; }
    return true;
  }
  function act(fn) { pause(); if (!ensure()) return; fn(); }
  function stepInto() {
    if (S.m.done) { toast(S.m.error ? 'Le programme s’est arrêté sur une erreur : ⟲ pour recommencer' : 'Programme terminé : ⟲ pour recommencer'); return; }
    S.lastLine = S.m.line;
    S.m.step();
    render();
  }
  function stepOver() {
    if (S.m.done) return stepInto();
    var d = S.m.depth, n = 0;
    S.lastLine = S.m.line;
    do { S.m.step(); n++; } while (!S.m.done && S.m.depth > d && n < 100000 && !S.bps.has(S.m.line));
    render();
  }
  function stepOut() {
    if (S.m.done) return stepInto();
    var d = S.m.depth, n = 0;
    if (d <= 1 && S.lang !== 'asm') return stepOver();
    S.lastLine = S.m.line;
    do { S.m.step(); n++; } while (!S.m.done && S.m.depth >= d && n < 100000 && !S.bps.has(S.m.line));
    render();
  }
  function stepBack() {
    var n = S.m.steps - 1;
    if (n < 0) { toast('Déjà au début du programme'); return; }
    var m = fresh();
    if (!m) return;
    while (m.steps < n && !m.done) m.step();
    S.m = m;
    S.lastLine = 0;
    render();
  }
  function run() {
    if (S.running) { pause(); return; }
    if (!ensure()) return;
    if (S.m.done) { restart(); if (!S.m) return; }
    S.running = true;
    buttons();
    if (S.bps.has(S.m.line) && S.m.steps > 0) { S.lastLine = S.m.line; S.m.step(); }
    tick();
  }
  function tick() {
    if (!S.running || !S.m) return;
    var sp = SPEEDS[S.speed], m = S.m;
    if (sp.per) {
      var lim = sp.per === Infinity ? 4000 : sp.per, n = 0, t0 = performance.now();
      while (n < lim && !m.done) {
        S.lastLine = m.line;
        m.step(); n++;
        if (S.bps.has(m.line)) { pause(); toast('● Point d’arrêt ligne ' + m.line); break; }
        if (sp.per === Infinity && performance.now() - t0 > 30) break;
      }
      if (m.done) pause();
      render({ fast: sp.per === Infinity && S.running });
      if (S.running) S.raf = requestAnimationFrame(tick);
      return;
    }
    S.lastLine = m.line;
    m.step();
    if (S.bps.has(m.line) && !m.done) { pause(); toast('● Point d’arrêt ligne ' + m.line); }
    if (m.done) pause();
    render();
    if (S.running) S.timer = setTimeout(tick, sp.ms);
  }
  function stopTimers() { clearTimeout(S.timer); cancelAnimationFrame(S.raf); S.timer = 0; S.raf = 0; }
  function pause() { S.running = false; stopTimers(); buttons(); }

  /* ---------------------------------------------------------------- édition */
  var liveT = 0, recT = 0;
  function onCode() {
    saveCode();
    clearTimeout(S.tabT); S.tabT = setTimeout(tabsFor, 400);
    if (S.live) { clearTimeout(liveT); liveT = setTimeout(liveRun, 450); return; }
    markDirty();
  }
  function markDirty() {
    if (S.running) pause();
    if (S.m && S.m.steps > 0) { S.dirty = true; el.dirty.hidden = false; }
    else { clearTimeout(recT); recT = setTimeout(function () { if (!S.dirty) restart(); }, 350); }
  }
  /* mode direct : tout réexécuter à chaque modification */
  function liveRun() {
    pause();
    var m = fresh();
    S.dirty = false;
    if (m) { var n = 0; while (!m.done && n++ < 50000) m.step(); }
    S.m = m;
    S.lastLine = 0;
    render({ scroll: false });
  }
  function toggleBp(line) {
    if (S.bps.has(line)) S.bps.delete(line); else S.bps.add(line);
    store.set('bp.' + codeKey(), Array.from(S.bps));
    ed.setMarks({ bps: S.bps });
  }

  /* ---------------------------------------------------------------- rendu */
  var ICON = { read: '👁', write: '✏️', heap: '📦', free: '♻️', io: '🖥', call: '📞', ret: '↩', warn: '⚠️', err: '💥', yes: '✔', no: '✘', new: '✨', alu: '🧮', jump: '↪', ok: '🏁' };
  function render(o) {
    o = o || {};
    var m = S.m;
    // éditeur
    var ce = S.compileErr;
    ed.setMarks({ cur: m && !m.done ? m.line : 0, last: m && !o.fast ? S.lastLine : 0, err: ce ? ce.line : m && m.error ? m.error.line : 0, bps: S.bps });
    if (m && !m.done && !o.fast) ed.reveal(m.line);
    if (m && m.error) ed.reveal(m.error.line);
    el.dirty.hidden = !S.dirty;
    // erreur de compilation
    if (ce) {
      el['compile-msg'].hidden = false;
      el['compile-msg'].innerHTML = '<b>✖ Erreur ' + (S.lang === 'asm' ? 'd’assemblage' : S.lang === 'py' ? 'de syntaxe' : 'de compilation') + ' ligne ' + ce.line + ' :</b> ' + U.esc(ce.msg) + (ce.hint ? '<div class="hint">💡 ' + U.esc(ce.hint) + '</div>' : '');
    } else el['compile-msg'].hidden = true;
    // explications
    var ex = '';
    if (ce) ex = '<div class="ex err"><i>✖</i><span>Le programme ne peut pas démarrer : corrige l’erreur indiquée sous l’éditeur.</span></div>';
    else if (m) {
      if (!m.log.length) ex = '<div class="empty">' + (m.steps ? 'Rien de spécial à cette étape.' : 'Prêt. Clique ⤓ Pas pour exécuter la ligne surlignée en vert, ou ▶ Exécuter.') + '</div>';
      m.log.forEach(function (x) { ex += '<div class="ex ' + x.c + '"><i>' + (ICON[x.c] || '•') + '</i><span>' + U.esc(x.t) + '</span></div>'; });
    }
    el.explain.innerHTML = ex;
    // prochaine ligne
    var srcLines = ed.value().split('\n');
    el['next-line'].innerHTML = m && !m.done ? 'prochaine : <b>ligne ' + m.line + '</b> · ' + U.esc((srcLines[m.line - 1] || '').trim().slice(0, 60)) : '';
    // console
    term(m);
    // mémoire / cible / processeur
    if (S.lang === 'cyber') { O42.CyberView.render(document.getElementById('mem'), m, ce); status(); buttons(); renderScene(); return; }
    if (m) {
      if (!o.fast || !mem.t || performance.now() - mem.t > 120) { mem.render(m.view(), { lang: S.lang, scroll: o.scroll }); mem.t = performance.now(); }
      if (S.lang === 'asm') cpu.render(m, { anim: SPEEDS[S.speed].ms ? Math.min(SPEEDS[S.speed].ms * 0.8, 700) : 120, animate: !o.fast });
    } else {
      document.getElementById('mem').innerHTML = '<div class="mem-empty">' + (ce ? 'Corrige l’erreur pour voir la mémoire.' : 'Lance le programme pour voir la mémoire.') + '</div>';
      if (S.lang === 'asm') el.cpu.innerHTML = '<div class="cpu"><div class="cpu-legend">Le processeur attend un programme valide.</div></div>';
    }
    status();
    buttons();
    renderScene();
  }
  function term(m) {
    var h = '';
    if (m) {
      var chunks = m.chunks ? m.chunks() : [{ fd: 1, s: m.stdout }];
      chunks.forEach(function (c) { h += c.fd === 2 ? '<span class="e">' + U.esc(c.s) + '</span>' : U.esc(c.s); });
      if (!m.done) h += '<span class="cursor"></span>';
      else {
        if (m.error) h += '<span class="crash">💥 ' + U.esc(m.error.msg) + ' (ligne ' + m.error.line + ')' + (m.error.hint ? '<span class="hint">💡 ' + U.esc(m.error.hint) + '</span>' : '') + '</span>';
        var sum = m.summary ? m.summary() : null;
        h += '<span class="sum">── fin du programme · ' + U.plural(m.steps, 'étape') + (m.exitCode !== null && m.exitCode !== undefined ? ' · code de sortie <b class="' + (m.exitCode ? 'meh' : 'good') + '">' + m.exitCode + '</b>' : '') + ' ──';
        if (sum) {
          h += '\nTAS : ' + U.plural(sum.allocs, 'allocation') + ', ' + U.plural(sum.frees, 'libération') + ', ' + U.plural(sum.bytes, 'octet') + ' alloué' + (sum.bytes > 1 ? 's' : '');
          if (m.error) { /* rien de plus */ }
          else if (sum.leaks.length) {
            h += '\n<b class="bad">FUITES : ' + U.plural(sum.leakBytes, 'octet') + ' dans ' + U.plural(sum.leaks.length, 'bloc') + '</b>';
            sum.leaks.slice(0, 5).forEach(function (l) { h += '\n  · ' + l.n + ' o à ' + U.hex(l.addr) + ' — ' + l.who + ' ligne ' + l.line; });
          } else if (sum.allocs) h += '\n<b class="good">✔ Aucune fuite : tous les blocs ont été libérés.</b>';
        }
        if (m.warnings && m.warnings.length) h += '\n<b class="meh">' + U.plural(m.warnings.length, 'avertissement') + '</b>' + m.warnings.slice(0, 4).map(function (w) { return '\n  · ligne ' + w.line + ' : ' + U.esc(w.msg); }).join('');
        h += '</span>';
      }
    } else if (S.compileErr) h = '<span class="crash">✖ ' + U.esc(S.compileErr.msg) + '</span>';
    el.term.innerHTML = h;
    el.term.scrollTop = el.term.scrollHeight;
    var b = el['exit-badge'];
    if (m && m.done) { b.textContent = m.error ? 'planté' : 'code ' + m.exitCode; b.className = 'exit-badge ' + (m.error ? 'bad' : 'ok'); }
    else { b.textContent = ''; b.className = 'exit-badge'; }
  }
  function status() {
    var m = S.m, s;
    if (S.compileErr) s = '<span class="st-err">✖ erreur</span>';
    else if (!m) s = '';
    else {
      s = 'étape <b>' + m.steps + '</b>';
      if (!m.done) s += ' · ligne <b>' + m.line + '</b>' + (S.lang !== 'asm' ? ' · profondeur ' + m.depth : '');
      s += ' · ' + (S.running ? '<span class="st-run">▶ en cours</span>' : m.error ? '<span class="st-err">✖ ' + (m.error.kind === 'timeout' ? 'trop long' : 'planté') + '</span>' : m.done ? '<span class="st-done">✔ terminé</span>' : '⏸ en pause');
    }
    el.status.innerHTML = s;
  }
  function buttons() {
    var m = S.m, can = !!m && !S.compileErr;
    $('#btn-run').hidden = S.running;
    $('#btn-pause').hidden = !S.running;
    $('#btn-run span').textContent = S.lang === 'cyber' ? (m && m.steps > 0 && !m.done ? 'Continuer' : 'Lancer l’attaque') : (m && m.steps > 0 && !m.done ? 'Continuer' : 'Exécuter');
    $('#btn-step span').textContent = S.lang === 'cyber' ? 'Étape suivante' : 'Ligne suivante';
    $('#btn-validate').hidden = !(S.mode === 'missions' && S.view === 'mission');
    $('#btn-step').disabled = !can || (m && m.done);
    $('#btn-over').disabled = !can || (m && m.done);
    $('#btn-out').disabled = !can || (m && m.done);
    $('#btn-back').disabled = !can || !m || m.steps === 0;
  }
  function speedLabel() { el['speed-val'].textContent = SPEEDS[S.speed].l; }
  /* en mode simple, les onglets Entrée et Fichier n'apparaissent que s'ils servent */
  function tabsFor() {
    var code = ed.value(), simple = document.body.classList.contains('simple');
    var mi = S.mode === 'missions' ? mission() : null, ex = S.mode === 'sandbox' ? O42.examples[S.lang][S.ex] : null;
    var wantsIn = !!((mi && (mi.stdin || mi.tests.some(function (t) { return t.stdin; }))) || (ex && ex.stdin) || el.stdin.value || /\bread\b|get_next_line|\binput\s*\(|stdin/.test(code));
    var wantsFile = /\bopen\b|texte\.txt/.test(code);
    $('#tab-in').hidden = simple && !wantsIn;
    $('#tab-files').hidden = simple && !wantsFile;
    var on = $('.tab.on');
    if (on && on.hidden) tab('out');
  }
  function tab(name) {
    $$('.tab').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === name); });
    $$('.tab-body').forEach(function (b) { b.hidden = b.dataset.body !== name; });
  }

  /* ---------------------------------------------------------------- validation */
  function validate() {
    pause();
    var mi = mission(), btn = $('#m-validate');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Tests en cours…'; }
    var tb = $('#btn-validate'); if (tb) tb.disabled = true;
    setTimeout(function () {
      var res = O42.judge(S.lang, mi, ed.value());
      S.results = res;
      if (S.exam) {
        if (res.ok) { O42.exam.onValidate(true); }
        else { S.fails[mi.id] = (S.fails[mi.id] || 0) + 1; var n0 = res.results.filter(function (r) { return r.ok; }).length; toast('Pas encore (' + n0 + '/' + res.results.length + ') — le chrono tourne, réessaie !', 'bad'); side(); }
        if (tb) tb.disabled = false;
        return;
      }
      if (res.ok) {
        var P = O42.profile, prev = S.progress[mi.id], first = !prev;
        var earned = P.computeStars((S.hintsShown[mi.id] || 0) > 0, (S.fails[mi.id] || 0) > 0);
        var stars = Math.max(earned, prev ? prev.s || 0 : 0);
        S.lastEarned = { earned: earned, total: stars, first: first };
        S.progress[mi.id] = { s: stars, h: (S.hintsShown[mi.id] || 0) > 0 ? 1 : 0, f: (S.fails[mi.id] || 0), t: Date.now() };
        S.won[mi.id] = true;
        P.save(S.progress);
        xp();
        confetti();
        celebrate(mi, first, res);
      } else {
        S.fails[mi.id] = (S.fails[mi.id] || 0) + 1;
        var nOk = res.results.filter(function (r) { return r.ok; }).length;
        toast('Pas encore : ' + nOk + ' / ' + res.results.length + ' test(s) réussi(s). Regarde les détails à gauche.', 'bad');
      }
      if (tb) tb.disabled = false;
      side();
      var r = $('.results'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 30);
  }

  /* ---------------------------------------------------------------- divers */
  var toastT = 0;
  function toast(t, cls) {
    el.toast.textContent = t;
    el.toast.className = 'toast show' + (cls ? ' ' + cls : '');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.toast.className = 'toast'; }, 2600);
  }
  function confetti() {
    var cols = ['#00babc', '#2ef2d0', '#ffcc4d', '#ff6fb5', '#4aa3ff', '#3ddc84'];
    for (var i = 0; i < 70; i++) {
      var d = document.createElement('div');
      d.className = 'confetti';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.background = cols[i % cols.length];
      d.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      d.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(d);
      setTimeout(function (x) { return function () { x.remove(); }; }(d), 4200);
    }
  }
  function modal(html) { el.modal.innerHTML = '<div class="modal-card">' + html + '</div>'; el.modal.hidden = false; }
  /* fenêtre de réussite */
  var CHEERS = ['Ton code passe tous les tests.', 'Mission accomplie, du premier coup d’œil au dernier octet.', 'Le campus te remercie !', 'Propre, net, efficace.', 'Encore une notion dans la poche.'];
  function celebrate(mi, first, res) {
    var L = S.lang, all = O42.missions[L], idx = all.indexOf(mi), next = idx + 1 < all.length ? idx + 1 : -1;
    var k = mi.ch, chapDone = doneIn(L, k), chapN = chapterOf(L, k).length, total = all.filter(function (m) { return S.progress[m.id]; }).length;
    var chapFull = chapDone === chapN;
    var opened = k < 10 && chapDone === 5 && first;
    var msg = chapFull && first ? 'Chapitre ' + k + ' terminé : « ' + U.esc(O42.chapters[L][k - 1].t) + ' » !' : CHEERS[(idx + total) % CHEERS.length];
    var le = S.lastEarned || { earned: 3, total: 3 };
    var starRow = '★★★'.slice(0, le.total) + '<span class="win-star-off">' + '★★★'.slice(0, 3 - le.total) + '</span>';
    var earnTxt = le.first ? '+' + le.earned + ' ★' + (le.total < 3 ? ' — rejoue sans indice et du premier coup pour 3 ★' : ' — parfait !') : 'déjà obtenu';
    modal('<div class="win-modal"><div class="win-badge"><span>★</span></div><h2>Bien joué !</h2>' +
      '<p class="win-title">Mission <b>' + mi.ch + '.' + mi.ord + ' · ' + U.esc(mi.title) + '</b> réussie.</p>' +
      '<div class="win-starline">' + starRow + '</div><p class="win-msg">' + U.esc(earnTxt) + ' · ' + msg + '</p>' +
      (opened ? '<p class="win-unlock">🔓 Le chapitre ' + (k + 1) + ' « ' + U.esc(O42.chapters[L][k].t) + ' » est maintenant ouvert.</p>' : '') +
      '<div class="win-stats"><div><b>' + O42.profile.domainStars(S.progress, L) + '/' + O42.profile.domainMax(L) + '</b><span>★ ' + LANG[L].name + '</span></div><div><b>' + chapDone + '/' + chapN + '</b><span>chapitre ' + k + '</span></div><div><b>' + O42.profile.total(S.progress) + '</b><span>★ au total</span></div></div>' +
      '<div class="win-actions">' + (next >= 0 && unlocked(L, next) ? '<button type="button" class="go" id="win-next">Mission suivante →</button>' : '') + '<button type="button" class="close">Rester ici</button></div></div>');
    var nb = $('#win-next');
    if (nb) { nb.focus(); nb.addEventListener('click', function () { el.modal.hidden = true; go(L, 'missions', next); }); }
  }

  /* confirmation dans la page (les fenêtres confirm() sont bloquées dans certains cadres) */
  function ask(msg, yes, fn) {
    modal('<h2 style="font-size:19px">Confirmer</h2><p>' + U.esc(msg) + '</p><div class="m-actions" style="justify-content:flex-end;margin-top:14px"><button type="button" class="close">Annuler</button><button type="button" class="go" id="ask-yes">' + U.esc(yes) + '</button></div>');
    $('#ask-yes').addEventListener('click', function () { el.modal.hidden = true; fn(); });
  }
  function closeModal() { el.modal.hidden = true; store.set('welcomed', true); }
  function welcome() {
    modal('<button class="close" type="button">✕</button><h2>Bienvenue dans 42 Origins</h2>' +
      '<p>Un laboratoire pour <b>voir</b> ce que fait vraiment ton code : chaque variable, chaque case mémoire, la <b>pile</b> et le <b>tas</b>, les registres du <b>processeur</b>… ligne par ligne, à la vitesse que tu veux.</p>' +
      '<p>Suis les <b>missions</b> (100 par langage, rangées en 10 chapitres, du plus simple au plus difficile) ou expérimente librement dans le <b>bac à sable</b>.<br>Dans chaque mission : lis l’objectif, complète le code, teste-le avec <b>▶ Exécuter</b> ou <b>⤓ Ligne suivante</b>, puis clique <b>✅ Valider</b>.</p>' +
      '<div class="welcome-langs"><button data-l="c" type="button"><b>C</b><span>write, pointeurs, malloc, get_next_line</span></button><button data-l="py" type="button"><b>Python</b><span>objets, listes, dictionnaires, récursion</span></button><button data-l="asm" type="button"><b>ASM</b><span>registres, pile, syscalls, libasm</span></button></div>' +
      '<p style="color:var(--dim);font-size:12.5px">Astuce : clique un numéro de ligne pour poser un <b>point d’arrêt</b>. Ta progression est sauvegardée dans ce navigateur.</p>');
    $$('.welcome-langs button', el.modal).forEach(function (b) { b.addEventListener('click', function () { closeModal(); go(b.dataset.l, 'missions'); }); });
  }
  function help() {
    modal('<button class="close" type="button">✕</button><h2>Aide</h2>' +
      '<h3>Débogueur</h3><table>' +
      '<tr><td><kbd>F5</kbd> / <kbd>Ctrl</kbd>+<kbd>Entrée</kbd></td><td>▶ Exécuter / continuer jusqu’au prochain point d’arrêt</td></tr>' +
      '<tr><td><kbd>Échap</kbd></td><td>⏸ Pause</td></tr>' +
      '<tr><td><kbd>F10</kbd></td><td>⤓ Pas : exécute la ligne verte (entre dans les fonctions)</td></tr>' +
      '<tr><td><kbd>Maj</kbd>+<kbd>F10</kbd></td><td>↷ Par-dessus : exécute un appel de fonction d’un coup</td></tr>' +
      '<tr><td><kbd>F8</kbd></td><td>⤴ Sortir : termine la fonction en cours</td></tr>' +
      '<tr><td><kbd>F9</kbd></td><td>⤒ Retour : revient d’un pas en arrière</td></tr>' +
      '<tr><td>clic sur un n° de ligne</td><td>● pose / enlève un point d’arrêt</td></tr></table>' +
      '<h3>Couleurs de la mémoire</h3><table>' +
      '<tr><td style="color:var(--stack)">■ stack</td><td>la pile : variables locales, paramètres, adresses de retour</td></tr>' +
      '<tr><td style="color:var(--heap)">■ heap</td><td>le tas : blocs malloc (et objets Python)</td></tr>' +
      '<tr><td style="color:var(--data)">■ data</td><td>globales, static, sections .data/.bss</td></tr>' +
      '<tr><td style="color:var(--rodata)">■ rodata</td><td>chaînes littérales en lecture seule</td></tr>' +
      '<tr><td><span style="color:var(--rd)">◻ bleu</span> / <span style="color:var(--wr)">◻ orange</span></td><td>case lue / écrite à la dernière étape (avec l’expression, ex. <code>s[i]</code>)</td></tr>' +
      '<tr><td>hachuré</td><td>non initialisé : valeur résiduelle indéterminée</td></tr>' +
      '<tr><td>flèches</td><td>un pointeur et la case qu’il désigne (survole-le)</td></tr></table>' +
      '<h3>Mode simple et outils avancés</h3><p>Par défaut, seul l’essentiel est affiché. Coche <b>Outils avancés</b> (en haut à droite) pour retrouver la vitesse, le pas à pas fin (passer une fonction, sortir, revenir), les octets en hexadécimal, le pipeline du processeur et le mode <b>Direct</b>.</p>' +
      '<h3>Écrire petit à petit</h3><p>Coche <b>Direct</b> : le programme est réexécuté à chaque frappe. Ou modifie le code en pause puis clique <b>⟳ Rejouer jusqu’ici</b> : la nouvelle version est rejouée jusqu’à l’étape où tu étais.</p>' +
      '<h3>Ce qui est simulé</h3><p>C : types de base, pointeurs, tableaux, struct, typedef, enum, static, malloc/calloc/realloc/free, write/read/open/close, get_next_line, printf, fonctions de &lt;string.h&gt; et &lt;ctype.h&gt;. Détection des segfaults, débordements, use-after-free, double free et fuites. Python : un sous-ensemble de Python 3 (sans classes). Assembleur : NASM x86-64 Linux, syscalls read/write/open/close/exit, libc malloc/free/printf.</p>');
  }
  function keys(e) {
    var k = e.key;
    if (!el.modal.hidden) { if (k === 'Escape') closeModal(); return; }
    if (k === 'F5' || (k === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); run(); return; }
    if (k === 'Escape') { if (S.running) { e.preventDefault(); pause(); } return; }
    if (k === 'F10') { e.preventDefault(); act(e.shiftKey ? stepOver : stepInto); return; }
    if (k === 'F8') { e.preventDefault(); act(stepOut); return; }
    if (k === 'F9') { e.preventDefault(); act(stepBack); return; }
  }

  O42.app = { state: S, render: render, restart: restart, go: go, side: side, xp: xp, mission: mission, confetti: confetti };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
