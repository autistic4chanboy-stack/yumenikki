/* =========================================================================
 *  42 ORIGINS — vue « cible » pour les labos de cybersécurité
 *  Objectif : rendre l'attaque SIMULÉE lisible et pédagogique. On déroule
 *  l'attaque étape par étape (à partir de m.trace), on explique en français
 *  simple ce que fait le serveur, et on montre la défense à la fin.
 *  Tout est simulé : comprendre la faille pour savoir la corriger.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;

  /* fiche « comment ça marche » par type de faille */
  var SIM = {
    sqli: { ic: '🗄️', name: 'Base de données', how: 'Le serveur colle ton texte directement dans une requête SQL, sans le protéger. En ajoutant une apostrophe, tu « sors » de la chaîne et tu réécris la condition.', you: 'Écris un <b>username</b> qui rend la vérification toujours vraie.' },
    cmdi: { ic: '🖥️', name: 'Serveur (shell)', how: 'Le serveur insère ton texte dans une ligne de commande shell. Les caractères <code>;</code> <code>&&</code> <code>|</code> permettent d’enchaîner une commande à toi.', you: 'Ajoute une 2ᵉ commande après celle prévue.' },
    pathtrav: { ic: '📁', name: 'Serveur de fichiers', how: 'Le serveur ouvre le fichier demandé à partir d’un dossier public. La séquence <code>../</code> remonte d’un dossier.', you: 'Demande un chemin qui <b>sort</b> du dossier public.' },
    logic: { ic: '🪪', name: 'Contrôle d’accès', how: 'Le serveur te fait trop confiance : il vérifie que tu es connecté, mais pas que tu as le <b>droit</b> d’accéder à ce que tu demandes.', you: 'Demande une ressource qui ne t’appartient pas.' },
    overflow: { ic: '🧱', name: 'Mémoire (tampon)', how: 'Ton entrée est copiée dans un tampon de taille fixe. Au-delà de sa taille, les octets en trop écrasent la mémoire juste à côté.', you: 'Entre <b>plus</b> de caractères que la taille du tampon.' },
    formatstr: { ic: '🧩', name: 'Chaîne de format', how: 'Ton texte est utilisé comme <i>format</i> d’affichage. Les marqueurs <code>%x</code> / <code>%s</code> lisent et révèlent la mémoire.', you: 'Utilise <code>%x</code>/<code>%s</code> pour fuiter le secret.' },
    token: { ic: '🎫', name: 'Jeton de session (JWT)', how: 'Le serveur fait confiance au jeton sans bien vérifier sa signature (faille <code>alg:none</code>) ou avec un secret trop faible.', you: 'Forge un jeton qui te donne le rôle <b>admin</b>.' },
    xss: { ic: '🌐', name: 'Navigateur (DOM)', how: 'La page réaffiche ton texte sans l’échapper : le HTML/JS que tu injectes s’exécute dans le navigateur de la victime.', you: 'Injecte un script qui lit <code>document.cookie</code>.' },
    crypto: { ic: '🔐', name: 'Message chiffré', how: 'Le chiffrement est faible (César, XOR court, hash sans sel…). On peut donc le casser sans connaître la clé.', you: 'Retrouve le texte clair (ou la clé).' }
  };

  /* icône + libellé par classe de ligne de narration renvoyée par le moteur */
  var CLS = {
    io: { ic: '📤', c: 'io' }, warn: { ic: '⚠️', c: 'warn' }, alu: { ic: '⚙️', c: 'code' },
    yes: { ic: '✅', c: 'yes' }, no: { ic: '🚫', c: 'no' }, ok: { ic: '🚩', c: 'ok' },
    call: { ic: '🛡️', c: 'def' }, '': { ic: '•', c: '' }
  };

  function line(l) {
    var k = CLS[l.c] || CLS[''];
    return '<div class="cy-ln ' + k.c + '"><span class="cy-ln-ic">' + k.ic + '</span><span>' + U.esc(l.t) + '</span></div>';
  }

  O42.CyberView = {
    render: function (host, m, compileErr, cfg) {
      var sim = (cfg && cfg.sim) || (m && m.simKind) || 'logic', info = SIM[sim] || SIM.logic;
      if (compileErr) { host.innerHTML = '<div class="mem-empty">' + U.esc(compileErr.msg) + '</div>'; return; }

      var h = '<div class="cy2">';
      // 1) fiche « la cible » — toujours visible, explique la faille
      h += '<div class="cy-card cy-how"><div class="cy-how-h"><span class="cy-how-ic">' + info.ic + '</span><div><b>Cible : ' + U.esc(info.name) + '</b>' +
        '<span class="cy-tag">faille simulée</span></div></div>' +
        '<p class="cy-how-txt">' + info.how + '</p>' +
        '<p class="cy-you">🎯 À toi : ' + info.you + '</p></div>';

      if (!m) {
        h += '<div class="cy-card cy-wait"><div class="cy-wait-ic">⌨️</div><p>Écris ta <b>charge</b> dans l’éditeur de gauche, puis clique <b>▶ Lancer l’attaque</b> (ou <b>⤓ Étape suivante</b> pour avancer pas à pas).</p></div>';
        host.innerHTML = h + '</div>';
        return;
      }

      var trace = m.trace || [], cur = Math.min(m.idx || 0, trace.length - 1), total = trace.length;

      // 2) progression
      var reached = Math.min(cur + 1, total);
      h += '<div class="cy-prog"><div class="cy-prog-txt">Attaque — étape ' + reached + ' / ' + total + (m.done ? '' : ' · <span class="cy-dim">⤓ pour continuer</span>') + '</div>' +
        '<div class="cy-prog-bar"><i style="width:' + Math.round(reached / total * 100) + '%"></i></div></div>';

      // 3) déroulé étape par étape (uniquement les étapes atteintes)
      h += '<ol class="cy-steps">';
      for (var i = 0; i <= cur && i < total; i++) {
        var fr = trace[i], isCur = i === cur;
        h += '<li class="cy-step' + (isCur ? ' cur' : ' done') + '"><div class="cy-step-n">' + (i + 1) + '</div><div class="cy-step-b">';
        (fr.log || []).forEach(function (l) { h += line(l); });
        // les panneaux (requête, base, fichiers, jeton…) ne s'affichent que pour l'étape courante, pour rester lisible
        if (isCur && fr.panels && fr.panels.length) {
          fr.panels.forEach(function (p) { h += '<section class="cy-panel"><h3>' + U.esc(p.title) + '</h3><div class="cy-body">' + p.html + '</div></section>'; });
        }
        h += '</div></li>';
      }
      h += '</ol>';

      // 4) verdict
      if (m.done) {
        if (m.ok) h += '<div class="cy-verdict win">🚩 Cible compromise — <code>' + U.esc(m.flag || '') + '</code></div>';
        else h += '<div class="cy-verdict fail">🔒 Cible intacte — ajuste ta charge et réessaie' + (m.failMsg ? ' <span class="cy-dim">(' + U.esc(m.failMsg) + ')</span>' : '') + '</div>';
      }

      host.innerHTML = h + '</div>';
      // auto-défilement vers l'étape courante
      var curEl = host.querySelector('.cy-step.cur');
      if (curEl && curEl.scrollIntoView) { try { curEl.scrollIntoView({ block: 'nearest' }); } catch (e) { } }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
