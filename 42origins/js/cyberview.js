/* =========================================================================
 *  42 ORIGINS — vue « cible » pour les labos de cybersécurité
 *  Rend l'état simulé de la cible (base de données, fichiers, mémoire,
 *  jeton, navigateur…) renvoyé par le moteur cyber via m.panels().
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  O42.CyberView = {
    render: function (host, m, compileErr) {
      if (compileErr) { host.innerHTML = '<div class="mem-empty">' + U.esc(compileErr.msg) + '</div>'; return; }
      if (!m) { host.innerHTML = '<div class="cy-intro"><div class="cy-badge">🎯</div><p>Écris ta charge (payload) dans l’éditeur, puis clique <b>▶ Lancer l’attaque</b> pour voir la cible réagir, étape par étape.</p></div>'; return; }
      var panels = m.panels ? m.panels() : [];
      var html = '<div class="cy-wrap">';
      if (m.done) html += '<div class="cy-verdict ' + (m.ok ? 'win' : 'fail') + '">' + (m.ok ? '🚩 Cible compromise — ' + U.esc(m.flag || '') : '🔒 Cible intacte — continue à chercher') + '</div>';
      if (!panels.length) html += '<div class="mem-empty">La cible apparaîtra ici pendant l’attaque.</div>';
      panels.forEach(function (p) {
        html += '<section class="cy-panel"><h3>' + U.esc(p.title) + '</h3><div class="cy-body">' + p.html + '</div></section>';
      });
      html += '</div>';
      host.innerHTML = html;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
