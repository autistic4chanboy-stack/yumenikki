/* =========================================================================
 *  42 ORIGINS — profil, étoiles, rangs, classements
 *  Économie d'étoiles : chaque niveau rapporte jusqu'à 3 ★ (réussi +1,
 *  sans indice +1, du premier coup +1). Un domaine = 100 niveaux = 300 ★.
 *  Cinq domaines = 1500 ★ au total. Les classements rangent par étoiles.
 *  Tout est stocké dans le navigateur ; les rivaux du classement sont
 *  déterministes et simulés (il n'y a pas de serveur).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var P = O42.profile = {};

  P.DOMAINS = ['c', 'py', 'asm', 'cobol', 'cyber'];
  P.DOMAIN_INFO = {
    c: { name: 'C', full: 'Langage C', icon: '🔧', hue: 205, blurb: 'Pointeurs, mémoire, malloc, get_next_line.' },
    py: { name: 'Python', full: 'Python', icon: '🐍', hue: 145, blurb: 'Objets, listes, dictionnaires, récursion.' },
    asm: { name: 'ASM', full: 'Assembleur x86-64', icon: '⚙️', hue: 275, blurb: 'Registres, pile, drapeaux, appels système.' },
    cobol: { name: 'COBOL', full: 'COBOL', icon: '🏦', hue: 35, blurb: 'PIC, WORKING-STORAGE, PERFORM — le code des banques.' },
    cyber: { name: 'Cyber', full: 'Cybersécurité', icon: '🛡️', hue: 350, blurb: 'Failles simulées : SQLi, XSS, overflow, crypto…' }
  };
  var store = O42.store || (O42.store = {
    get: function (k, d) { try { var v = localStorage.getItem('42o.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('42o.' + k, JSON.stringify(v)); } catch (e) { /* indisponible */ } }
  });
  P.store = store;

  /* --- enregistrement de progression : { s: étoiles 0..3, h: sans indice, f: 1er coup, t: date } --- */
  P.load = function () {
    var raw = store.get('progress', {}), rec = {};
    for (var k in raw) { var v = raw[k]; rec[k] = typeof v === 'number' ? { s: 1, t: v } : v; }
    return rec;
  };
  P.save = function (rec) { store.set('progress', rec); };
  P.stars = function (rec, id) { return rec[id] ? (rec[id].s || 0) : 0; };
  P.doneCount = function (rec, ids) { return ids.filter(function (id) { return rec[id]; }).length; };

  /* calcule les étoiles d'une réussite */
  P.computeStars = function (hintsUsed, fails) { return 1 + (hintsUsed ? 0 : 1) + (fails ? 0 : 1); };

  /* liste des ids de missions d'un domaine (après finalizeMissions) */
  P.missionIds = function (domain) { return (O42.missions[domain] || []).map(function (m) { return m.id; }); };
  P.domainStars = function (rec, domain) { var s = 0; P.missionIds(domain).forEach(function (id) { s += P.stars(rec, id); }); return s; };
  P.domainMax = function (domain) { return (O42.missions[domain] || []).length * 3; };
  P.total = function (rec) { var s = 0; P.DOMAINS.forEach(function (d) { s += P.domainStars(rec, d); }); return s; };
  P.totalMax = function () { var s = 0; P.DOMAINS.forEach(function (d) { s += P.domainMax(d); }); return s; };

  /* rangs par étoiles totales */
  P.RANKS = [
    { at: 0, t: 'Visiteur', ic: '🌱' }, { at: 30, t: 'Apprenti', ic: '📘' }, { at: 90, t: 'Codeur', ic: '💡' },
    { at: 180, t: 'Artisan', ic: '🔨' }, { at: 330, t: 'Ingénieur', ic: '🛠️' }, { at: 520, t: 'Expert', ic: '⭐' },
    { at: 760, t: 'Maître', ic: '🏅' }, { at: 1050, t: 'Architecte', ic: '🏛️' }, { at: 1300, t: 'Légende 42', ic: '👑' }, { at: 1500, t: 'Origin', ic: '🌌' }
  ];
  P.rank = function (stars) { var r = P.RANKS[0]; for (var i = 0; i < P.RANKS.length; i++) if (stars >= P.RANKS[i].at) r = P.RANKS[i]; return r; };
  P.nextRank = function (stars) { for (var i = 0; i < P.RANKS.length; i++) if (stars < P.RANKS[i].at) return P.RANKS[i]; return null; };

  /* niveau de joueur (façon XP) : surtout décoratif */
  P.level = function (stars) { return Math.floor(Math.sqrt(stars) ) + 1; };

  /* --- identité du joueur --- */
  P.me = function () {
    var p = store.get('player', null);
    if (!p) { p = { name: 'Toi', avatar: '🦊', created: Date.now() }; store.set('player', p); }
    return p;
  };
  P.setMe = function (p) { store.set('player', p); };
  P.AVATARS = ['🦊', '🐱', '🐼', '🦉', '🐙', '🦾', '🤖', '🐢', '🦅', '🐝', '🦖', '🐬'];

  /* --- examens : un par palier de 10 niveaux (fin de chapitre) --- */
  P.examId = function (domain, chapter) { return 'exam.' + domain + '.' + chapter; };
  P.examPassed = function (rec, domain, chapter) { return !!rec[P.examId(domain, chapter)]; };

  /* --- classement : rivaux déterministes (simulés, pas de serveur) --- */
  P.RIVALS = [
    { name: 'NullByte', avatar: '🦾', seed: 7, skew: { cyber: 1.6, asm: 1.2 } },
    { name: 'Ada_L', avatar: '🦉', seed: 13, skew: { py: 1.5, c: 1.1 } },
    { name: 'SegFault', avatar: '🐙', seed: 23, skew: { c: 1.5, asm: 1.4 } },
    { name: 'GraceH', avatar: '🐝', seed: 31, skew: { cobol: 1.8, py: 1.1 } },
    { name: 'r00t', avatar: '🤖', seed: 41, skew: { cyber: 1.9 } },
    { name: 'PixelPanda', avatar: '🐼', seed: 47, skew: { py: 1.3, cobol: 1.2 } },
    { name: 'Kernel_K', avatar: '🦅', seed: 59, skew: { asm: 1.6, c: 1.3 } },
    { name: 'ByteMe', avatar: '🐢', seed: 67, skew: { c: 1.2, cyber: 1.2 } },
    { name: 'Mainframe', avatar: '🏦', seed: 71, skew: { cobol: 2.0 } },
    { name: 'Vega', avatar: '🦖', seed: 83, skew: { py: 1.4, asm: 1.1 } },
    { name: 'Hex', avatar: '🐬', seed: 89, skew: { asm: 1.5, cyber: 1.3 } },
    { name: 'Cipher', avatar: '🐱', seed: 97, skew: { cyber: 1.7, c: 1.1 } }
  ];
  /* score simulé d'un rival pour un domaine (déterministe, borné) */
  P.rivalStars = function (rival, domain) {
    var rng = O42.util.rng(rival.seed * 131 + domainSeed(domain)), max = P.domainMax(domain) || 300;
    var base = (rng() % 1000) / 1000, skew = (rival.skew && rival.skew[domain]) || 0.8;
    var v = Math.min(1, base * 0.7 * skew + 0.15);
    return Math.round(v * max);
  };
  function domainSeed(d) { return { c: 3, py: 5, asm: 7, cobol: 11, cyber: 13 }[d] || 1; }
  P.rivalTotal = function (rival) { var s = 0; P.DOMAINS.forEach(function (d) { s += P.rivalStars(rival, d); }); return s; };

  P.leaderboard = function (rec, domain) {
    var me = P.me(), list = P.RIVALS.map(function (r) {
      return { name: r.name, avatar: r.avatar, stars: domain ? P.rivalStars(r, domain) : P.rivalTotal(r), me: false };
    });
    list.push({ name: me.name + ' (toi)', avatar: me.avatar, stars: domain ? P.domainStars(rec, domain) : P.total(rec), me: true });
    list.sort(function (a, b) { return b.stars - a.stars || (a.me ? 1 : -1); });
    list.forEach(function (x, i) { x.rank = i + 1; });
    return list;
  };
})(typeof window !== 'undefined' ? window : globalThis);
