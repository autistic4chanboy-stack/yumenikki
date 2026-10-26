/* =========================================================================
 *  42 ORIGINS — moteur Python
 *  Sous-ensemble de Python 3 : tokenizer avec indentation, parseur, interprète
 *  pas à pas. Modèle mémoire façon CPython : les noms vivent dans les cadres
 *  (pile d'appels), les objets (str, list, dict…) sur le tas avec un id.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var CompileError = U.CompileError, RtError = U.RtError;

  /* ---------------------------------------------------------------- tokenizer */
  var KW = {};
  'False None True and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' ').forEach(function (k) { KW[k] = 1; });
  var OPS3 = ['**=', '//=', '>>=', '<<=', '...'];
  var OPS2 = ['**', '//', '==', '!=', '<=', '>=', '<<', '>>', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '->', ':='];
  var OPS1 = '+-*/%@&|^~<>()[]{},:;.=!';

  function tokenize(src) {
    var toks = [], lines = src.replace(/\r\n?/g, '\n').split('\n'), indents = [0], depth = 0, i, cont = false;
    var pos = 0;
    for (var ln = 0; ln < lines.length; ln++) {
      var L = lines[ln], lineNo = ln + 1, j = 0, n = L.length;
      var lineStart = pos, curStart = pos;
      pos += n + 1;
      if (depth === 0 && !cont) {
        var col = 0;
        while (j < n && (L[j] === ' ' || L[j] === '\t')) { col += L[j] === '\t' ? 4 - (col % 4) : 1; j++; }
        if (j >= n || L[j] === '#') continue; // ligne vide ou commentaire
        if (col > indents[indents.length - 1]) { indents.push(col); toks.push({ t: 'INDENT', line: lineNo }); }
        else {
          while (col < indents[indents.length - 1]) { indents.pop(); toks.push({ t: 'DEDENT', line: lineNo }); }
          if (col !== indents[indents.length - 1]) throw new CompileError('IndentationError: l’indentation ne correspond à aucun niveau précédent', lineNo,
            'Utilise toujours 4 espaces par niveau, et aligne les lignes d’un même bloc.');
        }
      }
      cont = false;
      while (j < n) {
        var c = L[j];
        if (c === ' ' || c === '\t') { j++; continue; }
        if (c === '#') break;
        if (c === '\\' && j === n - 1) { cont = true; j++; break; }
        var st = j;
        var sm = /^([rRfFbB]{0,2})('''|"""|'|")/.exec(L.slice(j));
        if (sm && (sm[1] === '' || /^[A-Za-z]+$/.test(sm[1]))) {
          var pre = sm[1].toLowerCase(), q = sm[2], raw = pre.indexOf('r') >= 0, fstr = pre.indexOf('f') >= 0;
          j += sm[0].length;
          var s = '', startLine = lineNo;
          for (;;) {
            if (j >= n) {
              if (q.length === 3) { s += '\n'; ln++; if (ln >= lines.length) throw new CompileError('SyntaxError: chaîne triple-guillemets jamais fermée', startLine); L = lines[ln]; n = L.length; j = 0; lineNo = ln + 1; curStart = pos; pos += n + 1; continue; }
              throw new CompileError('SyntaxError: chaîne non fermée (il manque le ' + q + ' final)', lineNo);
            }
            if (L.substr(j, q.length) === q) { j += q.length; break; }
            if (L[j] === '\\' && !raw) {
              var e = L[j + 1];
              var map = { n: '\n', t: '\t', r: '\r', '0': '\0', '\\': '\\', "'": "'", '"': '"', a: '\x07', b: '\b', f: '\f', v: '\v' };
              if (e === undefined) { ln++; L = lines[ln] || ''; n = L.length; j = 0; lineNo = ln + 1; curStart = pos; pos += n + 1; continue; }
              if (e in map) { s += map[e]; j += 2; continue; }
              if (e === 'x') { s += String.fromCharCode(parseInt(L.substr(j + 2, 2), 16)); j += 4; continue; }
              s += '\\' + e; j += 2; continue;
            }
            s += L[j++];
          }
          var prev = toks[toks.length - 1];
          if (prev && prev.t === 'STR' && !fstr && !prev.f) { prev.v += s; continue; }
          toks.push({ t: 'STR', v: s, f: fstr, line: startLine, pos: lineStart + st, end: curStart + j });
          continue;
        }
        if (/[A-Za-z_À-ɏ]/.test(c)) {
          while (j < n && /[A-Za-z0-9_À-ɏ]/.test(L[j])) j++;
          var w = L.slice(st, j);
          toks.push({ t: KW[w] ? 'KW' : 'NAME', v: w, line: lineNo, pos: lineStart + st, end: lineStart + j });
          continue;
        }
        if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(L[j + 1] || ''))) {
          var re = /0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:[0-9][0-9_]*)?\.?[0-9_]*(?:[eE][+-]?[0-9]+)?/y;
          re.lastIndex = j;
          var m = re.exec(L)[0];
          j += m.length;
          var clean = m.replace(/_/g, '');
          if (/^0[xXbBoO]/.test(clean)) toks.push({ t: 'NUM', v: BigInt(clean), line: lineNo, pos: lineStart + st, end: lineStart + j });
          else if (/[.eE]/.test(clean)) toks.push({ t: 'NUM', v: parseFloat(clean), float: true, line: lineNo, pos: lineStart + st, end: lineStart + j });
          else toks.push({ t: 'NUM', v: BigInt(clean), line: lineNo, pos: lineStart + st, end: lineStart + j });
          if (j < n && /[A-Za-z_]/.test(L[j])) throw new CompileError('SyntaxError: nombre mal formé', lineNo);
          continue;
        }
        var op = null;
        if (OPS3.indexOf(L.substr(j, 3)) >= 0) op = L.substr(j, 3);
        else if (OPS2.indexOf(L.substr(j, 2)) >= 0) op = L.substr(j, 2);
        else if (OPS1.indexOf(c) >= 0) op = c;
        if (!op) throw new CompileError('SyntaxError: caractère inattendu « ' + c + ' »', lineNo);
        if (op === '!') throw new CompileError('SyntaxError: « ! » n’existe pas seul en Python : utilise not (ou != pour « différent »)', lineNo);
        if ('([{'.indexOf(op) >= 0) depth++;
        if (')]}'.indexOf(op) >= 0) depth = Math.max(0, depth - 1);
        toks.push({ t: 'OP', v: op, line: lineNo, pos: lineStart + st, end: lineStart + j + op.length });
        j += op.length;
      }
      if (depth === 0 && !cont && toks.length && toks[toks.length - 1].t !== 'NEWLINE' && toks[toks.length - 1].t !== 'INDENT' && toks[toks.length - 1].t !== 'DEDENT')
        toks.push({ t: 'NEWLINE', line: lineNo });
    }
    if (depth > 0) throw new CompileError('SyntaxError: parenthèse ou crochet jamais fermé', lines.length);
    if (toks.length && toks[toks.length - 1].t !== 'NEWLINE') toks.push({ t: 'NEWLINE', line: lines.length });
    while (indents.length > 1) { indents.pop(); toks.push({ t: 'DEDENT', line: lines.length }); }
    toks.push({ t: 'EOF', line: lines.length });
    return toks;
  }

  /* ---------------------------------------------------------------- parseur */
  function Parser(toks, src) { this.toks = toks; this.p = 0; this.src = src; }
  var PP = Parser.prototype;
  PP.peek = function (o) { return this.toks[Math.min(this.p + (o || 0), this.toks.length - 1)]; };
  PP.next = function () { return this.toks[this.p++]; };
  PP.isOp = function (v, o) { var t = this.peek(o); return t.t === 'OP' && t.v === v; };
  PP.isKw = function (v, o) { var t = this.peek(o); return t.t === 'KW' && t.v === v; };
  PP.acceptOp = function (v) { if (this.isOp(v)) return this.next(); return null; };
  PP.acceptKw = function (v) { if (this.isKw(v)) return this.next(); return null; };
  PP.fail = function (msg, t, hint) { t = t || this.peek(); throw new CompileError((/^IndentationError/.test(msg) ? '' : 'SyntaxError: ') + msg, t.line, hint); };
  PP.expectOp = function (v, why) {
    if (this.isOp(v)) return this.next();
    var t = this.peek();
    if (v === ':') this.fail('« : » attendu ' + (why || '') , this.toks[this.p - 1] || t, 'En Python, if / for / while / def se terminent par deux-points.');
    this.fail('« ' + v + ' » attendu ' + (why || '') + (t.t === 'NEWLINE' ? ' (fin de ligne atteinte)' : ''), t);
  };
  PP.newline = function () {
    var t = this.peek();
    if (t.t === 'NEWLINE') { this.next(); return; }
    if (t.t === 'EOF' || t.t === 'DEDENT') return;
    this.fail('fin de ligne attendue, trouvé « ' + (t.v !== undefined ? t.v : t.t) + ' »', t, t.t === 'NAME' || t.t === 'STR' ? 'Il manque peut-être une virgule, un opérateur ou des parenthèses.' : '');
  };

  PP.program = function () {
    var body = [];
    while (this.peek().t !== 'EOF') {
      if (this.peek().t === 'NEWLINE') { this.next(); continue; }
      if (this.peek().t === 'INDENT') this.fail('IndentationError: indentation inattendue', this.peek(), 'Cette ligne est décalée alors qu’elle ne suit pas un « : ».');
      Array.prototype.push.apply(body, this.stmt());
    }
    return body;
  };
  PP.block = function () {
    if (this.peek().t !== 'NEWLINE') {
      // instruction simple sur la même ligne : if x: return 1
      return this.simpleLine();
    }
    this.next();
    if (this.peek().t !== 'INDENT') this.fail('IndentationError: un bloc indenté est attendu ici', this.peek(), 'Après une ligne qui finit par « : », les lignes suivantes doivent être décalées de 4 espaces.');
    this.next();
    var body = [];
    while (this.peek().t !== 'DEDENT' && this.peek().t !== 'EOF') {
      if (this.peek().t === 'NEWLINE') { this.next(); continue; }
      Array.prototype.push.apply(body, this.stmt());
    }
    if (this.peek().t === 'DEDENT') this.next();
    return body;
  };
  PP.stmt = function () {
    var t = this.peek();
    if (t.t === 'KW') {
      switch (t.v) {
        case 'if': return [this.ifStmt()];
        case 'while': {
          this.next(); var c = this.test(); this.expectOp(':', 'après la condition du while');
          var body = this.block(), orelse = null;
          if (this.isKw('else')) { this.next(); this.expectOp(':'); orelse = this.block(); }
          return [{ k: 'while', c: c, body: body, orelse: orelse, line: t.line }];
        }
        case 'for': {
          this.next(); var tg = this.targetList(); if (!this.acceptKw('in')) this.fail('« in » attendu dans le for (for x in …)');
          var it = this.testList(); this.expectOp(':', 'à la fin du for');
          var fb = this.block(), fe = null;
          if (this.isKw('else')) { this.next(); this.expectOp(':'); fe = this.block(); }
          return [{ k: 'for', target: tg, iter: it, body: fb, orelse: fe, line: t.line }];
        }
        case 'def': {
          this.next();
          var nt = this.next();
          if (nt.t !== 'NAME') this.fail('nom de fonction attendu après def', nt);
          this.expectOp('(', 'après le nom de la fonction');
          var params = [];
          while (!this.isOp(')')) {
            var star = this.acceptOp('*') ? '*' : this.acceptOp('**') ? '**' : '';
            var pn = this.next();
            if (pn.t !== 'NAME') this.fail('nom de paramètre attendu', pn);
            var dflt = null;
            if (this.acceptOp(':')) this.test(); // annotation ignorée
            if (this.acceptOp('=')) dflt = this.test();
            params.push({ name: pn.v, dflt: dflt, star: star });
            if (!this.acceptOp(',')) break;
          }
          this.expectOp(')', 'pour fermer les paramètres');
          if (this.acceptOp('->')) this.test();
          this.expectOp(':', 'à la fin de la ligne def');
          var dbody = this.block();
          return [{ k: 'def', name: nt.v, params: params, body: dbody, line: t.line, endLine: this.toks[this.p - 1].line }];
        }
        case 'try': {
          this.next(); this.expectOp(':');
          var tb = this.block(), handlers = [], fin = null, tel = null;
          while (this.isKw('except')) {
            var et = this.next(), type = null, as = null;
            if (!this.isOp(':')) { type = this.test(); if (this.acceptKw('as')) as = this.next().v; }
            this.expectOp(':');
            handlers.push({ type: type, as: as, body: this.block(), line: et.line });
          }
          if (this.isKw('else')) { this.next(); this.expectOp(':'); tel = this.block(); }
          if (this.isKw('finally')) { this.next(); this.expectOp(':'); fin = this.block(); }
          if (!handlers.length && !fin) this.fail('try sans except ni finally');
          return [{ k: 'try', body: tb, handlers: handlers, orelse: tel, fin: fin, line: t.line }];
        }
        case 'class': this.fail('les classes ne sont pas gérées par ce visualiseur (pour l’instant)');
        case 'with': this.fail('with n’est pas géré par ce visualiseur');
      }
    }
    return this.simpleLine();
  };
  PP.ifStmt = function () {
    var t = this.next(), c = this.test();
    this.expectOp(':', 'à la fin du ' + t.v);
    var a = this.block(), b = null;
    if (this.isKw('elif')) b = [this.ifStmt()];
    else if (this.isKw('else')) { this.next(); this.expectOp(':', 'après else'); b = this.block(); }
    return { k: 'if', c: c, a: a, b: b, line: t.line, elif: t.v === 'elif' };
  };
  PP.simpleLine = function () {
    var out = [this.simple()];
    while (this.acceptOp(';')) { if (this.peek().t === 'NEWLINE' || this.peek().t === 'EOF') break; out.push(this.simple()); }
    this.newline();
    return out;
  };
  PP.simple = function () {
    var t = this.peek();
    if (t.t === 'KW') {
      switch (t.v) {
        case 'pass': this.next(); return { k: 'pass', line: t.line };
        case 'break': this.next(); return { k: 'break', line: t.line };
        case 'continue': this.next(); return { k: 'continue', line: t.line };
        case 'return': { this.next(); var e = this.atEnd() ? null : this.testList(); return { k: 'return', e: e, line: t.line }; }
        case 'global': case 'nonlocal': {
          this.next(); var names = [this.next().v];
          while (this.acceptOp(',')) names.push(this.next().v);
          return { k: 'global', names: names, line: t.line };
        }
        case 'del': { this.next(); var tg = [this.expr()]; while (this.acceptOp(',')) tg.push(this.expr()); return { k: 'del', targets: tg, line: t.line }; }
        case 'assert': { this.next(); var ac = this.test(), am = null; if (this.acceptOp(',')) am = this.test(); return { k: 'assert', c: ac, msg: am, line: t.line }; }
        case 'raise': { this.next(); var re = this.atEnd() ? null : this.test(); return { k: 'raise', e: re, line: t.line }; }
        case 'import': case 'from': {
          this.next();
          var mods = [];
          while (this.peek().t !== 'NEWLINE' && this.peek().t !== 'EOF') { var x = this.next(); if (x.t === 'NAME') mods.push(x.v); }
          return { k: 'import', mods: mods, from: t.v === 'from', line: t.line };
        }
      }
    }
    var e = this.testList(true);
    if (this.isOp('=')) {
      var targets = [e];
      while (this.acceptOp('=')) targets.push(this.testList(true));
      var val = targets.pop();
      targets.forEach(this.checkTarget, this);
      return { k: 'assign', targets: targets, e: val, line: t.line };
    }
    var at = this.peek();
    if (at.t === 'OP' && /^(\+|-|\*|\/|\/\/|%|\*\*|&|\||\^|<<|>>)=$/.test(at.v)) {
      this.next();
      this.checkTarget(e);
      return { k: 'aug', op: at.v.slice(0, -1), target: e, e: this.testList(), line: t.line };
    }
    return { k: 'expr', e: e, line: t.line };
  };
  PP.atEnd = function () { var t = this.peek(); return t.t === 'NEWLINE' || t.t === 'EOF' || (t.t === 'OP' && t.v === ';'); };
  PP.checkTarget = function (e) {
    if (e.k === 'name' || e.k === 'sub' || e.k === 'attr') return;
    if (e.k === 'tuple' || e.k === 'list') { e.items.forEach(this.checkTarget, this); return; }
    if (e.k === 'compare' && e.ops[0] === '==') return;
    throw new CompileError('SyntaxError: impossible d’affecter une valeur à « ' + this.src.slice(e.s, e.e) + ' »', e.line,
      e.k === 'call' ? 'On ne peut pas écrire f(x) = …' : 'À gauche du = il faut un nom de variable (ou l[i]).');
  };
  PP.targetList = function () {
    var t = this.peek(), items = [this.bitor()];
    if (!this.isOp(',')) return items[0];
    while (this.acceptOp(',')) { if (this.isKw('in')) break; items.push(this.bitor()); }
    return { k: 'tuple', items: items, line: t.line, s: t.pos, e: this.lastEnd() };
  };
  PP.lastEnd = function () { var t = this.toks[this.p - 1]; return t && t.end !== undefined ? t.end : t && t.pos ? t.pos + 1 : 0; };
  PP.mk = function (k, t, props) { props.k = k; props.line = t.line; props.s = t.pos; props.e = this.lastEnd(); return props; };
  PP.testList = function (stmtLevel) {
    var t = this.peek(), e = this.test();
    if (!this.isOp(',')) return e;
    var items = [e];
    while (this.acceptOp(',')) {
      if (this.atEnd() || this.isOp('=') || this.isOp(')')) break;
      items.push(this.test());
    }
    return this.mk('tuple', t, { items: items });
  };
  PP.test = function () {
    var t = this.peek();
    if (this.isKw('lambda')) {
      this.next();
      var params = [];
      while (!this.isOp(':')) { params.push({ name: this.next().v, dflt: null, star: '' }); if (!this.acceptOp(',')) break; }
      this.expectOp(':');
      var body = this.test();
      return this.mk('lambda', t, { params: params, body: body });
    }
    var a = this.orTest();
    if (this.isKw('if') ) {
      this.next(); var c = this.orTest();
      if (!this.acceptKw('else')) this.fail('« else » attendu dans l’expression conditionnelle (a if condition else b)');
      var b = this.test();
      return this.mk('ifexp', t, { c: c, a: a, b: b });
    }
    return a;
  };
  PP.orTest = function () {
    var t = this.peek(), a = this.andTest();
    while (this.isKw('or')) { this.next(); a = this.mk('bool', t, { op: 'or', a: a, b: this.andTest() }); }
    return a;
  };
  PP.andTest = function () {
    var t = this.peek(), a = this.notTest();
    while (this.isKw('and')) { this.next(); a = this.mk('bool', t, { op: 'and', a: a, b: this.notTest() }); }
    return a;
  };
  PP.notTest = function () {
    var t = this.peek();
    if (this.isKw('not')) { this.next(); var a = this.notTest(); return this.mk('not', t, { a: a }); }
    return this.comparison();
  };
  PP.comparison = function () {
    var t = this.peek(), first = this.bitor(), ops = [], rest = [];
    for (;;) {
      var o = this.peek(), op = null;
      if (o.t === 'OP' && /^(<|>|==|>=|<=|!=)$/.test(o.v)) { this.next(); op = o.v; }
      else if (o.t === 'KW' && o.v === 'in') { this.next(); op = 'in'; }
      else if (o.t === 'KW' && o.v === 'not' && this.isKw('in', 1)) { this.next(); this.next(); op = 'not in'; }
      else if (o.t === 'KW' && o.v === 'is') { this.next(); op = this.acceptKw('not') ? 'is not' : 'is'; }
      else if (o.t === 'OP' && o.v === '=' && false) break;
      if (!op) break;
      ops.push(op); rest.push(this.bitor());
    }
    if (!ops.length) return first;
    return this.mk('compare', t, { a: first, ops: ops, rest: rest });
  };
  var BINLEVELS = [['|'], ['^'], ['&'], ['<<', '>>'], ['+', '-'], ['*', '/', '//', '%', '@']];
  PP.bitor = function () { return this.binLevel(0); };
  PP.binLevel = function (lv) {
    if (lv >= BINLEVELS.length) return this.factor();
    var t = this.peek(), a = this.binLevel(lv + 1);
    for (;;) {
      var o = this.peek();
      if (o.t !== 'OP' || BINLEVELS[lv].indexOf(o.v) < 0) break;
      this.next();
      a = this.mk('bin', t, { op: o.v, a: a, b: this.binLevel(lv + 1) });
    }
    return a;
  };
  PP.factor = function () {
    var t = this.peek();
    if (t.t === 'OP' && (t.v === '-' || t.v === '+' || t.v === '~')) { this.next(); var a = this.factor(); return this.mk('unary', t, { op: t.v, a: a }); }
    return this.power();
  };
  PP.power = function () {
    var t = this.peek(), a = this.primary();
    if (this.acceptOp('**')) return this.mk('bin', t, { op: '**', a: a, b: this.factor() });
    return a;
  };
  PP.primary = function () {
    var t = this.peek(), a = this.atom();
    for (;;) {
      if (this.isOp('(')) {
        this.next();
        var args = [], kw = [];
        while (!this.isOp(')')) {
          if (this.peek().t === 'NAME' && this.isOp('=', 1)) { var kn = this.next().v; this.next(); kw.push({ name: kn, e: this.test() }); }
          else {
            var star = this.acceptOp('*');
            var ae = this.test();
            if (this.isKw('for')) ae = this.compFor(ae, 'list', t);
            if (star) ae = { k: 'star', a: ae, line: ae.line, s: ae.s, e: ae.e };
            args.push(ae);
          }
          if (!this.acceptOp(',')) break;
        }
        this.expectOp(')', 'pour fermer l’appel');
        a = this.mk('call', t, { f: a, args: args, kw: kw });
        continue;
      }
      if (this.isOp('[')) {
        this.next();
        var idx = this.subscript();
        this.expectOp(']', 'pour fermer l’indice');
        a = this.mk('sub', t, { a: a, i: idx });
        continue;
      }
      if (this.isOp('.')) {
        this.next();
        var nt = this.next();
        if (nt.t !== 'NAME') this.fail('nom attendu après le point', nt);
        a = this.mk('attr', t, { a: a, name: nt.v });
        continue;
      }
      break;
    }
    return a;
  };
  PP.subscript = function () {
    var t = this.peek(), parts = [null, null, null], k = 0, slice = false;
    if (!this.isOp(':')) parts[0] = this.test();
    while (this.isOp(':')) { this.next(); slice = true; k++; if (k > 2) this.fail('trop de « : » dans la tranche'); if (!this.isOp(':') && !this.isOp(']')) parts[k] = this.test(); }
    if (!slice) {
      if (this.isOp(',')) { var items = [parts[0]]; while (this.acceptOp(',')) items.push(this.test()); return this.mk('tuple', t, { items: items }); }
      return parts[0];
    }
    return this.mk('slice', t, { lo: parts[0], hi: parts[1], st: parts[2] });
  };
  PP.compFor = function (elt, kind, t, valElt) {
    var gens = [];
    while (this.isKw('for')) {
      this.next();
      var tg = this.targetList();
      if (!this.acceptKw('in')) this.fail('« in » attendu');
      var it = this.orTest(), conds = [];
      while (this.isKw('if')) { this.next(); conds.push(this.orTest()); }
      gens.push({ target: tg, iter: it, conds: conds });
    }
    return this.mk('comp', t, { kind: kind, elt: elt, val: valElt || null, gens: gens });
  };
  PP.atom = function () {
    var t = this.next();
    switch (t.t) {
      case 'NAME': return this.mk('name', t, { name: t.v });
      case 'NUM': return this.mk('num', t, { v: t.v, float: !!t.float });
      case 'STR': {
        if (!t.f) {
          var s = t.v;
          while (this.peek().t === 'STR' && !this.peek().f) s += this.next().v;
          return this.mk('str', t, { v: s });
        }
        return this.mk('fstr', t, { parts: this.fparts(t) });
      }
      case 'KW':
        if (t.v === 'True' || t.v === 'False') return this.mk('const', t, { v: t.v === 'True' });
        if (t.v === 'None') return this.mk('none', t, {});
        break;
      case 'OP':
        if (t.v === '(') {
          if (this.acceptOp(')')) return this.mk('tuple', t, { items: [] });
          var e = this.test();
          if (this.isKw('for')) { e = this.compFor(e, 'list', t); this.expectOp(')'); return e; }
          if (this.isOp(',')) {
            var items = [e];
            while (this.acceptOp(',')) { if (this.isOp(')')) break; items.push(this.test()); }
            this.expectOp(')', 'pour fermer le tuple');
            return this.mk('tuple', t, { items: items });
          }
          this.expectOp(')', 'pour fermer la parenthèse');
          e.paren = true;
          return e;
        }
        if (t.v === '[') {
          if (this.acceptOp(']')) return this.mk('list', t, { items: [] });
          var first = this.test();
          if (this.isKw('for')) { var c = this.compFor(first, 'list', t); this.expectOp(']', 'pour fermer la liste'); return c; }
          var li = [first];
          while (this.acceptOp(',')) { if (this.isOp(']')) break; li.push(this.test()); }
          this.expectOp(']', 'pour fermer la liste');
          return this.mk('list', t, { items: li });
        }
        if (t.v === '{') {
          if (this.acceptOp('}')) return this.mk('dict', t, { keys: [], vals: [] });
          var k0 = this.test();
          if (this.acceptOp(':')) {
            var v0 = this.test();
            if (this.isKw('for')) { var dc = this.compFor(k0, 'dict', t, v0); this.expectOp('}'); return dc; }
            var keys = [k0], vals = [v0];
            while (this.acceptOp(',')) { if (this.isOp('}')) break; keys.push(this.test()); this.expectOp(':', 'entre la clé et la valeur'); vals.push(this.test()); }
            this.expectOp('}', 'pour fermer le dictionnaire');
            return this.mk('dict', t, { keys: keys, vals: vals });
          }
          if (this.isKw('for')) { var sc = this.compFor(k0, 'set', t); this.expectOp('}'); return sc; }
          var si = [k0];
          while (this.acceptOp(',')) { if (this.isOp('}')) break; si.push(this.test()); }
          this.expectOp('}');
          return this.mk('setlit', t, { items: si });
        }
    }
    this.p--;
    if (t.t === 'NEWLINE' || t.t === 'EOF') this.fail('expression incomplète en fin de ligne', this.toks[this.p - 1] || t);
    if (t.t === 'INDENT') this.fail('IndentationError: indentation inattendue', t);
    this.fail('expression attendue, trouvé « ' + (t.v !== undefined ? t.v : t.t) + ' »', t);
  };
  PP.fparts = function (t) {
    var s = t.v, parts = [], i = 0, cur = '';
    while (i < s.length) {
      var c = s[i];
      if (c === '{' && s[i + 1] === '{') { cur += '{'; i += 2; continue; }
      if (c === '}' && s[i + 1] === '}') { cur += '}'; i += 2; continue; }
      if (c === '{') {
        if (cur) parts.push(cur), cur = '';
        var depth = 1, j = i + 1, inner = '';
        while (j < s.length && depth) { if (s[j] === '{') depth++; else if (s[j] === '}') depth--; if (depth) inner += s[j]; j++; }
        if (depth) throw new CompileError('SyntaxError: f-string : « } » manquant', t.line);
        var spec = '', conv = '', m = /^(.*?)(?:!([rsa]))?(?::([^:]*))?$/.exec(inner);
        var exprSrc = inner;
        var bracket = 0, cut = -1;
        for (var q = 0; q < inner.length; q++) { var ch = inner[q]; if ('([{'.indexOf(ch) >= 0) bracket++; else if (')]}'.indexOf(ch) >= 0) bracket--; else if (ch === ':' && !bracket) { cut = q; break; } }
        if (cut >= 0) { exprSrc = inner.slice(0, cut); spec = inner.slice(cut + 1); }
        var bang = /!([rsa])$/.exec(exprSrc);
        if (bang) { conv = bang[1]; exprSrc = exprSrc.slice(0, -2); }
        var dbg = /=\s*$/.test(exprSrc) && !/[=!<>]=\s*$/.test(exprSrc);
        if (dbg) exprSrc = exprSrc.replace(/=\s*$/, '');
        if (!exprSrc.trim()) throw new CompileError('SyntaxError: f-string : expression vide entre { }', t.line);
        var sub = new Parser(tokenize(exprSrc.trim()).filter(function (x) { return x.t !== 'NEWLINE' && x.t !== 'INDENT' && x.t !== 'DEDENT'; }).concat([{ t: 'EOF', line: t.line }]), exprSrc.trim());
        sub.toks.forEach(function (x) { x.line = t.line; });
        var ex = sub.test();
        parts.push({ e: ex, spec: spec, conv: conv, dbg: dbg ? exprSrc + '=' : '' });
        i = j;
        void m;
        continue;
      }
      cur += c; i++;
    }
    if (cur) parts.push(cur);
    return parts;
  };
  PP.expr = function () { return this.bitor(); };

  /* ---------------------------------------------------------------- objets */
  var NONE = { ty: 'NoneType' }, TRUE = { ty: 'bool', v: true }, FALSE = { ty: 'bool', v: false };
  function PyErr(type, msg, hint) { this.type = type; this.msg = msg; this.hint = hint || ''; }
  function pyBool(b) { return b ? TRUE : FALSE; }
  function isNum(x) { return x.ty === 'int' || x.ty === 'float' || x.ty === 'bool'; }
  function isSeq(x) { return x.ty === 'list' || x.ty === 'tuple' || x.ty === 'str'; }
  function toNum(x) { return x.ty === 'bool' ? (x.v ? 1 : 0) : x.ty === 'int' ? Number(x.v) : x.v; }
  function toBig(x) { return x.ty === 'bool' ? (x.v ? 1n : 0n) : x.v; }
  var BRK = { brk: 1 }, CNT = { cnt: 1 };

  function fmtFloat(v) {
    if (Number.isInteger(v) && Math.abs(v) < 1e16) return v.toFixed(1);
    if (!isFinite(v)) return isNaN(v) ? 'nan' : v > 0 ? 'inf' : '-inf';
    var s = String(v);
    if (/e/.test(s)) { s = s.replace(/e\+?(-?)(\d)$/, 'e$10$2').replace('e+', 'e+'); if (!/e-/.test(s)) s = s.replace('e', 'e+'); s = s.replace('e++', 'e+'); }
    return s;
  }
  function reprStr(s) {
    var q = s.indexOf("'") >= 0 && s.indexOf('"') < 0 ? '"' : "'";
    var out = q;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '\\') out += '\\\\'; else if (c === '\n') out += '\\n'; else if (c === '\t') out += '\\t'; else if (c === '\r') out += '\\r';
      else if (c === q) out += '\\' + q; else if (c.charCodeAt(0) < 32) out += '\\x' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
      else out += c;
    }
    return out + q;
  }
  function typeName(x) { return x.ty === 'builtin' || x.ty === 'method' ? 'builtin_function_or_method' : x.ty; }

  /* ---------------------------------------------------------------- machine */
  var HEAP_BASE = 0x7f3a21c04000, FRAME_BASE = 0x7ffd5e2a1000;

  function Machine(prog, opts) {
    opts = opts || {};
    this.src = prog.src; this.body = prog.body;
    this.stdinLines = (opts.stdin || '').split('\n');
    if (this.stdinLines.length && this.stdinLines[this.stdinLines.length - 1] === '') this.stdinLines.pop();
    this.stdinPos = 0;
    this.outText = ''; this.outChunks = [];
    this.heapNext = HEAP_BASE; this.objs = [];
    this.frames = []; this.frameSeq = 0;
    this.steps = 0; this.maxSteps = opts.maxSteps || 300000;
    this.done = false; this.error = null; this.exitCode = null; this.warnings = [];
    this.log = []; this.acc = []; this.line = 0; this.curLine = 0;
    this.used = {};
    this.smallInts = new Map();
    this.globals = this.newFrame('<module>', null);
    this.gen = this.boot();
    this.advance();
  }
  var M = Machine.prototype;
  Object.defineProperty(M, 'stdout', { get: function () { return this.outText; } });
  Object.defineProperty(M, 'depth', { get: function () { return this.frames.length; } });

  M.say = function (t, c) { if (this.log.length < 14) this.log.push({ t: t, c: c || '' }); };
  M.warn = function (t) { this.say('⚠ ' + t, 'warn'); if (this.warnings.length < 30) this.warnings.push({ msg: t, line: this.curLine }); };
  M.text = function (n) { return n && n.s !== undefined && n.e !== undefined ? this.src.slice(n.s, n.e).replace(/\s+/g, ' ') : '…'; };

  M.alloc = function (o, size) {
    o.id = this.heapNext;
    this.heapNext += Math.ceil((size || 48) / 16) * 16 + 16;
    this.objs.push(o);
    return o;
  };
  M.int = function (v) { return { ty: 'int', v: typeof v === 'bigint' ? v : BigInt(Math.trunc(v)) }; };
  M.float = function (v) { return { ty: 'float', v: v }; };
  M.str = function (s) { return this.alloc({ ty: 'str', v: s }, 49 + s.length); };
  M.list = function (items) { return this.alloc({ ty: 'list', items: items }, 56 + 8 * items.length); };
  M.tuple = function (items) { return this.alloc({ ty: 'tuple', items: items }, 40 + 8 * items.length); };
  M.dict = function () { return this.alloc({ ty: 'dict', keys: [], vals: [], index: new Map() }, 232); };
  M.newFrame = function (name, fn) {
    var f = { name: name, fn: fn, vars: new Map(), order: [], id: ++this.frameSeq, addr: FRAME_BASE - this.frameSeq * 0x200, globalsDecl: {} };
    this.frames.push(f);
    return f;
  };

  M.advance = function () {
    try {
      var r = this.gen.next();
      if (r.done) { if (!this.done) this.finish(0); }
      else this.line = r.value;
    } catch (e) {
      if (e instanceof PyErr) { this.fail(e); return; }
      if (e instanceof CompileError) { this.done = true; this.error = { msg: e.msg, kind: 'compile', line: e.line, hint: e.hint }; this.line = e.line; return; }
      if (e instanceof RangeError && /call stack/i.test(e.message)) { this.fail(new PyErr('RecursionError', 'maximum recursion depth exceeded', 'La récursion ne s’arrête jamais : il manque un cas de base.')); return; }
      throw e;
    }
  };
  M.fail = function (e) {
    this.done = true;
    if (e.type === 'SystemExit') { this.exitCode = e.code || 0; this.say('exit() : arrêt du programme.', 'ok'); return; }
    this.error = { msg: e.type + ': ' + e.msg, kind: 'py', line: this.curLine, hint: e.hint };
    this.line = this.curLine;
    this.say('✖ ' + e.type + ': ' + e.msg, 'err');
    this.emit(2, 'Traceback (most recent call last):\n  File "main.py", line ' + this.curLine + '\n' + e.type + ': ' + e.msg + '\n');
  };
  M.step = function () {
    if (this.done) return false;
    this.steps++; this.log = []; this.acc = [];
    if (this.steps > this.maxSteps) {
      this.done = true;
      this.error = { msg: 'Le programme a dépassé ' + this.maxSteps + ' étapes : boucle infinie ?', kind: 'timeout', line: this.line, hint: 'Ta condition de boucle devient-elle fausse un jour ?' };
      return false;
    }
    this.advance();
    return !this.done;
  };
  M.finish = function (code) {
    this.done = true;
    this.exitCode = code;
    this.say('Programme terminé.', 'ok');
  };
  M.emit = function (fd, s) {
    this.outChunks.push({ fd: fd, s: s });
    if (fd === 1) this.outText += s;
  };
  M.chunks = function () { return this.outChunks; };
  M.summary = function () { return null; };

  M.boot = function* () {
    this.say('Le module démarre : le cadre global est créé.', 'call');
    var c = yield* this.execBody(this.body);
    if (c === BRK || c === CNT) throw new CompileError('SyntaxError: break/continue en dehors d’une boucle', this.curLine);
    if (c && c.ret) throw new CompileError('SyntaxError: return en dehors d’une fonction', this.curLine);
  };

  M.execBody = function* (body) {
    for (var i = 0; i < body.length; i++) {
      var c = yield* this.exec(body[i]);
      if (c) return c;
    }
  };
  M.at = function (l) { this.curLine = l; return l; };
  M.frame = function () { return this.frames[this.frames.length - 1]; };

  /* --- variables --- */
  M.lookup = function (name, node) {
    var f = this.frame();
    if (f.vars.has(name) && !f.globalsDecl[name]) return f.vars.get(name);
    var fn = f.fn;
    while (fn && fn.closure) { if (fn.closure.vars.has(name)) return fn.closure.vars.get(name); fn = fn.closure.fn; }
    if (this.globals.vars.has(name)) return this.globals.vars.get(name);
    var b = BUILTINS[name];
    if (b) return b;
    if (f !== this.globals && this.isAssignedIn(f.fn, name)) throw new PyErr('UnboundLocalError', "local variable '" + name + "' referenced before assignment", 'La variable est modifiée dans la fonction, donc Python la considère locale. Utilise « global ' + name + ' » ou passe-la en paramètre.');
    var hint = '';
    if (/^(true|false|none|null)$/i.test(name)) hint = 'En Python on écrit True, False et None avec une majuscule.';
    else if (name === 'printf' || name === 'echo' || name === 'Print') hint = 'Pour afficher, utilise print(…).';
    else hint = 'Vérifie l’orthographe, ou donne une valeur à « ' + name + ' » avant de l’utiliser.';
    throw new PyErr('NameError', "name '" + name + "' is not defined", hint);
  };
  M.isAssignedIn = function (fn, name) {
    if (!fn) return false;
    if (!fn.assigned) {
      var set = {};
      (function walk(body) {
        body.forEach(function (s) {
          if (s.k === 'assign') s.targets.forEach(function mark(t) { if (t.k === 'name') set[t.name] = 1; else if (t.k === 'tuple' || t.k === 'list') t.items.forEach(mark); });
          if (s.k === 'aug' && s.target.k === 'name') set[s.target.name] = 1;
          if (s.k === 'for' && s.target.k === 'name') set[s.target.name] = 1;
          ['a', 'b', 'body', 'orelse', 'fin'].forEach(function (k) { if (Array.isArray(s[k])) walk(s[k]); });
        });
      })(fn.def.body);
      fn.assigned = set;
    }
    return !!fn.assigned[name];
  };
  M.setVar = function (name, v) {
    var f = this.frame();
    var target = f.globalsDecl[name] ? this.globals : f;
    if (!target.vars.has(name)) target.order.push(name);
    target.vars.set(name, v);
    var slot = target.order.indexOf(name);
    this.acc.push({ a: target.addr + slot * 8, n: 8, w: true });
  };

  /* --- vérité, égalité, comparaisons --- */
  M.truthy = function (x) {
    switch (x.ty) {
      case 'bool': return x.v;
      case 'NoneType': return false;
      case 'int': return x.v !== 0n;
      case 'float': return x.v !== 0;
      case 'str': return x.v.length > 0;
      case 'list': case 'tuple': return x.items.length > 0;
      case 'dict': return x.keys.length > 0;
      case 'range': return this.rangeLen(x) > 0;
    }
    return true;
  };
  M.eq = function (a, b) {
    if (isNum(a) && isNum(b)) {
      if (a.ty === 'float' || b.ty === 'float') return toNum(a) === toNum(b);
      return toBig(a) === toBig(b);
    }
    if (a.ty !== b.ty) return false;
    switch (a.ty) {
      case 'str': return a.v === b.v;
      case 'NoneType': return true;
      case 'list': case 'tuple':
        if (a.items.length !== b.items.length) return false;
        for (var i = 0; i < a.items.length; i++) if (!this.eq(a.items[i], b.items[i])) return false;
        return true;
      case 'dict':
        if (a.keys.length !== b.keys.length) return false;
        for (var j = 0; j < a.keys.length; j++) { var k = this.dictFind(b, a.keys[j]); if (k < 0 || !this.eq(a.vals[j], b.vals[k])) return false; }
        return true;
    }
    return a === b;
  };
  M.cmp = function (a, b, op) {
    if (isNum(a) && isNum(b)) {
      var x, y;
      if (a.ty === 'float' || b.ty === 'float') { x = toNum(a); y = toNum(b); } else { x = toBig(a); y = toBig(b); }
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (a.ty === 'str' && b.ty === 'str') return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
    if ((a.ty === 'list' && b.ty === 'list') || (a.ty === 'tuple' && b.ty === 'tuple')) {
      for (var i = 0; i < Math.min(a.items.length, b.items.length); i++) {
        if (!this.eq(a.items[i], b.items[i])) return this.cmp(a.items[i], b.items[i], op);
      }
      return a.items.length - b.items.length;
    }
    throw new PyErr('TypeError', "'" + op + "' not supported between instances of '" + typeName(a) + "' and '" + typeName(b) + "'",
      a.ty === 'str' || b.ty === 'str' ? 'On ne compare pas un texte et un nombre : convertis avec int(…) ou str(…).' : '');
  };
  M.hashKey = function (k) {
    switch (k.ty) {
      case 'int': return 'n' + k.v;
      case 'bool': return 'n' + (k.v ? 1 : 0);
      case 'float': return Number.isInteger(k.v) ? 'n' + k.v : 'f' + k.v;
      case 'str': return 's' + k.v;
      case 'NoneType': return 'N';
      case 'tuple': var self = this; return 't(' + k.items.map(function (x) { return self.hashKey(x); }).join(',') + ')';
    }
    throw new PyErr('TypeError', "unhashable type: '" + k.ty + "'", 'Une liste ou un dict ne peut pas servir de clé : utilise un tuple ou une chaîne.');
  };
  M.dictFind = function (d, k) { var i = d.index.get(this.hashKey(k)); return i === undefined ? -1 : i; };
  M.dictSet = function (d, k, v) {
    var h = this.hashKey(k), i = d.index.get(h);
    if (i === undefined) { d.index.set(h, d.keys.length); d.keys.push(k); d.vals.push(v); return d.keys.length - 1; }
    d.vals[i] = v;
    return i;
  };
  M.dictDel = function (d, k) {
    var i = this.dictFind(d, k);
    if (i < 0) throw new PyErr('KeyError', this.repr(k));
    d.keys.splice(i, 1); d.vals.splice(i, 1);
    d.index = new Map();
    for (var j = 0; j < d.keys.length; j++) d.index.set(this.hashKey(d.keys[j]), j);
  };

  /* --- conversion en texte --- */
  M.repr = function (x, seen) {
    switch (x.ty) {
      case 'NoneType': return 'None';
      case 'bool': return x.v ? 'True' : 'False';
      case 'int': return x.v.toString();
      case 'float': return fmtFloat(x.v);
      case 'str': return reprStr(x.v);
      case 'list': case 'tuple': {
        seen = seen || [];
        if (seen.indexOf(x) >= 0) return x.ty === 'list' ? '[...]' : '(...)';
        seen.push(x);
        var self = this, inner = x.items.map(function (i) { return self.repr(i, seen); }).join(', ');
        seen.pop();
        return x.ty === 'list' ? '[' + inner + ']' : '(' + inner + (x.items.length === 1 ? ',' : '') + ')';
      }
      case 'dict': {
        var s = this, parts = [];
        for (var i = 0; i < x.keys.length; i++) parts.push(s.repr(x.keys[i], seen) + ': ' + s.repr(x.vals[i], seen));
        return '{' + parts.join(', ') + '}';
      }
      case 'set': { var t = this; return x.items.length ? '{' + x.items.map(function (i) { return t.repr(i); }).join(', ') + '}' : 'set()'; }
      case 'range': return 'range(' + x.start + ', ' + x.stop + (x.step !== 1 ? ', ' + x.step : '') + ')';
      case 'function': return '<function ' + x.name + ' at ' + U.hex(x.id) + '>';
      case 'builtin': return '<built-in function ' + x.name + '>';
      case 'method': return '<built-in method ' + x.name + ' of ' + x.self.ty + ' object>';
      case 'type': return "<class '" + x.name + "'>";
      case 'module': return "<module '" + x.name + "'>";
      case 'exc': return x.name + '(' + reprStr(x.msg) + ')';
    }
    return '<' + x.ty + '>';
  };
  M.toStr = function (x) { return x.ty === 'str' ? x.v : x.ty === 'exc' ? x.msg : this.repr(x); };
  M.brief = function (x) {
    var r = this.repr(x);
    return r.length > 40 ? r.slice(0, 39) + '…' : r;
  };

  /* --- exécution des instructions --- */
  M.exec = function* (s) {
    switch (s.k) {
      case 'expr': {
        yield this.at(s.line);
        var v = yield* this.ev(s.e);
        if (s.e.k !== 'call' && this.frames.length === 1 && v.ty !== 'NoneType') this.say('Expression calculée : ' + this.brief(v) + ' (rien n’est affiché sans print)');
        return;
      }
      case 'assign': {
        yield this.at(s.line);
        var val = yield* this.ev(s.e);
        for (var i = 0; i < s.targets.length; i++) yield* this.assign(s.targets[i], val);
        return;
      }
      case 'aug': {
        yield this.at(s.line);
        var cur = yield* this.ev(s.target), rhs = yield* this.ev(s.e);
        var nv = yield* this.binop(s.op, cur, rhs, s, true);
        yield* this.assign(s.target, nv, s.op + '=');
        return;
      }
      case 'pass': yield this.at(s.line); this.say('pass : ne fait rien.'); return;
      case 'break': yield this.at(s.line); this.say('break : sortie de la boucle.'); return BRK;
      case 'continue': yield this.at(s.line); this.say('continue : tour suivant.'); return CNT;
      case 'return': {
        yield this.at(s.line);
        if (this.frames.length === 1) throw new CompileError("SyntaxError: 'return' outside function", s.line);
        var rv = s.e ? yield* this.ev(s.e) : NONE;
        this.say(this.frame().name + '() renvoie ' + this.brief(rv) + ' : son cadre disparaît.', 'ret');
        return { ret: rv };
      }
      case 'global': {
        yield this.at(s.line);
        var f = this.frame();
        s.names.forEach(function (n) { f.globalsDecl[n] = true; });
        this.say('global ' + s.names.join(', ') + ' : ces noms désignent les variables du cadre global.');
        return;
      }
      case 'del': {
        yield this.at(s.line);
        for (var d = 0; d < s.targets.length; d++) yield* this.del(s.targets[d]);
        return;
      }
      case 'assert': {
        yield this.at(s.line);
        var ac = yield* this.ev(s.c);
        if (!this.truthy(ac)) { var am = s.msg ? this.toStr(yield* this.ev(s.msg)) : ''; throw new PyErr('AssertionError', am); }
        return;
      }
      case 'raise': {
        yield this.at(s.line);
        if (!s.e) throw new PyErr('RuntimeError', 'No active exception to reraise');
        var ex = yield* this.ev(s.e);
        if (ex.ty === 'exc') throw new PyErr(ex.name, ex.msg);
        if (ex.ty === 'type') throw new PyErr(ex.name, '');
        throw new PyErr('TypeError', 'exceptions must derive from BaseException');
      }
      case 'import': {
        yield this.at(s.line);
        var self = this;
        s.mods.forEach(function (m) {
          if (m === 'math' || m === 'random' || m === 'sys') {
            if (!s.from) self.setVar(m, MODULES[m]);
          } else if (!s.from || !MODULES[s.mods[0]]) throw new PyErr('ModuleNotFoundError', "No module named '" + m + "'", 'Seuls math, random et sys sont disponibles ici.');
        });
        if (s.from) {
          var mod = MODULES[s.mods[0]];
          s.mods.slice(1).forEach(function (n) {
            if (n === 'import') return;
            if (!mod.attrs[n]) throw new PyErr('ImportError', "cannot import name '" + n + "'");
            self.setVar(n, mod.attrs[n]);
          });
        }
        this.say('import ' + s.mods.join(', '));
        return;
      }
      case 'def': {
        yield this.at(s.line);
        var fn = this.alloc({ ty: 'function', name: s.name, def: s, closure: this.frames.length > 1 ? this.frame() : null, defaults: [] }, 136);
        for (var p = 0; p < s.params.length; p++) fn.defaults.push(s.params[p].dflt ? yield* this.ev(s.params[p].dflt) : null);
        this.setVar(s.name, fn);
        this.say('def ' + s.name + ' : un objet fonction est créé sur le tas et le nom « ' + s.name + ' » pointe vers lui. Le corps n’est pas encore exécuté.', 'new');
        return;
      }
      case 'if': {
        yield this.at(s.line);
        var c = this.truthy(yield* this.ev(s.c));
        this.say((s.elif ? 'elif' : 'if') + ' « ' + this.text(s.c) + ' » est ' + (c ? 'vrai → on entre dans le bloc' : 'faux' + (s.b ? ' → on passe à la suite (elif/else)' : ' → on saute le bloc')), c ? 'yes' : 'no');
        if (c) return yield* this.execBody(s.a);
        if (s.b) return yield* this.execBody(s.b);
        return;
      }
      case 'while':
        for (;;) {
          yield this.at(s.line);
          var wc = this.truthy(yield* this.ev(s.c));
          this.say('while « ' + this.text(s.c) + ' » est ' + (wc ? 'vrai → un tour' : 'faux → fin de la boucle'), wc ? 'yes' : 'no');
          if (!wc) { if (s.orelse) return yield* this.execBody(s.orelse); return; }
          var r = yield* this.execBody(s.body);
          if (r === BRK) return;
          if (r && r !== CNT) return r;
        }
      case 'for': {
        yield this.at(s.line);
        var itv = yield* this.ev(s.iter);
        var it = this.iter(itv), k = 0;
        for (;;) {
          if (k > 0) yield this.at(s.line);
          var nx = it();
          if (nx === null) { this.say('for : plus d’élément dans ' + this.text(s.iter) + ' → fin de la boucle', 'no'); if (s.orelse) return yield* this.execBody(s.orelse); return; }
          yield* this.assign(s.target, nx, 'for');
          if (itv.ty === 'list' || itv.ty === 'str' || itv.ty === 'tuple') this.touchItem(itv, k, false);
          k++;
          var fr = yield* this.execBody(s.body);
          if (fr === BRK) return;
          if (fr && fr !== CNT) return fr;
        }
      }
      case 'try': {
        yield this.at(s.line);
        var res;
        try {
          res = yield* this.execBody(s.body);
          if (!res && s.orelse) res = yield* this.execBody(s.orelse);
        } catch (e) {
          if (!(e instanceof PyErr) || e.type === 'SystemExit') { if (s.fin) yield* this.execBody(s.fin); throw e; }
          var h = null;
          for (var hi = 0; hi < s.handlers.length; hi++) {
            var hd = s.handlers[hi];
            if (!hd.type) { h = hd; break; }
            var types = hd.type.k === 'tuple' ? hd.type.items : [hd.type];
            if (types.some(function (tn) { return tn.k === 'name' && (tn.name === e.type || tn.name === 'Exception' || (tn.name === 'LookupError' && /IndexError|KeyError/.test(e.type)) || (tn.name === 'ArithmeticError' && e.type === 'ZeroDivisionError')); })) { h = hd; break; }
          }
          if (!h) { if (s.fin) yield* this.execBody(s.fin); throw e; }
          this.curLine = h.line;
          this.say('Exception ' + e.type + ' attrapée par except.', 'yes');
          if (h.as) this.setVar(h.as, this.alloc({ ty: 'exc', name: e.type, msg: e.msg }, 64));
          res = yield* this.execBody(h.body);
        }
        if (s.fin) { var fres = yield* this.execBody(s.fin); if (fres) return fres; }
        return res;
      }
    }
    throw new PyErr('SystemError', 'instruction inconnue ' + s.k);
  };

  M.assign = function* (t, v, how) {
    switch (t.k) {
      case 'name': {
        var had = this.frame().vars.has(t.name);
        this.setVar(t.name, v);
        var heap = v.ty !== 'int' && v.ty !== 'float' && v.ty !== 'bool' && v.ty !== 'NoneType';
        this.say((how === 'for' ? 'for : ' : '') + t.name + ' = ' + this.brief(v) + (heap ? '   (le nom « ' + t.name + ' » ' + (had ? 'pointe maintenant' : 'pointe') + ' vers l’objet ' + v.ty + ' ' + U.hex(v.id) + ' du tas)' : '   (valeur rangée dans le cadre ' + this.frame().name + ')'), 'write');
        return;
      }
      case 'tuple': case 'list': {
        var items = this.toList(v, 'unpack');
        if (items.length !== t.items.length) throw new PyErr('ValueError', (items.length > t.items.length ? 'too many values to unpack' : 'not enough values to unpack') + ' (expected ' + t.items.length + ', got ' + items.length + ')');
        for (var i = 0; i < items.length; i++) yield* this.assign(t.items[i], items[i], how);
        return;
      }
      case 'sub': {
        var obj = yield* this.ev(t.a);
        if (t.i.k === 'slice') {
          if (obj.ty !== 'list') throw new PyErr('TypeError', "'" + obj.ty + "' object does not support slice assignment");
          var sl = yield* this.sliceIdx(obj, t.i);
          var vals = this.toList(v, 'slice');
          if (sl.step !== 1) throw new PyErr('ValueError', 'affectation de tranche avec un pas : non géré');
          Array.prototype.splice.apply(obj.items, [sl.start, Math.max(0, sl.stop - sl.start)].concat(vals));
          this.say(this.text(t) + ' = ' + this.brief(v), 'write');
          return;
        }
        var key = yield* this.ev(t.i);
        if (obj.ty === 'list') {
          var ix = this.index(obj, key, t);
          obj.items[ix] = v;
          this.touchItem(obj, ix, true, this.text(t));
          this.say(this.text(t) + ' = ' + this.brief(v) + '   (case [' + ix + '] de la liste ' + U.hex(obj.id) + ')', 'write');
          return;
        }
        if (obj.ty === 'dict') {
          var di = this.dictSet(obj, key, v);
          this.acc.push({ a: obj.id + 8 + di * 8, n: 8, w: true, tag: this.text(t) });
          this.say(this.text(t) + ' = ' + this.brief(v) + '   (dans le dictionnaire ' + U.hex(obj.id) + ')', 'write');
          return;
        }
        if (obj.ty === 'str') throw new PyErr('TypeError', "'str' object does not support item assignment",
          'Les chaînes Python sont immuables : on ne peut pas changer une lettre. Construis une nouvelle chaîne, par ex. s = s[:i] + "X" + s[i+1:].');
        if (obj.ty === 'tuple') throw new PyErr('TypeError', "'tuple' object does not support item assignment", 'Un tuple ne se modifie pas : utilise une liste.');
        throw new PyErr('TypeError', "'" + obj.ty + "' object does not support item assignment");
      }
      case 'attr': throw new PyErr('AttributeError', "impossible d'affecter l'attribut '" + t.name + "'");
    }
    throw new CompileError('SyntaxError: cible d’affectation invalide', t.line);
  };
  M.del = function* (t) {
    if (t.k === 'name') {
      var f = this.frame();
      if (!f.vars.has(t.name)) throw new PyErr('NameError', "name '" + t.name + "' is not defined");
      f.vars.delete(t.name);
      f.order.splice(f.order.indexOf(t.name), 1);
      this.say('del ' + t.name + ' : le nom disparaît du cadre (l’objet est détruit s’il n’est plus référencé).', 'free');
      return;
    }
    if (t.k === 'sub') {
      var obj = yield* this.ev(t.a), key = yield* this.ev(t.i);
      if (obj.ty === 'list') { var ix = this.index(obj, key, t); obj.items.splice(ix, 1); this.say('del ' + this.text(t), 'free'); return; }
      if (obj.ty === 'dict') { this.dictDel(obj, key); this.say('del ' + this.text(t), 'free'); return; }
      throw new PyErr('TypeError', "'" + obj.ty + "' object doesn't support item deletion");
    }
    throw new CompileError('SyntaxError: del invalide', t.line);
  };

  M.touchItem = function (obj, i, w, tag) {
    if (obj.ty === 'str') this.acc.push({ a: obj.id + 48 + i, n: 1, w: w, tag: tag || null });
    else this.acc.push({ a: obj.id + 64 + i * 8, n: 8, w: w, tag: tag || null });
  };
  M.index = function (obj, key, node) {
    if (key.ty !== 'int' && key.ty !== 'bool') throw new PyErr('TypeError', obj.ty + ' indices must be integers, not ' + key.ty, key.ty === 'float' ? 'Utilise // (division entière) ou int(…) pour obtenir un entier.' : key.ty === 'str' ? 'Pour un texte « "3" », convertis avec int(…).' : '');
    var n = obj.ty === 'str' ? obj.v.length : obj.items.length, i = Number(toBig(key));
    var orig = i;
    if (i < 0) i += n;
    if (i < 0 || i >= n) throw new PyErr('IndexError', (obj.ty === 'str' ? 'string' : obj.ty) + ' index out of range',
      'Indice ' + orig + ' demandé alors que ' + this.text(node.a) + ' a ' + n + ' élément' + (n > 1 ? 's' : '') + ' : les indices valides vont de 0 à ' + (n - 1) + ' (ou de -' + n + ' à -1).');
    return i;
  };
  M.sliceIdx = function* (obj, sl) {
    var n = obj.ty === 'str' ? obj.v.length : obj.items.length;
    var st = sl.st ? Number(toBig(yield* this.ev(sl.st))) : 1;
    if (st === 0) throw new PyErr('ValueError', 'slice step cannot be zero');
    function norm(x, def) {
      if (x === null) return def;
      if (x < 0) x += n;
      if (st > 0) return Math.max(0, Math.min(n, x));
      return Math.max(-1, Math.min(n - 1, x));
    }
    var lo = sl.lo ? Number(toBig(yield* this.ev(sl.lo))) : null, hi = sl.hi ? Number(toBig(yield* this.ev(sl.hi))) : null;
    return { start: norm(lo, st > 0 ? 0 : n - 1), stop: norm(hi, st > 0 ? n : -1), step: st };
  };
  M.iter = function (x) {
    var i = 0, self = this;
    switch (x.ty) {
      case 'list': case 'tuple': return function () { return i < x.items.length ? x.items[i++] : null; };
      case 'str': return function () { return i < x.v.length ? self.str(x.v[i++]) : null; };
      case 'range': return function () { var v = x.start + i * x.step; if (x.step > 0 ? v >= x.stop : v <= x.stop) return null; i++; return self.int(v); };
      case 'dict': return function () { return i < x.keys.length ? x.keys[i++] : null; };
      case 'set': return function () { return i < x.items.length ? x.items[i++] : null; };
    }
    throw new PyErr('TypeError', "'" + x.ty + "' object is not iterable", x.ty === 'int' ? 'Pour répéter n fois : for i in range(n).' : '');
  };
  M.toList = function (x) {
    if (x.ty === 'list' || x.ty === 'tuple' || x.ty === 'set') return x.items.slice();
    var it = this.iter(x), out = [], v;
    while ((v = it()) !== null) { out.push(v); if (out.length > 100000) throw new PyErr('MemoryError', 'trop d’éléments'); }
    return out;
  };
  M.rangeLen = function (r) { return Math.max(0, Math.ceil((r.stop - r.start) / r.step)); };

  /* --- évaluation des expressions --- */
  M.ev = function* (e) {
    switch (e.k) {
      case 'num': return e.float ? this.float(e.v) : this.int(e.v);
      case 'str': return this.str(e.v);
      case 'const': return pyBool(e.v);
      case 'none': return NONE;
      case 'name': {
        var v = this.lookup(e.name, e);
        var f = this.frame(), tgt = f.vars.has(e.name) ? f : this.globals, slot = tgt.order.indexOf(e.name);
        if (slot >= 0) this.acc.push({ a: tgt.addr + slot * 8, n: 8, w: false });
        return v;
      }
      case 'fstr': {
        var out = '';
        for (var i = 0; i < e.parts.length; i++) {
          var p = e.parts[i];
          if (typeof p === 'string') { out += p; continue; }
          var pv = yield* this.ev(p.e);
          out += p.dbg + (p.spec ? this.formatSpec(pv, p.spec) : p.conv === 'r' || p.dbg ? this.repr(pv) : this.toStr(pv));
        }
        return this.str(out);
      }
      case 'list': { var li = []; for (var a = 0; a < e.items.length; a++) li.push(yield* this.ev(e.items[a])); var lo = this.list(li); this.say('Nouvelle liste ' + U.hex(lo.id) + ' créée sur le tas.', 'new'); return lo; }
      case 'tuple': { var ti = []; for (var b = 0; b < e.items.length; b++) ti.push(yield* this.ev(e.items[b])); return this.tuple(ti); }
      case 'setlit': { var si = []; for (var c = 0; c < e.items.length; c++) { var sv = yield* this.ev(e.items[c]); if (!si.some(function (x) { return this.eq(x, sv); }, this)) si.push(sv); } return this.alloc({ ty: 'set', items: si }, 216); }
      case 'dict': {
        var d = this.dict();
        for (var k = 0; k < e.keys.length; k++) { var kk = yield* this.ev(e.keys[k]), vv = yield* this.ev(e.vals[k]); this.dictSet(d, kk, vv); }
        this.say('Nouveau dictionnaire ' + U.hex(d.id) + ' créé sur le tas.', 'new');
        return d;
      }
      case 'comp': return yield* this.comp(e);
      case 'unary': {
        var x = yield* this.ev(e.a);
        if (!isNum(x)) throw new PyErr('TypeError', "bad operand type for unary " + e.op + ": '" + x.ty + "'");
        if (e.op === '-') return x.ty === 'float' ? this.float(-x.v) : this.int(-toBig(x));
        if (e.op === '+') return x.ty === 'bool' ? this.int(toBig(x)) : x;
        if (x.ty === 'float') throw new PyErr('TypeError', "bad operand type for unary ~: 'float'");
        return this.int(~toBig(x));
      }
      case 'not': return pyBool(!this.truthy(yield* this.ev(e.a)));
      case 'bool': {
        var l = yield* this.ev(e.a);
        if (e.op === 'and' ? !this.truthy(l) : this.truthy(l)) return l;
        return yield* this.ev(e.b);
      }
      case 'ifexp': return this.truthy(yield* this.ev(e.c)) ? yield* this.ev(e.a) : yield* this.ev(e.b);
      case 'bin': { var A = yield* this.ev(e.a), B = yield* this.ev(e.b); return yield* this.binop(e.op, A, B, e); }
      case 'compare': {
        var left = yield* this.ev(e.a);
        for (var q = 0; q < e.ops.length; q++) {
          var right = yield* this.ev(e.rest[q]), op = e.ops[q], r;
          switch (op) {
            case '==': r = this.eq(left, right); break;
            case '!=': r = !this.eq(left, right); break;
            case '<': r = this.cmp(left, right, op) < 0; break;
            case '>': r = this.cmp(left, right, op) > 0; break;
            case '<=': r = this.cmp(left, right, op) <= 0; break;
            case '>=': r = this.cmp(left, right, op) >= 0; break;
            case 'in': case 'not in': r = this.contains(right, left); if (op === 'not in') r = !r; break;
            case 'is': case 'is not':
              r = left === right || (left.ty === 'int' && right.ty === 'int' && left.v === right.v && left.v >= -5n && left.v <= 256n) || (left.ty === right.ty && (left.ty === 'NoneType' || left.ty === 'bool') && left.v === right.v);
              if (op === 'is not') r = !r;
              break;
          }
          if (!r) return FALSE;
          left = right;
        }
        return TRUE;
      }
      case 'sub': {
        var obj = yield* this.ev(e.a);
        if (e.i.k === 'slice') {
          if (!isSeq(obj)) throw new PyErr('TypeError', "'" + obj.ty + "' object is not subscriptable");
          var s = yield* this.sliceIdx(obj, e.i), res = [];
          for (var z = s.start; s.step > 0 ? z < s.stop : z > s.stop; z += s.step) res.push(obj.ty === 'str' ? obj.v[z] : obj.items[z]);
          var so = obj.ty === 'str' ? this.str(res.join('')) : obj.ty === 'list' ? this.list(res) : this.tuple(res);
          this.say(this.text(e) + ' → ' + this.brief(so) + '   (tranche : une NOUVELLE copie ' + so.ty + ' est créée)', 'read');
          return so;
        }
        var key = yield* this.ev(e.i);
        if (obj.ty === 'dict') {
          var di = this.dictFind(obj, key);
          if (di < 0) throw new PyErr('KeyError', this.repr(key), 'Cette clé n’existe pas dans le dictionnaire. Utilise d.get(clé, défaut) ou teste « clé in d ».');
          this.acc.push({ a: obj.id + 8 + di * 8, n: 8, w: false, tag: this.text(e) });
          this.say(this.text(e) + ' → ' + this.brief(obj.vals[di]), 'read');
          return obj.vals[di];
        }
        if (obj.ty === 'range') { var rl = this.rangeLen(obj), ri = Number(toBig(key)); if (ri < 0) ri += rl; if (ri < 0 || ri >= rl) throw new PyErr('IndexError', 'range object index out of range'); return this.int(obj.start + ri * obj.step); }
        if (!isSeq(obj)) throw new PyErr('TypeError', "'" + obj.ty + "' object is not subscriptable", obj.ty === 'int' ? 'Un nombre n’a pas de cases : convertis-le en texte avec str(…) pour lire ses chiffres.' : '');
        var ix = this.index(obj, key, e);
        this.touchItem(obj, ix, false, this.text(e));
        var val = obj.ty === 'str' ? this.str(obj.v[ix]) : obj.items[ix];
        this.say(this.text(e) + ' → ' + this.brief(val) + '   (case [' + ix + '] de ' + obj.ty + ' ' + U.hex(obj.id) + ' sur le tas)', 'read');
        return val;
      }
      case 'attr': {
        var o = yield* this.ev(e.a);
        return this.getattr(o, e.name);
      }
      case 'call': return yield* this.call(e);
      case 'lambda': return this.alloc({ ty: 'function', name: '<lambda>', def: { params: e.params, body: [{ k: 'return', e: e.body, line: e.line }], line: e.line }, closure: this.frames.length > 1 ? this.frame() : null, defaults: e.params.map(function () { return null; }) }, 136);
      case 'star': throw new PyErr('SyntaxError', 'étoile * inattendue ici');
      case 'slice': throw new PyErr('SyntaxError', 'tranche inattendue');
    }
    throw new PyErr('SystemError', 'expression inconnue ' + e.k);
  };

  M.comp = function* (e) {
    var self = this, out = [], d = e.kind === 'dict' ? this.dict() : null;
    var f = this.frame();
    var saved = {};
    var names = [];
    e.gens.forEach(function (g) { (function collect(t) { if (t.k === 'name') names.push(t.name); else if (t.items) t.items.forEach(collect); })(g.target); });
    names.forEach(function (n) { saved[n] = f.vars.has(n) ? f.vars.get(n) : undefined; });
    var walk = function* (gi) {
      if (gi === e.gens.length) {
        if (d) { var k = yield* self.ev(e.elt), v = yield* self.ev(e.val); self.dictSet(d, k, v); }
        else out.push(yield* self.ev(e.elt));
        return;
      }
      var g = e.gens[gi], it = self.iter(yield* self.ev(g.iter)), x;
      while ((x = it()) !== null) {
        yield* self.assignSilent(g.target, x);
        var ok = true;
        for (var c = 0; c < g.conds.length; c++) if (!self.truthy(yield* self.ev(g.conds[c]))) { ok = false; break; }
        if (ok) yield* walk(gi + 1);
      }
    };
    yield* walk(0);
    names.forEach(function (n) {
      if (saved[n] === undefined) { if (f.vars.has(n)) { f.vars.delete(n); f.order.splice(f.order.indexOf(n), 1); } }
      else f.vars.set(n, saved[n]);
    });
    if (d) return d;
    if (e.kind === 'set') { var u = []; out.forEach(function (x) { if (!u.some(function (y) { return self.eq(x, y); })) u.push(x); }); return this.alloc({ ty: 'set', items: u }, 216); }
    var l = this.list(out);
    this.say('Compréhension de liste : nouvelle liste de ' + out.length + ' élément' + (out.length > 1 ? 's' : '') + ' ' + U.hex(l.id), 'new');
    return l;
  };
  M.assignSilent = function* (t, v) {
    if (t.k === 'name') { var f = this.frame(); if (!f.vars.has(t.name)) f.order.push(t.name); f.vars.set(t.name, v); return; }
    var items = this.toList(v);
    if (items.length !== t.items.length) throw new PyErr('ValueError', 'nombre de valeurs incorrect pour le dépaquetage');
    for (var i = 0; i < items.length; i++) yield* this.assignSilent(t.items[i], items[i]);
  };

  M.contains = function (c, x) {
    var self = this;
    switch (c.ty) {
      case 'str':
        if (x.ty !== 'str') throw new PyErr('TypeError', "'in <string>' requires string as left operand, not " + x.ty);
        return c.v.indexOf(x.v) >= 0;
      case 'list': case 'tuple': case 'set': return c.items.some(function (y) { return self.eq(x, y); });
      case 'dict': return this.dictFind(c, x) >= 0;
      case 'range': { if (x.ty !== 'int') return false; var v = Number(x.v); return (c.step > 0 ? v >= c.start && v < c.stop : v <= c.start && v > c.stop) && (v - c.start) % c.step === 0; }
    }
    throw new PyErr('TypeError', "argument of type '" + c.ty + "' is not iterable");
  };

  M.binop = function* (op, a, b, e, aug) {
    if (op === '+') {
      if (a.ty === 'str' && b.ty === 'str') return this.str(a.v + b.v);
      if (a.ty === 'list' && b.ty === 'list') {
        if (aug) { Array.prototype.push.apply(a.items, b.items); return a; }
        return this.list(a.items.concat(b.items));
      }
      if (a.ty === 'tuple' && b.ty === 'tuple') return this.tuple(a.items.concat(b.items));
      if ((a.ty === 'str') !== (b.ty === 'str') && (isNum(a) || isNum(b)))
        throw new PyErr('TypeError', a.ty === 'str' ? 'can only concatenate str (not "' + b.ty + '") to str' : "unsupported operand type(s) for +: '" + a.ty + "' and 'str'",
          'Pour coller un nombre à un texte : str(nombre), ou une f-string f"… {nombre}".');
    }
    if (op === '*') {
      var seq = isSeq(a) ? a : isSeq(b) ? b : null, num = seq === a ? b : a;
      if (seq && (num.ty === 'int' || num.ty === 'bool')) {
        var n = Math.max(0, Number(toBig(num)));
        if (n * (seq.ty === 'str' ? seq.v.length : seq.items.length) > 1e6) throw new PyErr('MemoryError', 'résultat trop grand');
        if (seq.ty === 'str') return this.str(seq.v.repeat(n));
        var items = [];
        for (var i = 0; i < n; i++) Array.prototype.push.apply(items, seq.items);
        if (seq.ty === 'list' && seq.items.some(function (x) { return x.ty === 'list'; })) this.warn('[liste] * n copie les RÉFÉRENCES : les sous-listes sont partagées');
        return seq.ty === 'list' ? this.list(items) : this.tuple(items);
      }
    }
    if (op === '%' && a.ty === 'str') return this.str(this.percentFormat(a.v, b));
    if (!isNum(a) || !isNum(b)) {
      if (op === '+' && (a.ty === 'list' || b.ty === 'list')) throw new PyErr('TypeError', 'can only concatenate list (not "' + (a.ty === 'list' ? b.ty : a.ty) + '") to list', 'Pour ajouter un élément à une liste : l.append(x).');
      throw new PyErr('TypeError', "unsupported operand type(s) for " + op + ": '" + a.ty + "' and '" + b.ty + "'");
    }
    if (a.ty === 'float' || b.ty === 'float' || op === '/') {
      var x = toNum(a), y = toNum(b), r;
      switch (op) {
        case '+': r = x + y; break; case '-': r = x - y; break; case '*': r = x * y; break;
        case '/': if (y === 0) throw new PyErr('ZeroDivisionError', 'division by zero', 'On ne divise jamais par 0 : teste le diviseur avant.'); r = x / y; break;
        case '//': if (y === 0) throw new PyErr('ZeroDivisionError', 'float floor division by zero'); r = Math.floor(x / y); break;
        case '%': if (y === 0) throw new PyErr('ZeroDivisionError', 'float modulo'); r = x - Math.floor(x / y) * y; break;
        case '**': r = Math.pow(x, y); break;
        default: throw new PyErr('TypeError', "unsupported operand type(s) for " + op + ": 'float'");
      }
      return this.float(r);
    }
    var X = toBig(a), Y = toBig(b), R;
    switch (op) {
      case '+': R = X + Y; break;
      case '-': R = X - Y; break;
      case '*': R = X * Y; break;
      case '//': case '%': {
        if (Y === 0n) throw new PyErr('ZeroDivisionError', 'integer division or modulo by zero', 'On ne divise jamais par 0 : teste le diviseur avant.');
        var q = X / Y, m = X % Y;
        if (m !== 0n && ((m < 0n) !== (Y < 0n))) { q -= 1n; m += Y; }
        R = op === '//' ? q : m;
        break;
      }
      case '**':
        if (Y < 0n) return this.float(Math.pow(Number(X), Number(Y)));
        if (Y > 10000n) throw new PyErr('OverflowError', 'exposant trop grand pour ce visualiseur');
        R = X ** Y; break;
      case '<<': R = X << Y; break;
      case '>>': R = X >> Y; break;
      case '&': R = X & Y; break;
      case '|': R = X | Y; break;
      case '^': R = X ^ Y; break;
      default: throw new PyErr('TypeError', 'opérateur ' + op + ' non géré');
    }
    return this.int(R);
  };

  M.percentFormat = function (fmt, arg) {
    var args = arg.ty === 'tuple' ? arg.items.slice() : [arg], self = this, k = 0;
    return fmt.replace(/%([-0 +]*)(\d*)(?:\.(\d+))?([sdifrx%])/g, function (m, fl, w, pr, c) {
      if (c === '%') return '%';
      var v = args[k++];
      if (!v) throw new PyErr('TypeError', 'not enough arguments for format string');
      var s;
      if (c === 's') s = self.toStr(v); else if (c === 'r') s = self.repr(v);
      else if (c === 'd' || c === 'i') s = String(BigInt(Math.trunc(toNum(v))));
      else if (c === 'x') s = BigInt(Math.trunc(toNum(v))).toString(16);
      else s = toNum(v).toFixed(pr ? +pr : 6);
      while (s.length < (+w || 0)) s = fl.indexOf('-') >= 0 ? s + ' ' : (fl.indexOf('0') >= 0 ? '0' : ' ') + s;
      return s;
    });
  };
  M.formatSpec = function (v, spec) {
    var m = /^(?:(.)?([<>^]))?([+\- ])?(0)?(\d+)?(,)?(?:\.(\d+))?([sdfxXobe%])?$/.exec(spec);
    if (!m) throw new PyErr('ValueError', "Invalid format specifier '" + spec + "'");
    var fill = m[1] || (m[4] ? '0' : ' '), align = m[2] || (isNum(v) && !m[1] ? '>' : '<'), w = +m[5] || 0, prec = m[7], ty = m[8], s;
    if (ty === 'f' || ty === '%' || (prec !== undefined && isNum(v) && !ty)) {
      var num = toNum(v) * (ty === '%' ? 100 : 1);
      s = num.toFixed(prec !== undefined ? +prec : 6) + (ty === '%' ? '%' : '');
    } else if (ty === 'd') { if (v.ty === 'float') throw new PyErr('ValueError', "Unknown format code 'd' for object of type 'float'"); s = toBig(v).toString(); }
    else if (ty === 'x' || ty === 'X' || ty === 'o' || ty === 'b') { s = toBig(v).toString(ty === 'o' ? 8 : ty === 'b' ? 2 : 16); if (ty === 'X') s = s.toUpperCase(); }
    else if (ty === 'e') s = toNum(v).toExponential(prec !== undefined ? +prec : 6).replace(/e([+-])(\d)$/, 'e$10$2');
    else { s = this.toStr(v); if (prec !== undefined && v.ty === 'str') s = s.slice(0, +prec); }
    if (m[6]) s = s.replace(/^(-?\d+)/, function (d) { return d.replace(/\B(?=(\d{3})+(?!\d))/g, ','); });
    if (m[3] === '+' && isNum(v) && toNum(v) >= 0) s = '+' + s;
    if (s.length < w) {
      var pad = w - s.length;
      if (align === '<') s = s + fill.repeat(pad);
      else if (align === '^') s = fill.repeat(Math.floor(pad / 2)) + s + fill.repeat(Math.ceil(pad / 2));
      else s = fill.repeat(pad) + s;
    }
    return s;
  };

  /* --- appels --- */
  M.call = function* (e) {
    var f = yield* this.ev(e.f);
    var args = [], kw = {};
    for (var i = 0; i < e.args.length; i++) {
      var a = e.args[i];
      if (a.k === 'star') { var sv = yield* this.ev(a.a); Array.prototype.push.apply(args, this.toList(sv)); }
      else args.push(yield* this.ev(a));
    }
    for (var k = 0; k < e.kw.length; k++) kw[e.kw[k].name] = yield* this.ev(e.kw[k].e);
    return yield* this.invoke(f, args, kw, e);
  };
  M.invoke = function* (f, args, kw, e) {
    if (f.ty === 'builtin' || f.ty === 'method') {
      this.used[f.name] = (this.used[f.name] || 0) + 1;
      var r = f.fn.call(this, args, kw, e, f.self);
      if (r && typeof r.next === 'function') r = yield* r;
      return r;
    }
    if (f.ty === 'type') return yield* this.invoke(BUILTINS[f.name], args, kw, e);
    if (f.ty !== 'function') throw new PyErr('TypeError', "'" + f.ty + "' object is not callable", f.ty === 'str' ? 'Tu as peut-être écrasé une fonction (ex. print = …) avec une valeur.' : '');
    this.used[f.name] = (this.used[f.name] || 0) + 1;
    return yield* this.callUser(f, args, kw, e);
  };
  M.callUser = function* (fn, args, kw, e) {
    if (this.frames.length > 400) throw new PyErr('RecursionError', 'maximum recursion depth exceeded', 'La récursion ne s’arrête jamais : il manque un cas de base (if … : return …).');
    var d = fn.def, params = d.params, self = this;
    var bound = new Map(), order = [];
    var pos = 0;
    for (var i = 0; i < params.length; i++) {
      var p = params[i];
      if (p.star === '*') { bound.set(p.name, this.tuple(args.slice(pos))); order.push(p.name); pos = args.length; continue; }
      if (p.star === '**') { var dd = this.dict(); for (var kn in kw) this.dictSet(dd, this.str(kn), kw[kn]); kw = {}; bound.set(p.name, dd); order.push(p.name); continue; }
      var v;
      if (pos < args.length) v = args[pos++];
      else if (kw[p.name] !== undefined) { v = kw[p.name]; delete kw[p.name]; }
      else if (fn.defaults[i]) v = fn.defaults[i];
      else throw new PyErr('TypeError', fn.name + "() missing required positional argument: '" + p.name + "'", 'Il faut donner autant d’arguments que de paramètres dans def ' + fn.name + '(…).');
      bound.set(p.name, v); order.push(p.name);
    }
    if (pos < args.length) throw new PyErr('TypeError', fn.name + '() takes ' + params.length + ' positional argument' + (params.length > 1 ? 's' : '') + ' but ' + args.length + ' were given');
    for (var extra in kw) throw new PyErr('TypeError', fn.name + "() got an unexpected keyword argument '" + extra + "'");
    var fr = this.newFrame(fn.name, fn);
    fr.vars = bound; fr.order = order;
    this.say('Appel de ' + fn.name + '(' + order.map(function (n) { return n + '=' + self.brief(bound.get(n)); }).join(', ') + ') : nouveau cadre sur la pile d’appels.', 'call');
    var saved = this.curLine;
    var c;
    try { c = yield* this.execBody(d.body); }
    finally { if (this.frames[this.frames.length - 1] === fr) this.frames.pop(); }
    this.curLine = saved;
    if (c === BRK || c === CNT) throw new CompileError("SyntaxError: 'break' outside loop", saved);
    if (c && c.ret) return c.ret;
    if (fn.name !== '<lambda>') this.say(fn.name + '() se termine sans return : elle renvoie None.', 'ret');
    return NONE;
  };

  M.getattr = function (o, name) {
    if (o.ty === 'module') {
      var a = o.attrs[name];
      if (!a) throw new PyErr('AttributeError', "module '" + o.name + "' has no attribute '" + name + "'");
      return a;
    }
    var tbl = METHODS[o.ty];
    if (!tbl || !tbl[name]) {
      var hint = '';
      if (o.ty === 'str' && (name === 'append' || name === 'push')) hint = 'Une chaîne ne se modifie pas : s = s + "…".';
      if (o.ty === 'list' && name === 'push') hint = 'En Python on ajoute avec append.';
      if (o.ty === 'list' && name === 'length' || name === 'size') hint = 'Pour la longueur : len(x).';
      throw new PyErr('AttributeError', "'" + o.ty + "' object has no attribute '" + name + "'", hint);
    }
    return { ty: 'method', name: name, self: o, fn: tbl[name] };
  };

  /* ---------------------------------------------------------------- builtins */
  var BUILTINS = {};
  function bi(name, fn) { BUILTINS[name] = { ty: 'builtin', name: name, fn: fn }; }
  function needArgs(name, args, lo, hi) {
    if (args.length < lo || args.length > (hi === undefined ? lo : hi))
      throw new PyErr('TypeError', name + '() takes ' + (lo === hi || hi === undefined ? lo : lo + ' to ' + hi) + ' argument' + ((hi || lo) > 1 ? 's' : '') + ' (' + args.length + ' given)');
  }
  bi('print', function (args, kw) {
    var self = this, sep = kw.sep ? this.toStr(kw.sep) : ' ', end = kw.end ? this.toStr(kw.end) : '\n';
    var s = args.map(function (a) { return self.toStr(a); }).join(sep) + end;
    this.emit(kw.file && kw.file.name === 'stderr' ? 2 : 1, s);
    this.say('print affiche ' + JSON.stringify(s.length > 50 ? s.slice(0, 49) + '…' : s), 'io');
    return NONE;
  });
  bi('input', function (args) {
    if (args.length) this.emit(1, this.toStr(args[0]));
    if (this.stdinPos >= this.stdinLines.length) throw new PyErr('EOFError', 'EOF when reading a line', 'Il n’y a plus rien à lire dans l’entrée (stdin). Ajoute des lignes dans la zone « Entrée ».');
    var line = this.stdinLines[this.stdinPos++];
    if (args.length) this.emit(1, line + '\n');
    var s = this.str(line);
    this.say('input() lit la ligne ' + JSON.stringify(line) + ' sur l’entrée standard → toujours un str (texte) !', 'io');
    return s;
  });
  bi('len', function (args) {
    needArgs('len', args, 1);
    var x = args[0];
    switch (x.ty) {
      case 'str': return this.int(x.v.length);
      case 'list': case 'tuple': case 'set': return this.int(x.items.length);
      case 'dict': return this.int(x.keys.length);
      case 'range': return this.int(this.rangeLen(x));
    }
    throw new PyErr('TypeError', "object of type '" + x.ty + "' has no len()", x.ty === 'int' ? 'Pour compter les chiffres d’un nombre : len(str(n)).' : '');
  });
  bi('range', function (args) {
    needArgs('range', args, 1, 3);
    args.forEach(function (a) { if (a.ty !== 'int' && a.ty !== 'bool') throw new PyErr('TypeError', "'" + a.ty + "' object cannot be interpreted as an integer", a.ty === 'float' ? 'range n’accepte que des entiers : utilise // ou int(…).' : a.ty === 'str' ? 'Convertis le texte en nombre avec int(…) (input() renvoie toujours un str).' : ''); });
    var n = args.map(function (a) { return Number(toBig(a)); });
    var r = args.length === 1 ? { start: 0, stop: n[0], step: 1 } : { start: n[0], stop: n[1], step: n[2] === undefined ? 1 : n[2] };
    if (r.step === 0) throw new PyErr('ValueError', 'range() arg 3 must not be zero');
    r.ty = 'range';
    return this.alloc(r, 48);
  });
  bi('int', function (args) {
    if (!args.length) return this.int(0);
    var x = args[0];
    if (x.ty === 'int') return x;
    if (x.ty === 'bool') return this.int(x.v ? 1 : 0);
    if (x.ty === 'float') { if (!isFinite(x.v)) throw new PyErr('ValueError', 'cannot convert float to integer'); return this.int(Math.trunc(x.v)); }
    if (x.ty === 'str') {
      var base = args[1] ? Number(toBig(args[1])) : 10, s = x.v.trim().replace(/_/g, '');
      var ok = base === 10 ? /^[+-]?\d+$/.test(s) : base === 16 ? /^[+-]?(0x)?[0-9a-f]+$/i.test(s) : base === 2 ? /^[+-]?(0b)?[01]+$/i.test(s) : /^[+-]?[0-9a-z]+$/i.test(s);
      if (!ok) throw new PyErr('ValueError', "invalid literal for int() with base " + base + ": " + reprStr(x.v), /^\s*[+-]?\d+\.\d*\s*$/.test(x.v) ? 'Pour un nombre à virgule : float(…).' : 'Ce texte ne contient pas un nombre entier.');
      if (base === 10) return this.int(BigInt(s));
      var neg = s[0] === '-', digits = s.replace(/^[+-]/, '').replace(/^0[xb]/i, ''), v = 0n;
      for (var i = 0; i < digits.length; i++) v = v * BigInt(base) + BigInt(parseInt(digits[i], 36));
      return this.int(neg ? -v : v);
    }
    throw new PyErr('TypeError', "int() argument must be a string or a number, not '" + x.ty + "'");
  });
  bi('float', function (args) {
    if (!args.length) return this.float(0);
    var x = args[0];
    if (isNum(x)) return this.float(toNum(x));
    if (x.ty === 'str') {
      var s = x.v.trim().toLowerCase();
      if (s === 'inf' || s === 'infinity') return this.float(Infinity);
      if (s === 'nan') return this.float(NaN);
      if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(s)) throw new PyErr('ValueError', 'could not convert string to float: ' + reprStr(x.v));
      return this.float(parseFloat(s));
    }
    throw new PyErr('TypeError', "float() argument must be a string or a number, not '" + x.ty + "'");
  });
  bi('str', function (args) { return this.str(args.length ? this.toStr(args[0]) : ''); });
  bi('repr', function (args) { return this.str(this.repr(args[0])); });
  bi('bool', function (args) { return pyBool(args.length ? this.truthy(args[0]) : false); });
  bi('list', function (args) { var l = this.list(args.length ? this.toList(args[0]) : []); this.say('list(…) crée une nouvelle liste ' + U.hex(l.id), 'new'); return l; });
  bi('tuple', function (args) { return this.tuple(args.length ? this.toList(args[0]) : []); });
  bi('set', function (args) { var self = this, u = []; (args.length ? this.toList(args[0]) : []).forEach(function (x) { self.hashKey(x); if (!u.some(function (y) { return self.eq(x, y); })) u.push(x); }); return this.alloc({ ty: 'set', items: u }, 216); });
  bi('dict', function (args, kw) {
    var d = this.dict();
    if (args.length) { var src = args[0]; if (src.ty === 'dict') for (var i = 0; i < src.keys.length; i++) this.dictSet(d, src.keys[i], src.vals[i]); else this.toList(src).forEach(function (p) { var kv = this.toList(p); this.dictSet(d, kv[0], kv[1]); }, this); }
    for (var k in kw) this.dictSet(d, this.str(k), kw[k]);
    return d;
  });
  bi('abs', function (args) { var x = args[0]; if (!isNum(x)) throw new PyErr('TypeError', "bad operand type for abs(): '" + x.ty + "'"); return x.ty === 'float' ? this.float(Math.abs(x.v)) : this.int(toBig(x) < 0n ? -toBig(x) : toBig(x)); });
  function minmax(name, sign) {
    bi(name, function (args) {
      var items = args.length === 1 ? this.toList(args[0]) : args;
      if (!items.length) throw new PyErr('ValueError', name + '() arg is an empty sequence', 'La liste est vide : il n’y a pas de ' + name + '.');
      var best = items[0];
      for (var i = 1; i < items.length; i++) if (this.cmp(items[i], best, name === 'max' ? '>' : '<') * sign > 0) best = items[i];
      return best;
    });
  }
  minmax('max', 1); minmax('min', -1);
  bi('sum', function (args) {
    var items = this.toList(args[0]), acc = args[1] || this.int(0);
    for (var i = 0; i < items.length; i++) acc = this.binop('+', acc, items[i], null).next().value;
    return acc;
  });
  bi('sorted', function (args, kw) {
    var items = this.toList(args[0]), self = this, rev = kw.reverse && this.truthy(kw.reverse);
    items.sort(function (a, b) { return self.cmp(a, b, '<'); });
    if (rev) items.reverse();
    var l = this.list(items);
    this.say('sorted crée une NOUVELLE liste triée ' + U.hex(l.id) + ' (l’originale ne change pas)', 'new');
    return l;
  });
  bi('reversed', function (args) { return this.list(this.toList(args[0]).reverse()); });
  bi('enumerate', function (args) { var self = this, st = args[1] ? Number(toBig(args[1])) : 0; return this.list(this.toList(args[0]).map(function (x, i) { return self.tuple([self.int(i + st), x]); })); });
  bi('zip', function (args) {
    var self = this, ls = args.map(function (a) { return self.toList(a); }), n = Math.min.apply(null, ls.map(function (l) { return l.length; })), out = [];
    for (var i = 0; i < n; i++) out.push(this.tuple(ls.map(function (l) { return l[i]; })));
    return this.list(out);
  });
  bi('ord', function (args) { var x = args[0]; if (x.ty !== 'str' || x.v.length !== 1) throw new PyErr('TypeError', 'ord() expected a character, but string of length ' + (x.v ? x.v.length : '?') + ' found'); return this.int(x.v.codePointAt(0)); });
  bi('chr', function (args) { var n = Number(toBig(args[0])); if (n < 0 || n > 0x10ffff) throw new PyErr('ValueError', 'chr() arg not in range(0x110000)'); return this.str(String.fromCodePoint(n)); });
  bi('round', function (args) {
    var x = toNum(args[0]);
    if (args.length > 1 && args[1].ty !== 'NoneType') { var d = Number(toBig(args[1])), p = Math.pow(10, d); return this.float(Math.round(x * p) / p); }
    var r = Math.round(x);
    if (Math.abs(x % 1) === 0.5) r = 2 * Math.round(x / 2); // arrondi « bancaire » comme Python
    return this.int(r);
  });
  bi('divmod', function (args) { var q = this.binop('//', args[0], args[1], null).next().value, m = this.binop('%', args[0], args[1], null).next().value; return this.tuple([q, m]); });
  bi('pow', function (args) { return this.binop('**', args[0], args[1], null).next().value; });
  bi('any', function (args) { return pyBool(this.toList(args[0]).some(this.truthy, this)); });
  bi('all', function (args) { return pyBool(this.toList(args[0]).every(this.truthy, this)); });
  bi('type', function (args) { return { ty: 'type', name: typeName(args[0]) }; });
  bi('isinstance', function (args) {
    var t = args[1], names = t.ty === 'tuple' ? t.items.map(function (x) { return x.name; }) : [t.name], ty = args[0].ty;
    return pyBool(names.indexOf(ty) >= 0 || (ty === 'bool' && names.indexOf('int') >= 0));
  });
  bi('id', function (args) { var x = args[0]; if (!x.id) x = this.alloc(x, 32); return this.int(x.id); });
  bi('hex', function (args) { var v = toBig(args[0]); return this.str((v < 0n ? '-0x' : '0x') + (v < 0n ? -v : v).toString(16)); });
  bi('bin', function (args) { var v = toBig(args[0]); return this.str((v < 0n ? '-0b' : '0b') + (v < 0n ? -v : v).toString(2)); });
  bi('exit', function (args) { var e = new PyErr('SystemExit', ''); e.code = args.length ? Number(toBig(args[0])) : 0; throw e; });
  BUILTINS.quit = BUILTINS.exit;
  bi('map', function* (args) {
    var f = args[0], items = this.toList(args[1]), out = [];
    for (var i = 0; i < items.length; i++) out.push(yield* this.invoke(f, [items[i]], {}, null));
    return this.list(out);
  });
  bi('filter', function* (args) {
    var f = args[0], items = this.toList(args[1]), out = [];
    for (var i = 0; i < items.length; i++) { var r = f.ty === 'NoneType' ? items[i] : yield* this.invoke(f, [items[i]], {}, null); if (this.truthy(r)) out.push(items[i]); }
    return this.list(out);
  });
  ['int', 'float', 'str', 'list', 'dict', 'tuple', 'bool', 'set'].forEach(function (n) { BUILTINS[n].isType = true; });
  ['ValueError', 'TypeError', 'IndexError', 'KeyError', 'ZeroDivisionError', 'NameError', 'Exception', 'RuntimeError', 'EOFError', 'AssertionError'].forEach(function (n) {
    BUILTINS[n] = { ty: 'builtin', name: n, fn: function (args) { return this.alloc({ ty: 'exc', name: n, msg: args.length ? this.toStr(args[0]) : '' }, 64); } };
  });

  /* méthodes */
  var METHODS = { str: {}, list: {}, dict: {}, set: {} };
  function meth(ty, name, fn) { METHODS[ty][name] = fn; }
  function needStr(x, what) { if (x.ty !== 'str') throw new PyErr('TypeError', what + ' attend un str, pas ' + x.ty); return x.v; }
  meth('str', 'upper', function (a, k, e, s) { return this.str(s.v.toUpperCase()); });
  meth('str', 'lower', function (a, k, e, s) { return this.str(s.v.toLowerCase()); });
  meth('str', 'capitalize', function (a, k, e, s) { return this.str(s.v.charAt(0).toUpperCase() + s.v.slice(1).toLowerCase()); });
  meth('str', 'title', function (a, k, e, s) { return this.str(s.v.toLowerCase().replace(/(^|[^a-zA-Zà-ÿ])([a-zà-ÿ])/g, function (m, p, c) { return p + c.toUpperCase(); })); });
  meth('str', 'swapcase', function (a, k, e, s) { return this.str(s.v.replace(/[a-zA-Z]/g, function (c) { return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase(); })); });
  function stripper(mode) {
    return function (a, k, e, s) {
      var chars = a.length && a[0].ty === 'str' ? a[0].v : ' \t\n\r\v\f', v = s.v, i = 0, j = v.length;
      if (mode !== 'r') while (i < j && chars.indexOf(v[i]) >= 0) i++;
      if (mode !== 'l') while (j > i && chars.indexOf(v[j - 1]) >= 0) j--;
      return this.str(v.slice(i, j));
    };
  }
  meth('str', 'strip', stripper('')); meth('str', 'lstrip', stripper('l')); meth('str', 'rstrip', stripper('r'));
  meth('str', 'split', function (a, k, e, s) {
    var self = this, sep = a.length && a[0].ty !== 'NoneType' ? needStr(a[0], 'split') : null, parts;
    if (sep === '') throw new PyErr('ValueError', 'empty separator');
    parts = sep === null ? s.v.trim().split(/\s+/).filter(function (x) { return x !== ''; }) : s.v.split(sep);
    if (a.length > 1) { var mx = Number(toBig(a[1])); if (mx >= 0 && parts.length > mx + 1) { var head = parts.slice(0, mx); head.push(parts.slice(mx).join(sep === null ? ' ' : sep)); parts = head; } }
    var l = this.list(parts.map(function (p) { return self.str(p); }));
    this.say('split découpe le texte en une nouvelle liste de ' + parts.length + ' morceaux', 'new');
    return l;
  });
  meth('str', 'join', function (a, k, e, s) {
    var self = this, items = this.toList(a[0]);
    items.forEach(function (x, i) { if (x.ty !== 'str') throw new PyErr('TypeError', 'sequence item ' + i + ': expected str instance, ' + x.ty + ' found', 'join ne colle que des textes : convertis avec str(…).'); });
    return this.str(items.map(function (x) { return x.v; }).join(s.v));
  });
  meth('str', 'replace', function (a, k, e, s) { var o = needStr(a[0], 'replace'), n = needStr(a[1], 'replace'); var r = o === '' ? s.v : s.v.split(o).join(n); this.say('replace renvoie une NOUVELLE chaîne (l’ancienne ne change pas)', 'new'); return this.str(r); });
  meth('str', 'find', function (a, k, e, s) { return this.int(s.v.indexOf(needStr(a[0], 'find'), a[1] ? Number(toBig(a[1])) : 0)); });
  meth('str', 'rfind', function (a, k, e, s) { return this.int(s.v.lastIndexOf(needStr(a[0], 'rfind'))); });
  meth('str', 'index', function (a, k, e, s) { var i = s.v.indexOf(needStr(a[0], 'index')); if (i < 0) throw new PyErr('ValueError', 'substring not found'); return this.int(i); });
  meth('str', 'count', function (a, k, e, s) { var sub = needStr(a[0], 'count'); if (!sub) return this.int(s.v.length + 1); return this.int(s.v.split(sub).length - 1); });
  meth('str', 'startswith', function (a, k, e, s) { return pyBool(s.v.indexOf(needStr(a[0], 'startswith')) === 0); });
  meth('str', 'endswith', function (a, k, e, s) { var x = needStr(a[0], 'endswith'); return pyBool(s.v.length >= x.length && s.v.slice(s.v.length - x.length) === x); });
  [['isdigit', /^[0-9]+$/], ['isalpha', /^[A-Za-zÀ-ÿ]+$/], ['isalnum', /^[A-Za-z0-9À-ÿ]+$/], ['isspace', /^\s+$/], ['isupper', /^(?=.*[A-Z])[^a-z]*$/], ['islower', /^(?=.*[a-z])[^A-Z]*$/]].forEach(function (p) {
    meth('str', p[0], function (a, k, e, s) { return pyBool(p[1].test(s.v)); });
  });
  meth('str', 'center', function (a, k, e, s) { var w = Number(toBig(a[0])), f = a[1] ? a[1].v : ' ', v = s.v; while (v.length < w) v = v.length % 2 ? v + f : f + v; return this.str(v); });
  meth('str', 'ljust', function (a, k, e, s) { var w = Number(toBig(a[0])), v = s.v; while (v.length < w) v += a[1] ? a[1].v : ' '; return this.str(v); });
  meth('str', 'rjust', function (a, k, e, s) { var w = Number(toBig(a[0])), v = s.v; while (v.length < w) v = (a[1] ? a[1].v : ' ') + v; return this.str(v); });
  meth('str', 'zfill', function (a, k, e, s) { var w = Number(toBig(a[0])), v = s.v; while (v.length < w) v = '0' + v; return this.str(v); });
  meth('str', 'format', function (a, k, e, s) {
    var self = this, i = 0;
    return this.str(s.v.replace(/\{\{|\}\}|\{([^{}:]*)(?::([^{}]*))?\}/g, function (m, key, spec) {
      if (m === '{{') return '{'; if (m === '}}') return '}';
      var v;
      if (key === '' || key === undefined) v = a[i++];
      else if (/^\d+$/.test(key)) v = a[+key];
      else v = k[key];
      if (!v) throw new PyErr('IndexError', 'Replacement index out of range for positional args tuple');
      return spec ? self.formatSpec(v, spec) : self.toStr(v);
    }));
  });
  meth('str', 'encode', function (a, k, e, s) { return this.str(s.v); });
  meth('list', 'append', function (a, k, e, s) {
    needArgs('append', a, 1);
    s.items.push(a[0]);
    this.touchItem(s, s.items.length - 1, true, 'append');
    this.say('append ajoute ' + this.brief(a[0]) + ' à la fin de la liste ' + U.hex(s.id) + ' (elle a maintenant ' + s.items.length + ' éléments) — la liste est modifiée sur place.', 'write');
    return NONE;
  });
  meth('list', 'extend', function (a, k, e, s) { Array.prototype.push.apply(s.items, this.toList(a[0])); this.say('extend ajoute plusieurs éléments à la liste', 'write'); return NONE; });
  meth('list', 'insert', function (a, k, e, s) { var i = Number(toBig(a[0])); if (i < 0) i = Math.max(0, s.items.length + i); s.items.splice(Math.min(i, s.items.length), 0, a[1]); this.touchItem(s, Math.min(i, s.items.length - 1), true); this.say('insert décale les éléments suivants d’une case', 'write'); return NONE; });
  meth('list', 'pop', function (a, k, e, s) {
    if (!s.items.length) throw new PyErr('IndexError', 'pop from empty list', 'La liste est vide : vérifie len(l) > 0 avant pop.');
    var i = a.length ? Number(toBig(a[0])) : s.items.length - 1;
    if (i < 0) i += s.items.length;
    if (i < 0 || i >= s.items.length) throw new PyErr('IndexError', 'pop index out of range');
    var v = s.items.splice(i, 1)[0];
    this.say('pop retire ' + this.brief(v) + ' (case [' + i + ']) de la liste', 'write');
    return v;
  });
  meth('list', 'remove', function (a, k, e, s) {
    for (var i = 0; i < s.items.length; i++) if (this.eq(s.items[i], a[0])) { s.items.splice(i, 1); return NONE; }
    throw new PyErr('ValueError', 'list.remove(x): x not in list');
  });
  meth('list', 'index', function (a, k, e, s) { for (var i = 0; i < s.items.length; i++) if (this.eq(s.items[i], a[0])) return this.int(i); throw new PyErr('ValueError', this.repr(a[0]) + ' is not in list'); });
  meth('list', 'count', function (a, k, e, s) { var self = this; return this.int(s.items.filter(function (x) { return self.eq(x, a[0]); }).length); });
  meth('list', 'reverse', function (a, k, e, s) { s.items.reverse(); this.say('reverse inverse la liste sur place', 'write'); return NONE; });
  meth('list', 'sort', function (a, k, e, s) { var self = this; s.items.sort(function (x, y) { return self.cmp(x, y, '<'); }); if (k.reverse && this.truthy(k.reverse)) s.items.reverse(); this.say('sort trie la liste sur place (et renvoie None !)', 'write'); return NONE; });
  meth('list', 'copy', function (a, k, e, s) { var l = this.list(s.items.slice()); this.say('copy crée une nouvelle liste ' + U.hex(l.id) + ' (copie superficielle)', 'new'); return l; });
  meth('list', 'clear', function (a, k, e, s) { s.items.length = 0; return NONE; });
  meth('dict', 'get', function (a, k, e, s) { var i = this.dictFind(s, a[0]); return i < 0 ? (a[1] || NONE) : s.vals[i]; });
  meth('dict', 'keys', function (a, k, e, s) { return this.list(s.keys.slice()); });
  meth('dict', 'values', function (a, k, e, s) { return this.list(s.vals.slice()); });
  meth('dict', 'items', function (a, k, e, s) { var self = this; return this.list(s.keys.map(function (x, i) { return self.tuple([x, s.vals[i]]); })); });
  meth('dict', 'pop', function (a, k, e, s) { var i = this.dictFind(s, a[0]); if (i < 0) { if (a[1]) return a[1]; throw new PyErr('KeyError', this.repr(a[0])); } var v = s.vals[i]; this.dictDel(s, a[0]); return v; });
  meth('dict', 'setdefault', function (a, k, e, s) { var i = this.dictFind(s, a[0]); if (i >= 0) return s.vals[i]; this.dictSet(s, a[0], a[1] || NONE); return a[1] || NONE; });
  meth('dict', 'update', function (a, k, e, s) { var o = a[0]; for (var i = 0; i < o.keys.length; i++) this.dictSet(s, o.keys[i], o.vals[i]); return NONE; });
  meth('dict', 'copy', function (a, k, e, s) { var d = this.dict(); for (var i = 0; i < s.keys.length; i++) this.dictSet(d, s.keys[i], s.vals[i]); return d; });
  meth('set', 'add', function (a, k, e, s) { var self = this; this.hashKey(a[0]); if (!s.items.some(function (y) { return self.eq(a[0], y); })) s.items.push(a[0]); return NONE; });

  /* modules */
  function mod(name, attrs) { return { ty: 'module', name: name, attrs: attrs }; }
  function fbi(name, f) { return { ty: 'builtin', name: name, fn: f }; }
  var rnd = U.rng(42);
  var MODULES = {
    math: mod('math', {
      sqrt: fbi('sqrt', function (a) { var x = toNum(a[0]); if (x < 0) throw new PyErr('ValueError', 'math domain error'); return this.float(Math.sqrt(x)); }),
      floor: fbi('floor', function (a) { return this.int(Math.floor(toNum(a[0]))); }),
      ceil: fbi('ceil', function (a) { return this.int(Math.ceil(toNum(a[0]))); }),
      pi: { ty: 'float', v: Math.PI },
      gcd: fbi('gcd', function (a) { var x = toBig(a[0]), y = toBig(a[1]); if (x < 0n) x = -x; if (y < 0n) y = -y; while (y) { var t = x % y; x = y; y = t; } return this.int(x); }),
      factorial: fbi('factorial', function (a) { var n = toBig(a[0]), r = 1n; for (var i = 2n; i <= n; i++) r *= i; return this.int(r); })
    }),
    random: mod('random', {
      randint: fbi('randint', function (a) { var lo = Number(toBig(a[0])), hi = Number(toBig(a[1])); return this.int(lo + (rnd() % (hi - lo + 1))); }),
      choice: fbi('choice', function (a) { var l = this.toList(a[0]); return l[rnd() % l.length]; }),
      random: fbi('random', function () { return this.float((rnd() % 1000000) / 1000000); })
    }),
    sys: mod('sys', { stdin: { ty: 'file', name: 'stdin' }, stdout: { ty: 'file', name: 'stdout' }, stderr: { ty: 'file', name: 'stderr' }, exit: BUILTINS.exit })
  };

  /* ---------------------------------------------------------------- vue mémoire */
  M.inline = function (x) { return x.ty === 'int' || x.ty === 'float' || x.ty === 'bool' || x.ty === 'NoneType' || x.ty === 'type' || x.ty === 'module' || x.ty === 'builtin'; };
  M.valCell = function (x, a, lbl) {
    if (this.inline(x)) {
      var c = { a: a, n: 8, lbl: lbl, val: this.repr(x), kind: x.ty === 'int' || x.ty === 'float' ? 'num' : 'kw', ty: x.ty };
      if (x.ty === 'module' || x.ty === 'builtin') c.val = x.ty === 'module' ? 'module ' + x.name : x.name + '()';
      return c;
    }
    return { a: a, n: 8, lbl: lbl, val: U.hex(x.id), ref: x.id, kind: 'ptr', ty: x.ty };
  };
  M.view = function () {
    var self = this, regions = [], reach = [], seen = new Set(), refc = new Map();
    function visit(x) {
      if (!x || self.inline(x) || !x.id) return;
      refc.set(x, (refc.get(x) || 0) + 1);
      if (seen.has(x)) return;
      seen.add(x);
      reach.push(x);
      if (x.items) x.items.forEach(visit);
      if (x.ty === 'dict') { x.keys.forEach(visit); x.vals.forEach(visit); }
      if (x.ty === 'function') x.defaults.forEach(function (d) { if (d) visit(d); });
    }
    var frames = this.frames.map(function (f, fi) {
      var objs = f.order.map(function (name, slot) {
        var v = f.vars.get(name);
        visit(v);
        var c = self.valCell(v, f.addr + slot * 8, '');
        return { key: 'f' + f.id + ':' + name, name: name, type: v.ty, a: f.addr + slot * 8, n: 8, cells: [c], region: 'stack' };
      });
      return { title: f.name === '<module>' ? 'Cadre global' : f.name + '()', sub: fi === self.frames.length - 1 ? 'cadre actif' : 'en attente', active: fi === self.frames.length - 1, objs: objs };
    });
    regions.push({ kind: 'stack', title: 'Cadres (pile d’appels)', info: 'Chaque nom (variable) vit dans un cadre. Les petits nombres sont affichés directement ; les autres objets sont référencés par leur adresse (id).', groups: frames });
    reach.sort(function (a, b) { return a.id - b.id; });
    var objs = reach.map(function (x) {
      var cells = [], base = x.id;
      if (x.ty === 'str') {
        var bytes = U.utf8(x.v);
        for (var i = 0; i < x.v.length && i < 200; i++) cells.push({ a: base + 48 + i, n: 1, lbl: '[' + i + ']', val: x.v[i] === ' ' ? '␣' : x.v[i] === '\n' ? '\\n' : x.v[i] === '\t' ? '\\t' : x.v[i], kind: 'char' });
        if (!x.v.length) cells.push({ a: base + 48, n: 1, lbl: '', val: '(vide)', cls: 'more' });
        void bytes;
      } else if (x.items) {
        x.items.slice(0, 200).forEach(function (it, i) { cells.push(self.valCell(it, base + 64 + i * 8, '[' + i + ']')); });
        if (!x.items.length) cells.push({ a: base + 64, n: 8, lbl: '', val: '(vide)', cls: 'more' });
      } else if (x.ty === 'dict') {
        x.keys.forEach(function (k, i) { cells.push(self.valCell(x.vals[i], base + 8 + i * 8, self.repr(k))); });
        if (!x.keys.length) cells.push({ a: base + 8, n: 8, lbl: '', val: '(vide)', cls: 'more' });
      } else if (x.ty === 'function') {
        cells.push({ a: base, n: 8, lbl: '', val: 'def ' + x.name + '(' + x.def.params.map(function (p) { return p.name; }).join(', ') + ')', kind: 'code' });
      } else if (x.ty === 'range') cells.push({ a: base, n: 8, lbl: '', val: self.repr(x), kind: 'code' });
      else if (x.ty === 'exc') cells.push({ a: base, n: 8, lbl: '', val: x.name + '(' + reprStr(x.msg) + ')', kind: 'code' });
      else cells.push({ a: base, n: 8, lbl: '', val: self.brief(x), kind: 'code' });
      var len = x.ty === 'str' ? x.v.length : x.items ? x.items.length : x.ty === 'dict' ? x.keys.length : null;
      return { key: 'o' + x.id, name: x.ty === 'function' ? 'function' : x.ty, type: x.ty + (len !== null ? ' · len ' + len : ''), a: x.id, n: 16, cells: cells, region: 'heap', note: 'réf. ×' + refc.get(x) + (x.ty === 'str' ? ' · immuable' : x.ty === 'list' || x.ty === 'dict' ? ' · modifiable' : ''), isArr: !!(x.items || x.ty === 'str') };
    });
    regions.push({ kind: 'heap', title: 'Objets (tas)', info: 'En Python tout est objet : listes, textes, fonctions vivent sur le tas. Quand plus aucun nom ne les référence, le ramasse-miettes les supprime.', groups: [{ title: '', objs: objs }], empty: 'Aucun objet pour l’instant.' });
    return { regions: regions, acc: this.acc };
  };
  M.peekVar = function (name) {
    for (var i = this.frames.length - 1; i >= 0; i--) {
      var f = this.frames[i];
      if (f.vars.has(name)) return this.pyInfo(f.vars.get(name));
    }
    return null;
  };
  M.pyInfo = function (v) {
    var self = this;
    if (v.ty === 'str') return { k: 'str', s: v.v };
    if (v.ty === 'int' || v.ty === 'bool') return { k: 'num', v: Number(toBig(v)) };
    if (v.ty === 'float') return { k: 'num', v: v.v };
    if (v.items) return { k: 'list', items: v.items.map(function (x) { return self.pyInfo(x); }) };
    if (v.ty === 'dict') return { k: 'dict', keys: v.keys.map(function (x) { return self.toStr(x); }), vals: v.vals.map(function (x) { return self.pyInfo(x); }) };
    return { k: v.ty };
  };

  /* ---------------------------------------------------------------- API */
  O42.engines.py = {
    name: 'Python',
    create: function (src, opts) {
      var body;
      try { body = new Parser(tokenize(src), src.replace(/\r\n?/g, '\n')).program(); }
      catch (e) { if (e instanceof CompileError) return { compileError: { msg: e.msg, line: e.line, hint: e.hint } }; throw e; }
      return new Machine({ src: src.replace(/\r\n?/g, '\n'), body: body }, opts);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
