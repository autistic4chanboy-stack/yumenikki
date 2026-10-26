/* =========================================================================
 *  42 ORIGINS — moteur C
 *  Lexer + préprocesseur minimal, parseur vers un arbre, interpréteur pas à
 *  pas (générateurs) sur une mémoire d'octets simulée : .rodata, .data, tas
 *  (malloc/free façon glibc) et pile. Détecte segfaults, débordements,
 *  use-after-free, double free et fuites. Aucun accès au DOM.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var CompileError = U.CompileError, RtError = U.RtError;

  /* ---------------------------------------------------------------- types */
  function it(name, size, signed) { return { k: 'int', name: name, size: size, signed: signed }; }
  var T = {
    void: { k: 'void', name: 'void', size: 1 },
    char: it('char', 1, true), uchar: it('unsigned char', 1, false), schar: it('signed char', 1, true),
    short: it('short', 2, true), ushort: it('unsigned short', 2, false),
    int: it('int', 4, true), uint: it('unsigned int', 4, false),
    long: it('long', 8, true), ulong: it('unsigned long', 8, false),
    size_t: it('size_t', 8, false), ssize_t: it('ssize_t', 8, true),
    bool: it('bool', 1, false),
    float: { k: 'float', name: 'float', size: 4 }, double: { k: 'float', name: 'double', size: 8 }
  };
  var PTRS = new Map();
  function ptrT(t) { var p = PTRS.get(t); if (!p) { p = { k: 'ptr', size: 8, to: t }; PTRS.set(t, p); } return p; }
  function arrT(t, n) { return { k: 'arr', of: t, n: n, size: n === null ? 0 : t.size * n }; }
  function alignOf(t) {
    if (t.k === 'arr') return alignOf(t.of);
    if (t.k === 'struct') return t.align || 1;
    return Math.min(t.size, 8) || 1;
  }
  function tname(t) {
    if (!t) return '?';
    if (t.k === 'ptr') { var b = tname(t.to); return b + (b[b.length - 1] === '*' ? '*' : ' *'); }
    if (t.k === 'arr') { var d = '', x = t; while (x.k === 'arr') { d += '[' + (x.n === null ? '' : x.n) + ']'; x = x.of; } return tname(x) + d; }
    if (t.k === 'struct') return t.alias || ((t.union ? 'union ' : 'struct ') + (t.tag || '(anonyme)'));
    return t.alias || t.name;
  }
  function isScalar(t) { return t.k === 'int' || t.k === 'float' || t.k === 'ptr'; }
  function isCharT(t) { return t.k === 'int' && t.size === 1 && t !== T.bool; }
  function alignUp(n, a) { return Math.ceil(n / a) * a; }

  var STACK_TOP = 0x7fffffffe000, STACK_SIZE = 0x10000;
  var HEAP_BASE = 0x555555559000, HEAP_SIZE = 0x40000;
  var DATA_BASE = 0x555555558010, DATA_SIZE = 0xff0;
  var RO_BASE = 0x555555556004, RO_SIZE = 0x1ff0;

  /* ---------------------------------------------------------------- lexer */
  var KW = {};
  ('auto break case char const continue default do double else enum extern float for goto if int long register ' +
   'return short signed sizeof static struct switch typedef union unsigned void volatile while inline restrict _Bool').split(' ').forEach(function (k) { KW[k] = 1; });
  var TYPE_KW = {};
  'void char short int long float double signed unsigned const volatile static extern struct union enum typedef register _Bool inline restrict auto'.split(' ').forEach(function (k) { TYPE_KW[k] = 1; });
  var P3 = ['...', '<<=', '>>='], P2 = ['->', '++', '--', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '^=', '|='];

  function readEscape(s, i, line) { // s[i] est le caractère après « \ »
    var c = s[i];
    var simple = { n: 10, t: 9, r: 13, '0': 0, '\\': 92, "'": 39, '"': 34, a: 7, b: 8, f: 12, v: 11, e: 27, '?': 63 };
    if (c >= '0' && c <= '7') {
      var j = i, v = 0;
      while (j < i + 3 && s[j] >= '0' && s[j] <= '7') { v = v * 8 + (s.charCodeAt(j) - 48); j++; }
      return { code: v & 255, len: j - i };
    }
    if (c === 'x') {
      var k = i + 1, h = '';
      while (/[0-9a-fA-F]/.test(s[k] || '')) h += s[k++];
      if (!h) throw new CompileError('séquence \\x sans chiffres hexadécimaux', line);
      return { code: parseInt(h, 16) & 255, len: k - i };
    }
    if (c in simple) return { code: simple[c], len: 1 };
    throw new CompileError('séquence d’échappement inconnue « \\' + c + ' »', line);
  }

  function tokenize(src) {
    var toks = [], i = 0, line = 1, n = src.length;
    while (i < n) {
      var c = src[i];
      if (c === '\n') { line++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '/' && src[i + 1] === '*') {
        var j = src.indexOf('*/', i + 2);
        if (j < 0) throw new CompileError('commentaire /* jamais fermé', line);
        for (var q = i; q < j; q++) if (src[q] === '\n') line++;
        i = j + 2; continue;
      }
      var st = i;
      if (/[A-Za-z_]/.test(c)) {
        while (i < n && /[A-Za-z0-9_]/.test(src[i])) i++;
        var w = src.slice(st, i);
        toks.push({ t: KW[w] ? 'kw' : 'id', v: w, line: line, pos: st, end: i });
        continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        var re = /0[xX][0-9a-fA-F]+|[0-9]*\.[0-9]+(?:[eE][+-]?[0-9]+)?|[0-9]+\.(?:[eE][+-]?[0-9]+)?|[0-9]+[eE][+-]?[0-9]+|[0-9]+/y;
        re.lastIndex = i;
        var m = re.exec(src)[0];
        i += m.length;
        var suf = '';
        while (i < n && /[uUlLfF]/.test(src[i])) suf += src[i++].toLowerCase();
        if (i < n && /[A-Za-z_0-9]/.test(src[i])) throw new CompileError('nombre mal formé « ' + src.slice(st, i + 1) + ' »', line);
        var isF = !/^0x/i.test(m) && /[.eE]/.test(m) || suf.indexOf('f') >= 0 && !/^0x/i.test(m);
        var tok = { t: 'num', line: line, pos: st, end: i };
        if (isF) { tok.v = parseFloat(m); tok.ty = suf.indexOf('f') >= 0 ? T.float : T.double; }
        else {
          var v = /^0x/i.test(m) ? parseInt(m, 16) : (m.length > 1 && m[0] === '0') ? parseInt(m, 8) : parseInt(m, 10);
          var u = suf.indexOf('u') >= 0, l = suf.indexOf('l') >= 0;
          tok.v = v;
          tok.ty = l || v > 0xffffffff || (!u && v > 0x7fffffff && !/^0x/i.test(m)) ? (u ? T.ulong : T.long) : (u || v > 0x7fffffff ? T.uint : T.int);
        }
        toks.push(tok);
        continue;
      }
      if (c === "'") {
        i++;
        var code;
        if (src[i] === '\\') { var e = readEscape(src, i + 1, line); code = e.code; i += 1 + e.len; }
        else if (src[i] === "'" || src[i] === '\n' || i >= n) throw new CompileError('caractère littéral vide ou non fermé', line);
        else { var bytes = U.utf8(src[i]); code = bytes[0]; if (bytes.length > 1) code = (bytes[bytes.length - 1] << 24) >> 24; i++; }
        if (src[i] !== "'") throw new CompileError('caractère littéral non fermé (une seule lettre entre \' \')', line);
        i++;
        toks.push({ t: 'num', v: (code << 24) >> 24, ty: T.int, chr: true, line: line, pos: st, end: i });
        continue;
      }
      if (c === '"') {
        i++;
        var b = [];
        while (i < n && src[i] !== '"') {
          if (src[i] === '\n') throw new CompileError('chaîne de caractères non fermée (il manque le " final)', line);
          if (src[i] === '\\') { var e2 = readEscape(src, i + 1, line); b.push(e2.code); i += 1 + e2.len; }
          else { var cp = src.codePointAt(i), ch = String.fromCodePoint(cp); Array.prototype.push.apply(b, U.utf8(ch)); i += ch.length; }
        }
        if (i >= n) throw new CompileError('chaîne de caractères non fermée (il manque le " final)', line);
        i++;
        toks.push({ t: 'str', v: b, line: line, pos: st, end: i });
        continue;
      }
      var p3 = src.substr(i, 3), p2 = src.substr(i, 2), op = null;
      if (P3.indexOf(p3) >= 0) op = p3; else if (P2.indexOf(p2) >= 0) op = p2; else if ('+-*/%=<>!&|^~?:;,.()[]{}'.indexOf(c) >= 0) op = c;
      if (!op) throw new CompileError('caractère inattendu « ' + c + ' »', line);
      i += op.length;
      toks.push({ t: 'op', v: op, line: line, pos: st, end: i });
    }
    toks.push({ t: 'eof', v: '', line: line, pos: n, end: n });
    return toks;
  }

  /* préprocesseur : #include ignoré (noté), #define NOM valeur, le reste ignoré */
  function preprocess(src) {
    var lines = src.split('\n'), macros = {}, includes = [], out = [];
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i], m = /^\s*#\s*(\w+)\s*(.*)$/.exec(L);
      if (!m) { out.push(L); continue; }
      var d = m[1], rest = m[2];
      if (d === 'include') includes.push(rest.trim());
      else if (d === 'define') {
        var dm = /^([A-Za-z_]\w*)(\()?\s*(.*)$/.exec(rest);
        if (!dm) throw new CompileError('#define mal formé', i + 1);
        if (dm[2]) throw new CompileError('les macros avec paramètres (#define ' + dm[1] + '(…)) ne sont pas gérées : écris une fonction', i + 1);
        var body = dm[3].replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').trim();
        macros[dm[1]] = { toks: body ? tokenize(body).slice(0, -1) : [], line: i + 1 };
      } else if (['ifndef', 'ifdef', 'endif', 'pragma', 'undef', 'if', 'else', 'elif', 'error'].indexOf(d) < 0)
        throw new CompileError('directive #' + d + ' inconnue', i + 1);
      out.push(L.replace(/[^\s]/g, ' ')); // même longueur : les positions restent alignées sur le source
    }
    return { src: out.join('\n'), macros: macros, includes: includes };
  }

  function expandMacros(toks, macros) {
    var out = [];
    function exp(t, depth) {
      if (t.t === 'id' && macros[t.v] && depth < 20) {
        macros[t.v].toks.forEach(function (mt) { exp({ t: mt.t, v: mt.v, ty: mt.ty, chr: mt.chr, line: t.line, pos: t.pos, end: t.end }, depth + 1); });
      } else out.push(t);
    }
    toks.forEach(function (t) { exp(t, 0); });
    return out;
  }

  /* ---------------------------------------------------------------- parseur */
  var BIN = { '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5, '==': 6, '!=': 6, '<': 7, '>': 7, '<=': 7, '>=': 7, '<<': 8, '>>': 8, '+': 9, '-': 9, '*': 10, '/': 10, '%': 10 };
  var ASSIGN = { '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1, '<<=': 1, '>>=': 1, '&=': 1, '^=': 1, '|=': 1 };

  function Parser(toks, src) {
    this.toks = toks; this.p = 0; this.src = src; this.lastEnd = 0;
    this.typedefs = Object.create(null); this.structs = Object.create(null); this.enums = Object.create(null);
    this.funcs = Object.create(null); this.protos = Object.create(null); this.globals = []; this.strs = [];
    this.typedefs.size_t = T.size_t; this.typedefs.ssize_t = T.ssize_t; this.typedefs.bool = T.bool;
    this.typedefs.uint8_t = T.uchar; this.typedefs.int32_t = T.int; this.typedefs.uint32_t = T.uint;
    this.typedefs.int64_t = T.long; this.typedefs.uint64_t = T.ulong; this.typedefs.intptr_t = T.long; this.typedefs.uintptr_t = T.ulong;
    this.enums.NULL = { v: 0, ptr: true }; this.enums.true = { v: 1 }; this.enums.false = { v: 0 };
    this.enums.EXIT_SUCCESS = { v: 0 }; this.enums.EXIT_FAILURE = { v: 1 };
    this.enums.STDIN_FILENO = { v: 0 }; this.enums.STDOUT_FILENO = { v: 1 }; this.enums.STDERR_FILENO = { v: 2 };
    this.enums.O_RDONLY = { v: 0 }; this.enums.O_WRONLY = { v: 1 }; this.enums.O_RDWR = { v: 2 }; this.enums.O_CREAT = { v: 64 };
    this.enums.BUFFER_SIZE = { v: 42 }; this.enums.INT_MAX = { v: 2147483647 }; this.enums.INT_MIN = { v: -2147483648 };
    this.enums.CHAR_MAX = { v: 127 }; this.enums.CHAR_MIN = { v: -128 }; this.enums.EOF = { v: -1 };
  }
  var PP = Parser.prototype;
  PP.peek = function (o) { return this.toks[Math.min(this.p + (o || 0), this.toks.length - 1)]; };
  PP.next = function () { var t = this.toks[this.p++]; this.lastEnd = t.end; return t; };
  PP.is = function (v, o) { var t = this.peek(o); return (t.t === 'op' || t.t === 'kw') && t.v === v; };
  PP.accept = function (v) { return this.is(v) ? this.next() : null; };
  PP.fail = function (msg, tok) {
    tok = tok || this.peek();
    throw new CompileError(msg + (tok.t === 'eof' ? ' (fin du fichier atteinte)' : ' près de « ' + this.src.slice(tok.pos, tok.end) + ' »'), tok.line);
  };
  PP.expect = function (v, ctx) {
    if (this.is(v)) return this.next();
    if (v === ';' || v === ')' || v === ']') {
      var prev = this.toks[this.p - 1] || this.peek();
      throw new CompileError('« ' + v + ' » attendu' + (ctx ? ' ' + ctx : '') + ' après « ' + this.src.slice(prev.pos, prev.end) + ' »', prev.line,
        v === ';' ? 'En C, chaque instruction se termine par un point-virgule.' : '');
    }
    this.fail('« ' + v + ' » attendu' + (ctx ? ' ' + ctx : ''));
  };
  PP.node = function (k, tok, props) {
    props.k = k; props.line = tok.line; props.s = tok.pos; props.e = this.lastEnd;
    return props;
  };
  PP.isTypeStart = function (o) {
    var t = this.peek(o);
    if (t.t === 'kw') return !!TYPE_KW[t.v];
    return t.t === 'id' && !!this.typedefs[t.v];
  };

  PP.specifiers = function () {
    var signed = null, short = 0, long = 0, base = null, any = false, storage = {}, isConst = false;
    for (;;) {
      var t = this.peek();
      if (t.t === 'kw') {
        var v = t.v;
        if (v === 'const' || v === 'volatile' || v === 'register' || v === 'inline' || v === 'restrict' || v === 'auto') { this.next(); if (v === 'const') isConst = true; any = true; continue; }
        if (v === 'static' || v === 'extern' || v === 'typedef') { this.next(); storage[v] = true; any = true; continue; }
        if (v === 'signed' || v === 'unsigned') { this.next(); signed = v === 'signed'; any = true; continue; }
        if (v === 'short') { this.next(); short++; any = true; continue; }
        if (v === 'long') { this.next(); long++; any = true; continue; }
        if (v === 'int' || v === 'char' || v === 'void' || v === 'float' || v === 'double' || v === '_Bool') {
          if (base) this.fail('deux types dans la même déclaration');
          this.next(); base = v; any = true; continue;
        }
        if (v === 'struct' || v === 'union') { if (base) this.fail('deux types dans la même déclaration'); base = this.structSpec(); any = true; continue; }
        if (v === 'enum') { base = this.enumSpec(); any = true; continue; }
        break;
      }
      if (t.t === 'id' && this.typedefs[t.v] && !base && signed === null && !short && !long) {
        // « mon_type x » : nom de type ; mais « x = … » après un typedef déjà vu reste une variable
        this.next(); base = this.typedefs[t.v]; any = true; continue;
      }
      break;
    }
    if (!any) return null;
    var ty;
    if (base && typeof base === 'object') ty = base;
    else if (base === 'void') ty = T.void;
    else if (base === 'char') ty = signed === false ? T.uchar : signed === true ? T.schar : T.char;
    else if (base === '_Bool') ty = T.bool;
    else if (base === 'float') ty = T.float;
    else if (base === 'double') ty = T.double;
    else if (short) ty = signed === false ? T.ushort : T.short;
    else if (long) ty = signed === false ? T.ulong : T.long;
    else ty = signed === false ? T.uint : T.int;
    return { type: ty, storage: storage, isConst: isConst };
  };

  PP.structSpec = function () {
    var kw = this.next(), union = kw.v === 'union', tag = null;
    if (this.peek().t === 'id') tag = this.next().v;
    var st;
    if (tag) {
      st = this.structs[tag];
      if (!st) st = this.structs[tag] = { k: 'struct', tag: tag, union: union, fields: [], size: 0, align: 1, complete: false, line: kw.line };
    } else st = { k: 'struct', tag: null, union: union, fields: [], size: 0, align: 1, complete: false, line: kw.line };
    if (this.accept('{')) {
      if (st.complete) this.fail('struct ' + tag + ' est définie deux fois');
      var fields = [];
      while (!this.accept('}')) {
        if (this.peek().t === 'eof') this.fail('« } » manquant à la fin de la struct');
        var sp = this.specifiers();
        if (!sp) this.fail('type de champ attendu dans la struct');
        do {
          var d = this.declarator(sp.type, false);
          if (d.params) this.fail('une struct ne peut pas contenir de fonction');
          if (d.type.k === 'struct' && !d.type.complete) this.fail('champ de type incomplet (utilise un pointeur : struct ' + d.type.tag + ' *)');
          fields.push({ name: d.name, type: d.type });
        } while (this.accept(','));
        this.expect(';', 'après le champ');
      }
      var off = 0, maxA = 1;
      fields.forEach(function (f) {
        var a = alignOf(f.type);
        maxA = Math.max(maxA, a);
        if (union) { f.off = 0; off = Math.max(off, f.type.size); }
        else { off = alignUp(off, a); f.pad = off; f.off = off; off += f.type.size; }
      });
      st.fields = fields; st.align = maxA; st.size = alignUp(Math.max(off, 1), maxA); st.complete = true;
    }
    return st;
  };

  PP.enumSpec = function () {
    this.next();
    if (this.peek().t === 'id') this.next();
    if (this.accept('{')) {
      var v = 0;
      while (!this.accept('}')) {
        var nt = this.next();
        if (nt.t !== 'id') this.fail('nom de constante attendu dans l’enum', nt);
        if (this.accept('=')) v = this.constEval(this.assign());
        this.enums[nt.v] = { v: v };
        v++;
        if (!this.accept(',')) { this.expect('}'); break; }
      }
    }
    return T.int;
  };

  /* déclarateur : pointeurs, nom, tableaux, paramètres de fonction */
  PP.declarator = function (base, abstract) {
    var t = base;
    while (this.accept('*')) { t = ptrT(t); while (this.accept('const') || this.accept('volatile') || this.accept('restrict')); }
    if (this.is('(') && this.is('*', 1)) this.fail('les pointeurs sur fonction ne sont pas gérés par ce visualiseur');
    var nameTok = null;
    if (this.peek().t === 'id') nameTok = this.next();
    else if (!abstract) this.fail('nom de variable ou de fonction attendu');
    var params = null, dims = [];
    if (nameTok && this.is('(')) params = this.paramList();
    while (this.accept('[')) {
      if (this.accept(']')) { dims.push(null); continue; }
      var e = this.assign();
      dims.push(this.constEval(e, 'la taille d’un tableau doit être une constante'));
      this.expect(']');
    }
    for (var i = dims.length - 1; i >= 0; i--) {
      if (dims[i] !== null && dims[i] <= 0) this.fail('taille de tableau invalide (' + dims[i] + ')');
      t = arrT(t, dims[i]);
    }
    return { name: nameTok ? nameTok.v : null, type: t, params: params, line: nameTok ? nameTok.line : this.peek().line, tok: nameTok };
  };

  PP.paramList = function () {
    this.expect('(');
    var ps = [];
    ps.variadic = false;
    if (this.accept(')')) return ps;
    if (this.is('void') && this.is(')', 1)) { this.next(); this.next(); return ps; }
    do {
      if (this.accept('...')) { ps.variadic = true; break; }
      var sp = this.specifiers();
      if (!sp) this.fail('type de paramètre attendu');
      var d = this.declarator(sp.type, true);
      var pt = d.type.k === 'arr' ? ptrT(d.type.of) : d.type;
      ps.push({ name: d.name, type: pt, line: d.line });
    } while (this.accept(','));
    this.expect(')', 'pour fermer la liste des paramètres');
    return ps;
  };

  PP.typeName = function () {
    var sp = this.specifiers();
    if (!sp) this.fail('type attendu');
    return this.declarator(sp.type, true).type;
  };

  PP.program = function () {
    while (this.peek().t !== 'eof') {
      if (this.accept(';')) continue;
      var sp = this.specifiers();
      if (!sp) {
        var t = this.peek();
        if (t.t === 'id' && this.is('(', 1)) this.fail('type de retour manquant devant la fonction ' + t.v + ' (ex. int ' + t.v + '(…))');
        this.fail('déclaration attendue (type, fonction ou variable globale)');
      }
      if (this.accept(';')) continue;
      var defined = false;
      do {
        var d = this.declarator(sp.type, false);
        if (sp.storage.typedef) {
          if (d.type.k === 'struct' && !d.type.alias) d.type.alias = d.name;
          this.typedefs[d.name] = d.type;
          continue;
        }
        if (d.params) {
          var fn = { name: d.name, ret: d.type, params: d.params, line: d.line };
          if (this.is('{')) {
            if (this.funcs[d.name]) this.fail('la fonction ' + d.name + ' est définie deux fois');
            fn.body = this.block();
            this.funcs[d.name] = fn;
            defined = true;
            break;
          }
          this.protos[d.name] = fn;
        } else {
          var init = null;
          if (this.accept('=')) init = this.initializer();
          var gt = this.fixArray(d.type, init);
          if (gt.k === 'void') this.fail('une variable ne peut pas être de type void');
          this.globals.push({ name: d.name, type: gt, init: init, line: d.line });
        }
      } while (this.accept(','));
      if (!defined) this.expect(';', 'à la fin de la déclaration');
    }
  };

  PP.fixArray = function (t, init) {
    if (t.k !== 'arr' || t.n !== null) return t;
    if (!init) this.fail('tableau sans taille : donne une taille ou une valeur initiale');
    if (init.k === 'str') return arrT(t.of, init.bytes.length + 1);
    if (init.k === 'init') return arrT(t.of, init.items.length);
    this.fail('initialisation de tableau invalide');
  };

  PP.initializer = function () {
    if (this.is('{')) {
      var tok = this.next(), items = [];
      while (!this.accept('}')) {
        items.push(this.initializer());
        if (!this.accept(',')) { this.expect('}'); break; }
      }
      return this.node('init', tok, { items: items });
    }
    return this.assign();
  };

  PP.block = function () {
    var tok = this.expect('{'), body = [];
    while (!this.is('}')) {
      if (this.peek().t === 'eof') throw new CompileError('« } » manquant : un bloc ouvert ligne ' + tok.line + ' n’est jamais fermé', tok.line);
      body.push(this.stmt());
    }
    var end = this.next();
    return { k: 'block', body: body, line: tok.line, endLine: end.line };
  };

  PP.stmt = function () {
    var t = this.peek();
    if (this.is('{')) return this.block();
    if (t.t === 'kw') {
      switch (t.v) {
        case 'if': {
          this.next(); this.expect('(', 'après if'); var c = this.expr(); this.expect(')', 'pour fermer la condition du if');
          var a = this.stmt(), b = null;
          if (this.accept('else')) b = this.stmt();
          return { k: 'if', c: c, a: a, b: b, line: t.line };
        }
        case 'while': {
          this.next(); this.expect('(', 'après while'); var c2 = this.expr(); this.expect(')', 'pour fermer la condition du while');
          return { k: 'while', c: c2, body: this.stmt(), line: t.line };
        }
        case 'do': {
          this.next(); var body = this.stmt(); var wt = this.expect('while', 'après le corps du do');
          this.expect('('); var c3 = this.expr(); this.expect(')'); this.expect(';');
          return { k: 'do', body: body, c: c3, line: t.line, condLine: wt.line };
        }
        case 'for': {
          this.next(); this.expect('(', 'après for');
          var init = null;
          if (this.isTypeStart()) init = this.decl();
          else if (!this.accept(';')) { var ie = this.expr(); this.expect(';', 'dans le for'); init = { k: 'expr', e: ie, line: t.line }; }
          var cond = this.is(';') ? null : this.expr(); this.expect(';', 'dans le for');
          var inc = this.is(')') ? null : this.expr(); this.expect(')', 'pour fermer le for');
          return { k: 'for', init: init, c: cond, inc: inc, body: this.stmt(), line: t.line };
        }
        case 'return': {
          this.next(); var e = this.is(';') ? null : this.expr(); this.expect(';', 'après return');
          return { k: 'return', e: e, line: t.line };
        }
        case 'break': this.next(); this.expect(';'); return { k: 'break', line: t.line };
        case 'continue': this.next(); this.expect(';'); return { k: 'continue', line: t.line };
        case 'switch': {
          this.next(); this.expect('('); var se = this.expr(); this.expect(')');
          var sb = this.stmt();
          if (sb.k !== 'block') this.fail('switch sans bloc { }');
          return { k: 'switch', e: se, body: sb, line: t.line };
        }
        case 'case': {
          this.next(); var cv = this.constEval(this.cond(), 'la valeur d’un case doit être constante'); this.expect(':');
          return { k: 'case', v: cv, line: t.line };
        }
        case 'default': this.next(); this.expect(':'); return { k: 'default', line: t.line };
        case 'goto': this.fail('goto n’est pas géré (et interdit par la Norme de 42 !)');
      }
    }
    if (this.isTypeStart() && !(t.t === 'id' && (this.is('=', 1) || this.is('(', 1) || this.is('[', 1) || this.is('.', 1) || this.is('->', 1)))) return this.decl();
    if (this.accept(';')) return { k: 'nop', line: t.line };
    var ex = this.expr();
    this.expect(';', 'à la fin de l’instruction');
    return { k: 'expr', e: ex, line: t.line };
  };

  PP.decl = function () {
    var t = this.peek(), sp = this.specifiers(), items = [];
    if (this.accept(';')) return { k: 'nop', line: t.line };
    do {
      var d = this.declarator(sp.type, false);
      if (sp.storage.typedef) { this.typedefs[d.name] = d.type; continue; }
      if (d.params) { this.protos[d.name] = { name: d.name, ret: d.type, params: d.params }; continue; }
      var init = null;
      if (this.accept('=')) init = this.initializer();
      var ty = this.fixArray(d.type, init);
      if (ty.k === 'void') this.fail('une variable ne peut pas être de type void (void * oui)');
      if (ty.k === 'struct' && !ty.complete) this.fail('struct ' + ty.tag + ' n’est pas définie (type incomplet)');
      items.push({ name: d.name, type: ty, init: init, line: d.line, isStatic: !!sp.storage.static, isConst: sp.isConst });
    } while (this.accept(','));
    this.expect(';', 'à la fin de la déclaration');
    return { k: 'decl', items: items, line: t.line };
  };

  PP.expr = function () {
    var t = this.peek(), e = this.assign();
    while (this.accept(',')) e = this.node('comma', t, { a: e, b: this.assign() });
    return e;
  };
  PP.assign = function () {
    var t = this.peek(), a = this.cond(), o = this.peek();
    if (o.t === 'op' && ASSIGN[o.v]) {
      this.next();
      var b = this.assign();
      return this.node('assign', t, { op: o.v, a: a, b: b });
    }
    return a;
  };
  PP.cond = function () {
    var t = this.peek(), c = this.bin(1);
    if (this.accept('?')) {
      var a = this.expr(); this.expect(':', 'dans l’opérateur ternaire');
      var b = this.cond();
      return this.node('cond', t, { c: c, a: a, b: b });
    }
    return c;
  };
  PP.bin = function (min) {
    var t = this.peek(), a = this.unary();
    for (;;) {
      var o = this.peek();
      if (o.t !== 'op') break;
      var pr = BIN[o.v];
      if (!pr || pr < min) break;
      this.next();
      var b = this.bin(pr + 1);
      a = this.node('bin', t, { op: o.v, a: a, b: b });
    }
    return a;
  };
  PP.unary = function () {
    var t = this.peek();
    if (t.t === 'op') {
      if (t.v === '++' || t.v === '--') { this.next(); var a = this.unary(); return this.node('pre', t, { op: t.v, a: a }); }
      if ('+-!~*&'.indexOf(t.v) >= 0 && t.v.length === 1) { this.next(); var u = this.unary(); return this.node('un', t, { op: t.v, a: u }); }
      if (t.v === '(' && this.isTypeStart(1)) {
        this.next(); var ty = this.typeName(); this.expect(')', 'après le type du cast');
        var ca = this.unary();
        return this.node('cast', t, { t: ty, a: ca });
      }
    }
    if (t.t === 'kw' && t.v === 'sizeof') {
      this.next();
      if (this.is('(') && this.isTypeStart(1)) { this.next(); var st = this.typeName(); this.expect(')'); return this.node('sizeof_t', t, { t: st }); }
      var se = this.unary();
      return this.node('sizeof_e', t, { a: se });
    }
    return this.postfix();
  };
  PP.postfix = function () {
    var t = this.peek(), a = this.primary();
    for (;;) {
      if (this.accept('[')) { var i = this.expr(); this.expect(']', 'pour fermer l’indice'); a = this.node('idx', t, { a: a, i: i }); continue; }
      if (this.is('(')) {
        if (a.k !== 'id') this.fail('seuls les appels de fonction par leur nom sont gérés');
        this.next();
        var args = [];
        if (!this.accept(')')) {
          do { args.push(this.assign()); } while (this.accept(','));
          this.expect(')', 'pour fermer l’appel de ' + a.name);
        }
        a = this.node('call', t, { f: a.name, args: args });
        continue;
      }
      if (this.is('.') || this.is('->')) {
        var arrow = this.next().v === '->', ft = this.next();
        if (ft.t !== 'id') this.fail('nom de champ attendu après ' + (arrow ? '->' : '.'), ft);
        a = this.node('mem', t, { a: a, name: ft.v, arrow: arrow });
        continue;
      }
      if (this.is('++') || this.is('--')) { var o = this.next(); a = this.node('post', t, { op: o.v, a: a }); continue; }
      break;
    }
    return a;
  };
  PP.primary = function () {
    var t = this.next();
    if (t.t === 'num') return this.node('num', t, { v: t.v, t: t.ty, chr: !!t.chr });
    if (t.t === 'str') {
      var b = t.v.slice();
      while (this.peek().t === 'str') b = b.concat(this.next().v);
      var n = this.node('str', t, { bytes: b });
      this.strs.push(n);
      return n;
    }
    if (t.t === 'id') {
      if (this.enums[t.v] && !this.is('(')) { var en = this.enums[t.v]; return this.node('num', t, { v: en.v, t: en.ptr ? ptrT(T.void) : T.int, named: t.v }); }
      return this.node('id', t, { name: t.v });
    }
    if (t.t === 'op' && t.v === '(') { var e = this.expr(); this.expect(')', 'pour fermer la parenthèse'); e.paren = true; return e; }
    this.p--;
    this.fail('expression attendue');
  };

  /* évaluation d'expressions constantes (tailles de tableaux, case, globales) */
  PP.constEval = function (e, why) {
    var self = this;
    function ev(n) {
      switch (n.k) {
        case 'num': return n.v;
        case 'un': { var a = ev(n.a); return n.op === '-' ? -a : n.op === '+' ? a : n.op === '!' ? +!a : n.op === '~' ? ~a : NaN; }
        case 'bin': {
          var x = ev(n.a), y = ev(n.b);
          switch (n.op) {
            case '+': return x + y; case '-': return x - y; case '*': return x * y;
            case '/': return y ? Math.trunc(x / y) : NaN; case '%': return y ? x % y : NaN;
            case '<<': return x << y; case '>>': return x >> y; case '&': return x & y; case '|': return x | y; case '^': return x ^ y;
            case '==': return +(x === y); case '!=': return +(x !== y); case '<': return +(x < y); case '>': return +(x > y);
            case '<=': return +(x <= y); case '>=': return +(x >= y); case '&&': return +(x && y); case '||': return +(x || y);
          }
          return NaN;
        }
        case 'sizeof_t': return n.t.size;
        case 'cast': return ev(n.a);
        case 'cond': return ev(n.c) ? ev(n.a) : ev(n.b);
      }
      return NaN;
    }
    var v = ev(e);
    if (isNaN(v)) throw new CompileError(why || 'expression constante attendue', e.line);
    return v;
  };

  /* ---------------------------------------------------------------- mémoire */
  function Region(name, kind, base, size, rnd) {
    this.name = name; this.kind = kind; this.base = base; this.size = size; this.end = base + size;
    this.buf = new Uint8Array(size); this.dv = new DataView(this.buf.buffer); this.ini = new Uint8Array(size);
    if (rnd) for (var i = 0; i < size; i++) this.buf[i] = (rnd() >>> 5) & 255;
  }

  var BRK = { brk: 1 }, CNT = { cnt: 1 };
  function Exit(code) { this.code = code; }

  /* ---------------------------------------------------------------- machine */
  function Machine(prog, opts) {
    opts = opts || {};
    this.prog = prog; this.src = prog.src;
    var rnd = U.rng(4242);
    this.ro = new Region('.rodata', 'rodata', RO_BASE, RO_SIZE);
    this.data = new Region('.data', 'data', DATA_BASE, DATA_SIZE);
    this.heapR = new Region('heap', 'heap', HEAP_BASE, HEAP_SIZE, rnd);
    this.stack = new Region('stack', 'stack', STACK_TOP - STACK_SIZE, STACK_SIZE, rnd);
    this.regions = [this.ro, this.data, this.heapR, this.stack];
    this.heap = new U.Heap(HEAP_BASE, HEAP_SIZE);
    this.lits = new Map(); this.litObjs = []; this.roNext = RO_BASE; this.dataNext = DATA_BASE;
    this.globalVars = []; this.statics = new Map();
    this.frames = []; this.sp = STACK_TOP - 0x1f0;
    this.stdinBytes = U.utf8(opts.stdin || '');
    this.files = {};
    var fs = opts.files || {};
    for (var k in fs) this.files[k] = U.utf8(fs[k]);
    this.fds = { 0: { name: 'stdin', data: this.stdinBytes, pos: 0 }, 1: { name: 'stdout', w: true }, 2: { name: 'stderr', w: true } };
    this.out = []; this.outBytes = []; this._stdout = null;
    this.steps = 0; this.maxSteps = opts.maxSteps || 300000;
    this.done = false; this.error = null; this.exitCode = null; this.warnings = [];
    this.log = []; this.acc = []; this.line = 0; this.curLine = 0;
    this.calls = { malloc: 0, free: 0 };
    this.used = {};
    this.frameSeq = 0;
    this.gen = this.boot();
    this.advance();
  }
  var M = Machine.prototype;

  Object.defineProperty(M, 'stdout', { get: function () {
    if (this._stdout === null) this._stdout = U.decode(this.outBytes);
    return this._stdout;
  } });
  Object.defineProperty(M, 'depth', { get: function () { return this.frames.length; } });

  M.say = function (text, cls) { if (this.log.length < 14) this.log.push({ t: text, c: cls || '' }); else if (this.log.length === 14) this.log.push({ t: '…', c: '' }); };
  M.warn = function (text) {
    this.say('⚠ ' + text, 'warn');
    if (this.warnings.length < 50 && !this.warnings.some(function (w) { return w.msg === text; })) this.warnings.push({ msg: text, line: this.curLine });
  };
  M.text = function (n) { return this.src.slice(n.s, n.e).replace(/\s+/g, ' '); };

  M.advance = function () {
    try {
      var r = this.gen.next();
      if (r.done) { if (!this.done) this.finish(0); }
      else { this.line = r.value; }
    } catch (e) {
      if (e instanceof Exit) { this.finish(e.code); return; }
      if (e instanceof RtError || e instanceof CompileError) {
        this.done = true;
        this.error = { msg: e.msg, kind: e.kind || 'compile', line: e.line || this.curLine, hint: e.hint };
        this.line = this.error.line;
        this.say('✖ ' + e.msg, 'err');
        return;
      }
      throw e;
    }
  };
  M.step = function () {
    if (this.done) return false;
    this.steps++;
    this.log = []; this.acc = [];
    if (this.steps > this.maxSteps) {
      this.done = true;
      this.error = { msg: 'Le programme a dépassé ' + this.maxSteps + ' étapes : boucle infinie ?', kind: 'timeout', line: this.line, hint: 'Vérifie que la condition de ta boucle finit par devenir fausse (incrémentes-tu bien ton compteur ?).' };
      return false;
    }
    this.advance();
    return !this.done;
  };

  M.finish = function (code) {
    if (this.done) return;
    this.done = true;
    this.exitCode = code & 255;
    this.frames = [];
    this.say('Programme terminé avec le code de sortie ' + this.exitCode + '.', 'ok');
    var leaks = this.heap.leaks();
    if (leaks.length) {
      var tot = leaks.reduce(function (s, b) { return s + b.n; }, 0);
      this.say('Fuites mémoire : ' + U.plural(tot, 'octet') + ' dans ' + U.plural(leaks.length, 'bloc') + ' jamais libéré' + (leaks.length > 1 ? 's' : '') + ' (oubli de free).', 'warn');
    }
  };

  M.summary = function () {
    var leaks = this.heap.leaks(), tot = 0;
    leaks.forEach(function (b) { tot += b.n; });
    var allocs = this.heap.blocks.length, frees = this.heap.blocks.filter(function (b) { return b.freed; }).length;
    var bytes = this.heap.blocks.reduce(function (s, b) { return s + b.n; }, 0);
    return { allocs: allocs, frees: frees, bytes: bytes, leakBytes: tot, leaks: leaks.map(function (b) { return { addr: b.a, n: b.n, line: b.line, who: b.who }; }) };
  };

  /* --- accès mémoire vérifiés --- */
  M.regionOf = function (a) {
    for (var i = 0; i < this.regions.length; i++) { var r = this.regions[i]; if (a >= r.base && a < r.end) return r; }
    return null;
  };
  M.regionName = function (a) {
    var r = this.regionOf(a);
    return r ? { rodata: 'rodata', data: 'globale', heap: 'heap', stack: 'stack' }[r.kind] : 'hors mémoire';
  };
  M.liveVars = function () {
    var out = [];
    this.frames.forEach(function (f) { f.scopes.forEach(function (s) { s.vars.forEach(function (v) { if (!v.isStatic) out.push(v); }); }); });
    return out;
  };
  M.check = function (a, n, w) {
    if (!Number.isFinite(a)) throw new RtError('adresse invalide', 'segv');
    if (a >= 0 && a < 0x1000) throw new RtError('Segmentation fault : ' + (w ? 'écriture' : 'lecture') + ' à l’adresse ' + U.hex(a) + (a < 16 ? ' (pointeur NULL déréférencé)' : ' (pointeur presque NULL)'), 'segv',
      'Un pointeur qui vaut NULL ne pointe sur rien. Vérifie le retour de malloc / get_next_line, ou initialise ton pointeur.');
    var r = this.regionOf(a);
    if (!r || a + n > r.end) throw new RtError('Segmentation fault : ' + (w ? 'écriture' : 'lecture') + ' à l’adresse ' + U.hex(a) + ' qui n’appartient pas au programme', 'segv',
      'Ce pointeur contient une adresse invalide (non initialisé ? valeur résiduelle ?).');
    if (r.kind === 'heap') {
      var f = this.heap.find(a, n);
      if (!f.ok) {
        if (f.reason === 'freed') throw new RtError('heap-use-after-free : ' + (w ? 'écriture' : 'lecture') + ' de ' + U.plural(n, 'octet') + ' dans le bloc #' + f.b.id + ' déjà libéré (free ligne ' + f.b.freedLine + ')', 'uaf',
          'Après free(p), la mémoire ne t’appartient plus. Mets p = NULL après le free pour éviter ça.');
        if (f.reason === 'over' || f.reason === 'under') {
          var off = a - f.b.a;
          throw new RtError('heap-buffer-overflow : ' + (w ? 'écriture' : 'lecture') + ' à l’octet ' + off + ' du bloc #' + f.b.id + ' qui ne fait que ' + U.plural(f.b.n, 'octet') + ' (cases [0] à [' + (f.b.n - 1) + '])', 'overflow',
            'Tu dépasses la taille réservée par malloc. As-tu pensé au +1 pour le \\0 final ?');
        }
        throw new RtError('heap : accès à ' + U.hex(a) + ' en dehors de tout bloc alloué par malloc', 'overflow');
      }
      return r;
    }
    if (r.kind === 'stack') {
      var vs = this.liveVars();
      for (var i = 0; i < vs.length; i++) { var v = vs[i]; if (a >= v.a && a + n <= v.a + v.t.size) return r; }
      for (var j = 0; j < vs.length; j++) {
        var vv = vs[j];
        if (a < vv.a + vv.t.size + 16 && a + n > vv.a - 16)
          throw new RtError('stack-buffer-overflow : ' + (w ? 'écriture' : 'lecture') + ' à ' + U.hex(a) + ', ' + (a >= vv.a ? (a - vv.a) + ' octets après le début' : (vv.a - a) + ' octets avant le début') + ' de « ' + vv.name + ' » (' + U.plural(vv.t.size, 'octet') + ')', 'overflow',
            'Tu sors des cases du tableau « ' + vv.name + ' ». Les indices vont de 0 à taille − 1.');
      }
      if (a < this.sp) throw new RtError('stack-use-after-return : accès à ' + U.hex(a) + ', une variable locale d’une fonction déjà terminée', 'uaf',
        'Une fonction ne doit jamais renvoyer l’adresse d’une de ses variables locales : elle disparaît au return. Utilise malloc.');
      throw new RtError('accès à ' + U.hex(a) + ' dans la pile hors de toute variable', 'overflow');
    }
    if (r.kind === 'rodata') {
      if (w) throw new RtError('Segmentation fault : écriture dans une chaîne littérale (zone .rodata en lecture seule)', 'segv',
        'char *s = "abc" pointe vers une chaîne non modifiable. Pour la modifier, utilise char s[] = "abc" (copie sur la pile) ou malloc.');
      for (var k = 0; k < this.litObjs.length; k++) { var L = this.litObjs[k]; if (a >= L.a && a + n <= L.a + L.n) return r; }
      throw new RtError('global-buffer-overflow : lecture après la fin d’une chaîne littérale (' + U.hex(a) + ')', 'overflow', 'Il manque sans doute un test sur le \\0 final.');
    }
    if (r.kind === 'data') {
      var gs = this.globalVars;
      for (var g = 0; g < gs.length; g++) if (a >= gs[g].a && a + n <= gs[g].a + gs[g].t.size) return r;
      throw new RtError('global-buffer-overflow : accès à ' + U.hex(a) + ' hors des variables globales', 'overflow');
    }
    return r;
  };
  M.touch = function (a, n, w, tag) { this.acc.push({ a: a, n: n, w: !!w, tag: tag || null }); };
  M.rawLoad = function (r, a, t) {
    var o = a - r.base, dv = r.dv;
    if (t.k === 'ptr') return Number(dv.getBigUint64(o, true));
    if (t.k === 'float') return t.size === 4 ? dv.getFloat32(o, true) : dv.getFloat64(o, true);
    switch (t.size) {
      case 1: return t.signed ? dv.getInt8(o) : dv.getUint8(o);
      case 2: return t.signed ? dv.getInt16(o, true) : dv.getUint16(o, true);
      case 4: return t.signed ? dv.getInt32(o, true) : dv.getUint32(o, true);
      default: return Number(t.signed ? dv.getBigInt64(o, true) : dv.getBigUint64(o, true));
    }
  };
  M.rawStore = function (r, a, t, v) {
    var o = a - r.base, dv = r.dv;
    if (t.k === 'ptr') dv.setBigUint64(o, BigInt.asUintN(64, BigInt(Math.trunc(v))), true);
    else if (t.k === 'float') { if (t.size === 4) dv.setFloat32(o, v, true); else dv.setFloat64(o, v, true); }
    else switch (t.size) {
      case 1: dv.setUint8(o, v & 255); break;
      case 2: dv.setUint16(o, v & 0xffff, true); break;
      case 4: dv.setUint32(o, v >>> 0, true); break;
      default: dv.setBigUint64(o, BigInt.asUintN(64, BigInt(Math.trunc(v))), true);
    }
    for (var i = 0; i < t.size; i++) r.ini[o + i] = 1;
  };
  M.isInit = function (a, n) {
    var r = this.regionOf(a);
    if (!r) return true;
    for (var i = 0; i < n; i++) if (!r.ini[a - r.base + i]) return false;
    return true;
  };
  M.load = function (a, t, what) {
    var r = this.check(a, t.size, false);
    this.touch(a, t.size, false, null);
    if (!this.isInit(a, t.size)) this.warn('lecture de ' + (what || U.hex(a)) + ' non initialisé' + ' : sa valeur est indéterminée (des restes de la mémoire)');
    return this.rawLoad(r, a, t);
  };
  M.store = function (a, t, v) {
    var r = this.check(a, t.size, true);
    this.touch(a, t.size, true, null);
    this.rawStore(r, a, t, v);
    this.hintHeap(a, t, v);
  };
  M.readBytes = function (a, n) {
    if (n <= 0) return [];
    var r = this.check(a, n, false), o = a - r.base;
    this.touch(a, n, false, null);
    return Array.prototype.slice.call(r.buf, o, o + n);
  };
  M.writeBytes = function (a, bytes) {
    if (!bytes.length) return;
    var r = this.check(a, bytes.length, true), o = a - r.base;
    this.touch(a, bytes.length, true, null);
    for (var i = 0; i < bytes.length; i++) { r.buf[o + i] = bytes[i]; r.ini[o + i] = 1; }
  };
  M.cstr = function (a, max) { // lit une chaîne C jusqu'au \0 (vérifiée octet par octet)
    var out = [], lim = max === undefined ? 100000 : max;
    if (a === 0) throw new RtError('Segmentation fault : lecture d’une chaîne à l’adresse NULL', 'segv', 'Le pointeur passé vaut NULL.');
    for (var i = 0; i < lim; i++) {
      var r = this.check(a + i, 1, false), c = r.buf[a + i - r.base];
      if (!r.ini[a + i - r.base]) this.warn('chaîne non initialisée lue à ' + U.hex(a + i) + ' (pas de \\0 ?)');
      if (c === 0) break;
      out.push(c);
    }
    this.touch(a, out.length + 1, false, null);
    return out;
  };
  /* type deviné pour un bloc du tas : « int *t = malloc(...) » → cases de 4 octets */
  M.hintHeap = function (a, t, v) {
    if (t.k !== 'ptr' || !v || t.to.k === 'void') return;
    if (v < HEAP_BASE || v >= HEAP_BASE + HEAP_SIZE) return;
    var b = this.heap.at(v);
    if (b && !b.freed && (!b.hint || (b.hint === T.char && t.to !== T.char) || b.hint.k === 'void')) b.hint = t.to;
  };

  /* --- conversions --- */
  function wrap(v, size, signed) {
    if (size === 8) {
      if (Number.isSafeInteger(v) && (signed || v >= 0)) return v;
      var b = BigInt.asUintN(64, BigInt(Math.trunc(v)));
      return signed ? Number(BigInt.asIntN(64, b)) : Number(b);
    }
    if (size === 4) return signed ? v | 0 : v >>> 0;
    if (size === 2) return signed ? (v << 16) >> 16 : v & 0xffff;
    return signed ? (v << 24) >> 24 : v & 0xff;
  }
  M.conv = function (val, t) {
    var v = val.v;
    if (t.k === 'int') {
      if (val.t.k === 'float') { if (!isFinite(v)) v = 0; v = Math.trunc(v); }
      if (t === T.bool) return v ? 1 : 0;
      return wrap(v, t.size, t.signed);
    }
    if (t.k === 'float') return t.size === 4 ? Math.fround(v) : +v;
    if (t.k === 'ptr') { if (val.t.k === 'float') throw new RtError('impossible de convertir un nombre à virgule en pointeur', 'type'); return v < 0 ? Number(BigInt.asUintN(64, BigInt(v))) : v; }
    return v;
  };
  function promote(t) { return t.k === 'int' && t.size < 4 ? T.int : t; }
  function arith(a, b) {
    if (a.k === 'float' || b.k === 'float') return T.double;
    a = promote(a); b = promote(b);
    if (a.size !== b.size) return a.size > b.size ? a : b;
    return !a.signed ? a : b;
  }

  /* --- formatage d'une valeur pour les explications --- */
  M.fmt = function (val) {
    var t = val.t, v = val.v;
    if (t.k === 'ptr') {
      if (v === 0) return 'NULL';
      if (isCharT(t.to)) {
        try { var r = this.regionOf(v); if (r) { var s = []; for (var i = 0; i < 24; i++) { var o = v - r.base + i; if (o >= r.size || !r.ini[o] || !r.buf[o]) break; s.push(r.buf[o]); } return U.hex(v) + ' ' + U.quote(s, 24); } } catch (e) { /* rien */ }
      }
      return U.hex(v);
    }
    if (t.k === 'float') return String(+v.toPrecision(7));
    if (isCharT(t)) return v + " '" + U.glyph(v) + "'";
    return String(v);
  };

  /* ---------------------------------------------------------------- exécution */
  M.allocLit = function (n) {
    var key = n.bytes.join(',');
    var a = this.lits.get(key);
    if (a === undefined) {
      a = this.roNext;
      var o = a - RO_BASE;
      if (o + n.bytes.length + 1 > RO_SIZE) throw new RtError('trop de chaînes littérales', 'limit');
      for (var i = 0; i < n.bytes.length; i++) { this.ro.buf[o + i] = n.bytes[i]; this.ro.ini[o + i] = 1; }
      this.ro.buf[o + n.bytes.length] = 0; this.ro.ini[o + n.bytes.length] = 1;
      this.roNext += n.bytes.length + 1;
      this.lits.set(key, a);
      this.litObjs.push({ a: a, n: n.bytes.length + 1, bytes: n.bytes, line: n.line });
    }
    n.addr = a;
    return a;
  };
  M.allocData = function (name, t, line, fn) {
    var al = alignOf(t);
    this.dataNext = alignUp(this.dataNext, al);
    var a = this.dataNext;
    this.dataNext += t.size;
    if (this.dataNext > DATA_BASE + DATA_SIZE) throw new RtError('trop de variables globales', 'limit');
    var o = a - DATA_BASE;
    for (var i = 0; i < t.size; i++) { this.data.buf[o + i] = 0; this.data.ini[o + i] = 1; }
    var g = { name: name, t: t, a: a, line: line, global: true, fn: fn || null };
    this.globalVars.push(g);
    return g;
  };

  M.boot = function* () {
    var self = this, prog = this.prog;
    prog.strs.forEach(function (n) { self.allocLit(n); });
    for (var i = 0; i < prog.globals.length; i++) {
      var gd = prog.globals[i];
      if (this.globalVars.some(function (g) { return g.name === gd.name; })) throw new CompileError('variable globale « ' + gd.name + ' » déclarée deux fois', gd.line);
      var g = this.allocData(gd.name, gd.type, gd.line);
      this.curLine = gd.line;
      if (gd.init) yield* this.initVar(g, gd.init);
    }
    var main = prog.funcs.main;
    if (this.globalVars.length) this.say('Variables globales placées dans la zone .data (initialisées à 0 par défaut).');
    this.say('Le système appelle main() : un premier cadre est créé sur la pile (stack).', 'call');
    var args = [];
    if (main.params.length >= 1) args.push({ t: T.int, v: 1 });
    if (main.params.length >= 2) {
      var name = this.allocLit({ bytes: U.utf8('./a.out'), line: 0 });
      this.sp -= 16;
      var av = this.sp;
      this.stack.dv.setBigUint64(av - this.stack.base, BigInt(name), true);
      this.stack.dv.setBigUint64(av - this.stack.base + 8, 0n, true);
      for (var q = 0; q < 16; q++) this.stack.ini[av - this.stack.base + q] = 1;
      this.argvObj = { name: 'argv[] (système)', t: arrT(ptrT(T.char), 2), a: av, isStatic: false };
      args.push({ t: ptrT(ptrT(T.char)), v: av });
    }
    var r = yield* this.callUser(main, args, null);
    throw new Exit(r ? r.v : 0);
  };

  M.callUser = function* (fn, args, call) {
    if (this.frames.length >= 900) throw new RtError('Stack overflow : plus de 900 appels imbriqués (récursion infinie ?)', 'segv',
      'Une fonction récursive doit avoir un cas de base qui arrête les appels.');
    var frame = { name: fn.name, fn: fn, scopes: [], sp0: this.sp, id: ++this.frameSeq, ret: null };
    this.sp -= 16; // adresse de retour + rbp sauvegardé
    this.frames.push(frame);
    frame.scopes.push({ vars: [], sp: this.sp });
    if (this.argvObj && fn.name === 'main') frame.scopes[0].vars.push(this.argvObj);
    for (var i = 0; i < fn.params.length; i++) {
      var p = fn.params[i];
      var v = this.allocVar(p.name || ('param' + i), p.type, fn.line, true);
      var a = args[i];
      if (p.type.k === 'struct') this.copyStruct(v.a, a.v, p.type);
      else this.rawStore(this.stack, v.a, p.type, this.conv(a, p.type)), this.touch(v.a, p.type.size, true);
      this.hintHeap(v.a, p.type, a.v);
    }
    var c = yield* this.execBlock(fn.body, true);
    var ret;
    if (c && c.ret) ret = c.ret;
    else {
      this.curLine = fn.body.endLine;
      yield fn.body.endLine;
      if (fn.ret.k !== 'void' && fn.name !== 'main') this.warn('la fonction ' + fn.name + ' se termine sans return alors qu’elle doit renvoyer un ' + tname(fn.ret));
      ret = { t: fn.ret.k === 'void' ? T.void : fn.ret, v: 0 };
      this.say('Fin de ' + fn.name + '() : son cadre est retiré de la pile.', 'ret');
    }
    this.frames.pop();
    this.sp = frame.sp0;
    return ret;
  };

  M.allocVar = function (name, t, line, isParam) {
    var f = this.frames[this.frames.length - 1], scope = f.scopes[f.scopes.length - 1];
    if (t.size <= 0) throw new RtError('variable « ' + name + ' » de taille nulle', 'type');
    for (var i = 0; i < scope.vars.length; i++) if (scope.vars[i].name === name && !isParam) throw new CompileError('« ' + name + ' » est déjà déclarée dans ce bloc', line);
    var al = Math.max(1, Math.min(16, alignOf(t)));
    if (t.k === 'arr' && t.size >= 16) al = 16;
    this.sp = Math.floor((this.sp - t.size) / al) * al;
    if (this.sp < this.stack.base + 64) throw new RtError('Stack overflow : la pile (' + (STACK_SIZE / 1024) + ' Ko ici) est pleine', 'segv', 'Un tableau local trop grand ou une récursion trop profonde.');
    var o = this.sp - this.stack.base;
    for (var k = 0; k < t.size; k++) this.stack.ini[o + k] = 0;
    var v = { name: name, t: t, a: this.sp, line: line, param: !!isParam, frame: f.id };
    scope.vars.push(v);
    return v;
  };

  M.execBlock = function* (b, fnBody) {
    var f = this.frames[this.frames.length - 1];
    if (!fnBody) f.scopes.push({ vars: [], sp: this.sp });
    var c;
    for (var i = 0; i < b.body.length; i++) {
      c = yield* this.exec(b.body[i]);
      if (c) break;
    }
    var sc = f.scopes.pop();
    this.sp = sc.sp;
    return c;
  };

  M.at = function (line) { this.curLine = line; return line; };

  M.exec = function* (s) {
    switch (s.k) {
      case 'block': return yield* this.execBlock(s, false);
      case 'nop': return;
      case 'expr':
        yield this.at(s.line);
        var r = yield* this.rv(s.e);
        if (s.e.k !== 'assign' && s.e.k !== 'call' && s.e.k !== 'pre' && s.e.k !== 'post' && s.e.k !== 'comma') this.say('Expression évaluée (résultat ' + this.fmt(r) + ' ignoré).');
        return;
      case 'decl':
        yield this.at(s.line);
        yield* this.declItems(s);
        return;
      case 'if': {
        yield this.at(s.line);
        var c = yield* this.truth(s.c);
        this.say('Condition « ' + this.text(s.c) + ' » ' + (c ? 'vraie → on entre dans le if' : 'fausse → ' + (s.b ? 'on passe au else' : 'on saute le bloc')), c ? 'yes' : 'no');
        if (c) return yield* this.exec(s.a);
        if (s.b) return yield* this.exec(s.b);
        return;
      }
      case 'while':
        for (;;) {
          yield this.at(s.line);
          var wc = yield* this.truth(s.c);
          this.say('Condition « ' + this.text(s.c) + ' » ' + (wc ? 'vraie → un tour de boucle' : 'fausse → sortie de la boucle'), wc ? 'yes' : 'no');
          if (!wc) return;
          var wr = yield* this.exec(s.body);
          if (wr === BRK) return;
          if (wr && wr !== CNT) return wr;
        }
      case 'do':
        for (;;) {
          var dr = yield* this.exec(s.body);
          if (dr === BRK) return;
          if (dr && dr !== CNT) return dr;
          yield this.at(s.condLine);
          var dc = yield* this.truth(s.c);
          this.say('Condition « ' + this.text(s.c) + ' » ' + (dc ? 'vraie → on recommence' : 'fausse → fin du do…while'), dc ? 'yes' : 'no');
          if (!dc) return;
        }
      case 'for': {
        var f = this.frames[this.frames.length - 1];
        f.scopes.push({ vars: [], sp: this.sp });
        var res;
        yield this.at(s.line);
        if (s.init) { if (s.init.k === 'decl') yield* this.declItems(s.init); else yield* this.rv(s.init.e); }
        for (;;) {
          if (s.c) {
            var fc = yield* this.truth(s.c);
            this.say('Condition « ' + this.text(s.c) + ' » ' + (fc ? 'vraie → un tour de boucle' : 'fausse → sortie du for'), fc ? 'yes' : 'no');
            if (!fc) break;
          }
          var fr = yield* this.exec(s.body);
          if (fr === BRK) break;
          if (fr && fr !== CNT) { res = fr; break; }
          yield this.at(s.line);
          if (s.inc) yield* this.rv(s.inc);
        }
        var sc = f.scopes.pop();
        this.sp = sc.sp;
        return res;
      }
      case 'return': {
        yield this.at(s.line);
        var fn = this.frames[this.frames.length - 1].fn;
        var rv = { t: T.void, v: 0 };
        if (s.e) {
          var x = yield* this.rv(s.e);
          if (fn.ret.k === 'void') throw new CompileError('return avec une valeur dans une fonction void', s.line);
          if (fn.ret.k === 'struct') throw new RtError('renvoyer une struct par valeur n’est pas géré : renvoie un pointeur', 'type');
          rv = { t: fn.ret, v: this.conv(x, fn.ret) };
          this.checkPtrConv(x, fn.ret, 'return');
          if (fn.ret.k === 'ptr' && rv.v >= this.stack.base && rv.v < STACK_TOP) {
            var fr0 = this.frames[this.frames.length - 1], owns = false;
            fr0.scopes.forEach(function (sc2) { sc2.vars.forEach(function (v) { if (rv.v >= v.a && rv.v < v.a + v.t.size) owns = true; }); });
            if (owns) this.warn(fn.name + ' renvoie l’adresse d’une variable locale : elle sera détruite à la sortie de la fonction');
          }
        } else if (fn.ret.k !== 'void' && fn.name !== 'main') this.warn('return sans valeur dans une fonction qui renvoie ' + tname(fn.ret));
        this.say(fn.name + '() renvoie ' + (s.e ? this.fmt(rv) : 'rien') + ' : son cadre de pile est détruit.', 'ret');
        return { ret: rv };
      }
      case 'break': yield this.at(s.line); this.say('break : on sort de la boucle.'); return BRK;
      case 'continue': yield this.at(s.line); this.say('continue : on passe directement au tour suivant.'); return CNT;
      case 'switch': {
        yield this.at(s.line);
        var sv = yield* this.rv(s.e), body = s.body.body, start = -1;
        for (var i = 0; i < body.length; i++) if (body[i].k === 'case' && body[i].v === sv.v) { start = i; break; }
        if (start < 0) for (var j = 0; j < body.length; j++) if (body[j].k === 'default') { start = j; break; }
        this.say('switch sur ' + sv.v + (start < 0 ? ' : aucun case ne correspond' : ' → saut au ' + (body[start].k === 'case' ? 'case ' + body[start].v : 'default')));
        if (start < 0) return;
        var ff = this.frames[this.frames.length - 1];
        ff.scopes.push({ vars: [], sp: this.sp });
        var out;
        for (var k = start; k < body.length; k++) {
          var cr = yield* this.exec(body[k]);
          if (cr === BRK) break;
          if (cr) { out = cr; break; }
        }
        this.sp = ff.scopes.pop().sp;
        return out;
      }
      case 'case': case 'default': return;
    }
    throw new RtError('instruction inconnue ' + s.k, 'internal');
  };

  M.declItems = function* (s) {
    for (var i = 0; i < s.items.length; i++) {
      var it = s.items[i], v;
      if (it.isStatic) {
        var fnName = this.frames[this.frames.length - 1].name, key = it;
        var g = this.statics.get(key), first = !g;
        if (!g) { g = this.allocData(fnName + '::' + it.name, it.type, it.line, fnName); this.statics.set(key, g); }
        var f = this.frames[this.frames.length - 1];
        f.scopes[f.scopes.length - 1].vars.push({ name: it.name, t: g.t, a: g.a, line: it.line, isStatic: true });
        if (first && it.init) { yield* this.initVar(g, it.init); this.say('static ' + it.name + ' : stockée dans .data, initialisée une seule fois et conservée entre les appels.'); }
        else if (!first) this.say('static ' + it.name + ' existe déjà : elle garde sa valeur du dernier appel.');
        continue;
      }
      v = this.allocVar(it.name, it.type, it.line);
      if (it.init) {
        yield* this.initVar(v, it.init);
        this.say(tname(it.type) + ' ' + it.name + ' créée sur la pile à ' + U.hex(v.a) + ' (' + U.plural(it.type.size, 'octet') + ')' + this.describeVal(v), 'write');
      } else {
        this.say(tname(it.type) + ' ' + it.name + ' réservée sur la pile à ' + U.hex(v.a) + ' (' + U.plural(it.type.size, 'octet') + '), non initialisée : elle contient des restes.', 'new');
      }
    }
  };
  M.describeVal = function (v) {
    if (isScalar(v.t)) { try { return ' = ' + this.fmt({ t: v.t, v: this.rawLoad(this.stack, v.a, v.t) }); } catch (e) { return ''; } }
    if (v.t.k === 'arr' && isCharT(v.t.of)) {
      var o = v.a - this.stack.base, b = [];
      for (var i = 0; i < v.t.n && this.stack.buf[o + i]; i++) b.push(this.stack.buf[o + i]);
      return ' = ' + U.quote(b) + ' (chaque lettre dans une case, plus le \\0 final)';
    }
    return '';
  };

  M.initVar = function* (v, init) {
    if (init.k === 'init') { yield* this.initList(v.a, v.t, init, v.name); return; }
    if (v.t.k === 'arr') {
      if (init.k === 'str' && isCharT(v.t.of)) {
        var b = init.bytes.slice(0, v.t.n);
        if (init.bytes.length > v.t.n) this.warn('la chaîne "' + U.decode(init.bytes) + '" est trop longue pour ' + v.name + '[' + v.t.n + ']');
        while (b.length < v.t.n) b.push(0);
        this.writeBytes(v.a, b);
        return;
      }
      throw new CompileError('initialisation de tableau invalide (utilise { … } ou une chaîne)', init.line);
    }
    if (v.t.k === 'struct') {
      var sv = yield* this.rv(init);
      if (sv.t !== v.t) throw new CompileError('types de struct incompatibles', init.line);
      this.copyStruct(v.a, sv.v, v.t);
      return;
    }
    var r = yield* this.rv(init);
    this.checkPtrConv(r, v.t, v.name);
    this.store(v.a, v.t, this.conv(r, v.t));
  };
  M.initList = function* (a, t, list, name) {
    if (t.k === 'arr') {
      if (list.items.length > t.n) this.warn('trop de valeurs pour le tableau ' + name);
      var zero = [];
      for (var z = 0; z < t.size; z++) zero.push(0);
      this.writeBytes(a, zero);
      for (var i = 0; i < Math.min(t.n, list.items.length); i++) {
        var it = list.items[i];
        if (it.k === 'init') yield* this.initList(a + i * t.of.size, t.of, it, name);
        else if (it.k === 'str' && t.of.k === 'arr') { var b = it.bytes.slice(0, t.of.n); while (b.length < t.of.n) b.push(0); this.writeBytes(a + i * t.of.size, b); }
        else { var r = yield* this.rv(it); this.store(a + i * t.of.size, t.of, this.conv(r, t.of)); }
      }
      return;
    }
    if (t.k === 'struct') {
      var zs = [];
      for (var q = 0; q < t.size; q++) zs.push(0);
      this.writeBytes(a, zs);
      for (var j = 0; j < Math.min(t.fields.length, list.items.length); j++) {
        var f = t.fields[j], fi = list.items[j];
        if (fi.k === 'init') yield* this.initList(a + f.off, f.type, fi, name);
        else if (fi.k === 'str' && f.type.k === 'arr') { var bb = fi.bytes.slice(0, f.type.n); while (bb.length < f.type.n) bb.push(0); this.writeBytes(a + f.off, bb); }
        else { var rr = yield* this.rv(fi); this.store(a + f.off, f.type, this.conv(rr, f.type)); }
      }
      return;
    }
    if (list.items.length) { var r1 = yield* this.rv(list.items[0]); this.store(a, t, this.conv(r1, t)); }
  };
  M.copyStruct = function (dst, src, t) { this.writeBytes(dst, this.readBytes(src, t.size)); };

  M.checkPtrConv = function (r, t, what) {
    if (t.k === 'ptr' && r.t.k === 'int' && r.v !== 0) this.warn('un entier est converti en pointeur (' + what + ') : c’est presque toujours une erreur');
    if (t.k === 'int' && r.t.k === 'ptr' && t.size < 8) this.warn('un pointeur est tronqué dans un ' + tname(t) + ' (' + what + ')');
  };

  M.lookup = function (name, node) {
    var f = this.frames[this.frames.length - 1];
    if (f) for (var i = f.scopes.length - 1; i >= 0; i--) {
      var vs = f.scopes[i].vars;
      for (var j = vs.length - 1; j >= 0; j--) if (vs[j].name === name) return vs[j];
    }
    for (var k = 0; k < this.globalVars.length; k++) if (this.globalVars[k].name === name && !this.globalVars[k].fn) return this.globalVars[k];
    if (this.prog.funcs[name] || BUILTINS[name]) throw new CompileError('« ' + name + ' » est une fonction : il faut l’appeler avec des parenthèses ' + name + '(…)', node.line);
    throw new CompileError('« ' + name + ' » n’est pas déclarée (première utilisation dans ' + (f ? f.name : 'le fichier') + ')', node.line,
      'Déclare la variable avant de l’utiliser, par exemple : int ' + name + ' = 0;');
  };

  M.truth = function* (e) { var v = yield* this.rv(e); return v.v !== 0 && !(v.t.k === 'float' && isNaN(v.v)); };

  /* lvalue : { t, a } */
  M.lv = function* (e) {
    switch (e.k) {
      case 'id': { var x = this.lookup(e.name, e); return { t: x.t, a: x.a, v: x }; }
      case 'idx': {
        var base = yield* this.rv(e.a), ix = yield* this.rv(e.i);
        if (base.t.k !== 'ptr' && ix.t.k === 'ptr') { var tmp = base; base = ix; ix = tmp; }
        if (base.t.k !== 'ptr') throw new CompileError('« ' + this.text(e.a) + ' » n’est ni un tableau ni un pointeur : on ne peut pas utiliser [ ]', e.line);
        if (ix.t.k !== 'int') throw new CompileError('l’indice d’un tableau doit être un entier', e.line);
        var el = base.t.to;
        if (el.k === 'void') throw new CompileError('indice sur un void * : convertis-le d’abord (char *)', e.line);
        var arrInfo = e.a.k === 'id' ? this.lookup(e.a.name, e.a) : null;
        if (arrInfo && arrInfo.t.k === 'arr' && (ix.v < 0 || ix.v >= arrInfo.t.n))
          throw new RtError('indice ' + ix.v + ' hors du tableau ' + e.a.name + '[' + arrInfo.t.n + '] (cases valides : 0 à ' + (arrInfo.t.n - 1) + ')', 'overflow',
            'Le dernier indice d’un tableau de ' + arrInfo.t.n + ' cases est ' + (arrInfo.t.n - 1) + '.');
        return { t: el, a: base.v + ix.v * el.size, idx: ix.v, tag: this.text(e) };
      }
      case 'un':
        if (e.op === '*') {
          var p = yield* this.rv(e.a);
          if (p.t.k !== 'ptr') throw new CompileError('« *' + this.text(e.a) + ' » : on ne peut déréférencer qu’un pointeur', e.line);
          if (p.t.to.k === 'void') throw new CompileError('déréférencement d’un void * : convertis-le d’abord vers un type', e.line);
          return { t: p.t.to, a: p.v, tag: this.text(e) };
        }
        break;
      case 'mem': {
        var st, ba;
        if (e.arrow) {
          var pp = yield* this.rv(e.a);
          if (pp.t.k !== 'ptr' || pp.t.to.k !== 'struct') throw new CompileError('« -> » s’utilise sur un pointeur vers une struct', e.line);
          st = pp.t.to; ba = pp.v;
          if (ba === 0) throw new RtError('Segmentation fault : ' + this.text(e) + ' alors que ' + this.text(e.a) + ' vaut NULL', 'segv', 'Avant d’utiliser p->champ, vérifie que p != NULL.');
        } else {
          var l = yield* this.lv(e.a);
          if (l.t.k !== 'struct') throw new CompileError('« . » s’utilise sur une struct' + (l.t.k === 'ptr' ? ' (pour un pointeur, utilise ->)' : ''), e.line);
          st = l.t; ba = l.a;
        }
        if (!st.complete) throw new CompileError('struct incomplète', e.line);
        var fd = null;
        for (var i = 0; i < st.fields.length; i++) if (st.fields[i].name === e.name) fd = st.fields[i];
        if (!fd) throw new CompileError('la struct ' + tname(st) + ' n’a pas de champ « ' + e.name + ' »', e.line);
        return { t: fd.type, a: ba + fd.off, tag: this.text(e) };
      }
      case 'str': return { t: arrT(T.char, e.bytes.length + 1), a: e.addr };
    }
    throw new CompileError('« ' + this.text(e) + ' » ne désigne pas une case mémoire (impossible d’y écrire)', e.line);
  };

  M.readLv = function (l, e) {
    if (l.t.k === 'arr') return { t: ptrT(l.t.of), v: l.a };
    if (l.t.k === 'struct') return { t: l.t, v: l.a };
    var v = this.load(l.a, l.t, l.tag || this.text(e));
    if (l.tag) {
      this.acc[this.acc.length - 1].tag = l.tag;
      this.say(l.tag + ' → ' + this.fmt({ t: l.t, v: v }) + '   (lu à ' + U.hex(l.a) + ', ' + this.regionName(l.a) + (l.idx !== undefined ? ', case [' + l.idx + ']' : '') + ')', 'read');
    }
    return { t: l.t, v: v };
  };

  M.rv = function* (e) {
    switch (e.k) {
      case 'num': return { t: e.t, v: e.v };
      case 'str': return { t: ptrT(T.char), v: e.addr };
      case 'id': {
        var x = this.lookup(e.name, e);
        if (x.t.k === 'arr') return { t: ptrT(x.t.of), v: x.a };
        if (x.t.k === 'struct') return { t: x.t, v: x.a };
        return { t: x.t, v: this.load(x.a, x.t, e.name) };
      }
      case 'idx': case 'mem': { var l = yield* this.lv(e); return this.readLv(l, e); }
      case 'un': {
        if (e.op === '*') { var l2 = yield* this.lv(e); return this.readLv(l2, e); }
        if (e.op === '&') {
          var la = yield* this.lv(e.a);
          return { t: ptrT(la.t), v: la.a };
        }
        var a = yield* this.rv(e.a);
        if (e.op === '!') return { t: T.int, v: a.v ? 0 : 1 };
        if (a.t.k === 'ptr') throw new CompileError('opérateur ' + e.op + ' impossible sur un pointeur', e.line);
        var pt = a.t.k === 'float' ? T.double : promote(a.t);
        if (e.op === '-') return { t: pt, v: pt.k === 'float' ? -a.v : wrap(-a.v, pt.size, pt.signed) };
        if (e.op === '~') { if (pt.k === 'float') throw new CompileError('~ sur un nombre à virgule', e.line); return { t: pt, v: pt.size === 8 ? Number(BigInt.asIntN(64, ~BigInt(a.v))) : wrap(~a.v, pt.size, pt.signed) }; }
        return { t: pt, v: a.v };
      }
      case 'pre': case 'post': {
        var lp = yield* this.lv(e.a);
        if (lp.t.k === 'arr' || lp.t.k === 'struct') throw new CompileError(e.op + ' impossible sur un tableau', e.line);
        var old = this.load(lp.a, lp.t, this.text(e.a));
        var d = e.op === '++' ? 1 : -1, nv;
        if (lp.t.k === 'ptr') nv = old + d * (lp.t.to.k === 'void' ? 1 : lp.t.to.size);
        else nv = this.conv({ t: lp.t, v: old + d }, lp.t);
        this.store(lp.a, lp.t, nv);
        this.say(this.text(e.a) + ' ' + e.op + ' : ' + this.fmt({ t: lp.t, v: old }) + ' → ' + this.fmt({ t: lp.t, v: nv }), 'write');
        return { t: lp.t, v: e.k === 'pre' ? nv : old };
      }
      case 'assign': {
        var L = yield* this.lv(e.a);
        if (L.t.k === 'arr') throw new CompileError('on ne peut pas affecter un tableau entier avec = (copie case par case, ou utilise un pointeur)', e.line);
        if (L.v && L.v.isConst) this.warn(L.v.name + ' est const');
        var R = yield* this.rv(e.b), val;
        if (L.t.k === 'struct') {
          if (e.op !== '=' || R.t !== L.t) throw new CompileError('affectation de struct incompatible', e.line);
          this.copyStruct(L.a, R.v, L.t);
          this.say(this.text(e.a) + ' ← copie de la struct (' + U.plural(L.t.size, 'octet') + ')', 'write');
          return { t: L.t, v: L.a };
        }
        if (e.op === '=') { this.checkPtrConv(R, L.t, this.text(e.a)); val = this.conv(R, L.t); }
        else {
          var cur = { t: L.t, v: this.load(L.a, L.t, this.text(e.a)) };
          val = this.conv(this.binop(e.op.slice(0, -1), cur, R, e), L.t);
        }
        this.store(L.a, L.t, val);
        if (L.tag) this.acc[this.acc.length - 1].tag = L.tag;
        var shown = { t: L.t, v: val };
        this.say(this.text(e.a) + ' ← ' + this.fmt(shown) + '   (écrit à ' + U.hex(L.a) + ', ' + this.regionName(L.a) + (L.idx !== undefined ? ', case [' + L.idx + ']' : '') + ')', 'write');
        return shown;
      }
      case 'bin': {
        if (e.op === '&&' || e.op === '||') {
          var A = yield* this.truth(e.a);
          if (e.op === '&&' ? !A : A) return { t: T.int, v: A ? 1 : 0 };
          var B = yield* this.truth(e.b);
          return { t: T.int, v: B ? 1 : 0 };
        }
        var va = yield* this.rv(e.a), vb = yield* this.rv(e.b);
        return this.binop(e.op, va, vb, e);
      }
      case 'cond': {
        var cc = yield* this.truth(e.c);
        return yield* this.rv(cc ? e.a : e.b);
      }
      case 'call': return yield* this.call(e);
      case 'cast': {
        var cv = yield* this.rv(e.a);
        if (e.t.k === 'void') return { t: T.void, v: 0 };
        if (e.t.k === 'struct' || e.t.k === 'arr') throw new CompileError('cast vers ' + tname(e.t) + ' impossible', e.line);
        var r = { t: e.t, v: this.conv(cv, e.t) };
        if (e.t.k === 'ptr') this.hintHeap(0, e.t, r.v);
        return r;
      }
      case 'sizeof_t': return { t: T.size_t, v: e.t.size };
      case 'sizeof_e': {
        var st = this.typeOf(e.a);
        this.say('sizeof(' + this.text(e.a) + ') = ' + st.size + ' (type ' + tname(st) + ')' + (st.k === 'ptr' ? ' — attention, c’est la taille du pointeur, pas de ce qu’il pointe !' : ''));
        return { t: T.size_t, v: st.size };
      }
      case 'comma': { yield* this.rv(e.a); return yield* this.rv(e.b); }
      case 'init': throw new CompileError('{ … } ne s’utilise que pour initialiser une variable', e.line);
    }
    throw new RtError('expression non gérée (' + e.k + ')', 'internal');
  };

  M.typeOf = function (e) {
    switch (e.k) {
      case 'num': return e.t;
      case 'str': return arrT(T.char, e.bytes.length + 1);
      case 'id': return this.lookup(e.name, e).t;
      case 'idx': { var b = this.typeOf(e.a); if (b.k === 'arr') return b.of; if (b.k === 'ptr') return b.to; return T.int; }
      case 'un':
        if (e.op === '*') { var p = this.typeOf(e.a); return p.k === 'ptr' ? p.to : p.k === 'arr' ? p.of : T.int; }
        if (e.op === '&') return ptrT(this.typeOf(e.a));
        if (e.op === '!') return T.int;
        return promote(this.typeOf(e.a));
      case 'mem': {
        var s = this.typeOf(e.a);
        if (e.arrow) s = s.to;
        if (s && s.k === 'struct') for (var i = 0; i < s.fields.length; i++) if (s.fields[i].name === e.name) return s.fields[i].type;
        return T.int;
      }
      case 'cast': return e.t;
      case 'call': { var f = this.prog.funcs[e.f] || this.prog.protos[e.f]; if (f) return f.ret; var bi = BUILTINS[e.f]; return bi && bi.ret ? bi.ret : T.int; }
      case 'sizeof_t': case 'sizeof_e': return T.size_t;
      case 'assign': case 'pre': case 'post': return this.typeOf(e.a);
      case 'bin': {
        if (/^(==|!=|<|>|<=|>=|&&|\|\|)$/.test(e.op)) return T.int;
        var ta = this.typeOf(e.a), tb = this.typeOf(e.b);
        if (ta.k === 'arr') ta = ptrT(ta.of);
        if (tb.k === 'arr') tb = ptrT(tb.of);
        if (ta.k === 'ptr' && tb.k === 'ptr') return T.long;
        if (ta.k === 'ptr') return ta;
        if (tb.k === 'ptr') return tb;
        return arith(ta, tb);
      }
      case 'cond': return this.typeOf(e.a);
      case 'comma': return this.typeOf(e.b);
    }
    return T.int;
  };

  M.binop = function (op, a, b, e) {
    var ap = a.t.k === 'ptr', bp = b.t.k === 'ptr';
    if (ap || bp) {
      var esz = function (t) { return t.to.k === 'void' ? 1 : t.to.size; };
      if (op === '+' && ap && !bp) { if (b.t.k !== 'int') throw new CompileError('pointeur + nombre à virgule', e.line); return { t: a.t, v: a.v + b.v * esz(a.t) }; }
      if (op === '+' && bp && !ap) return { t: b.t, v: b.v + a.v * esz(b.t) };
      if (op === '-' && ap && !bp) return { t: a.t, v: a.v - b.v * esz(a.t) };
      if (op === '-' && ap && bp) return { t: T.long, v: Math.trunc((a.v - b.v) / esz(a.t)) };
      if (/^(==|!=|<|>|<=|>=)$/.test(op)) {
        var x = a.v, y = b.v;
        return { t: T.int, v: +(op === '==' ? x === y : op === '!=' ? x !== y : op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y) };
      }
      throw new CompileError('opération « ' + op + ' » impossible avec un pointeur', e.line);
    }
    if (a.t.k === 'struct' || b.t.k === 'struct') throw new CompileError('opération « ' + op + ' » impossible sur une struct', e.line);
    var t = arith(a.t, b.t);
    if (/^(<<|>>)$/.test(op)) t = a.t.k === 'float' ? T.double : promote(a.t);
    var x1 = this.conv(a, t), y1 = this.conv(b, t), r;
    if (t.k === 'float') {
      switch (op) {
        case '+': r = x1 + y1; break; case '-': r = x1 - y1; break; case '*': r = x1 * y1; break; case '/': r = x1 / y1; break;
        case '<': return { t: T.int, v: +(x1 < y1) }; case '>': return { t: T.int, v: +(x1 > y1) };
        case '<=': return { t: T.int, v: +(x1 <= y1) }; case '>=': return { t: T.int, v: +(x1 >= y1) };
        case '==': return { t: T.int, v: +(x1 === y1) }; case '!=': return { t: T.int, v: +(x1 !== y1) };
        default: throw new CompileError('opérateur « ' + op + ' » impossible avec des nombres à virgule', e.line);
      }
      return { t: t, v: r };
    }
    var big = t.size === 8;
    switch (op) {
      case '+': r = x1 + y1; break;
      case '-': r = x1 - y1; break;
      case '*': r = big ? x1 * y1 : Math.imul(x1, y1); if (big && !Number.isSafeInteger(r)) r = Number(BigInt.asIntN(64, BigInt(x1) * BigInt(y1))); break;
      case '/': case '%':
        if (y1 === 0) throw new RtError('Floating point exception : division ' + (op === '%' ? '(modulo) ' : '') + 'par zéro', 'fpe', 'Vérifie que le diviseur ne vaut pas 0 avant de diviser.');
        r = op === '/' ? Math.trunc(x1 / y1) : x1 % y1;
        break;
      case '<<': r = big ? Number(BigInt.asIntN(64, BigInt(x1) << BigInt(y1 & 63))) : x1 << (y1 & 31); break;
      case '>>': r = big ? Number((t.signed ? BigInt.asIntN(64, BigInt(x1)) : BigInt.asUintN(64, BigInt(x1))) >> BigInt(y1 & 63)) : (t.signed ? x1 >> (y1 & 31) : x1 >>> (y1 & 31)); break;
      case '&': r = big ? Number(BigInt.asIntN(64, BigInt(x1) & BigInt(y1))) : x1 & y1; break;
      case '|': r = big ? Number(BigInt.asIntN(64, BigInt(x1) | BigInt(y1))) : x1 | y1; break;
      case '^': r = big ? Number(BigInt.asIntN(64, BigInt(x1) ^ BigInt(y1))) : x1 ^ y1; break;
      case '<': return { t: T.int, v: +(x1 < y1) }; case '>': return { t: T.int, v: +(x1 > y1) };
      case '<=': return { t: T.int, v: +(x1 <= y1) }; case '>=': return { t: T.int, v: +(x1 >= y1) };
      case '==': return { t: T.int, v: +(x1 === y1) }; case '!=': return { t: T.int, v: +(x1 !== y1) };
      default: throw new CompileError('opérateur ' + op + ' inconnu', e.line);
    }
    var rv = wrap(r, t.size, t.signed);
    if (t.signed && rv !== r && (op === '+' || op === '-' || op === '*') && Number.isSafeInteger(r)) this.warn('dépassement de capacité (overflow) : ' + r + ' ne tient pas dans un ' + tname(t) + ', on obtient ' + rv);
    return { t: t, v: rv };
  };

  M.call = function* (e) {
    var fn = this.prog.funcs[e.f];
    var args = [];
    for (var i = 0; i < e.args.length; i++) args.push(yield* this.rv(e.args[i]));
    this.used[e.f] = (this.used[e.f] || 0) + 1;
    if (fn) {
      if (args.length !== fn.params.length && !fn.params.variadic) throw new CompileError((args.length < fn.params.length ? 'pas assez' : 'trop') + ' d’arguments pour ' + e.f + ' (' + fn.params.length + ' attendu' + (fn.params.length > 1 ? 's' : '') + ', ' + args.length + ' donné' + (args.length > 1 ? 's' : '') + ')', e.line);
      var self = this;
      this.say('Appel de ' + e.f + '(' + args.map(function (a) { return self.fmt(a); }).join(', ') + ') : un nouveau cadre est empilé sur la stack, les paramètres y sont copiés.', 'call');
      var saved = this.curLine;
      var r = yield* this.callUser(fn, args, e);
      this.curLine = saved;
      return r;
    }
    var b = BUILTINS[e.f];
    if (!b) throw new CompileError('fonction « ' + e.f + ' » inconnue (pas définie dans ton fichier)', e.line, 'Vérifie l’orthographe, ou écris cette fonction au-dessus de main.');
    if (b.n !== undefined && args.length < b.n) throw new CompileError('pas assez d’arguments pour ' + e.f + ' (' + b.n + ' attendus)', e.line);
    return b.f.call(this, args, e);
  };

  /* ---------------------------------------------------------------- bibliothèque */
  function P(v) { return { t: ptrT(T.void), v: v }; }
  function CP(v) { return { t: ptrT(T.char), v: v }; }
  function I(v) { return { t: T.int, v: v }; }
  function SZ(v) { return { t: T.size_t, v: v }; }
  var BUILTINS = {};
  function def(name, n, ret, f) { BUILTINS[name] = { n: n, ret: ret, f: f }; }

  M.malloc = function (n, who, e) {
    if (n < 0 || n > 0x20000) throw new RtError(who + '(' + n + ') : taille impossible' + (n < 0 ? ' (négative, ou size_t qui a « bouclé »)' : ' pour ce visualiseur (max 128 Ko)'), 'limit');
    var b = this.heap.alloc(n, e.line, who);
    if (!b) { this.say(who + ' échoue : le tas est plein → renvoie NULL', 'warn'); return null; }
    var o = b.a - HEAP_BASE;
    for (var i = 0; i < b.n; i++) this.heapR.ini[o + i] = 0;
    this.calls.malloc++;
    return b;
  };
  def('malloc', 1, ptrT(T.void), function (a, e) {
    var n = this.conv(a[0], T.size_t), b = this.malloc(n, 'malloc', e);
    if (!b) return P(0);
    this.touch(b.a, n, true);
    this.say('malloc(' + n + ') réserve ' + U.plural(n, 'octet') + ' sur le tas (heap) → ' + U.hex(b.a) + '. Le contenu n’est pas initialisé.', 'heap');
    return P(b.a);
  });
  def('calloc', 2, ptrT(T.void), function (a, e) {
    var n = this.conv(a[0], T.size_t) * this.conv(a[1], T.size_t), b = this.malloc(n, 'calloc', e);
    if (!b) return P(0);
    var z = []; for (var i = 0; i < n; i++) z.push(0);
    this.writeBytes(b.a, z);
    this.say('calloc réserve ' + U.plural(n, 'octet') + ' sur le tas à ' + U.hex(b.a) + ', tous mis à 0.', 'heap');
    return P(b.a);
  });
  def('realloc', 2, ptrT(T.void), function (a, e) {
    var p = a[0].v, n = this.conv(a[1], T.size_t);
    var old = p ? this.heap.at(p) : null;
    if (p && (!old || old.freed)) throw new RtError('realloc(): pointeur invalide ' + U.hex(p), 'free');
    var b = this.malloc(n, 'realloc', e);
    if (!b) return P(0);
    if (old) {
      var k = Math.min(old.n, n), bytes = [];
      for (var i = 0; i < k; i++) bytes.push(this.heapR.buf[old.a - HEAP_BASE + i]);
      this.writeBytes(b.a, bytes);
      for (var j = 0; j < k; j++) if (!this.heapR.ini[old.a - HEAP_BASE + j]) this.heapR.ini[b.a - HEAP_BASE + j] = 0;
      b.hint = old.hint; old.freed = true; old.freedLine = e.line;
    }
    this.say('realloc : nouveau bloc de ' + U.plural(n, 'octet') + ' à ' + U.hex(b.a) + (old ? ', ancien contenu copié, ancien bloc libéré' : ''), 'heap');
    return P(b.a);
  });
  def('free', 1, T.void, function (a, e) {
    var p = a[0].v;
    if (a[0].t.k !== 'ptr') throw new CompileError('free attend un pointeur', e.line);
    if (p === 0) { this.say('free(NULL) : ne fait rien (c’est autorisé).'); return { t: T.void, v: 0 }; }
    var b = this.heap.at(p);
    if (!b) {
      var f = this.heap.find(p, 1);
      if (p >= this.stack.base && p < STACK_TOP) throw new RtError('free(): invalid pointer — ' + U.hex(p) + ' est sur la pile (stack), il n’a pas été alloué par malloc', 'free', 'On ne libère que ce qui vient de malloc / calloc / strdup / get_next_line.');
      if (f.b && p > f.b.a && p < f.b.a + f.b.cap) throw new RtError('free(): invalid pointer — ' + U.hex(p) + ' pointe au milieu du bloc #' + f.b.id + ' (début à ' + U.hex(f.b.a) + ')', 'free', 'Il faut passer à free l’adresse exacte renvoyée par malloc (as-tu avancé le pointeur ?).');
      throw new RtError('free(): invalid pointer ' + U.hex(p), 'free');
    }
    if (b.freed) throw new RtError('free(): double free detected — le bloc #' + b.id + ' (' + U.hex(p) + ') a déjà été libéré ligne ' + b.freedLine, 'free', 'Après un free, mets le pointeur à NULL : free(NULL) ne fait rien.');
    b.freed = true; b.freedLine = e.line;
    this.calls.free++;
    this.touch(p, Math.max(b.n, 1), true);
    this.say('free(' + U.hex(p) + ') : le bloc #' + b.id + ' de ' + U.plural(b.n, 'octet') + ' est rendu au système. Le pointeur, lui, contient toujours l’ancienne adresse !', 'free');
    return { t: T.void, v: 0 };
  });
  M.chunks = function () {
    var out = [], cur = null;
    this.out.forEach(function (c) { if (cur && cur.fd === c.fd) cur.b = cur.b.concat(c.bytes); else out.push(cur = { fd: c.fd, b: c.bytes.slice() }); });
    return out.map(function (c) { return { fd: c.fd, s: U.decode(c.b) }; });
  };
  M.emit = function (fd, bytes) {
    this.out.push({ fd: fd, bytes: bytes });
    if (fd === 1) { for (var i = 0; i < bytes.length; i++) this.outBytes.push(bytes[i]); this._stdout = null; }
  };
  def('write', 3, T.ssize_t, function (a, e) {
    var fd = a[0].v, p = a[1].v, n = this.conv(a[2], T.size_t);
    if (fd !== 1 && fd !== 2 && !(this.fds[fd] && this.fds[fd].w)) { this.say('write sur le fd ' + fd + ' : descripteur invalide → -1', 'warn'); return { t: T.ssize_t, v: -1 }; }
    if (n > 100000) throw new RtError('write : taille ' + n + ' absurde (négative convertie en size_t ?)', 'limit');
    var bytes = this.readBytes(p, n);
    for (var i = 0; i < n; i++) if (!this.isInit(p + i, 1)) { this.warn('write envoie des octets non initialisés'); break; }
    this.emit(fd, bytes);
    this.say('write(' + fd + (fd === 1 ? ' = sortie standard' : fd === 2 ? ' = erreurs' : '') + ', ' + U.hex(p) + ', ' + n + ') affiche ' + U.quote(bytes, 40) + ' → renvoie ' + n, 'io');
    return { t: T.ssize_t, v: n };
  });
  def('read', 3, T.ssize_t, function (a, e) {
    var fd = a[0].v, p = a[1].v, n = this.conv(a[2], T.size_t), f = this.fds[fd];
    if (!f || f.w) { this.say('read sur le fd ' + fd + ' : descripteur invalide → -1', 'warn'); return { t: T.ssize_t, v: -1 }; }
    var k = Math.min(n, f.data.length - f.pos), bytes = f.data.slice(f.pos, f.pos + k);
    if (k > 0) this.check(p, n > k ? k : n, true);
    this.writeBytes(p, bytes);
    f.pos += k;
    this.say('read(' + fd + ', ' + U.hex(p) + ', ' + n + ') lit ' + U.plural(k, 'octet') + (k ? ' : ' + U.quote(bytes, 40) : ' (fin du fichier)') + ' → renvoie ' + k + '. Attention : read n’ajoute pas de \\0 !', 'io');
    return { t: T.ssize_t, v: k };
  });
  def('get_next_line', 1, ptrT(T.char), function (a, e) {
    var fd = a[0].v, f = this.fds[fd];
    if (!f || f.w) return CP(0);
    if (f.pos >= f.data.length) { this.say('get_next_line(' + fd + ') : plus rien à lire → NULL', 'io'); return CP(0); }
    var end = f.data.indexOf(10, f.pos), take = end < 0 ? f.data.length - f.pos : end + 1 - f.pos;
    var bytes = f.data.slice(f.pos, f.pos + take);
    var b = this.malloc(take + 1, 'get_next_line', e);
    this.writeBytes(b.a, bytes.concat([0]));
    b.hint = T.char;
    f.pos += take;
    this.say('get_next_line(' + fd + ') lit une ligne ' + U.quote(bytes, 40) + ', la copie dans un bloc malloc de ' + (take + 1) + ' octets à ' + U.hex(b.a) + ' → il faudra le free !', 'heap');
    return CP(b.a);
  });
  def('open', 2, T.int, function (a, e) {
    var name = U.decode(this.cstr(a[0].v));
    if (!this.files[name]) { this.say('open("' + name + '") : fichier introuvable → -1', 'warn'); return I(-1); }
    var fd = 3; while (this.fds[fd]) fd++;
    this.fds[fd] = { name: name, data: this.files[name], pos: 0 };
    this.say('open("' + name + '") → descripteur de fichier ' + fd + ' (0, 1, 2 sont déjà pris par stdin, stdout, stderr)', 'io');
    return I(fd);
  });
  def('close', 1, T.int, function (a) {
    var fd = a[0].v;
    if (fd > 2 && this.fds[fd]) { delete this.fds[fd]; this.say('close(' + fd + ') : fichier fermé', 'io'); return I(0); }
    return I(-1);
  });
  M.printfArgs = function (a, start) {
    var self = this, i = start;
    return function (kind) {
      var x = a[i++];
      if (!x) { self.warn('printf : il manque un argument pour le format'); return 0; }
      if (kind === 'double') return x.t.k === 'float' ? x.v : (self.warn('printf : %f reçoit un entier'), 0);
      if (kind === 'ptr') return x.v;
      if (x.t.k === 'float') { self.warn('printf : nombre à virgule passé à un format entier'); return 0; }
      if (kind === 'int') return x.v | 0;
      if (kind === 'uint') return x.v >>> 0;
      return x.v;
    };
  };
  def('printf', 1, T.int, function (a, e) {
    var self = this, fmt = this.cstr(a[0].v);
    var out = U.cformat(fmt, this.printfArgs(a, 1), function (p) { return self.cstr(p); });
    this.emit(1, out);
    this.say('printf affiche ' + U.quote(out, 40), 'io');
    return I(out.length);
  });
  def('dprintf', 2, T.int, function (a) {
    var self = this, fmt = this.cstr(a[1].v);
    var out = U.cformat(fmt, this.printfArgs(a, 2), function (p) { return self.cstr(p); });
    this.emit(a[0].v === 2 ? 2 : 1, out);
    this.say('dprintf affiche ' + U.quote(out, 40), 'io');
    return I(out.length);
  });
  def('putchar', 1, T.int, function (a) { var c = a[0].v & 255; this.emit(1, [c]); this.say("putchar affiche '" + U.glyph(c) + "'", 'io'); return I(c); });
  def('puts', 1, T.int, function (a) { var b = this.cstr(a[0].v).concat([10]); this.emit(1, b); this.say('puts affiche ' + U.quote(b, 40) + ' (avec un \\n ajouté)', 'io'); return I(b.length); });
  def('strlen', 1, T.size_t, function (a) { var b = this.cstr(a[0].v); this.say('strlen compte ' + b.length + ' caractères avant le \\0'); return SZ(b.length); });
  def('strcpy', 2, ptrT(T.char), function (a) { var b = this.cstr(a[1].v).concat([0]); this.writeBytes(a[0].v, b); this.say('strcpy copie ' + U.quote(b) + ' à ' + U.hex(a[0].v)); return CP(a[0].v); });
  def('strncpy', 3, ptrT(T.char), function (a) { var n = a[2].v, b = this.cstr(a[1].v).slice(0, n); while (b.length < n) b.push(0); this.writeBytes(a[0].v, b); return CP(a[0].v); });
  def('strcat', 2, ptrT(T.char), function (a) { var d = this.cstr(a[0].v), s = this.cstr(a[1].v).concat([0]); this.writeBytes(a[0].v + d.length, s); return CP(a[0].v); });
  def('strcmp', 2, T.int, function (a) {
    var x = this.cstr(a[0].v), y = this.cstr(a[1].v), i = 0;
    while (i < x.length && x[i] === y[i]) i++;
    return I((x[i] || 0) - (y[i] || 0));
  });
  def('strncmp', 3, T.int, function (a) {
    var x = this.cstr(a[0].v), y = this.cstr(a[1].v), n = a[2].v, i = 0;
    while (i < n && i < x.length && x[i] === y[i]) i++;
    return I(i >= n ? 0 : (x[i] || 0) - (y[i] || 0));
  });
  def('strdup', 1, ptrT(T.char), function (a, e) {
    var s = this.cstr(a[0].v).concat([0]), b = this.malloc(s.length, 'strdup', e);
    this.writeBytes(b.a, s); b.hint = T.char;
    this.say('strdup copie ' + U.quote(s) + ' dans un nouveau bloc du tas à ' + U.hex(b.a), 'heap');
    return CP(b.a);
  });
  def('strchr', 2, ptrT(T.char), function (a) { var s = this.cstr(a[0].v), c = a[1].v & 255; if (c === 0) return CP(a[0].v + s.length); var i = s.indexOf(c); return CP(i < 0 ? 0 : a[0].v + i); });
  def('memset', 3, ptrT(T.void), function (a) { var b = []; for (var i = 0; i < a[2].v; i++) b.push(a[1].v & 255); this.writeBytes(a[0].v, b); this.say('memset remplit ' + U.plural(a[2].v, 'octet') + ' avec ' + (a[1].v & 255)); return P(a[0].v); });
  def('bzero', 2, T.void, function (a) { var b = []; for (var i = 0; i < a[1].v; i++) b.push(0); this.writeBytes(a[0].v, b); return { t: T.void, v: 0 }; });
  def('memcpy', 3, ptrT(T.void), function (a) {
    var src = this.readBytes(a[1].v, a[2].v);
    var r = this.regionOf(a[1].v), si = [];
    if (r) for (var i = 0; i < src.length; i++) si.push(r.ini[a[1].v - r.base + i]);
    this.writeBytes(a[0].v, src);
    var rd = this.regionOf(a[0].v);
    if (rd) for (var j = 0; j < si.length; j++) if (!si[j]) rd.ini[a[0].v - rd.base + j] = 0;
    this.say('memcpy copie ' + U.plural(a[2].v, 'octet') + ' de ' + U.hex(a[1].v) + ' vers ' + U.hex(a[0].v));
    return P(a[0].v);
  });
  BUILTINS.memmove = BUILTINS.memcpy;
  def('atoi', 1, T.int, function (a) { var s = U.decode(this.cstr(a[0].v)), m = /^[\s]*([+-]?\d+)/.exec(s); return I(m ? wrap(parseInt(m[1], 10), 4, true) : 0); });
  def('abs', 1, T.int, function (a) { return I(Math.abs(a[0].v) | 0); });
  def('exit', 1, T.void, function (a) { this.say('exit(' + a[0].v + ') : le programme s’arrête immédiatement.'); throw new Exit(a[0].v); });
  [['isalpha', /[A-Za-z]/], ['isdigit', /[0-9]/], ['isalnum', /[A-Za-z0-9]/], ['isspace', /[ \t\n\v\f\r]/], ['isupper', /[A-Z]/], ['islower', /[a-z]/], ['isprint', /[ -~]/]].forEach(function (p) {
    def(p[0], 1, T.int, function (a) { return I(p[1].test(String.fromCharCode(a[0].v & 255)) ? 1 : 0); });
  });
  def('toupper', 1, T.int, function (a) { var c = a[0].v; return I(c >= 97 && c <= 122 ? c - 32 : c); });
  def('tolower', 1, T.int, function (a) { var c = a[0].v; return I(c >= 65 && c <= 90 ? c + 32 : c); });

  /* ---------------------------------------------------------------- vue mémoire */
  M.peek = function (a, t) {
    var r = this.regionOf(a);
    if (!r || a + t.size > r.end) return null;
    return this.rawLoad(r, a, t);
  };
  M.cellsOf = function (a, t, prefix, out, depth) {
    if (out.length > 400) return;
    if (t.k === 'arr') {
      var n = t.n, lim = Math.min(n, 256);
      for (var i = 0; i < lim; i++) this.cellsOf(a + i * t.of.size, t.of, prefix + '[' + i + ']', out, depth + 1);
      if (n > lim) out.push({ a: a + lim * t.of.size, n: (n - lim) * t.of.size, lbl: '…', val: '+' + (n - lim), cls: 'more' });
      return;
    }
    if (t.k === 'struct') {
      for (var f = 0; f < t.fields.length; f++) {
        var fd = t.fields[f];
        if (f > 0) { var prev = t.fields[f - 1], pend = prev.off + prev.type.size; if (fd.off > pend && !t.union) out.push({ a: a + pend, n: fd.off - pend, lbl: 'pad', val: '', cls: 'pad' }); }
        this.cellsOf(a + fd.off, fd.type, prefix + '.' + fd.name, out, depth + 1);
      }
      return;
    }
    out.push(this.cell(a, t, prefix));
  };
  M.cell = function (a, t, lbl) {
    var r = this.regionOf(a), c = { a: a, n: t.size, lbl: lbl, ty: tname(t) };
    if (!r || a + t.size > r.end) { c.val = '?'; c.cls = 'garbage'; return c; }
    var v = this.rawLoad(r, a, t), init = true, o = a - r.base;
    for (var i = 0; i < t.size; i++) if (!r.ini[o + i]) init = false;
    var bytes = Array.prototype.slice.call(r.buf, o, o + t.size);
    c.bytes = bytes;
    if (!init) c.cls = 'garbage';
    if (t.k === 'ptr') {
      c.val = v === 0 ? 'NULL' : U.hex(v);
      c.kind = 'ptr';
      if (v !== 0 && init) c.ref = v;
      if (!init) c.val = U.hex(v);
    } else if (isCharT(t)) {
      c.val = U.glyph(v); c.sub = String(v); c.kind = 'char';
      if (v === 0) c.cls = (c.cls ? c.cls + ' ' : '') + 'nul';
    } else if (t.k === 'float') { c.val = String(+v.toPrecision(6)); c.kind = 'num'; }
    else { c.val = String(v); c.kind = 'num'; }
    if (!init) c.title = 'Non initialisé : valeur résiduelle ' + c.val;
    return c;
  };
  M.view = function () {
    var self = this, regions = [];
    // pile : cadres du plus ancien (main, en haut) au plus récent
    var frames = this.frames.map(function (f, fi) {
      var objs = [];
      f.scopes.forEach(function (s) {
        s.vars.forEach(function (v) {
          var cells = [];
          self.cellsOf(v.a, v.t, '', cells, 0);
          if (cells.length === 1 && cells[0].lbl === '') cells[0].lbl = '';
          objs.push({ key: 'v' + v.a + ':' + v.name, name: v.name, type: tname(v.t), a: v.a, n: v.t.size, cells: cells, region: v.isStatic ? 'data' : 'stack', note: v.param ? 'paramètre' : v.isStatic ? 'static → .data' : '', isArr: v.t.k === 'arr' });
        });
      });
      return { title: f.name + '()', sub: fi === self.frames.length - 1 ? 'cadre actif' : 'en attente du retour', active: fi === self.frames.length - 1, objs: objs, top: f.sp0, bottom: fi === self.frames.length - 1 ? self.sp : self.frames[fi + 1].sp0 };
    });
    regions.push({ kind: 'stack', title: 'Pile (stack)', info: 'Variables locales et paramètres. Chaque appel de fonction empile un cadre ; il disparaît au return.', groups: frames, sp: this.sp });
    var hb = this.heap.blocks.filter(function (b) { return !b.freed || b.freedLine; }).slice(-40).map(function (b) {
      var cells = [], h = b.hint && b.hint.k !== 'void' ? b.hint : T.uchar;
      if (h.k === 'struct' || h.size > 1) {
        var k = Math.floor(b.n / h.size);
        for (var i = 0; i < k && cells.length < 300; i++) self.cellsOf(b.a + i * h.size, h, '[' + i + ']', cells, 0);
        if (k === 1 && h.k === 'struct') cells.forEach(function (c) { c.lbl = c.lbl.replace(/^\[0\]/, ''); });
        if (b.n % h.size) self.cellsOf(b.a + k * h.size, arrT(T.uchar, b.n % h.size), '+', cells, 0);
      } else self.cellsOf(b.a, arrT(h === T.char || h === T.schar ? T.char : T.char, Math.max(b.n, 0)), '', cells, 0);
      if (b.freed) cells.forEach(function (c) { c.cls = 'freed'; c.ref = null; });
      var status = b.freed ? 'freed' : (self.done ? 'leak' : 'live');
      return { key: 'h' + b.a, name: 'bloc #' + b.id, type: (b.hint ? tname(b.hint) + ' × ' + Math.floor(b.n / Math.max(1, b.hint.size)) : b.n + ' octets'), a: b.a, n: b.n, cap: b.cap, cells: cells, region: 'heap', status: status,
        note: b.who + '(' + b.n + ') ligne ' + b.line + (b.freed ? ' · libéré ligne ' + b.freedLine : self.done ? ' · FUITE : jamais libéré' : '') };
    });
    regions.push({ kind: 'heap', title: 'Tas (heap)', info: 'Mémoire réservée avec malloc. Elle reste jusqu’au free, même après la fin de la fonction.', groups: [{ title: '', objs: hb }], empty: 'Aucun malloc pour l’instant.' });
    var gl = this.globalVars.map(function (g) {
      var cells = [];
      self.cellsOf(g.a, g.t, '', cells, 0);
      return { key: 'g' + g.a, name: g.name, type: tname(g.t), a: g.a, n: g.t.size, cells: cells, region: 'data', note: g.fn ? 'static de ' + g.fn + '()' : 'globale' };
    });
    if (gl.length) regions.push({ kind: 'data', title: 'Globales & static (.data)', info: 'Existent pendant toute la durée du programme, initialisées à 0.', groups: [{ title: '', objs: gl }] });
    var lits = this.litObjs.filter(function (l) { return l.line; }).slice(0, 30).map(function (l) {
      var cells = [];
      self.cellsOf(l.a, arrT(T.char, l.n), '', cells, 0);
      return { key: 'r' + l.a, name: U.quote(l.bytes, 18), type: 'char[' + l.n + ']', a: l.a, n: l.n, cells: cells, region: 'rodata', note: 'ligne ' + l.line };
    });
    if (lits.length) regions.push({ kind: 'rodata', title: 'Chaînes littérales (.rodata)', info: 'Les "textes entre guillemets" : en lecture seule, toute écriture provoque un segfault.', groups: [{ title: '', objs: lits }], collapsed: true });
    return { regions: regions, acc: this.acc };
  };

  /* variable visible (pour les scènes des missions) : renvoie des octets ou une valeur */
  M.peekVar = function (name) {
    var fr = this.frames;
    for (var i = fr.length - 1; i >= 0; i--) {
      for (var s = fr[i].scopes.length - 1; s >= 0; s--) {
        var vs = fr[i].scopes[s].vars;
        for (var j = vs.length - 1; j >= 0; j--) if (vs[j].name === name) return this.varInfo(vs[j]);
      }
    }
    for (var k = 0; k < this.globalVars.length; k++) if (this.globalVars[k].name === name) return this.varInfo(this.globalVars[k]);
    return null;
  };
  M.varInfo = function (v) {
    var r = this.regionOf(v.a), o = v.a - r.base;
    var info = { t: tname(v.t), a: v.a, k: v.t.k };
    if (v.t.k === 'arr') { info.bytes = Array.prototype.slice.call(r.buf, o, o + v.t.size); info.ini = Array.prototype.slice.call(r.ini, o, o + v.t.size); info.n = v.t.n; info.es = v.t.of.size; }
    else if (isScalar(v.t)) info.v = this.rawLoad(r, v.a, v.t);
    if (v.t.k === 'ptr' && info.v) info.str = this.peekStr(info.v);
    return info;
  };
  M.peekStr = function (a) {
    var r = this.regionOf(a);
    if (!r) return null;
    var out = [];
    for (var i = 0; i < 200; i++) { var o = a - r.base + i; if (o >= r.size || r.buf[o] === 0) break; out.push(r.buf[o]); }
    return out;
  };
  M.peekI32 = function (a) { var r = this.regionOf(a); return r ? r.dv.getInt32(a - r.base, true) : 0; };
  M.peekPtr = function (a) { var r = this.regionOf(a); return r ? Number(r.dv.getBigUint64(a - r.base, true)) : 0; };

  /* ---------------------------------------------------------------- API */
  function compile(src) {
    var pp = preprocess(src);
    var toks = expandMacros(tokenize(pp.src), pp.macros);
    var p = new Parser(toks, src);
    p.program();
    if (!p.funcs.main) throw new CompileError('il manque la fonction main : le programme commence toujours par int main(void) { … }', 1);
    return { src: src, funcs: p.funcs, protos: p.protos, globals: p.globals, strs: p.strs, includes: pp.includes };
  }

  O42.engines.c = {
    name: 'C',
    create: function (src, opts) {
      var prog;
      try { prog = compile(src); }
      catch (e) {
        if (e instanceof CompileError) return { compileError: { msg: e.msg, line: e.line, hint: e.hint } };
        throw e;
      }
      return new Machine(prog, opts);
    },
    builtins: BUILTINS
  };
})(typeof window !== 'undefined' ? window : globalThis);
