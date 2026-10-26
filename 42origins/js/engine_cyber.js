/* =========================================================================
 *  42 ORIGINS — moteur Cybersécurité (laboratoire simulé)
 *
 *  Tout est SIMULÉ dans le navigateur : aucune machine, aucun réseau, aucun
 *  système réel n'est touché. Chaque défi présente une cible vulnérable
 *  factice (un formulaire, un mini-serveur de fichiers, un bout de mémoire…)
 *  et l'apprenant écrit une « charge » (payload) dans l'éditeur. Le moteur
 *  rejoue l'attaque étape par étape pour MONTRER comment la faille marche,
 *  puis comment s'en protéger. But : comprendre et défendre.
 *
 *  Le moteur expose l'interface commune (step/done/error/stdout/view…) et,
 *  en plus, panels() → l'état de la cible, rendu par CyberView.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  O42.cyber = O42.cyber || {};
  var SIM = O42.cyber.sims = O42.cyber.sims || {};

  function esc(s) { return U.esc(String(s)); }
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function b64(s) {
    var bytes = U.utf8(s), out = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < bytes.length ? B64[n & 63] : '=');
    }
    return out;
  }
  function unb64(s) {
    s = String(s).replace(/[^A-Za-z0-9+/]/g, '');
    var bytes = [];
    for (var i = 0; i < s.length; i += 4) {
      var n = (B64.indexOf(s[i]) << 18) | (B64.indexOf(s[i + 1]) << 12) | ((B64.indexOf(s[i + 2]) & 63) << 6) | (B64.indexOf(s[i + 3]) & 63);
      bytes.push((n >> 16) & 255); if (s[i + 2]) bytes.push((n >> 8) & 255); if (s[i + 3]) bytes.push(n & 255);
    }
    try { return U.decode(bytes); } catch (e) { return ''; }
  }
  function parseInput(src) {
    // « clé: valeur » par ligne → objet ; sinon chaîne brute
    var lines = src.replace(/\r/g, '').split('\n'), params = {}, has = false, raw = src.trim();
    lines.forEach(function (l) { var m = /^\s*([A-Za-z_][\w.-]*)\s*[:=]\s?(.*)$/.exec(l); if (m && !/^https?/.test(l)) { params[m[1]] = m[2]; has = true; } });
    return { params: has ? params : null, raw: raw, lines: lines.filter(function (l) { return l.trim(); }) };
  }
  O42.cyber.util = { esc: esc, b64: b64, unb64: unb64, parseInput: parseInput };

  /* ---------------------------------------------------------------- machine */
  function Machine(input, sc) {
    this.src = input; this.sc = sc;
    this.trace = []; this.out = []; this.ok = false; this.flag = null; this.panelsData = [];
    this.error = null; this.hintMsg = null; this.warnings = [];
    this.idx = -1; this.steps = 0; this.done = false; this.exitCode = null;
    this.log = []; this.acc = []; this.line = 0; this.used = {};
    try { this.build(); }
    catch (e) { this.trace = [{ line: 0, log: [{ t: '✖ ' + (e.msg || e.message), c: 'err' }], panels: [], out: '' }]; this.error = { msg: e.msg || e.message, kind: 'sim', line: e.line || 0 }; }
    this.renderAt(0);
  }
  var M = Machine.prototype;
  Object.defineProperty(M, 'stdout', { get: function () { return this.out.join(''); } });
  Object.defineProperty(M, 'depth', { get: function () { return 0; } });

  M.build = function () {
    var sim = SIM[this.sc.sim];
    if (!sim) throw { msg: 'simulateur « ' + this.sc.sim + ' » inconnu', line: 0 };
    var ctx = {
      input: this.src, parsed: parseInput(this.src), sc: this.sc,
      trace: [], out: '',
      stage: function (text, cls, panels) { this.trace.push({ log: typeof text === 'string' ? [{ t: text, c: cls || '' }] : text, panels: panels || [], out: this.out }); },
      print: function (s) { this.out += s + '\n'; },
      win: function (flag) { this.ok = true; this.flag = flag || 'OK'; },
      ok: false, flag: null, fail: null, esc: esc, b64: b64, unb64: unb64
    };
    sim.run(ctx);
    this.trace = ctx.trace.length ? ctx.trace : [{ log: [{ t: 'Rien à exécuter.', c: '' }], panels: [], out: ctx.out }];
    this.ok = ctx.ok; this.flag = ctx.flag; this.finalOut = ctx.out; this.failMsg = ctx.fail;
  };

  M.renderAt = function (i) {
    this.idx = i;
    var fr = this.trace[i] || { log: [], panels: [], out: '' };
    this.log = fr.log || []; this.panelsData = fr.panels || []; this.acc = fr.acc || [];
    this.line = fr.line || 0;
    // la sortie accumulée jusqu'à cette étape
    this.out = [fr.out !== undefined ? fr.out : (this.finalOut || '')];
  };
  M.step = function () {
    if (this.done) return false;
    this.steps++;
    if (this.idx + 1 >= this.trace.length) { this.finish(); return false; }
    this.renderAt(this.idx + 1);
    if (this.idx + 1 >= this.trace.length) this.finish();
    return !this.done;
  };
  M.finish = function () {
    if (this.done) return;
    this.done = true;
    this.out = [this.finalOut || this.out[0] || ''];
    this.exitCode = this.ok ? 0 : 1;
    if (this.ok) this.log = [{ t: '🚩 Objectif atteint : ' + (this.flag || ''), c: 'ok' }];
    else if (this.failMsg) this.log = [{ t: this.failMsg, c: 'warn' }];
    else this.log = [{ t: 'La cible n’a pas été compromise. Essaie une autre charge.', c: '' }];
    this.panelsData = (this.trace[this.trace.length - 1] || {}).panels || this.panelsData;
  };
  M.chunks = function () { return [{ fd: 1, s: this.stdout }]; };
  M.summary = function () { return null; };
  M.panels = function () { return this.panelsData; };
  M.view = function () { return { regions: [], acc: [], cyber: true }; };
  M.peekVar = function () { return null; };

  /* ---------------------------------------------------------------- mini-SQL */
  /* un moteur SQL jouet : SELECT cols FROM tbl [WHERE cond] [UNION SELECT ...] */
  function sqlRun(db, query) {
    var q = query.replace(/\s+/g, ' ').trim();
    // retire les commentaires -- ... et # ... et /* */
    var cutc = q.search(/--|#/);
    var commented = cutc >= 0 ? q.slice(cutc) : '';
    if (cutc >= 0) q = q.slice(0, cutc).trim();
    q = q.replace(/\/\*.*?\*\//g, ' ');
    var rows = [], parts = q.split(/\bUNION\b(?:\s+ALL)?/i);
    parts.forEach(function (sel) {
      sel = sel.trim().replace(/;$/, '');
      var m = /^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i.exec(sel);
      if (!m) { if (/^SELECT\s+(.+)$/i.test(sel) && parts.length > 1) { rows.push(litRow(RegExp.$1)); } return; }
      var cols = m[1].split(',').map(function (c) { return c.trim(); });
      var table = db[m[2].toLowerCase()];
      if (!table) return;
      var where = m[3];
      table.rows.forEach(function (r) {
        if (where && !sqlCond(where, r, table.cols)) return;
        var out = cols.map(function (c) {
          if (c === '*') return table.cols.map(function (cn) { return r[cn]; });
          if (/^['"].*['"]$/.test(c)) return [c.slice(1, -1)];
          if (/^\d+$/.test(c)) return [c];
          return [r[c] !== undefined ? r[c] : c];
        });
        rows.push([].concat.apply([], out));
      });
    });
    return { rows: rows, query: q, commented: commented };
  }
  function litRow(sel) { return sel.split(',').map(function (c) { c = c.trim(); return /^['"].*['"]$/.test(c) ? c.slice(1, -1) : c; }); }
  function sqlCond(cond, row, cols) {
    // évalue AND/OR de comparaisons simples « col = 'x' » ; tolère OR 1=1, '='' etc.
    try {
      var expr = cond.replace(/\bAND\b/gi, '&&').replace(/\bOR\b/gi, '||');
      // remplace les comparaisons col op 'val' / num
      expr = expr.replace(/([\w.]+|'[^']*'|"[^"]*"|\d+)\s*(=|<>|!=|<|>|<=|>=|LIKE)\s*('[^']*'|"[^"]*"|\d+|[\w.]+)/gi, function (all, a, op, b) {
        var av = val(a), bv = val(b);
        if (op.toUpperCase() === 'LIKE') { var re = new RegExp('^' + String(bv).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i'); return re.test(String(av)) ? 'true' : 'false'; }
        if (op === '=') op = '===='; if (op === '<>' || op === '!=') op = '!===';
        var r;
        switch (op) { case '====': r = String(av) === String(bv); break; case '!===': r = String(av) !== String(bv); break; case '<': r = +av < +bv; break; case '>': r = +av > +bv; break; case '<=': r = +av <= +bv; break; case '>=': r = +av >= +bv; break; default: r = false; }
        return r ? 'true' : 'false';
      });
      function val(x) { if (/^['"]/.test(x)) return x.slice(1, -1); if (/^\d+$/.test(x)) return x; return row[x] !== undefined ? row[x] : x; }
      // ce qui reste (true/false/&&/||/parenthèses) est évalué prudemment
      if (!/^[\s()truefalse&|!]+$/i.test(expr)) return false;
      /* eslint-disable no-new-func */
      return !!Function('"use strict";return (' + expr.replace(/\btrue\b/gi, 'true').replace(/\bfalse\b/gi, 'false') + ')')();
    } catch (e) { return false; }
  }
  function dbPanel(db, title) {
    var html = '';
    for (var t in db) {
      html += '<div class="cy-table"><div class="cy-th">🗃 ' + esc(t) + '</div><table><tr>' + db[t].cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>' +
        db[t].rows.map(function (r) { return '<tr>' + db[t].cols.map(function (c) { return '<td' + (/pass|secret|flag|token/i.test(c) ? ' class="cy-secret"' : '') + '>' + esc(r[c]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
    }
    return { title: title || 'Base de données', html: html };
  }

  /* ------- SQLi : contournement d'authentification / dump ------- */
  SIM.sqli = { run: function (c) {
    var sc = c.sc, db = sc.db(), field = sc.field || 'username', fixed = sc.fixed || {};
    var p = c.parsed.params || {}, inj = p[field] !== undefined ? p[field] : c.parsed.raw;
    var vals = Object.assign({}, fixed); vals[field] = inj;
    c.stage([{ t: 'Le formulaire envoie « ' + field + ' » = ' + JSON.stringify(inj), c: 'io' }], null, [dbPanel(db), reqPanel(vals)]);
    var query = sc.query(vals);
    c.stage([{ t: 'Le serveur construit la requête SANS protéger l’entrée :', c: 'warn' }, { t: query, c: 'alu' }], null, [dbPanel(db), { title: 'Requête SQL exécutée', html: '<pre class="cy-sql">' + sqlHighlight(query, inj) + '</pre>' }]);
    var res = sqlRun(db, query);
    var hit = res.rows.length > 0;
    c.stage([{ t: 'Résultat : ' + res.rows.length + ' ligne(s) renvoyée(s).', c: hit ? 'yes' : 'no' }], null, [{ title: 'Réponse de la base', html: res.rows.length ? '<table class="cy-res">' + res.rows.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>' : '<p class="cy-empty">aucune ligne — accès refusé</p>' }]);
    var okFn = sc.success || function (rows) { return rows.length > 0; };
    if (okFn(res.rows, res)) { c.print(sc.winMsg || 'Authentification réussie !'); c.win(sc.flag || 'ACCESS-GRANTED'); c.stage([{ t: '🚩 ' + (sc.winMsg || 'Tu es entré !') + ' La requête a renvoyé des données qu’elle n’aurait pas dû.', c: 'ok' }], null, []); }
    else { c.fail = 'La requête n’a rien renvoyé d’utile. Pense à neutraliser le mot de passe (ex. avec OR, ou en commentant la fin avec --).'; }
    c.stage([{ t: '🛡 Défense : utiliser des requêtes préparées (paramètres liés), jamais de concaténation de l’entrée utilisateur.', c: 'call' }], null, []);
  } };
  function sqlHighlight(q, inj) {
    var h = esc(q);
    if (inj) { var e = esc(inj); h = h.split(e).join('<span class="cy-inj">' + e + '</span>'); }
    return h.replace(/\b(SELECT|FROM|WHERE|AND|OR|UNION|LIKE|INSERT|UPDATE|DELETE)\b/gi, '<span class="cy-kw">$1</span>');
  }
  function reqPanel(vals) { return { title: 'Requête HTTP (POST)', html: '<pre class="cy-req">' + Object.keys(vals).map(function (k) { return esc(k) + '=' + esc(vals[k]); }).join('&amp;') + '</pre>' }; }

  /* ------- Injection de commande ------- */
  SIM.cmdi = { run: function (c) {
    var sc = c.sc, fs = sc.fs(), inj = (c.parsed.params && c.parsed.params[sc.field || 'host']) || c.parsed.raw;
    var cmd = sc.build(inj);
    c.stage([{ t: 'L’application exécute un shell : ' + sc.template, c: 'io' }, { t: '→ ' + cmd, c: 'warn' }], null, [fsPanel(fs), { title: 'Commande shell', html: '<pre class="cy-sh">' + esc(cmd) + '</pre>' }]);
    var r = shellRun(cmd, fs);
    r.forEach(function (st) { c.print(st.out); c.stage([{ t: '$ ' + st.cmd, c: 'alu' }, { t: st.out || '(rien)', c: st.hit ? 'yes' : '' }], null, [fsPanel(fs)]); });
    var got = r.some(function (st) { return sc.success ? sc.success(st.out) : /FLAG|flag\{/.test(st.out); });
    if (got) { c.win(sc.flag || 'CMD-EXEC'); c.stage([{ t: '🚩 Tu as exécuté une commande en plus de celle prévue : injection réussie.', c: 'ok' }], null, []); }
    else c.fail = 'La commande injectée n’a rien révélé. Essaie d’enchaîner une commande (; && |) pour lire le drapeau.';
    c.stage([{ t: '🛡 Défense : ne jamais passer une entrée à un shell. Utiliser une API qui prend les arguments séparément, et valider strictement l’entrée.', c: 'call' }], null, []);
  } };
  function shellRun(cmd, fs) {
    var out = [], cmds = cmd.split(/\s*(?:;|&&|\|\||\|)\s*/).filter(Boolean);
    cmds.forEach(function (one) {
      var parts = one.trim().split(/\s+/), prog = parts[0], arg = parts.slice(1).join(' ');
      var o = '', hit = false;
      if (prog === 'echo') o = arg.replace(/^["']|["']$/g, '');
      else if (prog === 'whoami') o = 'www-data';
      else if (prog === 'id') o = 'uid=33(www-data) gid=33(www-data)';
      else if (prog === 'ls') { var d = fs[arg || '.'] || fs['.']; o = d && d.dir ? d.dir.join('  ') : Object.keys(fs).filter(function (k) { return k !== '.'; }).join('  '); }
      else if (prog === 'cat') { var f = fs[arg]; o = f ? (f.content !== undefined ? f.content : '') : 'cat: ' + arg + ': No such file'; if (f && /FLAG|flag\{/.test(o)) hit = true; }
      else if (prog === 'pwd') o = '/srv/app';
      else if (prog === 'ping') o = 'PING ' + arg + ': 64 bytes';
      else o = prog + ': command not found';
      out.push({ cmd: one.trim(), out: o, hit: hit });
    });
    return out;
  }
  function fsPanel(fs) {
    var html = '<ul class="cy-fs">';
    for (var k in fs) { if (k === '.') continue; html += '<li>' + (fs[k].dir ? '📁 ' : '📄 ') + esc(k) + (fs[k].secret ? ' 🔒' : '') + '</li>'; }
    return { title: 'Système de fichiers (simulé)', html: html + '</ul>' };
  }

  /* ------- Traversée de chemin ------- */
  SIM.pathtrav = { run: function (c) {
    var sc = c.sc, fs = sc.fs(), inj = (c.parsed.params && c.parsed.params[sc.field || 'file']) || c.parsed.raw;
    var full = (sc.base || '/var/www/public/') + inj;
    var resolved = normPath(full);
    c.stage([{ t: 'Le serveur sert : ' + sc.base + '<entrée>', c: 'io' }, { t: 'chemin demandé : ' + full, c: '' }, { t: 'chemin résolu  : ' + resolved, c: 'warn' }], null, [fsTreePanel(fs, resolved)]);
    var f = fs[resolved];
    if (f && f.content !== undefined) {
      c.print(f.content);
      c.stage([{ t: 'Fichier lu : ' + resolved, c: 'yes' }], null, [{ title: 'Contenu servi', html: '<pre class="cy-file">' + esc(f.content) + '</pre>' }]);
      if (sc.success ? sc.success(resolved, f.content) : f.secret) { c.win(sc.flag || 'FILE-READ'); c.stage([{ t: '🚩 Tu es sorti du dossier public et as lu un fichier interdit.', c: 'ok' }], null, []); }
      else c.fail = 'Ce fichier est public. Remonte l’arborescence avec ../ pour atteindre un fichier sensible.';
    } else { c.stage([{ t: '404 : fichier introuvable (' + resolved + ')', c: 'no' }], null, []); c.fail = 'Chemin invalide. Combien de ../ faut-il pour sortir de « ' + sc.base + ' » ?'; }
    c.stage([{ t: '🛡 Défense : refuser « .. », résoudre le chemin et vérifier qu’il reste dans le dossier autorisé.', c: 'call' }], null, []);
  } };
  function normPath(p) { var parts = p.split('/'), out = []; parts.forEach(function (s) { if (s === '..') out.pop(); else if (s !== '.' && s !== '') out.push(s); }); return '/' + out.join('/'); }
  function fsTreePanel(fs, hi) {
    var keys = Object.keys(fs).sort();
    return { title: 'Fichiers du serveur', html: '<ul class="cy-fs">' + keys.map(function (k) { return '<li class="' + (k === hi ? 'cy-hit' : '') + '">' + (fs[k].secret ? '🔒 ' : '📄 ') + esc(k) + '</li>'; }).join('') + '</ul>' };
  }

  /* ------- Logique / IDOR / contournement d'auth ------- */
  SIM.logic = { run: function (c) {
    var sc = c.sc, state = sc.state(), req = c.parsed.params || {};
    if (!c.parsed.params) { c.fail = 'Écris la requête sous forme « clé: valeur » (une par ligne).'; c.stage([{ t: 'Format attendu : des lignes « paramètre: valeur ».', c: 'warn' }], null, [sc.panel(state, {})]); return; }
    c.stage([{ t: 'Requête envoyée :', c: 'io' }].concat(Object.keys(req).map(function (k) { return { t: '  ' + k + ' = ' + req[k], c: '' }; })), null, [sc.panel(state, req)]);
    var r = sc.check(state, req, c);
    (r.steps || []).forEach(function (st) { c.stage(st.log, null, st.panels || [sc.panel(state, req)]); });
    if (r.ok) { c.print(r.msg || 'Accès obtenu.'); c.win(sc.flag || 'LOGIC-BYPASS'); c.stage([{ t: '🚩 ' + (r.win || 'Tu as accédé à une ressource interdite en modifiant la requête.'), c: 'ok' }], null, [sc.panel(state, req)]); }
    else c.fail = r.fail || 'Pas encore. Observe quels paramètres le serveur fait confiance.';
    if (sc.defense) c.stage([{ t: '🛡 ' + sc.defense, c: 'call' }], null, []);
  } };

  /* ------- Débordement de tampon (mémoire visible) ------- */
  SIM.overflow = { run: function (c) {
    var sc = c.sc, bufLen = sc.buf || 8, inj = c.parsed.raw;
    var bytes = U.utf8(inj);
    // disposition : [ buffer (bufLen) ][ flag (sc.after bytes, souvent 4) ]
    var afterLen = sc.afterLen || 4, total = bufLen + afterLen;
    var mem = new Array(total).fill(0);
    var secret = sc.afterInit !== undefined ? sc.afterInit : 0;
    for (var i = 0; i < afterLen; i++) mem[bufLen + i] = (secret >> (8 * i)) & 255;
    c.stage([{ t: 'La variable « ' + (sc.varName || 'buffer') + ' » fait ' + bufLen + ' octets, suivie de « ' + (sc.afterName || 'is_admin') + ' » (' + afterLen + ' octets, = ' + secret + ').', c: '' }], memCells(mem, bufLen, sc), []);
    c.stage([{ t: 'gets(' + (sc.varName || 'buffer') + ') copie TON entrée sans vérifier la taille (' + bytes.length + ' octets écrits).', c: 'warn' }], null, []);
    for (var k = 0; k < bytes.length && k < total; k++) mem[k] = bytes[k];
    if (bytes.length > bufLen) c.stage([{ t: '⚠ débordement : ' + (bytes.length - bufLen) + ' octet(s) écrasent ce qui suit le tampon.', c: 'warn' }], null, []);
    var after = 0; for (i = 0; i < afterLen; i++) after |= (mem[bufLen + i] || 0) << (8 * i);
    c.stage([{ t: 'Après copie, « ' + (sc.afterName || 'is_admin') + ' » vaut maintenant ' + (after >>> 0) + '.', c: after !== secret ? 'yes' : 'no' }], memCells(mem, bufLen, sc, bytes.length), []);
    var goal = sc.success ? sc.success(after >>> 0, mem) : (after >>> 0) !== (secret >>> 0) && (after >>> 0) !== 0;
    if (goal) { c.print(sc.winMsg || 'is_admin = 1 → accès administrateur !'); c.win(sc.flag || 'OVERFLOW'); c.stage([{ t: '🚩 En débordant le tampon, tu as changé une variable voisine. C’est un buffer overflow.', c: 'ok' }], null, []); }
    else c.fail = sc.failMsg || ('Le tampon fait ' + bufLen + ' octets. Combien de caractères faut-il pour atteindre et changer « ' + (sc.afterName || 'is_admin') + ' » ?');
    c.stage([{ t: '🛡 Défense : vérifier la longueur (fgets avec taille), ne jamais utiliser gets.', c: 'call' }], null, []);
  } };
  function memCells(mem, bufLen, sc, written) {
    var cells = mem.map(function (b, i) {
      var inBuf = i < bufLen;
      return { a: 0x100 + i, n: 1, lbl: i === 0 ? (sc.varName || 'buf') : i === bufLen ? (sc.afterName || 'flag') : '', val: U.glyph(b), sub: String(b), kind: 'char', cls: (written !== undefined && i < written && !inBuf ? 'acc-w ' : '') + (inBuf ? '' : 'nul') };
    });
    return [{ title: 'Mémoire de la pile', html: '<div class="cy-mem">' + cells.map(function (c2) { return '<span class="cy-cell ' + (c2.cls || '') + '" title="' + c2.sub + '"><i>' + esc(c2.lbl) + '</i><b>' + esc(c2.val) + '</b></span>'; }).join('') + '</div><p class="cy-note">bleu/orange = octets que ton entrée a écrits ; à droite du trait = la variable voisine.</p>' }];
  }

  /* ------- Chaîne de format ------- */
  SIM.formatstr = { run: function (c) {
    var sc = c.sc, stack = sc.stack || ['0x1', 'SECRET=' + (sc.secret || 'flag{s3cr3t}'), '0x0'], fmt = c.parsed.raw;
    c.stage([{ t: 'Le programme fait printf(entrée) au lieu de printf("%s", entrée).', c: 'warn' }, { t: 'Pile (du haut) : ' + stack.join(' | '), c: '' }], null, [{ title: 'Pile lue par printf', html: '<ol class="cy-stack">' + stack.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' }]);
    var out = '', leaked = [], si = 0;
    fmt.replace(/%[0-9$]*([sxpn%])/g, function (m, conv) { if (conv === '%') { out += '%'; return; } var v = stack[si++] || '(vide)'; if (conv === 's' || conv === 'x' || conv === 'p') { out += v + ' '; leaked.push(v); } return m; });
    if (!/%/.test(fmt)) out = fmt;
    c.print(out.trim());
    c.stage([{ t: 'Sortie : ' + (out.trim() || '(vide)'), c: leaked.length ? 'yes' : '' }], null, [{ title: 'Fuite mémoire', html: '<pre class="cy-file">' + esc(out.trim()) + '</pre>' }]);
    var got = leaked.some(function (v) { return /SECRET|flag\{/i.test(v); });
    if (got) { c.win(sc.flag || 'MEM-LEAK'); c.stage([{ t: '🚩 Avec des %x / %s tu as lu la mémoire de la pile et fait fuiter un secret.', c: 'ok' }], null, []); }
    else c.fail = 'Pas de secret révélé. Essaie plusieurs spécificateurs %x ou %s pour lire plus loin dans la pile.';
    c.stage([{ t: '🛡 Défense : toujours un format constant — printf("%s", entrée).', c: 'call' }], null, []);
  } };

  /* ------- Crypto jouet : XOR / César / dictionnaire ------- */
  SIM.crypto = { run: function (c) {
    var sc = c.sc;
    if (sc.kind === 'caesar') {
      var ct = sc.cipher, ans = (c.parsed.params && c.parsed.params.plaintext) || c.parsed.raw;
      c.stage([{ t: 'Texte chiffré (César) : ' + ct, c: 'io' }], null, [caesarPanel(ct)]);
      c.stage([{ t: 'Toutes les rotations possibles :', c: '' }], null, [caesarPanel(ct)]);
      var dec = sc.plain;
      if (norm(ans) === norm(dec)) { c.print('Déchiffré : ' + dec); c.win(sc.flag || 'DECRYPTED'); c.stage([{ t: '🚩 Tu as cassé le chiffre de César (26 décalages à tester seulement).', c: 'ok' }], null, []); }
      else c.fail = 'Ce n’est pas le bon texte clair. Regarde les 26 rotations et trouve celle qui a du sens.';
    } else if (sc.kind === 'xor') {
      var hex = sc.cipherHex, key = (c.parsed.params && c.parsed.params.key) || c.parsed.raw;
      var bytes = hexBytes(hex), dec2 = '';
      for (var i = 0; i < bytes.length; i++) dec2 += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
      c.stage([{ t: 'Chiffré (XOR clé répétée) : ' + hex, c: 'io' }, { t: 'Avec la clé « ' + key + ' » → ' + dec2, c: /flag\{/.test(dec2) ? 'yes' : '' }], null, [{ title: 'Déchiffrement XOR', html: '<pre class="cy-file">' + esc(dec2) + '</pre>' }]);
      if (/flag\{/.test(dec2)) { c.win('XOR-BROKEN'); c.stage([{ t: '🚩 Clé trouvée : le XOR à clé courte répétée est cassable.', c: 'ok' }], null, []); }
      else c.fail = 'Mauvaise clé. Indice : le texte clair commence souvent par « flag{ ».';
    } else { // dictionnaire de hash
      var target = sc.hash, ans3 = (c.parsed.params && c.parsed.params.password) || c.parsed.raw;
      c.stage([{ t: 'Hash volé : ' + target + ' (fonction : ' + (sc.algo || 'toy') + ')', c: 'io' }], null, [{ title: 'Fuite de la base', html: '<pre class="cy-file">user: admin\nhash: ' + esc(target) + '</pre>' }]);
      if (toyHash(ans3) === target) { c.print('Mot de passe retrouvé : ' + ans3); c.win('CRACKED'); c.stage([{ t: '🚩 Mot de passe trouvé : un hash faible et un mot courant se cassent par dictionnaire.', c: 'ok' }], null, []); }
      else c.fail = 'Ce mot ne donne pas ce hash. Essaie des mots de passe courants (le classement des pires mots de passe aide !).';
    }
    c.stage([{ t: '🛡 Défense : algorithmes modernes et salés (argon2, bcrypt), clés longues et aléatoires, jamais de chiffre « maison ».', c: 'call' }], null, []);
  } };
  function caesarPanel(ct) { var rows = ''; for (var s = 1; s < 26; s++) rows += '<tr><td>+' + s + '</td><td>' + esc(caesar(ct, s)) + '</td></tr>'; return { title: 'Les 26 rotations', html: '<table class="cy-caesar"><tr><td>0</td><td>' + esc(ct) + '</td></tr>' + rows + '</table>' }; }
  function caesar(s, n) { return s.replace(/[a-z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 97 + n) % 26 + 97); }).replace(/[A-Z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 + n) % 26 + 65); }); }
  function norm(s) { return String(s).trim().toLowerCase(); }
  function hexBytes(h) { var b = []; h = h.replace(/\s/g, ''); for (var i = 0; i < h.length; i += 2) b.push(parseInt(h.substr(i, 2), 16)); return b; }
  function toyHash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'h' + h.toString(16); }
  O42.cyber.toyHash = toyHash;

  /* ------- Jeton / JWT jouet (alg:none, secret faible) ------- */
  SIM.token = { run: function (c) {
    var sc = c.sc, tok = c.parsed.raw.trim();
    var parts = tok.split('.');
    c.stage([{ t: 'Jeton fourni : ' + (tok || '(vide)'), c: 'io' }], null, [tokenPanel(tok)]);
    if (parts.length < 2) { c.fail = 'Un jeton a la forme header.payload.signature (séparés par des points).'; return; }
    var header, payload;
    try { header = JSON.parse(unb64(parts[0])); payload = JSON.parse(unb64(parts[1])); } catch (e) { c.fail = 'Les parties header/payload doivent être du JSON encodé en base64.'; c.stage([{ t: 'Décodage impossible.', c: 'no' }], null, []); return; }
    c.stage([{ t: 'Header  : ' + JSON.stringify(header), c: '' }, { t: 'Payload : ' + JSON.stringify(payload), c: '' }], null, [tokenPanel(tok, header, payload)]);
    var valid = false, why = '';
    if ((header.alg || '').toLowerCase() === 'none') { valid = true; why = 'alg = none : le serveur accepte un jeton sans signature !'; }
    else { var sig = b64(sc.secret ? 'sig:' + parts[0] + '.' + parts[1] + ':' + sc.secret : ''); valid = parts[2] === sig; why = valid ? 'signature valide (secret deviné)' : 'signature invalide'; }
    c.stage([{ t: why, c: valid ? 'yes' : 'no' }], null, []);
    if (valid && payload && String(payload.role).toLowerCase() === 'admin') { c.print('Bienvenue, administrateur.'); c.win('JWT-FORGED'); c.stage([{ t: '🚩 Jeton forgé accepté avec role=admin. C’est une élévation de privilège.', c: 'ok' }], null, []); }
    else if (valid) c.fail = 'Jeton accepté mais tu n’es pas admin : modifie le champ « role » du payload.';
    else c.fail = 'Jeton refusé. Indice : si l’algorithme est « none », aucune signature n’est vérifiée.';
    c.stage([{ t: '🛡 Défense : refuser alg=none, vérifier la signature avec un secret long, contrôler les droits côté serveur.', c: 'call' }], null, []);
  } };
  function tokenPanel(tok, header, payload) {
    var parts = tok.split('.');
    return { title: 'Jeton décodé', html: '<div class="cy-jwt"><div class="cy-jwt-h">header<br><code>' + esc(header ? JSON.stringify(header) : (parts[0] ? unb64(parts[0]) : '')) + '</code></div><div class="cy-jwt-p">payload<br><code>' + esc(payload ? JSON.stringify(payload) : (parts[1] ? unb64(parts[1]) : '')) + '</code></div><div class="cy-jwt-s">signature<br><code>' + esc(parts[2] || '(aucune)') + '</code></div></div>' };
  }

  /* ------- XSS simulé (réflexion dans une page) ------- */
  SIM.xss = { run: function (c) {
    var sc = c.sc, payload = c.parsed.raw, cookie = sc.cookie || 'SESSION=flag{xss}';
    var page = (sc.template || '<div class="comment">{{input}}</div>').replace('{{input}}', payload);
    c.stage([{ t: 'Ton commentaire est inséré tel quel dans la page (sans échappement) :', c: 'warn' }], null, [{ title: 'HTML de la page', html: '<pre class="cy-file">' + esc(page) + '</pre>' }]);
    var scripts = [];
    page.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function (m, code) { scripts.push(code); return m; });
    page.replace(/on\w+\s*=\s*("([^"]*)"|'([^']*)')/gi, function (m, q, a, b) { scripts.push(a || b); return m; });
    page.replace(/<img[^>]+onerror\s*=\s*("([^"]*)"|'([^']*)')/gi, function (m, q, a, b) { scripts.push(a || b); return m; });
    if (!scripts.length) { c.stage([{ t: 'Aucun script ne s’exécute : le navigateur n’a vu que du texte.', c: 'no' }], null, []); c.fail = 'Ta charge n’a pas injecté de script exécutable. Essaie une balise <script> ou un attribut onerror.'; }
    else {
      var ran = scripts.join(' ; ');
      var steals = /document\.cookie|cookie/i.test(ran);
      c.stage([{ t: 'Le navigateur de la victime exécute : ' + ran, c: 'alu' }], null, [{ title: 'Navigateur victime', html: '<div class="cy-browser"><div class="cy-url">🔒 banque.exemple/commentaires</div><div class="cy-dom">' + page.replace(/<script[\s\S]*?<\/script>/gi, '〔script〕') + '</div></div>' }]);
      if (steals) { c.print('Cookie exfiltré : ' + cookie); c.win('XSS'); c.stage([{ t: '🚩 Ton script s’exécute dans la session de la victime et vole son cookie.', c: 'ok' }], null, []); }
      else c.fail = 'Le script s’exécute mais ne vole rien d’utile. Vise document.cookie.';
    }
    c.stage([{ t: '🛡 Défense : échapper toute donnée affichée (textContent, pas innerHTML), Content-Security-Policy, cookies HttpOnly.', c: 'call' }], null, []);
  } };

  /* ---------------------------------------------------------------- API */
  O42.engines.cyber = {
    name: 'Cybersécurité',
    create: function (src, opts) {
      var sc = opts && opts.cyber;
      if (!sc) return { compileError: { msg: 'Ce défi n’a pas de cible configurée.', line: 0 } };
      return new Machine(src, sc);
    },
    sims: SIM
  };
})(typeof window !== 'undefined' ? window : globalThis);
