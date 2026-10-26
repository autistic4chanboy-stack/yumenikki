/* =========================================================================
 *  42 ORIGINS — accueil, profil, classement
 *  Écrans « clairs » (style carte, anneaux de progression) au-dessus de
 *  l'atelier. Toutes les illustrations sont originales (SVG maison).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util, P = O42.profile;
  function esc(s) { return U.esc(s); }
  function $(s, r) { return (r || document).querySelector(s); }

  /* anneau de progression SVG */
  function ring(frac, size, label, hue) {
    var r = size / 2 - 6, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, frac)));
    return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--ring-bg)" stroke-width="5"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="hsl(' + hue + ',80%,55%)" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ring-t">' + esc(label) + '</text></svg>';
  }

  var H = O42.home = {};
  H.el = function () { return document.getElementById('home'); };

  H.show = function () {
    var rec = O42.app.state.progress, me = P.me(), total = P.total(rec), max = P.totalMax();
    var rank = P.rank(total), nxt = P.nextRank(total);
    var prog = nxt ? (total - rank.at) / (nxt.at - rank.at) : 1;
    var last = P.store.get('lang', 'c');
    var h = '<div class="home-in">';
    // bandeau
    h += '<header class="home-top">' +
      '<div class="brand-big"><span class="logo42"><i>4</i><i>2</i></span><span class="brand-t">ORIGINS</span></div>' +
      '<button class="home-x" id="home-close" type="button" title="Retour à l’atelier">✕ Atelier</button></header>';
    // carte profil
    h += '<section class="hero-card">' +
      '<button class="hero-av" id="home-av" title="Changer d’avatar">' + esc(me.avatar) + '</button>' +
      '<div class="hero-id"><h1>' + esc(me.name) + '</h1>' +
      '<div class="hero-rank">' + rank.ic + ' ' + esc(rank.t) + ' · niveau ' + P.level(total) + '</div>' +
      '<div class="hero-bar"><i style="width:' + Math.round(prog * 100) + '%"></i></div>' +
      '<div class="hero-sub">' + (nxt ? (nxt.at - total) + ' ★ avant <b>' + esc(nxt.t) + '</b>' : 'rang maximal atteint — bravo !') + '</div></div>' +
      '<div class="hero-stars">' + ring(total / max, 108, '★ ' + total, 48) + '<span>sur ' + max + '</span></div>' +
      '</section>';
    // reprendre
    h += '<button class="home-resume" id="home-resume"><span class="hr-ic">' + P.DOMAIN_INFO[last].icon + '</span><span><b>Reprendre</b><br>' + esc(P.DOMAIN_INFO[last].full) + '</span><span class="hr-go">▶</span></button>';
    // domaines
    h += '<h2 class="home-h2">Choisis un domaine</h2><div class="dom-grid">';
    P.DOMAINS.forEach(function (d) {
      var info = P.DOMAIN_INFO[d], st = P.domainStars(rec, d), dmax = P.domainMax(d) || 300;
      var done = P.doneCount(rec, P.missionIds(d)), nmis = (O42.missions[d] || []).length;
      h += '<button class="dom-card" data-d="' + d + '" style="--hue:' + info.hue + '">' +
        '<div class="dom-ring">' + ring(dmax ? st / dmax : 0, 74, info.icon, info.hue) + '</div>' +
        '<div class="dom-body"><b>' + esc(info.full) + '</b><span class="dom-blurb">' + esc(info.blurb) + '</span>' +
        '<span class="dom-meta">★ ' + st + ' / ' + dmax + ' · ' + done + '/' + nmis + ' niveaux</span></div><span class="dom-go">›</span></button>';
    });
    h += '</div>';
    // classement aperçu + boutons
    h += '<div class="home-foot"><button class="home-big-btn" id="home-rank">🏆 Classement</button><button class="home-big-btn ghost" id="home-prof">👤 Mon profil</button></div>';
    h += '<p class="home-note">Progression enregistrée dans ce navigateur. Le classement affiche des rivaux simulés (il n’y a pas de serveur).</p>';
    h += '</div>';
    var el = H.el(); el.innerHTML = h; el.hidden = false; el.scrollTop = 0;
    document.body.classList.add('home-open');
    $('#home-close', el).onclick = H.hide;
    $('#home-resume', el).onclick = function () { H.hide(); O42.app.go(last, 'missions'); };
    $('#home-rank', el).onclick = function () { H.leaderboard(); };
    $('#home-prof', el).onclick = function () { H.profile(); };
    $('#home-av', el).onclick = function () { H.profile(); };
    Array.prototype.forEach.call(el.querySelectorAll('.dom-card'), function (b) { b.onclick = function () { H.hide(); O42.app.go(b.dataset.d, 'missions'); }; });
  };
  H.hide = function () { var el = H.el(); el.hidden = true; document.body.classList.remove('home-open'); };

  /* --- profil (modal) --- */
  H.profile = function () {
    var rec = O42.app.state.progress, me = P.me(), total = P.total(rec);
    var h = '<div class="prof"><button class="close" type="button">✕</button><div class="prof-head">' +
      '<div class="prof-av">' + esc(me.avatar) + '</div><div><input id="prof-name" class="prof-name" value="' + esc(me.name) + '" maxlength="18"> <div class="prof-rank">' + P.rank(total).ic + ' ' + esc(P.rank(total).t) + ' · ★ ' + total + '</div></div></div>';
    h += '<div class="prof-avs">' + P.AVATARS.map(function (a) { return '<button class="prof-pick' + (a === me.avatar ? ' on' : '') + '" data-a="' + a + '">' + a + '</button>'; }).join('') + '</div>';
    h += '<h3>Progression par domaine</h3><div class="prof-bars">';
    P.DOMAINS.forEach(function (d) {
      var info = P.DOMAIN_INFO[d], st = P.domainStars(rec, d), dmax = P.domainMax(d) || 300, done = P.doneCount(rec, P.missionIds(d));
      h += '<div class="prof-bar"><span class="pb-ic">' + info.icon + '</span><span class="pb-name">' + esc(info.name) + '</span>' +
        '<span class="pb-track"><i style="width:' + (dmax ? Math.round(st / dmax * 100) : 0) + '%;background:hsl(' + info.hue + ',75%,55%)"></i></span><span class="pb-val">★ ' + st + '/' + dmax + '</span></div>';
    });
    h += '</div>';
    // badges : un par chapitre terminé + examens
    var badges = [];
    P.DOMAINS.forEach(function (d) {
      (O42.chapters[d] || []).forEach(function (c, i) {
        var ids = (O42.missions[d] || []).filter(function (m) { return m.ch === i + 1; }).map(function (m) { return m.id; });
        if (ids.length && ids.every(function (id) { return rec[id]; })) badges.push({ ic: P.DOMAIN_INFO[d].icon, t: P.DOMAIN_INFO[d].name + ' · ch.' + (i + 1) });
        if (P.examPassed(rec, d, i + 1)) badges.push({ ic: '🎖', t: P.DOMAIN_INFO[d].name + ' examen ' + (i + 1) });
      });
    });
    h += '<h3>Badges (' + badges.length + ')</h3><div class="prof-badges">' + (badges.length ? badges.map(function (b) { return '<span class="badge-chip" title="' + esc(b.t) + '">' + b.ic + '</span>'; }).join('') : '<p class="home-note">Termine un chapitre pour gagner ton premier badge.</p>') + '</div>';
    h += '</div>';
    modal(h);
    var m = document.getElementById('modal');
    Array.prototype.forEach.call(m.querySelectorAll('.prof-pick'), function (b) { b.onclick = function () { var p = P.me(); p.avatar = b.dataset.a; P.setMe(p); H.profile(); O42.app.xp(); }; });
    $('#prof-name', m).onchange = function () { var p = P.me(); p.name = this.value.trim() || 'Toi'; P.setMe(p); };
  };

  /* --- classement (modal avec onglets) --- */
  H.leaderboard = function (domain) {
    var rec = O42.app.state.progress;
    var tabs = [{ k: '', n: '🌍 Global' }].concat(P.DOMAINS.map(function (d) { return { k: d, n: P.DOMAIN_INFO[d].icon + ' ' + P.DOMAIN_INFO[d].name }; }));
    var cur = domain || '';
    var list = P.leaderboard(rec, cur || null);
    var h = '<div class="lb"><button class="close" type="button">✕</button><h2>🏆 Classement</h2>' +
      '<div class="lb-tabs">' + tabs.map(function (t) { return '<button class="lb-tab' + (t.k === cur ? ' on' : '') + '" data-k="' + t.k + '">' + t.n + '</button>'; }).join('') + '</div>';
    var maxS = cur ? (P.domainMax(cur) || 300) : P.totalMax();
    h += '<ol class="lb-list">' + list.map(function (r) {
      return '<li class="' + (r.me ? 'me' : '') + (r.rank <= 3 ? ' top' : '') + '"><span class="lb-rank">' + (r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank) + '</span>' +
        '<span class="lb-av">' + r.avatar + '</span><span class="lb-name">' + esc(r.name) + '</span>' +
        '<span class="lb-bar"><i style="width:' + Math.round(r.stars / maxS * 100) + '%"></i></span>' +
        '<span class="lb-stars">★ ' + r.stars + '</span></li>';
    }).join('') + '</ol>';
    h += '<p class="home-note">Rivaux simulés (scores déterministes). À toi de grimper !</p></div>';
    modal(h);
    var m = document.getElementById('modal');
    Array.prototype.forEach.call(m.querySelectorAll('.lb-tab'), function (b) { b.onclick = function () { H.leaderboard(b.dataset.k); }; });
  };

  function modal(html) { var m = document.getElementById('modal'); m.innerHTML = '<div class="modal-card wide">' + html + '</div>'; m.hidden = false; }
})(typeof window !== 'undefined' ? window : globalThis);
