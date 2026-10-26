/* =========================================================================
 *  42 ORIGINS — examens chronométrés
 *  À la fin de chaque chapitre (palier de 10 niveaux), un examen tire AU
 *  HASARD un exercice parmi 5 du chapitre et le fait résoudre dans le temps.
 *  Réussir rapporte un badge et des étoiles bonus.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util, P = O42.profile;
  var E = O42.exam = {};
  var timer = null;

  E.SECONDS = 180; // 3 minutes

  /* l'examen d'un chapitre est débloqué quand le chapitre est terminé */
  E.unlocked = function (rec, domain, chapter) {
    var ids = (O42.missions[domain] || []).filter(function (m) { return m.ch === chapter; }).map(function (m) { return m.id; });
    return ids.length > 0 && ids.every(function (id) { return rec[id]; });
  };
  E.passed = function (rec, domain, chapter) { return P.examPassed(rec, domain, chapter); };

  E.start = function (domain, chapter) {
    var all = O42.missions[domain] || [];
    var pool = all.filter(function (m) { return m.ch === chapter; });
    if (!pool.length) return;
    // 5 candidats au hasard, puis 1 tiré
    var rng = U.rng((Date.now() & 0xffffff) ^ (chapter * 7919 + domain.length));
    var shuffled = pool.slice();
    for (var i = shuffled.length - 1; i > 0; i--) { var j = rng() % (i + 1); var t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t; }
    var candidates = shuffled.slice(0, Math.min(5, shuffled.length));
    var chosen = candidates[rng() % candidates.length];
    var idx = all.indexOf(chosen);
    E.intro(domain, chapter, candidates, idx);
  };

  E.intro = function (domain, chapter, candidates, idx) {
    var info = P.DOMAIN_INFO[domain], chap = O42.chapters[domain][chapter - 1];
    var h = '<div class="exam-intro"><div class="exam-seal">🎖</div><h2>Examen — ' + U.esc(info.name) + ' · chapitre ' + chapter + '</h2>' +
      '<p class="exam-ch">' + U.esc(chap.t) + '</p>' +
      '<p>Un exercice est tiré <b>au hasard</b> parmi ' + candidates.length + ', à résoudre en <b>' + Math.round(E.SECONDS / 60) + ' minutes</b>, sans aide extérieure. Réussis pour gagner le badge et des étoiles bonus.</p>' +
      '<ul class="exam-pool">' + candidates.map(function (m) { return '<li>' + U.esc(m.title) + '</li>'; }).join('') + '</ul>' +
      '<div class="exam-actions"><button class="go" id="exam-go" type="button">⏱ Commencer l’examen</button><button class="close" type="button">Plus tard</button></div></div>';
    modal(h);
    document.getElementById('exam-go').onclick = function () {
      document.getElementById('modal').hidden = true;
      O42.app.go(domain, 'missions', idx);
      var S = O42.app.state;
      S.exam = { domain: domain, chapter: chapter, endsAt: Date.now() + E.SECONDS * 1000, missionIdx: idx };
      // repart du code de départ
      E.bar();
      timer = setInterval(E.bar, 500);
    };
  };

  /* bandeau chrono */
  E.bar = function () {
    var S = O42.app.state, ex = S.exam, el = document.getElementById('exam-bar');
    if (!ex) { stop(); if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'exam-bar'; el.className = 'exam-bar'; document.body.appendChild(el); }
    var left = Math.max(0, Math.round((ex.endsAt - Date.now()) / 1000));
    var mm = Math.floor(left / 60), ss = left % 60;
    el.className = 'exam-bar' + (left <= 30 ? ' urgent' : '');
    el.innerHTML = '🎖 <b>Examen en cours</b> · ' + U.esc(P.DOMAIN_INFO[ex.domain].name) + ' ch.' + ex.chapter +
      ' <span class="exam-clock">⏱ ' + mm + ':' + (ss < 10 ? '0' : '') + ss + '</span>' +
      '<button id="exam-quit" type="button">Abandonner</button>';
    document.getElementById('exam-quit').onclick = function () { E.end(false, true); };
    if (left <= 0) E.end(false, false);
  };

  /* appelé par la validation */
  E.onValidate = function (ok) {
    var S = O42.app.state;
    if (!S.exam) return false;
    if (ok) E.end(true);
    return true; // on a géré le cas examen
  };

  E.end = function (win, quit) {
    var S = O42.app.state, ex = S.exam;
    if (!ex) return;
    stop();
    var el = document.getElementById('exam-bar'); if (el) el.remove();
    S.exam = null;
    if (win) {
      var rec = S.progress;
      var fresh = !P.examPassed(rec, ex.domain, ex.chapter);
      rec[P.examId(ex.domain, ex.chapter)] = { s: 0, exam: 1, t: Date.now() };
      P.save(rec); O42.app.xp();
      if (O42.app.confetti) O42.app.confetti();
      modal('<div class="exam-result win"><div class="exam-seal big">🎖</div><h2>Examen réussi !</h2>' +
        '<p>Chapitre ' + ex.chapter + ' de ' + U.esc(P.DOMAIN_INFO[ex.domain].full) + ' validé sous pression.</p>' +
        (fresh ? '<p class="exam-badge">🏅 Nouveau badge d’examen débloqué !</p>' : '<p class="home-note">Déjà réussi — toujours aussi affûté.</p>') +
        '<div class="exam-actions"><button class="go close" type="button">Continuer</button></div></div>');
    } else {
      modal('<div class="exam-result fail"><div class="exam-seal big">⏳</div><h2>' + (quit ? 'Examen abandonné' : 'Temps écoulé') + '</h2>' +
        '<p>Pas de panique : tu peux retenter l’examen autant de fois que nécessaire.</p>' +
        '<div class="exam-actions"><button class="go" id="exam-retry" type="button">↻ Retenter</button><button class="close" type="button">Plus tard</button></div></div>');
      var rb = document.getElementById('exam-retry');
      if (rb) rb.onclick = function () { document.getElementById('modal').hidden = true; E.start(ex.domain, ex.chapter); };
    }
    O42.app.side();
  };

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function modal(html) { var m = document.getElementById('modal'); m.innerHTML = '<div class="modal-card">' + html + '</div>'; m.hidden = false; }
})(typeof window !== 'undefined' ? window : globalThis);
