/* =========================================================================
 *  42 ORIGINS — moteur assembleur x86-64 (syntaxe NASM, Linux)
 *  Assemblage en deux passes, puis exécution instruction par instruction :
 *  16 registres 64 bits (BigInt), drapeaux ZF SF CF OF, pile, sections
 *  .data/.rodata/.bss, appels système (read, write, open, close, exit),
 *  fonctions externes (malloc, free, printf, __errno_location…).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var CompileError = U.CompileError, RtError = U.RtError;

  var M64 = (1n << 64n) - 1n;
  function mask(size) { return size === 8 ? M64 : (1n << BigInt(size * 8)) - 1n; }
  function signBit(size) { return 1n << BigInt(size * 8 - 1); }
  function toSigned(v, size) { return BigInt.asIntN(size * 8, v); }
  function toU(v, size) { return BigInt.asUintN(size * 8, v); }

  /* ---------------------------------------------------------------- registres */
  var R64 = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];
  var REG = {};
  (function () {
    var r32 = ['eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi'], r16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'], r8 = ['al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil'];
    for (var i = 0; i < 16; i++) {
      REG[R64[i]] = { i: i, size: 8, name: R64[i] };
      REG[i < 8 ? r32[i] : R64[i] + 'd'] = { i: i, size: 4, name: i < 8 ? r32[i] : R64[i] + 'd' };
      REG[i < 8 ? r16[i] : R64[i] + 'w'] = { i: i, size: 2, name: i < 8 ? r16[i] : R64[i] + 'w' };
      REG[i < 8 ? r8[i] : R64[i] + 'b'] = { i: i, size: 1, name: i < 8 ? r8[i] : R64[i] + 'b' };
    }
    ['ah', 'ch', 'dh', 'bh'].forEach(function (n, i) { REG[n] = { i: i, size: 1, hi: true, name: n }; });
  })();
  var SIZEKW = { byte: 1, word: 2, dword: 4, qword: 8 };
  var DATA = { db: 1, dw: 2, dd: 4, dq: 8 }, RES = { resb: 1, resw: 2, resd: 4, resq: 8 };
  var CONDS = {
    e: 'ZF', z: 'ZF', ne: '!ZF', nz: '!ZF', g: 'G', nle: 'G', ge: 'GE', nl: 'GE', l: 'L', nge: 'L', le: 'LE', ng: 'LE',
    a: 'A', nbe: 'A', ae: '!CF', nb: '!CF', nc: '!CF', b: 'CF', nae: 'CF', c: 'CF', be: 'BE', na: 'BE', s: 'SF', ns: '!SF', o: 'OF', no: '!OF'
  };
  var COND_FR = {
    e: 'égal (ZF=1)', z: 'zéro (ZF=1)', ne: 'différent (ZF=0)', nz: 'non nul (ZF=0)', g: 'plus grand (signé)', nle: 'plus grand (signé)', ge: 'plus grand ou égal (signé)', nl: 'plus grand ou égal (signé)',
    l: 'plus petit (signé)', nge: 'plus petit (signé)', le: 'plus petit ou égal (signé)', ng: 'plus petit ou égal (signé)', a: 'au-dessus (non signé)', nbe: 'au-dessus (non signé)',
    ae: 'au-dessus ou égal (non signé)', nb: 'au-dessus ou égal', nc: 'pas de retenue (CF=0)', b: 'en dessous (non signé)', nae: 'en dessous', c: 'retenue (CF=1)', be: 'en dessous ou égal (non signé)', na: 'en dessous ou égal',
    s: 'négatif (SF=1)', ns: 'positif (SF=0)', o: 'débordement (OF=1)', no: 'pas de débordement (OF=0)'
  };
  var MNEMO_FR = {
    mov: 'copie la source dans la destination', movzx: 'copie en complétant avec des zéros', movsx: 'copie en conservant le signe', movsxd: 'copie 32→64 bits en conservant le signe',
    lea: 'calcule une adresse (sans lire la mémoire)', add: 'addition', sub: 'soustraction', inc: '+1', dec: '−1', imul: 'multiplication signée', mul: 'multiplication non signée',
    div: 'division non signée de rdx:rax', idiv: 'division signée de rdx:rax', neg: 'change le signe', not: 'inverse tous les bits', and: 'ET bit à bit', or: 'OU bit à bit', xor: 'OU exclusif bit à bit',
    shl: 'décalage à gauche (×2 par bit)', sal: 'décalage à gauche', shr: 'décalage à droite non signé (÷2 par bit)', sar: 'décalage à droite signé', cmp: 'compare (soustraction sans stocker)', test: 'ET sans stocker (pour tester)',
    jmp: 'saut inconditionnel', call: 'appel de fonction (empile l’adresse de retour)', ret: 'retour (dépile l’adresse de retour)', push: 'empile (rsp −= 8 puis écrit)', pop: 'dépile (lit puis rsp += 8)',
    syscall: 'appel système au noyau Linux', nop: 'ne fait rien', xchg: 'échange les deux opérandes', cqo: 'étend le signe de rax dans rdx', cdq: 'étend le signe de eax dans edx', cdqe: 'étend eax en rax (signé)',
    leave: 'mov rsp, rbp puis pop rbp', loop: 'rcx −= 1, saute si rcx ≠ 0', movsb: 'copie un octet [rsi] → [rdi]', stosb: 'écrit al dans [rdi]', cld: 'efface le drapeau de direction', std: 'met le drapeau de direction'
  };

  /* ---------------------------------------------------------------- expressions NASM */
  function lexExpr(s, line) {
    var out = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === ' ' || c === '\t') { i++; continue; }
      var m;
      if ((m = /^(0[xX][0-9a-fA-F_]+|[0-9][0-9a-fA-F_]*[hH]\b|0[bB][01_]+|[01_]+[bB]\b|[0-9][0-9_]*[dD]?\b|[0-9][0-9_]*)/.exec(s.slice(i)))) {
        var t = m[0].replace(/_/g, ''), v;
        if (/^0x/i.test(t)) v = BigInt(t);
        else if (/h$/i.test(t)) v = BigInt('0x' + t.slice(0, -1));
        else if (/^0b/i.test(t)) v = BigInt(t);
        else if (/^[01]+b$/i.test(t)) v = BigInt('0b' + t.slice(0, -1));
        else v = BigInt(t.replace(/d$/i, ''));
        out.push({ t: 'n', v: v }); i += m[0].length; continue;
      }
      if (c === "'" || c === '"' || c === '`') {
        var j = s.indexOf(c, i + 1);
        if (j < 0) throw new CompileError('caractère entre guillemets non fermé', line);
        var bytes = U.utf8(c === '`' ? unescapeBT(s.slice(i + 1, j)) : s.slice(i + 1, j)), val = 0n;
        for (var k = bytes.length - 1; k >= 0; k--) val = (val << 8n) | BigInt(bytes[k]);
        out.push({ t: 'n', v: val, chr: true }); i = j + 1; continue;
      }
      if ((m = /^[A-Za-z_.?@$][\w.?@$]*/.exec(s.slice(i)))) { out.push({ t: 'id', v: m[0] }); i += m[0].length; continue; }
      if (s.substr(i, 2) === '<<' || s.substr(i, 2) === '>>' || s.substr(i, 2) === '//') { out.push({ t: 'op', v: s.substr(i, 2) }); i += 2; continue; }
      if ('+-*/%()&|^~'.indexOf(c) >= 0) { out.push({ t: 'op', v: c }); i++; continue; }
      throw new CompileError('caractère inattendu « ' + c + ' » dans l’expression', line);
    }
    return out;
  }
  function unescapeBT(s) {
    return s.replace(/\\(n|t|r|0|\\|`|'|"|x[0-9a-fA-F]{2})/g, function (m, e) {
      return e === 'n' ? '\n' : e === 't' ? '\t' : e === 'r' ? '\r' : e === '0' ? '\0' : e[0] === 'x' ? String.fromCharCode(parseInt(e.slice(1), 16)) : e;
    });
  }
  /* parse en arbre ; les identifiants sont résolus plus tard */
  function parseExpr(toks, line) {
    var p = 0;
    function peek() { return toks[p]; }
    function bin(lv) {
      var LV = [['|'], ['^'], ['&'], ['<<', '>>'], ['+', '-'], ['*', '/', '%', '//']];
      if (lv >= LV.length) return unary();
      var a = bin(lv + 1);
      while (peek() && peek().t === 'op' && LV[lv].indexOf(peek().v) >= 0) { var o = toks[p++].v; a = { op: o, a: a, b: bin(lv + 1) }; }
      return a;
    }
    function unary() {
      var t = peek();
      if (!t) throw new CompileError('expression incomplète', line);
      if (t.t === 'op' && (t.v === '-' || t.v === '+' || t.v === '~')) { p++; return { op: 'u' + t.v, a: unary() }; }
      if (t.t === 'op' && t.v === '(') { p++; var e = bin(0); if (!peek() || peek().v !== ')') throw new CompileError('« ) » manquante', line); p++; return e; }
      p++;
      if (t.t === 'n') return { n: t.v };
      if (t.t === 'id') return { id: t.v };
      throw new CompileError('expression invalide', line);
    }
    var e = bin(0);
    if (p < toks.length) throw new CompileError('expression invalide près de « ' + toks[p].v + ' »', line);
    return e;
  }
  function evalExpr(e, look, line) {
    if (e.n !== undefined) return e.n;
    if (e.id !== undefined) { var v = look(e.id); if (v === undefined) throw new CompileError('symbole « ' + e.id + ' » inconnu (étiquette ou constante non définie)', line); return v; }
    var a = evalExpr(e.a, look, line);
    if (e.op === 'u-') return -a;
    if (e.op === 'u+') return a;
    if (e.op === 'u~') return ~a;
    var b = evalExpr(e.b, look, line);
    switch (e.op) {
      case '+': return a + b; case '-': return a - b; case '*': return a * b;
      case '/': case '//': if (!b) throw new CompileError('division par zéro dans une expression', line); return a / b;
      case '%': if (!b) throw new CompileError('division par zéro dans une expression', line); return a % b;
      case '<<': return a << b; case '>>': return a >> b; case '&': return a & b; case '|': return a | b; case '^': return a ^ b;
    }
    throw new CompileError('opérateur inconnu', line);
  }
  function exprIds(e, out) { if (!e) return out; if (e.id) out.push(e.id); if (e.a) exprIds(e.a, out); if (e.b) exprIds(e.b, out); return out; }

  /* découpe « a, 'b,c', [x+y] » en opérandes */
  function splitOps(s) {
    var out = [], cur = '', q = null, br = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { cur += c; if (c === q) q = null; continue; }
      if (c === "'" || c === '"' || c === '`') { q = c; cur += c; continue; }
      if (c === '[' || c === '(') br++;
      if (c === ']' || c === ')') br--;
      if (c === ',' && br === 0) { out.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim() || out.length) out.push(cur.trim());
    return out;
  }
  function stripComment(L) {
    var q = null;
    for (var i = 0; i < L.length; i++) {
      var c = L[i];
      if (q) { if (c === '\\' && q === '`') { i++; continue; } if (c === q) q = null; continue; }
      if (c === "'" || c === '"' || c === '`') q = c;
      else if (c === ';') return L.slice(0, i);
    }
    return L;
  }

  /* ---------------------------------------------------------------- assembleur */
  var SECT = { text: 0x401000, rodata: 0x402000, data: 0x403000, bss: 0x404000 };
  var SECT_SIZE = { text: 0x1000, rodata: 0x1000, data: 0x1000, bss: 0x1000 };
  var HEAP_BASE = 0x405000, HEAP_SIZE = 0x40000;
  var STACK_TOP = 0x7ffffffde000 + 0x20000, STACK_SIZE = 0x10000;
  var EXIT_MAGIC = 0x7ffff7c29d90; // « __libc_start_call_main » : adresse de retour de main
  var EXTERNS = { malloc: 1, free: 1, calloc: 1, printf: 1, puts: 1, putchar: 1, __errno_location: 1, exit: 1, strlen: 1, write: 1, read: 1, strdup: 1, strcpy: 1, strcmp: 1 };

  function assemble(src) {
    var lines = src.replace(/\r\n?/g, '\n').split('\n');
    var labels = Object.create(null), consts = Object.create(null), defines = Object.create(null);
    var sect = 'text', loc = { text: SECT.text, rodata: SECT.rodata, data: SECT.data, bss: SECT.bss };
    var ins = [], datas = [], lastGlobal = '', globals = [], externs = {}, equs = [], symList = [];
    function full(name) { return name[0] === '.' && name.slice(0, 2) !== '..' ? lastGlobal + name : name; }
    function defLabel(name, line) {
      var f = full(name);
      if (REG[f.toLowerCase()]) throw new CompileError('« ' + name + ' » est un nom de registre : choisis un autre nom d’étiquette', line);
      if (labels[f] || consts[f] !== undefined) throw new CompileError('l’étiquette « ' + f + ' » est définie deux fois', line);
      if (name[0] !== '.') lastGlobal = name;
      labels[f] = { addr: loc[sect], sect: sect, line: line, name: f };
      symList.push(labels[f]);
      return f;
    }
    for (var ln = 0; ln < lines.length; ln++) {
      var lineNo = ln + 1, raw = lines[ln], L = stripComment(raw).trim();
      if (!L) continue;
      for (var d in defines) L = L.replace(new RegExp('\\b' + d.replace(/[$.]/g, '\\$&') + '\\b', 'g'), defines[d]);
      var m;
      if ((m = /^%define\s+(\S+)\s+(.*)$/i.exec(L))) { defines[m[1]] = m[2].trim(); continue; }
      if (/^%/.test(L)) throw new CompileError('directive ' + L.split(/\s/)[0] + ' non gérée', lineNo);
      // étiquette avec deux-points
      if ((m = /^([A-Za-z_.?@$][\w.?@$]*)\s*:\s*(.*)$/.exec(L)) && !SIZEKW[m[1].toLowerCase()]) {
        defLabel(m[1], lineNo);
        L = m[2].trim();
        if (!L) continue;
      }
      var words = L.split(/\s+/), w0 = words[0].toLowerCase();
      // « nom db … » / « nom equ … » sans deux-points
      if (words.length > 1 && (DATA[words[1].toLowerCase()] || RES[words[1].toLowerCase()] || words[1].toLowerCase() === 'equ' || words[1].toLowerCase() === 'times') && !DATA[w0] && !RES[w0]) {
        if (words[1].toLowerCase() === 'equ') {
          var en = full(words[0]), ex = L.slice(L.toLowerCase().indexOf('equ') + 3).trim();
          if (!ex) throw new CompileError('equ sans valeur', lineNo);
          var tree = parseExpr(lexExpr(ex, lineNo), lineNo);
          equs.push({ name: en, tree: tree, dollar: loc[sect], line: lineNo });
          consts[en] = null;
          continue;
        }
        defLabel(words[0], lineNo);
        L = L.slice(words[0].length).trim();
        words = L.split(/\s+/); w0 = words[0].toLowerCase();
      }
      if (w0 === 'section' || w0 === 'segment') {
        var sn = (words[1] || '').toLowerCase().replace(/^\./, '');
        if (!(sn in SECT)) throw new CompileError('section « ' + words[1] + ' » inconnue (utilise .text, .data, .rodata ou .bss)', lineNo);
        sect = sn; continue;
      }
      if (w0 === 'global' || w0 === 'globl' || w0 === '.globl') { globals.push.apply(globals, L.slice(words[0].length).split(',').map(function (x) { return x.trim().split(':')[0]; })); continue; }
      if (w0 === 'extern') { L.slice(6).split(',').forEach(function (x) { externs[x.trim()] = true; }); continue; }
      if (w0 === 'bits' || w0 === 'default' || w0 === 'cpu' || w0 === 'org') continue;
      if (w0 === 'align') { var al = Number(words[1] || 8); loc[sect] = Math.ceil(loc[sect] / al) * al; continue; }
      var times = 1;
      if (w0 === 'times') {
        var tm = /^times\s+(.+?)\s+(db|dw|dd|dq|resb|resw|resd|resq|nop)\b(.*)$/i.exec(L);
        if (!tm) throw new CompileError('times mal formé (ex. times 10 db 0)', lineNo);
        times = Number(evalExpr(parseExpr(lexExpr(tm[1], lineNo), lineNo), function (id) { return consts[id] ? consts[id] : labels[id] ? BigInt(labels[id].addr) : id === '$' ? BigInt(loc[sect]) : undefined; }, lineNo));
        L = (tm[2] + ' ' + tm[3]).trim(); words = L.split(/\s+/); w0 = words[0].toLowerCase();
      }
      if (DATA[w0]) {
        if (sect === 'text') throw new CompileError('données (' + w0 + ') dans la section .text : place-les dans section .data', lineNo);
        if (sect === 'bss') throw new CompileError('.bss ne contient que des réservations (resb…), pas de valeurs : utilise section .data', lineNo);
        var unit = DATA[w0], items = splitOps(L.slice(words[0].length).trim()), parts = [];
        if (!items.length || (items.length === 1 && !items[0])) throw new CompileError(w0 + ' sans valeur', lineNo);
        items.forEach(function (it) {
          if (/^(['"`]).*\1$/.test(it) && it.length >= 2) {
            var str = it[0] === '`' ? unescapeBT(it.slice(1, -1)) : it.slice(1, -1), b = U.utf8(str);
            if (unit > 1 && b.length <= unit && b.length > 1) parts.push({ expr: parseExpr(lexExpr(it, lineNo), lineNo) });
            else { b.forEach(function (x) { parts.push({ byte: x, str: true }); }); if (unit > 1) while ((parts.length % unit)) parts.push({ byte: 0 }); }
          } else parts.push({ expr: parseExpr(lexExpr(it, lineNo), lineNo) });
        });
        var size = 0;
        parts.forEach(function (pt) { size += pt.byte !== undefined ? 1 : unit; });
        for (var t = 0; t < times; t++) {
          datas.push({ addr: loc[sect], unit: unit, parts: parts, sect: sect, line: lineNo, size: size, dollar: loc[sect] });
          loc[sect] += size;
        }
        if (loc[sect] - SECT[sect] > SECT_SIZE[sect]) throw new CompileError('section .' + sect + ' trop grande pour ce visualiseur (4 Ko max)', lineNo);
        var lastSym = symList[symList.length - 1];
        if (lastSym && lastSym.sect === sect && !lastSym.unit) lastSym.unit = unit;
        continue;
      }
      if (RES[w0]) {
        if (sect !== 'bss' && sect !== 'data') throw new CompileError(w0 + ' s’utilise dans la section .bss', lineNo);
        var cnt = Number(evalExpr(parseExpr(lexExpr(words.slice(1).join(' ') || '1', lineNo), lineNo), function (id) { return consts[id] || undefined; }, lineNo)) * times;
        datas.push({ addr: loc[sect], unit: RES[w0], res: cnt * RES[w0], sect: sect, line: lineNo, size: cnt * RES[w0] });
        loc[sect] += cnt * RES[w0];
        if (loc[sect] - SECT[sect] > SECT_SIZE[sect]) throw new CompileError('section .' + sect + ' trop grande pour ce visualiseur (4 Ko max)', lineNo);
        var ls = symList[symList.length - 1];
        if (ls && ls.sect === sect && !ls.unit) ls.unit = RES[w0];
        continue;
      }
      // instruction
      if (sect !== 'text') throw new CompileError('instruction « ' + words[0] + ' » hors de la section .text', lineNo, 'Le code s’écrit après « section .text ».');
      var mn = w0, rest = L.slice(words[0].length).trim(), prefix = null;
      if (mn === 'rep' || mn === 'repe' || mn === 'repz' || mn === 'repne' || mn === 'repnz') { prefix = mn; mn = rest.split(/\s+/)[0].toLowerCase(); rest = rest.slice(mn.length).trim(); }
      var opsTxt = rest ? splitOps(rest) : [];
      var inst = { mn: mn, prefix: prefix, opsTxt: opsTxt, line: lineNo, addr: loc.text, text: L.replace(/\s+/g, ' '), lastGlobal: lastGlobal };
      inst.ops = opsTxt.map(function (o) { return parseOperand(o, lineNo, inst); });
      validate(inst);
      inst.size = estSize(inst);
      ins.push(inst);
      for (var t2 = 1; t2 < times; t2++) { var cp = Object.assign({}, inst, { addr: loc.text + inst.size * t2 }); ins.push(cp); }
      loc.text += inst.size * times;
    }
    // constantes equ (peuvent dépendre d'étiquettes)
    function look(dollar, lg) {
      return function (id) {
        if (id === '$') return BigInt(dollar);
        if (id === '$$') return BigInt(SECT.data);
        var f = id[0] === '.' && lg ? lg + id : id;
        if (labels[f]) return BigInt(labels[f].addr);
        if (consts[f] !== undefined && consts[f] !== null) return consts[f];
        if (labels[id]) return BigInt(labels[id].addr);
        return undefined;
      };
    }
    for (var pass = 0; pass < 3; pass++) equs.forEach(function (e) { try { consts[e.name] = evalExpr(e.tree, look(e.dollar, ''), e.line); } catch (er) { if (pass === 2) throw er; } });
    // résolution des opérandes
    ins.forEach(function (inst) {
      var lk = look(inst.addr + inst.size, inst.lastGlobal);
      inst.ops.forEach(function (o) {
        if (o.k === 'imm') {
          var ids = exprIds(o.tree, []);
          ids.forEach(function (id) { var f = id[0] === '.' ? inst.lastGlobal + id : id; if (!labels[f] && consts[f] === undefined && !labels[id] && id !== '$' && id !== '$$' && (externs[id] || EXTERNS[id])) o.ext = id; });
          if (o.ext) return;
          o.v = evalExpr(o.tree, lk, inst.line);
          o.isLabel = ids.length === 1 && !!(labels[ids[0][0] === '.' ? inst.lastGlobal + ids[0] : ids[0]]) && !o.tree.op;
        } else if (o.k === 'mem') {
          o.disp = o.dtree ? evalExpr(o.dtree, lk, inst.line) : 0n;
          var di = o.dtree ? exprIds(o.dtree, []) : [];
          if (di.length) o.label = di[0][0] === '.' ? inst.lastGlobal + di[0] : di[0];
        }
      });
    });
    // données
    var bytes = { text: [], rodata: new Uint8Array(SECT_SIZE.rodata), data: new Uint8Array(SECT_SIZE.data), bss: new Uint8Array(SECT_SIZE.bss) };
    datas.forEach(function (d) {
      if (d.res) return;
      var buf = bytes[d.sect], o = d.addr - SECT[d.sect], lk = look(d.dollar, '');
      d.parts.forEach(function (pt) {
        if (pt.byte !== undefined) { buf[o++] = pt.byte; return; }
        var v = toU(evalExpr(pt.expr, lk, d.line), d.unit);
        for (var k = 0; k < d.unit; k++) { buf[o++] = Number(v & 255n); v >>= 8n; }
      });
    });
    var addrIndex = new Map();
    ins.forEach(function (x, i) { addrIndex.set(x.addr, i); });
    var entry = labels._start ? '_start' : labels.main ? 'main' : labels.ft_main ? 'ft_main' : null;
    if (!ins.length) throw new CompileError('aucune instruction : écris ton code après « section .text »', lines.length);
    if (!entry) throw new CompileError('point d’entrée introuvable : ajoute l’étiquette « _start: » (et « global _start »)', 1);
    if (labels[entry].sect !== 'text') throw new CompileError(entry + ' doit être dans la section .text', labels[entry].line);
    // tailles des symboles de données
    var syms = symList.filter(function (s) { return s.sect !== 'text'; }).sort(function (a, b) { return a.addr - b.addr; });
    syms.forEach(function (s, i) {
      var nx = syms[i + 1], end = nx && nx.sect === s.sect ? nx.addr : loc[s.sect];
      s.size = end - s.addr;
    });
    return { ins: ins, labels: labels, consts: consts, bytes: bytes, loc: loc, entry: entry, addrIndex: addrIndex, syms: syms, externs: externs, src: src, lines: lines, globals: globals };
  }

  function parseOperand(s, line, inst) {
    var t = s.trim(), m, size = null;
    if (!t) throw new CompileError('opérande vide (virgule en trop ?)', line);
    if ((m = /^(byte|word|dword|qword)\s+(?:ptr\s+)?(.*)$/i.exec(t))) { size = SIZEKW[m[1].toLowerCase()]; t = m[2].trim(); }
    t = t.replace(/\s+wrt\s+\.\.\w+$/i, '');
    var lo = t.toLowerCase();
    if (REG[lo]) { if (size && size !== REG[lo].size) throw new CompileError('taille incohérente : ' + s, line); return { k: 'reg', r: REG[lo], txt: t }; }
    if (t[0] === '[') {
      if (t[t.length - 1] !== ']') throw new CompileError('« ] » manquant dans ' + s, line);
      var inner = t.slice(1, -1).trim().replace(/^rel\s+/i, '');
      var sm = /^(byte|word|dword|qword)\s+(.*)$/i.exec(inner);
      if (sm) { size = SIZEKW[sm[1].toLowerCase()]; inner = sm[2]; }
      // découpe en termes + / -
      var terms = [], cur = '', sign = '+', depth = 0;
      for (var i = 0; i < inner.length; i++) {
        var c = inner[i];
        if (c === '(') depth++; if (c === ')') depth--;
        if ((c === '+' || c === '-') && depth === 0 && cur.trim()) { terms.push({ s: sign, t: cur.trim() }); sign = c; cur = ''; continue; }
        if ((c === '+' || c === '-') && depth === 0 && !cur.trim()) { sign = sign === c ? '+' : '-'; continue; }
        cur += c;
      }
      if (cur.trim()) terms.push({ s: sign, t: cur.trim() });
      var base = null, index = null, scale = 1, disp = [];
      terms.forEach(function (tm) {
        var x = tm.t.replace(/\s+/g, ''), xl = x.toLowerCase(), mm;
        if (REG[xl]) {
          if (REG[xl].size !== 8) throw new CompileError('dans [ ], utilise des registres 64 bits (rax, rsi…) et non ' + x, line);
          if (tm.s === '-') throw new CompileError('on ne peut pas soustraire un registre dans une adresse', line);
          if (!base) base = REG[xl]; else if (!index) index = REG[xl]; else throw new CompileError('trop de registres dans l’adresse ' + s, line);
          return;
        }
        if ((mm = /^([a-z0-9]+)\*(\d+)$/i.exec(x)) && REG[mm[1].toLowerCase()] || (mm = /^(\d+)\*([a-z0-9]+)$/i.exec(x)) && REG[mm[2].toLowerCase()]) {
          var rn = REG[mm[1].toLowerCase()] ? mm[1] : mm[2], sc = Number(REG[mm[1].toLowerCase()] ? mm[2] : mm[1]);
          if ([1, 2, 4, 8].indexOf(sc) < 0) throw new CompileError('le facteur d’échelle doit être 1, 2, 4 ou 8', line);
          if (index) throw new CompileError('un seul registre index par adresse', line);
          index = REG[rn.toLowerCase()]; scale = sc;
          return;
        }
        disp.push(tm.s + '(' + tm.t + ')');
      });
      var dtree = disp.length ? parseExpr(lexExpr(disp.join(''), line), line) : null;
      return { k: 'mem', base: base, index: index, scale: scale, dtree: dtree, size: size, txt: s.trim() };
    }
    if (/^(byte|word|dword|qword)$/i.test(t)) throw new CompileError('opérande incomplète : ' + s, line);
    var tree = parseExpr(lexExpr(t, line), line);
    return { k: 'imm', tree: tree, size: size, txt: t };
  }

  var KNOWN = {};
  ('mov movzx movsx movsxd lea add sub adc sbb inc dec imul mul div idiv neg not and or xor shl sal shr sar rol ror cmp test jmp call ret push pop syscall nop xchg cqo cdq cdqe cwd leave loop ' +
   'movsb stosb lodsb scasb cmpsb cld std int hlt').split(' ').forEach(function (k) { KNOWN[k] = 1; });
  function condOf(mn, pre) { return mn.indexOf(pre) === 0 && CONDS[mn.slice(pre.length)] ? mn.slice(pre.length) : null; }
  function validate(x) {
    var mn = x.mn, ops = x.ops, n = ops.length;
    var isJ = condOf(mn, 'j'), isSet = condOf(mn, 'set'), isCmov = condOf(mn, 'cmov');
    if (!KNOWN[mn] && !isJ && !isSet && !isCmov) throw new CompileError('instruction « ' + mn + ' » inconnue', x.line, /^(print|printf|echo|write)$/.test(mn) ? 'En assembleur on affiche avec l’appel système write (rax = 1, puis syscall).' : '');
    function need(k, why) { if (n !== k) throw new CompileError(mn + ' attend ' + k + ' opérande' + (k > 1 ? 's' : '') + (why ? ' (' + why + ')' : '') + ', ' + n + ' donnée' + (n > 1 ? 's' : ''), x.line); }
    var two = { mov: 1, add: 1, sub: 1, adc: 1, sbb: 1, and: 1, or: 1, xor: 1, cmp: 1, test: 1, xchg: 1, lea: 1, movzx: 1, movsx: 1, movsxd: 1 };
    if (two[mn] || isCmov) {
      need(2, 'destination, source');
      var d = ops[0], s = ops[1];
      if (d.k === 'imm') throw new CompileError('la destination de ' + mn + ' ne peut pas être une constante', x.line, 'Le premier opérande reçoit le résultat : ce doit être un registre ou une case mémoire.');
      if (d.k === 'mem' && s.k === 'mem') throw new CompileError(mn + ' ne peut pas avoir deux opérandes mémoire', x.line, 'Le processeur ne copie pas directement mémoire → mémoire : passe par un registre (mov rax, [a] puis mov [b], rax).');
      if (mn === 'lea') { if (d.k !== 'reg' || s.k !== 'mem') throw new CompileError('lea s’écrit : lea registre, [adresse]', x.line); return; }
      if (mn === 'movzx' || mn === 'movsx' || mn === 'movsxd') {
        if (d.k !== 'reg') throw new CompileError(mn + ' : la destination doit être un registre', x.line);
        if (s.k === 'mem' && !s.size) throw new CompileError(mn + ' : précise la taille de la source (byte [ … ] ou word [ … ])', x.line);
        return;
      }
      if (d.k === 'reg' && s.k === 'reg' && d.r.size !== s.r.size) throw new CompileError('tailles différentes : ' + d.r.name + ' (' + d.r.size * 8 + ' bits) et ' + s.r.name + ' (' + s.r.size * 8 + ' bits)', x.line,
        'Les deux opérandes doivent avoir la même taille. Pour copier un petit registre dans un grand : movzx.');
      if (d.k === 'mem' && s.k === 'reg' && d.size && d.size !== s.r.size) throw new CompileError('taille incohérente entre ' + d.txt + ' et ' + s.r.name, x.line);
      if (s.k === 'mem' && d.k === 'reg' && s.size && s.size !== d.r.size) throw new CompileError('taille incohérente entre ' + d.r.name + ' et ' + s.txt, x.line);
      if (d.k === 'mem' && s.k === 'imm' && !d.size) throw new CompileError('taille de l’opération non précisée pour ' + mn + ' ' + d.txt + ', …', x.line, 'Le processeur ne sait pas combien d’octets écrire : précise byte [ … ], word, dword ou qword.');
      if (mn === 'xchg' && s.k === 'imm') throw new CompileError('xchg échange deux emplacements, pas une constante', x.line);
      return;
    }
    if (/^(inc|dec|neg|not|mul|div|idiv|push|pop)$/.test(mn)) {
      need(1);
      if (ops[0].k === 'mem' && !ops[0].size && mn !== 'push' && mn !== 'pop') throw new CompileError(mn + ' ' + ops[0].txt + ' : précise la taille (byte, word, dword ou qword)', x.line);
      if (mn === 'pop' && ops[0].k === 'imm') throw new CompileError('pop a besoin d’un registre ou d’une case mémoire', x.line);
      if ((mn === 'push' || mn === 'pop') && ops[0].k === 'reg' && ops[0].r.size !== 8 && ops[0].r.size !== 2) throw new CompileError(mn + ' ' + ops[0].r.name + ' : en 64 bits on empile des registres 64 bits (ex. ' + R64[ops[0].r.i] + ')', x.line);
      if (ops[0].k === 'imm' && mn !== 'push') throw new CompileError(mn + ' ne s’applique pas à une constante', x.line);
      return;
    }
    if (mn === 'imul') { if (n < 1 || n > 3) need(2); if (n >= 2 && ops[0].k !== 'reg') throw new CompileError('imul : la destination doit être un registre', x.line); return; }
    if (/^(shl|sal|shr|sar|rol|ror)$/.test(mn)) {
      if (n === 1) { ops.push({ k: 'imm', tree: { n: 1n }, txt: '1' }); return; }
      need(2);
      if (ops[1].k === 'reg' && ops[1].r.name !== 'cl') throw new CompileError('le nombre de décalages doit être une constante ou le registre cl', x.line);
      if (ops[1].k === 'mem') throw new CompileError('le nombre de décalages doit être une constante ou cl', x.line);
      if (ops[0].k === 'mem' && !ops[0].size) throw new CompileError('précise la taille de ' + ops[0].txt, x.line);
      return;
    }
    if (mn === 'jmp' || mn === 'call' || isJ || mn === 'loop') { need(1, 'une étiquette'); return; }
    if (isSet) { need(1); if (ops[0].k === 'reg' && ops[0].r.size !== 1) throw new CompileError(mn + ' écrit un octet : utilise al, bl, cl…', x.line); return; }
    if (mn === 'int') { need(1); return; }
    if (/^(ret|syscall|nop|cqo|cdq|cdqe|cwd|leave|movsb|stosb|lodsb|scasb|cmpsb|cld|std|hlt)$/.test(mn)) { if (n && mn !== 'ret') need(0); return; }
  }
  function estSize(x) {
    var mn = x.mn, o = x.ops;
    if (/^(ret|nop|leave|cld|std|movsb|stosb|lodsb|scasb|cmpsb|cdq|cwd|hlt)$/.test(mn)) return x.prefix ? 2 : 1;
    if (mn === 'syscall' || mn === 'cqo' || mn === 'cdqe' || mn === 'int') return 2;
    if (mn === 'push' || mn === 'pop') return o[0] && o[0].k === 'reg' ? (o[0].r.i >= 8 ? 2 : 1) : 5;
    if (mn === 'call' || mn === 'jmp') return 5;
    if (mn[0] === 'j' || mn === 'loop') return 2;
    var sz = 3;
    o.forEach(function (op) { if (op.k === 'mem') sz += op.dtree ? 4 : 1; if (op.k === 'imm') sz += 4; });
    return Math.min(sz, 10);
  }

  /* ---------------------------------------------------------------- mémoire */
  function Region(name, kind, base, size, init) {
    this.name = name; this.kind = kind; this.base = base; this.size = size; this.end = base + size;
    this.buf = init ? init : new Uint8Array(size);
    this.ini = new Uint8Array(size);
    this.ro = kind === 'rodata' || kind === 'text';
  }

  /* ---------------------------------------------------------------- machine */
  function Exit(code) { this.code = code; }
  function Machine(prog, opts) {
    opts = opts || {};
    this.prog = prog; this.src = prog.src;
    this.regs = []; for (var i = 0; i < 16; i++) this.regs.push(0n);
    this.flags = { CF: 0, ZF: 0, SF: 0, OF: 0, DF: 0 };
    var rnd = U.rng(77);
    this.text = new Region('.text', 'text', SECT.text, SECT_SIZE.text);
    this.rodata = new Region('.rodata', 'rodata', SECT.rodata, SECT_SIZE.rodata, prog.bytes.rodata.slice());
    this.data = new Region('.data', 'data', SECT.data, SECT_SIZE.data, prog.bytes.data.slice());
    this.bss = new Region('.bss', 'bss', SECT.bss, SECT_SIZE.bss, prog.bytes.bss.slice());
    this.heapR = new Region('heap', 'heap', HEAP_BASE, HEAP_SIZE);
    for (var h = 0; h < HEAP_SIZE; h++) this.heapR.buf[h] = (rnd() >>> 7) & 255;
    this.stack = new Region('stack', 'stack', STACK_TOP - STACK_SIZE, STACK_SIZE);
    for (var s2 = 0; s2 < STACK_SIZE; s2++) this.stack.buf[s2] = 0;
    [this.rodata, this.data, this.bss].forEach(function (r) { r.ini.fill(1); });
    this.stack.ini.fill(1);
    this.regions = [this.text, this.rodata, this.data, this.bss, this.heapR, this.stack];
    this.heap = new U.Heap(HEAP_BASE, HEAP_SIZE);
    this.errnoAddr = SECT.bss + SECT_SIZE.bss - 8;
    this.stdinBytes = U.utf8(opts.stdin || '');
    this.files = {};
    var fs = opts.files || {};
    for (var k in fs) this.files[k] = U.utf8(fs[k]);
    this.fds = { 0: { name: 'stdin', data: this.stdinBytes, pos: 0 }, 1: { w: true }, 2: { w: true } };
    this.outBytes = []; this.out = []; this._stdout = null;
    this.steps = 0; this.maxSteps = opts.maxSteps || 200000;
    this.done = false; this.error = null; this.exitCode = null; this.warnings = [];
    this.log = []; this.acc = []; this.callDepth = 0; this.used = {};
    this.retMarks = new Map();
    // pile initiale : argc, argv[0], NULL, envp NULL
    var sp = STACK_TOP - 0x110;
    this.regs[4] = BigInt(sp);
    this.w64(sp, 1n); this.w64(sp + 8, BigInt(STACK_TOP - 0x20)); this.w64(sp + 16, 0n); this.w64(sp + 24, 0n);
    var prog0 = U.utf8('./a.out\0');
    for (var q = 0; q < prog0.length; q++) this.stack.buf[STACK_TOP - 0x20 - this.stack.base + q] = prog0[q];
    this.spTop = sp;
    this.entry = prog.entry;
    if (prog.entry === 'main' || prog.entry === 'ft_main') {
      this.regs[4] -= 8n;
      this.w64(Number(this.regs[4]), BigInt(EXIT_MAGIC));
      this.retMarks.set(Number(this.regs[4]), 'retour vers la libc (fin du programme)');
      this.regs[7] = 1n; this.regs[6] = BigInt(sp + 8);
    }
    this.rip = prog.addrIndex.get(prog.labels[prog.entry].addr);
    this.prevRegs = this.regs.slice();
    this.prevFlags = Object.assign({}, this.flags);
    this.cpu = { last: null };
    this.line = prog.ins[this.rip].line;
    this.say('Programme chargé : le code dans .text, les données dans .data/.bss. Le processeur démarre à « ' + prog.entry + ' » (rip = ' + U.hex(prog.ins[this.rip].addr) + ').', 'call');
    if (prog.entry === 'main') this.say('main est appelée par la libc : l’adresse de retour est déjà sur la pile.', 'call');
  }
  var M = Machine.prototype;
  Object.defineProperty(M, 'stdout', { get: function () { if (this._stdout === null) this._stdout = U.decode(this.outBytes); return this._stdout; } });
  Object.defineProperty(M, 'depth', { get: function () { return this.callDepth; } });
  M.say = function (t, c) { if (this.log.length < 14) this.log.push({ t: t, c: c || '' }); };
  M.warn = function (t) { this.say('⚠ ' + t, 'warn'); if (this.warnings.length < 30 && !this.warnings.some(function (w) { return w.msg === t; })) this.warnings.push({ msg: t, line: this.line }); };
  M.chunks = function () {
    var out = [], cur = null;
    this.out.forEach(function (c) { if (cur && cur.fd === c.fd) cur.b = cur.b.concat(c.bytes); else out.push(cur = { fd: c.fd, b: c.bytes.slice() }); });
    return out.map(function (c) { return { fd: c.fd, s: U.decode(c.b) }; });
  };
  M.emit = function (fd, bytes) { this.out.push({ fd: fd, bytes: bytes }); if (fd === 1) { Array.prototype.push.apply(this.outBytes, bytes); this._stdout = null; } };

  M.regionOf = function (a) { for (var i = 0; i < this.regions.length; i++) { var r = this.regions[i]; if (a >= r.base && a < r.end) return r; } return null; };
  M.check = function (a, n, w) {
    if (a >= 0 && a < 0x1000) throw new RtError('Segmentation fault : ' + (w ? 'écriture' : 'lecture') + ' à l’adresse ' + U.hex(a) + (a === 0 ? ' (pointeur NULL)' : ''), 'segv', 'Le registre utilisé comme adresse vaut (presque) 0 : a-t-il bien été initialisé ?');
    var r = this.regionOf(a);
    if (!r || a + n > r.end) throw new RtError('Segmentation fault : ' + (w ? 'écriture' : 'lecture') + ' à l’adresse ' + U.hex(a) + ' qui n’appartient pas au programme', 'segv', 'Ce registre ne contient pas une adresse valide. Utilise lea / une étiquette pour obtenir une adresse.');
    if (w && r.ro) throw new RtError('Segmentation fault : écriture dans ' + r.name + ' (lecture seule)', 'segv', r.kind === 'text' ? 'On ne peut pas écrire dans le code.' : 'Les données de .rodata ne sont pas modifiables : place-les dans .data.');
    if (r.kind === 'text' && !w) throw new RtError('lecture dans .text : ce visualiseur ne lit pas le code machine', 'segv');
    if (r.kind === 'heap') {
      var f = this.heap.find(a, n);
      if (!f.ok) {
        if (f.reason === 'freed') throw new RtError('heap-use-after-free : accès au bloc #' + f.b.id + ' déjà libéré', 'uaf', 'Après free, ce bloc ne t’appartient plus.');
        if (f.b) throw new RtError('heap-buffer-overflow : accès à l’octet ' + (a - f.b.a) + ' d’un bloc de ' + f.b.n + ' octets', 'overflow', 'As-tu réservé assez d’octets avec malloc (sans oublier le \\0) ?');
        throw new RtError('accès au tas hors de tout bloc malloc (' + U.hex(a) + ')', 'overflow');
      }
    }
    if (r.kind === 'stack' && a < Number(this.regs[4]) - 128) this.warn('accès sous rsp (' + U.hex(a) + ') : cette zone de pile n’est pas réservée (fais sub rsp, N avant)');
    return r;
  };
  M.rd = function (a, n, tag) {
    var r = this.check(a, n, false), o = a - r.base, v = 0n;
    for (var i = n - 1; i >= 0; i--) v = (v << 8n) | BigInt(r.buf[o + i]);
    this.acc.push({ a: a, n: n, w: false, v: v, tag: tag || null });
    return v;
  };
  M.wr = function (a, n, v, tag) {
    var r = this.check(a, n, true), o = a - r.base, x = toU(v, n);
    for (var i = 0; i < n; i++) { r.buf[o + i] = Number(x & 255n); r.ini[o + i] = 1; x >>= 8n; }
    this.acc.push({ a: a, n: n, w: true, v: toU(v, n), tag: tag || null });
  };
  M.w64 = function (a, v) { var r = this.regionOf(a), o = a - r.base, x = toU(v, 8); for (var i = 0; i < 8; i++) { r.buf[o + i] = Number(x & 255n); x >>= 8n; } };
  M.peek = function (a, n) { var r = this.regionOf(a); if (!r || a + n > r.end) return null; var o = a - r.base, v = 0n; for (var i = n - 1; i >= 0; i--) v = (v << 8n) | BigInt(r.buf[o + i]); return v; };
  M.cstr = function (a) {
    var out = [];
    for (var i = 0; i < 65536; i++) { var r = this.check(a + i, 1, false), c = r.buf[a + i - r.base]; if (!c) break; out.push(c); }
    this.acc.push({ a: a, n: out.length + 1, w: false });
    return out;
  };
  M.bytesAt = function (a, n) { var r = this.check(a, n, false), o = a - r.base; this.acc.push({ a: a, n: n, w: false }); return Array.prototype.slice.call(r.buf, o, o + n); };

  /* registres */
  M.getReg = function (r) {
    var v = this.regs[r.i];
    if (r.hi) return (v >> 8n) & 255n;
    return v & mask(r.size);
  };
  M.setReg = function (r, v) {
    v = toU(v, r.size);
    var cur = this.regs[r.i];
    if (r.size === 8) this.regs[r.i] = v;
    else if (r.size === 4) this.regs[r.i] = v; // écrire 32 bits remet à zéro les 32 bits du haut
    else if (r.hi) this.regs[r.i] = (cur & ~(255n << 8n)) | (v << 8n);
    else this.regs[r.i] = (cur & ~mask(r.size)) | v;
    this.regs[r.i] = toU(this.regs[r.i], 8);
  };
  M.addrOf = function (o) {
    var a = o.disp || 0n;
    if (o.base) a += this.regs[o.base.i];
    if (o.index) a += this.regs[o.index.i] * BigInt(o.scale);
    return Number(toU(a, 8));
  };
  M.opSize = function (ins) {
    var s = 0;
    ins.ops.forEach(function (o) { if (o.k === 'reg' && !s) s = o.r.size; if (o.k === 'mem' && o.size && !s) s = o.size; });
    return s || 8;
  };
  M.read = function (o, size) {
    if (o.k === 'reg') return this.getReg(o.r);
    if (o.k === 'imm') { if (o.ext) throw new RtError('« ' + o.ext + ' » est une fonction externe : on l’appelle avec call', 'type'); return toU(o.v, size); }
    return this.rd(this.addrOf(o), o.size || size, o.txt);
  };
  M.write = function (o, size, v) {
    if (o.k === 'reg') return this.setReg(o.r, v);
    this.wr(this.addrOf(o), o.size || size, v, o.txt);
  };

  M.setZS = function (r, size) { this.flags.ZF = r === 0n ? 1 : 0; this.flags.SF = (r & signBit(size)) ? 1 : 0; };
  M.cond = function (c) {
    var f = this.flags, k = CONDS[c];
    switch (k) {
      case 'ZF': return !!f.ZF; case '!ZF': return !f.ZF; case 'CF': return !!f.CF; case '!CF': return !f.CF;
      case 'SF': return !!f.SF; case '!SF': return !f.SF; case 'OF': return !!f.OF; case '!OF': return !f.OF;
      case 'G': return !f.ZF && f.SF === f.OF; case 'GE': return f.SF === f.OF; case 'L': return f.SF !== f.OF; case 'LE': return !!f.ZF || f.SF !== f.OF;
      case 'A': return !f.CF && !f.ZF; case 'BE': return !!f.CF || !!f.ZF;
    }
    return false;
  };

  M.push = function (v, tag) { this.regs[4] = toU(this.regs[4] - 8n, 8); var a = Number(this.regs[4]); if (a < this.stack.base + 64) throw new RtError('Stack overflow : la pile est pleine (récursion infinie ?)', 'segv'); this.wr(a, 8, v, tag || '[rsp]'); return a; };
  M.pop = function () { var a = Number(this.regs[4]); if (a >= STACK_TOP) throw new RtError('pop sur une pile vide : plus rien à dépiler', 'segv', 'Chaque pop doit correspondre à un push.'); var v = this.rd(a, 8, '[rsp]'); this.regs[4] = toU(this.regs[4] + 8n, 8); return v; };

  M.jumpTo = function (target, ins) {
    var idx = this.prog.addrIndex.get(Number(target));
    if (idx === undefined) throw new RtError('saut vers ' + U.hex(target) + ' qui n’est pas une instruction', 'segv');
    this.nextRip = idx;
  };
  M.fmtV = function (v, size) {
    size = size || 8;
    var s = toSigned(v, size);
    var lab = this.symAt(Number(v));
    if (lab) return U.hex(v) + ' (' + lab + ')';
    if (s >= -100000n && s <= 1000000n) return s.toString() + (s >= 32n && s < 127n ? " '" + String.fromCharCode(Number(s)) + "'" : '');
    return U.hex(v);
  };
  M.symAt = function (a) {
    var ss = this.prog.syms;
    for (var i = 0; i < ss.length; i++) { var s = ss[i]; if (a >= s.addr && a < s.addr + Math.max(1, s.size)) return a === s.addr ? s.name : s.name + '+' + (a - s.addr); }
    return null;
  };

  M.step = function () {
    if (this.done) return false;
    this.steps++;
    this.log = []; this.acc = [];
    this.prevRegs = this.regs.slice();
    this.prevFlags = Object.assign({}, this.flags);
    if (this.steps > this.maxSteps) {
      this.done = true;
      this.error = { msg: 'Plus de ' + this.maxSteps + ' instructions exécutées : boucle infinie ?', kind: 'timeout', line: this.line, hint: 'Ta condition de sortie (cmp + saut) est-elle un jour vérifiée ?' };
      return false;
    }
    var ins = this.prog.ins[this.rip];
    if (!ins) { this.crash(new RtError('Segmentation fault : le processeur est sorti de ton code (rip = ' + U.hex(this.ripAddr()) + ')', 'segv', 'Un programme assembleur ne s’arrête pas tout seul à la fin : termine-le avec l’appel système exit (mov rax, 60 / mov rdi, 0 / syscall).')); return false; }
    this.cur = ins;
    this.nextRip = this.rip + 1;
    this.cpu.last = { ins: ins, alu: null, jump: null, mem: null, sys: null };
    try {
      this.exec(ins);
      this.rip = this.nextRip;
      var nx = this.prog.ins[this.rip];
      this.line = nx ? nx.line : ins.line;
      if (!nx && !this.done) this.crash(new RtError('Segmentation fault : après la dernière instruction, le processeur continue dans le vide', 'segv', 'Termine le programme avec un appel système exit (rax = 60, rdi = code, syscall).'));
    } catch (e) {
      if (e instanceof Exit) { this.finish(e.code); return false; }
      if (e instanceof RtError || e instanceof CompileError) { this.crash(e); return false; }
      throw e;
    }
    this.cpu.last.mem = this.acc.slice();
    return !this.done;
  };
  M.ripAddr = function () { var i = this.prog.ins[this.rip]; return i ? i.addr : this.prog.loc.text; };
  M.crash = function (e) {
    this.done = true;
    this.error = { msg: e.msg, kind: e.kind || 'runtime', line: this.cur ? this.cur.line : this.line, hint: e.hint };
    this.line = this.error.line;
    this.say('✖ ' + e.msg, 'err');
  };
  M.finish = function (code) {
    this.done = true;
    this.exitCode = Number(code & 255n);
    this.say('Le programme se termine avec le code de sortie ' + this.exitCode + '.', 'ok');
    var lk = this.heap.leaks();
    if (lk.length) this.say('Fuites mémoire : ' + U.plural(lk.length, 'bloc') + ' malloc jamais libéré' + (lk.length > 1 ? 's' : '') + '.', 'warn');
  };
  M.summary = function () {
    var leaks = this.heap.leaks(), tot = 0;
    leaks.forEach(function (b) { tot += b.n; });
    return { allocs: this.heap.blocks.length, frees: this.heap.blocks.length - leaks.length, bytes: this.heap.blocks.reduce(function (s, b) { return s + b.n; }, 0), leakBytes: tot, leaks: leaks.map(function (b) { return { addr: b.a, n: b.n, line: b.line, who: b.who }; }) };
  };

  M.alu = function (op, a, b, r, size, sym) { this.cpu.last.alu = { op: op, a: a, b: b, r: r, size: size, sym: sym }; };

  M.exec = function (ins) {
    var mn = ins.mn, o = ins.ops, self = this, size = this.opSize(ins), a, b, r, d, desc = MNEMO_FR[mn] || '';
    var c;
    switch (mn) {
      case 'mov': {
        if (o[1].k === 'imm' && o[1].ext) throw new RtError('« ' + o[1].ext + ' » est une fonction externe', 'type');
        if (o[0].k === 'reg' && o[0].r.size === 8 && o[1].k === 'imm') { a = toU(o[1].v, 8); }
        else a = this.read(o[1], size);
        this.write(o[0], size, a);
        this.say('mov ' + o[0].txt + ', ' + o[1].txt + ' : ' + o[0].txt + ' ← ' + this.fmtV(a, size) + (o[1].k === 'mem' ? '   (lu en mémoire à ' + U.hex(this.addrOf(o[1])) + ')' : '') + (o[0].k === 'mem' ? '   (écrit en mémoire à ' + U.hex(this.addrOf(o[0])) + ')' : '') + (o[0].k === 'reg' && o[0].r.size === 4 ? ' — écrire un registre 32 bits met à 0 les 32 bits du haut' : ''), o[0].k === 'mem' ? 'write' : 'read');
        if (o[1].k === 'imm' && o[1].isLabel && o[0].k === 'reg') this.say('C’est l’ADRESSE de l’étiquette qui est copiée, pas son contenu (pour le contenu : [' + o[1].txt + ']).');
        return;
      }
      case 'movzx': case 'movsx': case 'movsxd': {
        var ss = o[1].k === 'reg' ? o[1].r.size : o[1].size || (mn === 'movsxd' ? 4 : 1);
        a = this.read(o[1], ss);
        r = mn === 'movzx' ? a : toU(toSigned(a, ss), o[0].r.size);
        this.setReg(o[0].r, r);
        this.say(mn + ' : ' + o[0].txt + ' ← ' + this.fmtV(r, o[0].r.size) + ' (' + ss * 8 + ' bits → ' + o[0].r.size * 8 + ' bits, ' + (mn === 'movzx' ? 'complété par des 0' : 'signe conservé') + ')', 'read');
        return;
      }
      case 'lea': {
        a = this.addrOf(o[1]);
        this.setReg(o[0].r, BigInt(a));
        this.alu('lea', null, null, BigInt(a), 8, 'adresse');
        this.say('lea ' + o[0].txt + ', ' + o[1].txt + ' : ' + o[0].txt + ' ← ' + U.hex(a) + (this.symAt(a) ? ' (adresse de ' + this.symAt(a) + ')' : '') + ' — calcul d’adresse, aucune lecture mémoire', 'read');
        return;
      }
      case 'add': case 'sub': case 'adc': case 'sbb': case 'cmp': {
        a = this.read(o[0], size); b = this.read(o[1], size);
        if (o[1].k === 'imm') b = toU(o[1].v, size);
        var carry = (mn === 'adc' || mn === 'sbb') && this.flags.CF ? 1n : 0n, isAdd = mn === 'add' || mn === 'adc';
        var full = isAdd ? a + b + carry : a - b - carry;
        r = toU(full, size);
        this.flags.CF = isAdd ? (full > mask(size) ? 1 : 0) : (a < b + carry ? 1 : 0);
        var sa = (a & signBit(size)) !== 0n, sb = (b & signBit(size)) !== 0n, sr = (r & signBit(size)) !== 0n;
        this.flags.OF = isAdd ? (sa === sb && sr !== sa ? 1 : 0) : (sa !== sb && sr !== sa ? 1 : 0);
        this.setZS(r, size);
        if (mn !== 'cmp') this.write(o[0], size, r);
        this.alu(mn, a, b, r, size, isAdd ? '+' : '−');
        if (mn === 'cmp') {
          var A = toSigned(a, size), B = toSigned(b, size);
          this.say('cmp ' + o[0].txt + ', ' + o[1].txt + ' : calcule ' + A + ' − ' + B + ' = ' + toSigned(r, size) + ' sans rien stocker, juste pour régler les drapeaux → ' + (A === B ? 'égaux (ZF=1)' : A < B ? o[0].txt + ' est plus petit' : o[0].txt + ' est plus grand') + '.', 'alu');
        } else this.say(mn + ' ' + o[0].txt + ', ' + o[1].txt + ' : ' + toSigned(a, size) + ' ' + (isAdd ? '+' : '−') + ' ' + toSigned(b, size) + (carry ? ' ' + (isAdd ? '+' : '−') + ' 1 (retenue)' : '') + ' = ' + toSigned(r, size) + ' → ' + o[0].txt + this.flagNote(), 'alu');
        return;
      }
      case 'inc': case 'dec': {
        a = this.read(o[0], o[0].k === 'reg' ? o[0].r.size : o[0].size);
        var sz = o[0].k === 'reg' ? o[0].r.size : o[0].size;
        r = toU(mn === 'inc' ? a + 1n : a - 1n, sz);
        this.flags.OF = mn === 'inc' ? (r === signBit(sz) ? 1 : 0) : (a === signBit(sz) ? 1 : 0);
        this.setZS(r, sz);
        this.write(o[0], sz, r);
        this.alu(mn, a, 1n, r, sz, mn === 'inc' ? '+' : '−');
        this.say(mn + ' ' + o[0].txt + ' : ' + toSigned(a, sz) + ' → ' + toSigned(r, sz) + (r === 0n ? ' (ZF=1 : le résultat vaut 0)' : ''), 'alu');
        return;
      }
      case 'neg': case 'not': {
        var nz = o[0].k === 'reg' ? o[0].r.size : o[0].size;
        a = this.read(o[0], nz);
        r = toU(mn === 'neg' ? -a : ~a, nz);
        if (mn === 'neg') { this.flags.CF = a !== 0n ? 1 : 0; this.flags.OF = a === signBit(nz) ? 1 : 0; this.setZS(r, nz); }
        this.write(o[0], nz, r);
        this.alu(mn, a, null, r, nz, mn === 'neg' ? '−x' : '~x');
        this.say(mn + ' ' + o[0].txt + ' : ' + toSigned(a, nz) + ' → ' + toSigned(r, nz), 'alu');
        return;
      }
      case 'and': case 'or': case 'xor': case 'test': {
        a = this.read(o[0], size); b = o[1].k === 'imm' ? toU(o[1].v, size) : this.read(o[1], size);
        r = mn === 'and' || mn === 'test' ? a & b : mn === 'or' ? a | b : a ^ b;
        this.flags.CF = 0; this.flags.OF = 0; this.setZS(r, size);
        if (mn !== 'test') this.write(o[0], size, r);
        this.alu(mn, a, b, r, size, mn === 'or' ? 'OU' : mn === 'xor' ? 'XOR' : 'ET');
        if (mn === 'xor' && o[0].k === 'reg' && o[1].k === 'reg' && o[0].r.i === o[1].r.i) this.say('xor ' + o[0].txt + ', ' + o[0].txt + ' : un nombre XOR lui-même = 0. C’est la façon classique (et rapide) de mettre un registre à zéro.', 'alu');
        else if (mn === 'test') this.say('test ' + o[0].txt + ', ' + o[1].txt + ' : ET bit à bit sans stocker → ' + (r === 0n ? 'résultat 0 (ZF=1)' : 'résultat non nul (ZF=0)') + (o[0].k === 'reg' && o[1].k === 'reg' && o[0].r.i === o[1].r.i ? ' : sert à tester si ' + o[0].txt + ' vaut 0' : ''), 'alu');
        else this.say(mn + ' ' + o[0].txt + ', ' + o[1].txt + ' : ' + U.hex(a) + ' ' + mn.toUpperCase() + ' ' + U.hex(b) + ' = ' + U.hex(r), 'alu');
        return;
      }
      case 'shl': case 'sal': case 'shr': case 'sar': case 'rol': case 'ror': {
        var hs = o[0].k === 'reg' ? o[0].r.size : o[0].size, bits = BigInt(hs * 8);
        a = this.read(o[0], hs);
        var n = (o[1].k === 'reg' ? this.getReg(o[1].r) : toU(o[1].v, 1)) & (hs === 8 ? 63n : 31n);
        if (n === 0n) { this.say(mn + ' de 0 bit : rien ne change'); return; }
        if (mn === 'shl' || mn === 'sal') { r = toU(a << n, hs); this.flags.CF = Number((a >> (bits - n)) & 1n); }
        else if (mn === 'shr') { r = a >> n; this.flags.CF = Number((a >> (n - 1n)) & 1n); }
        else if (mn === 'sar') { r = toU(toSigned(a, hs) >> n, hs); this.flags.CF = Number((toSigned(a, hs) >> (n - 1n)) & 1n); }
        else if (mn === 'rol') { var k = n % bits; r = toU((a << k) | (a >> (bits - k)), hs); this.flags.CF = Number(r & 1n); }
        else { var k2 = n % bits; r = toU((a >> k2) | (a << (bits - k2)), hs); this.flags.CF = Number((r >> (bits - 1n)) & 1n); }
        if (mn !== 'rol' && mn !== 'ror') this.setZS(r, hs);
        this.write(o[0], hs, r);
        this.alu(mn, a, n, r, hs, mn[1] === 'h' || mn === 'sal' || mn === 'sar' ? (mn === 'shl' || mn === 'sal' ? '<<' : '>>') : mn);
        this.say(mn + ' ' + o[0].txt + ', ' + n + ' : ' + toSigned(a, hs) + ' → ' + toSigned(r, hs) + (mn === 'shl' || mn === 'sal' ? ' (× ' + (1n << n) + ')' : mn === 'shr' || mn === 'sar' ? ' (÷ ' + (1n << n) + ')' : ''), 'alu');
        return;
      }
      case 'imul': {
        if (o.length === 1) {
          var s1 = o[0].k === 'reg' ? o[0].r.size : o[0].size || 8;
          a = toSigned(this.getReg(REG[s1 === 8 ? 'rax' : s1 === 4 ? 'eax' : s1 === 2 ? 'ax' : 'al']), s1); b = toSigned(this.read(o[0], s1), s1);
          var p = a * b;
          this.setReg(REG[s1 === 8 ? 'rax' : 'eax'], toU(p, s1));
          if (s1 >= 2) this.setReg(REG[s1 === 8 ? 'rdx' : 'edx'], toU(p >> BigInt(s1 * 8), s1));
          this.flags.CF = this.flags.OF = toSigned(toU(p, s1), s1) !== p ? 1 : 0;
          this.alu('imul', toU(a, s1), toU(b, s1), toU(p, s1), s1, '×');
          this.say('imul ' + o[0].txt + ' : rax × ' + o[0].txt + ' = ' + a + ' × ' + b + ' = ' + p + ' (résultat dans rdx:rax)', 'alu');
          return;
        }
        var ds = o[0].r.size;
        a = toSigned(this.read(o.length === 3 ? o[1] : o[0], ds), ds);
        b = o.length === 3 ? toSigned(toU(o[2].v, ds), ds) : (o[1].k === 'imm' ? toSigned(toU(o[1].v, ds), ds) : toSigned(this.read(o[1], ds), ds));
        var pr = a * b;
        r = toU(pr, ds);
        this.flags.CF = this.flags.OF = toSigned(r, ds) !== pr ? 1 : 0;
        this.setReg(o[0].r, r);
        this.alu('imul', toU(a, ds), toU(b, ds), r, ds, '×');
        this.say('imul : ' + a + ' × ' + b + ' = ' + toSigned(r, ds) + ' → ' + o[0].txt + (this.flags.OF ? ' ⚠ débordement : le vrai résultat (' + pr + ') ne tient pas dans ' + ds * 8 + ' bits' : ''), 'alu');
        return;
      }
      case 'mul': {
        var ms = o[0].k === 'reg' ? o[0].r.size : o[0].size || 8;
        a = this.getReg(REG[ms === 8 ? 'rax' : 'eax']) & mask(ms); b = this.read(o[0], ms);
        var mp = a * b;
        this.setReg(REG[ms === 8 ? 'rax' : 'eax'], toU(mp, ms));
        this.setReg(REG[ms === 8 ? 'rdx' : 'edx'], toU(mp >> BigInt(ms * 8), ms));
        this.flags.CF = this.flags.OF = (mp >> BigInt(ms * 8)) ? 1 : 0;
        this.alu('mul', a, b, toU(mp, ms), ms, '×');
        this.say('mul ' + o[0].txt + ' : rax × ' + o[0].txt + ' = ' + a + ' × ' + b + ' = ' + mp + ' (bas dans rax, haut dans rdx)', 'alu');
        return;
      }
      case 'div': case 'idiv': {
        var vs = o[0].k === 'reg' ? o[0].r.size : o[0].size || 8, bitsN = BigInt(vs * 8);
        var raxR = REG[vs === 8 ? 'rax' : vs === 4 ? 'eax' : 'ax'], rdxR = REG[vs === 8 ? 'rdx' : vs === 4 ? 'edx' : 'dx'];
        var divisor = this.read(o[0], vs);
        if (divisor === 0n) throw new RtError('Floating point exception : division par zéro (' + o[0].txt + ' vaut 0)', 'fpe', 'Avant div, vérifie que le diviseur n’est pas nul.');
        var dividend = (this.getReg(rdxR) << bitsN) | this.getReg(raxR), q, rem;
        if (mn === 'idiv') {
          var sd = BigInt.asIntN(vs * 16, dividend), sv = toSigned(divisor, vs);
          q = sd / sv; rem = sd % sv;
          if (q !== toSigned(toU(q, vs), vs)) throw new RtError('Floating point exception : le quotient ne tient pas dans ' + vs * 8 + ' bits (as-tu oublié cqo pour préparer rdx ?)', 'fpe', 'Avant idiv, fais cqo (qui remplit rdx avec le signe de rax). Avant div, fais xor rdx, rdx.');
          this.alu('idiv', toU(sd, vs), divisor, toU(q, vs), vs, '÷');
        } else {
          q = dividend / divisor; rem = dividend % divisor;
          if (q > mask(vs)) throw new RtError('Floating point exception : le quotient ne tient pas dans ' + vs * 8 + ' bits — rdx n’était pas à 0 avant div', 'fpe', 'div divise rdx:rax (128 bits). Mets rdx à 0 avant : xor rdx, rdx.');
          this.alu('div', dividend & mask(vs), divisor, q, vs, '÷');
        }
        this.setReg(raxR, toU(q, vs)); this.setReg(rdxR, toU(rem, vs));
        this.say(mn + ' ' + o[0].txt + ' : ' + (mn === 'idiv' ? BigInt.asIntN(vs * 16, dividend) : dividend) + ' ÷ ' + (mn === 'idiv' ? toSigned(divisor, vs) : divisor) + ' → quotient ' + q + ' dans rax, reste ' + rem + ' dans rdx', 'alu');
        if (this.prevRegs[2] !== 0n && mn === 'div' && vs === 8) this.warn('rdx n’était pas à 0 avant div : il fait partie du nombre divisé (rdx:rax)');
        return;
      }
      case 'cqo': this.regs[2] = (this.regs[0] & signBit(8)) ? M64 : 0n; this.say('cqo : rdx ← ' + (this.regs[2] ? '-1 (rax est négatif)' : '0 (rax est positif)') + ' — prépare rdx:rax pour idiv', 'alu'); return;
      case 'cdq': this.setReg(REG.edx, (this.regs[0] & 0x80000000n) ? 0xffffffffn : 0n); this.say('cdq : étend le signe de eax dans edx', 'alu'); return;
      case 'cwd': this.setReg(REG.dx, (this.regs[0] & 0x8000n) ? 0xffffn : 0n); return;
      case 'cdqe': this.regs[0] = toU(toSigned(this.regs[0] & 0xffffffffn, 4), 8); this.say('cdqe : rax ← eax étendu en conservant le signe', 'alu'); return;
      case 'xchg': {
        var xs = size; a = this.read(o[0], xs); b = this.read(o[1], xs);
        this.write(o[0], xs, b); this.write(o[1], xs, a);
        this.say('xchg : ' + o[0].txt + ' et ' + o[1].txt + ' échangent leurs valeurs (' + this.fmtV(a, xs) + ' ↔ ' + this.fmtV(b, xs) + ')', 'write');
        return;
      }
      case 'push': {
        var pv = o[0].k === 'imm' ? toU(o[0].v, 8) : this.read(o[0], o[0].k === 'reg' ? o[0].r.size : 8);
        var at = this.push(pv);
        this.say('push ' + o[0].txt + ' : rsp descend de 8 (→ ' + U.hex(at) + ') puis ' + this.fmtV(pv) + ' est écrit au sommet de la pile', 'write');
        return;
      }
      case 'pop': {
        var at2 = Number(this.regs[4]), pv2 = this.pop();
        this.write(o[0], 8, pv2);
        this.retMarks.delete(at2);
        this.say('pop ' + o[0].txt + ' : lit ' + this.fmtV(pv2) + ' au sommet (' + U.hex(at2) + ') → ' + o[0].txt + ', puis rsp remonte de 8', 'read');
        return;
      }
      case 'leave': {
        this.regs[4] = this.regs[5];
        this.regs[5] = this.pop();
        this.say('leave : rsp ← rbp (on libère les variables locales) puis pop rbp (on restaure le rbp de l’appelant)', 'read');
        return;
      }
      case 'jmp': {
        if (o[0].ext) throw new RtError('jmp vers une fonction externe non géré : utilise call', 'type');
        var tg = o[0].k === 'imm' ? o[0].v : this.read(o[0], 8);
        this.jumpTo(tg, ins);
        this.cpu.last.jump = { taken: true, to: Number(tg) };
        this.say('jmp ' + o[0].txt + ' : saut inconditionnel → rip = ' + U.hex(tg), 'jump');
        return;
      }
      case 'loop': {
        this.regs[1] = toU(this.regs[1] - 1n, 8);
        var lt = this.regs[1] !== 0n;
        if (lt) this.jumpTo(o[0].v, ins);
        this.cpu.last.jump = { taken: lt, to: Number(o[0].v) };
        this.say('loop : rcx ← ' + this.regs[1] + (lt ? ' ≠ 0 → on reboucle vers ' + o[0].txt : ' = 0 → on sort de la boucle'), lt ? 'yes' : 'no');
        return;
      }
      case 'call': {
        if (o[0].ext) return this.callExt(o[0].ext, ins);
        var ct = o[0].k === 'imm' ? o[0].v : this.read(o[0], 8);
        var retAddr = BigInt(ins.addr + ins.size);
        var sAt = this.push(retAddr, 'adresse de retour');
        this.retMarks.set(sAt, 'adresse de retour → ligne ' + ((this.prog.ins[this.rip + 1] || ins).line));
        if (Number(this.regs[4]) % 16 !== 0 && false) this.warn('pile non alignée');
        this.jumpTo(ct, ins);
        this.callDepth++;
        this.cpu.last.jump = { taken: true, to: Number(ct), call: true };
        this.say('call ' + o[0].txt + ' : empile l’adresse de retour ' + U.hex(retAddr) + ' (pour revenir ligne ' + ((this.prog.ins[this.rip + 1] || ins).line) + ') puis saute dans la fonction', 'call');
        return;
      }
      case 'ret': {
        var at3 = Number(this.regs[4]);
        if (at3 >= this.spTop && this.entry === '_start') throw new RtError('Segmentation fault : ret depuis _start — il n’y a aucune adresse de retour sur la pile', 'segv', '_start n’est pas une fonction : termine le programme avec l’appel système exit (mov rax, 60 / mov rdi, 0 / syscall).');
        var ra = this.pop();
        this.retMarks.delete(at3);
        if (Number(ra) === EXIT_MAGIC) { this.say('ret depuis main : retour dans la libc, qui termine le programme avec eax comme code de sortie.', 'ret'); throw new Exit(this.regs[0]); }
        if (this.prog.addrIndex.get(Number(ra)) === undefined) throw new RtError('Segmentation fault : ret saute vers ' + U.hex(ra) + ', qui n’est pas une adresse de retour valide', 'segv', 'La pile est déséquilibrée : chaque push doit avoir son pop avant le ret.');
        this.jumpTo(ra, ins);
        this.callDepth = Math.max(0, this.callDepth - 1);
        this.cpu.last.jump = { taken: true, to: Number(ra), ret: true };
        this.say('ret : dépile l’adresse de retour ' + U.hex(ra) + ' et y retourne. La valeur de retour est dans rax = ' + this.fmtV(this.regs[0]), 'ret');
        return;
      }
      case 'syscall': return this.syscall(ins);
      case 'int': {
        if (toU(o[0].v, 1) !== 0x80n) throw new RtError('int ' + o[0].txt + ' non géré', 'type');
        return this.int80(ins);
      }
      case 'nop': this.say('nop : ne fait rien (1 cycle d’attente).'); return;
      case 'hlt': throw new RtError('hlt est une instruction privilégiée (réservée au noyau) → Segmentation fault', 'segv', 'Pour terminer : appel système exit.');
      case 'cld': this.flags.DF = 0; this.say('cld : DF = 0, les instructions de chaîne avancent'); return;
      case 'std': this.flags.DF = 1; this.say('std : DF = 1, les instructions de chaîne reculent'); return;
      case 'movsb': case 'stosb': case 'lodsb': case 'scasb': case 'cmpsb': return this.strOp(ins);
    }
    if ((c = condOf(mn, 'j'))) {
      var tk = this.cond(c);
      if (tk) this.jumpTo(o[0].v, ins);
      this.cpu.last.jump = { taken: tk, to: Number(o[0].v), cond: c };
      this.say(mn + ' ' + o[0].txt + ' : saut si ' + COND_FR[c] + ' → ' + (tk ? 'condition vraie, on saute' : 'condition fausse, on continue à la ligne suivante') + this.flagNote(true), tk ? 'yes' : 'no');
      return;
    }
    if ((c = condOf(mn, 'set'))) { var sv2 = this.cond(c) ? 1n : 0n; this.write(o[0], 1, sv2); this.say(mn + ' : ' + o[0].txt + ' ← ' + sv2 + ' (' + COND_FR[c] + ' ' + (sv2 ? 'vrai' : 'faux') + ')'); return; }
    if ((c = condOf(mn, 'cmov'))) { var cm = this.cond(c); if (cm) this.write(o[0], size, this.read(o[1], size)); this.say(mn + ' : ' + (cm ? 'condition vraie → copie' : 'condition fausse → rien')); return; }
    throw new RtError('instruction ' + mn + ' non gérée', 'internal');
  };
  M.flagNote = function (cond) {
    var f = this.flags;
    return '   [ZF=' + f.ZF + ' SF=' + f.SF + ' CF=' + f.CF + ' OF=' + f.OF + ']';
  };
  M.strOp = function (ins) {
    var mn = ins.mn, rep = !!ins.prefix, step = this.flags.DF ? -1n : 1n, count = 0;
    var n = rep ? this.regs[1] : 1n;
    if (rep && n > 100000n) throw new RtError('rep avec rcx = ' + n + ' : beaucoup trop grand (rcx non initialisé ?)', 'limit');
    while (n > 0n) {
      var rsi = Number(this.regs[6]), rdi = Number(this.regs[7]);
      if (mn === 'movsb') { this.wr(rdi, 1, this.rd(rsi, 1)); this.regs[6] += step; this.regs[7] += step; }
      else if (mn === 'stosb') { this.wr(rdi, 1, this.regs[0] & 255n); this.regs[7] += step; }
      else if (mn === 'lodsb') { this.setReg(REG.al, this.rd(rsi, 1)); this.regs[6] += step; }
      else if (mn === 'scasb') { var v = this.rd(rdi, 1), al = this.regs[0] & 255n; this.flags.ZF = v === al ? 1 : 0; this.regs[7] += step; if (rep && ((ins.prefix.indexOf('ne') >= 0 || ins.prefix.indexOf('nz') >= 0) ? this.flags.ZF : !this.flags.ZF)) { n--; if (rep) this.regs[1] = n; break; } }
      else if (mn === 'cmpsb') { var x1 = this.rd(rsi, 1), y1 = this.rd(rdi, 1); this.flags.ZF = x1 === y1 ? 1 : 0; this.flags.CF = x1 < y1 ? 1 : 0; this.regs[6] += step; this.regs[7] += step; if (rep && !this.flags.ZF) { n--; this.regs[1] = n; break; } }
      n--; count++;
      if (rep) this.regs[1] = n;
    }
    this.say((ins.prefix ? ins.prefix + ' ' : '') + mn + ' : ' + count + ' octet' + (count > 1 ? 's' : '') + ' traité' + (count > 1 ? 's' : ''), 'write');
  };

  /* appels système Linux x86-64 */
  M.syscall = function (ins) {
    var nr = Number(this.regs[0] & 0xffffffffn), rdi = this.regs[7], rsi = this.regs[6], rdx = this.regs[2], res;
    var names = { 0: 'read', 1: 'write', 2: 'open', 3: 'close', 60: 'exit', 231: 'exit_group', 12: 'brk', 39: 'getpid' };
    this.cpu.last.sys = { nr: nr, name: names[nr] || '?' };
    switch (nr) {
      case 1: {
        var fd = Number(rdi), n = Number(rdx);
        if (!this.fds[fd] || !this.fds[fd].w) { res = -9n; this.say('syscall write(' + fd + ', …) : descripteur invalide → rax = -9 (EBADF)', 'warn'); break; }
        if (n > 65536) throw new RtError('write avec rdx = ' + rdx + ' octets : beaucoup trop (rdx non initialisé ?)', 'limit', 'rdx doit contenir le nombre d’octets à écrire.');
        var r0 = this.regionOf(Number(rsi));
        if (n > 0 && (!r0 || Number(rsi) + n > r0.end || r0.kind === 'text')) { res = -14n; this.say('syscall write : l’adresse ' + U.hex(rsi) + ' est invalide → rax = -14 (EFAULT). Le noyau refuse au lieu de planter.', 'warn'); break; }
        var bytes = n ? this.bytesAt(Number(rsi), n) : [];
        this.emit(fd, bytes);
        res = BigInt(n);
        this.say('syscall n°1 = write(fd=' + fd + (fd === 1 ? ' stdout' : fd === 2 ? ' stderr' : '') + ', buf=' + U.hex(rsi) + (this.symAt(Number(rsi)) ? ' (' + this.symAt(Number(rsi)) + ')' : '') + ', count=' + n + ') affiche ' + U.quote(bytes, 40) + ' → rax = ' + n + ' octets écrits', 'io');
        break;
      }
      case 0: {
        var rfd = Number(rdi), rn = Number(rdx), f = this.fds[rfd];
        if (!f || f.w) { res = -9n; this.say('syscall read : descripteur ' + rfd + ' invalide → rax = -9 (EBADF)', 'warn'); break; }
        var k = Math.min(rn, f.data.length - f.pos), chunk = f.data.slice(f.pos, f.pos + k);
        var r1 = this.regionOf(Number(rsi));
        if (k > 0 && (!r1 || r1.ro || Number(rsi) + k > r1.end)) { res = -14n; this.say('syscall read : tampon ' + U.hex(rsi) + ' invalide ou en lecture seule → rax = -14 (EFAULT)', 'warn'); break; }
        for (var i = 0; i < k; i++) this.wr(Number(rsi) + i, 1, BigInt(chunk[i]));
        f.pos += k;
        res = BigInt(k);
        this.say('syscall n°0 = read(fd=' + rfd + ', buf=' + U.hex(rsi) + ', count=' + rn + ') lit ' + U.plural(k, 'octet') + (k ? ' : ' + U.quote(chunk, 40) : ' (fin de l’entrée)') + ' → rax = ' + k, 'io');
        break;
      }
      case 2: {
        var name = U.decode(this.cstr(Number(rdi)));
        if (!this.files[name]) { res = -2n; this.say('syscall open("' + name + '") : fichier introuvable → rax = -2 (ENOENT)', 'warn'); break; }
        var nfd = 3; while (this.fds[nfd]) nfd++;
        this.fds[nfd] = { name: name, data: this.files[name], pos: 0 };
        res = BigInt(nfd);
        this.say('syscall open("' + name + '") → rax = ' + nfd + ' (nouveau descripteur de fichier)', 'io');
        break;
      }
      case 3: { var cfd = Number(rdi); res = this.fds[cfd] && cfd > 2 ? (delete this.fds[cfd], 0n) : -9n; this.say('syscall close(' + cfd + ') → rax = ' + res, 'io'); break; }
      case 60: case 231:
        this.say('syscall n°' + nr + ' = exit(' + toSigned(rdi, 8) + ') : le noyau termine le programme. Le code de sortie est rdi & 255 = ' + Number(rdi & 255n) + '.', 'ok');
        throw new Exit(rdi);
      case 39: res = 4242n; this.say('syscall getpid → 4242'); break;
      case 12: res = BigInt(HEAP_BASE); this.say('syscall brk : non géré ici (utilise malloc)', 'warn'); break;
      default:
        res = -38n;
        this.say('syscall n°' + nr + ' inconnu → rax = -38 (ENOSYS). Numéros utiles : 0 read, 1 write, 60 exit.', 'warn');
    }
    this.regs[0] = toU(res, 8);
    this.regs[1] = BigInt(ins.addr + ins.size); // syscall écrase rcx (adresse de retour)…
    this.regs[11] = BigInt(0x202 | this.flags.CF | (this.flags.ZF << 6) | (this.flags.SF << 7) | (this.flags.OF << 11)); // … et r11 (rflags)
  };
  M.int80 = function (ins) {
    var nr = Number(this.regs[0] & 0xffffffffn), ebx = this.regs[3] & 0xffffffffn, ecx = this.regs[1] & 0xffffffffn, edx = this.regs[2] & 0xffffffffn;
    this.warn('int 0x80 est l’ancienne interface 32 bits : en 64 bits utilise syscall (rax=1 write, rax=60 exit)');
    if (nr === 1) throw new Exit(ebx);
    if (nr === 4) {
      var b = this.bytesAt(Number(ecx), Number(edx));
      this.emit(Number(ebx), b);
      this.regs[0] = edx;
      this.say('int 0x80 write → ' + U.quote(b), 'io');
      return;
    }
    throw new RtError('int 0x80 n°' + nr + ' non géré', 'type');
  };

  /* fonctions de la libc (call malloc …) */
  M.callExt = function (name, ins) {
    var rdi = this.regs[7], rsi = this.regs[6], self = this;
    this.used[name] = (this.used[name] || 0) + 1;
    if (Number(this.regs[4]) % 16 !== 0) this.warn('pile non alignée sur 16 octets au moment de call ' + name + ' (en vrai, la libc peut planter) : ajuste avec sub rsp, 8 ou un push');
    this.cpu.last.jump = { taken: true, ext: name };
    var res = this.regs[0];
    switch (name) {
      case 'malloc': case 'calloc': {
        var n = Number(name === 'calloc' ? rdi * rsi : rdi);
        if (n > 0x20000) throw new RtError(name + '(' + n + ') : taille trop grande (rdi contient-il bien la taille ?)', 'limit');
        var b = this.heap.alloc(n, ins.line, name);
        if (!b) { res = 0n; break; }
        var o = b.a - HEAP_BASE;
        for (var i = 0; i < n; i++) { if (name === 'calloc') this.heapR.buf[o + i] = 0; this.heapR.ini[o + i] = name === 'calloc' ? 1 : 0; }
        res = BigInt(b.a);
        this.acc.push({ a: b.a, n: Math.max(n, 1), w: true });
        this.say('call ' + name + ' : réserve ' + U.plural(n, 'octet') + ' (taille lue dans rdi) sur le tas → rax = ' + U.hex(b.a) + ' (adresse du bloc)', 'heap');
        break;
      }
      case 'free': {
        var p = Number(rdi);
        if (p === 0) { this.say('call free(NULL) : ne fait rien'); break; }
        var fb = this.heap.at(p);
        if (!fb) throw new RtError('free(): invalid pointer ' + U.hex(p) + ' (rdi ne contient pas une adresse renvoyée par malloc)', 'free');
        if (fb.freed) throw new RtError('free(): double free detected — bloc ' + U.hex(p) + ' déjà libéré', 'free');
        fb.freed = true; fb.freedLine = ins.line;
        this.say('call free(' + U.hex(p) + ') : le bloc #' + fb.id + ' est rendu au système', 'free');
        break;
      }
      case '__errno_location': res = BigInt(this.errnoAddr); this.say('call __errno_location → rax = ' + U.hex(this.errnoAddr) + ' : adresse de la variable errno (un int)', 'call'); break;
      case 'exit': this.say('call exit(' + toSigned(rdi, 8) + ')', 'ok'); throw new Exit(rdi);
      case 'strlen': { var s = this.cstr(Number(rdi)); res = BigInt(s.length); this.say('call strlen → rax = ' + s.length); break; }
      case 'strdup': { var sd = this.cstr(Number(rdi)), bd = this.heap.alloc(sd.length + 1, ins.line, 'strdup'); for (var j = 0; j <= sd.length; j++) this.wr(bd.a + j, 1, BigInt(sd[j] || 0)); res = BigInt(bd.a); this.say('call strdup → copie sur le tas à ' + U.hex(bd.a), 'heap'); break; }
      case 'strcpy': { var sc = this.cstr(Number(rsi)); for (var q = 0; q <= sc.length; q++) this.wr(Number(rdi) + q, 1, BigInt(sc[q] || 0)); res = rdi; break; }
      case 'strcmp': { var x = this.cstr(Number(rdi)), y = this.cstr(Number(rsi)), z = 0; while (z < x.length && x[z] === y[z]) z++; res = toU(BigInt((x[z] || 0) - (y[z] || 0)), 8); break; }
      case 'write': case 'read': {
        var save = this.regs[0];
        this.regs[0] = name === 'write' ? 1n : 0n;
        this.syscall(ins);
        var sr = toSigned(this.regs[0], 8);
        if (sr < 0n) { this.wr(this.errnoAddr, 4, -sr); res = M64; this.say('la fonction ' + name + ' de la libc met errno = ' + (-sr) + ' et renvoie -1'); }
        else res = this.regs[0];
        void save;
        break;
      }
      case 'printf': case 'puts': case 'putchar': {
        var out;
        if (name === 'putchar') out = [Number(rdi & 255n)];
        else if (name === 'puts') out = this.cstr(Number(rdi)).concat([10]);
        else {
          var argRegs = [6, 2, 1, 8, 9], ai = 0;
          out = U.cformat(this.cstr(Number(rdi)), function (kind) {
            var v = ai < argRegs.length ? self.regs[argRegs[ai++]] : (self.warn('printf : plus de 5 arguments non gérés'), 0n);
            if (kind === 'int') return Number(BigInt.asIntN(32, v));
            if (kind === 'uint') return Number(BigInt.asUintN(32, v));
            if (kind === 'long') return Number(BigInt.asIntN(64, v));
            if (kind === 'double') return 0;
            return Number(BigInt.asUintN(64, v));
          }, function (a) { return self.cstr(a); });
          if (this.regs[0] & 255n) this.warn('printf : en convention System V, al doit contenir le nombre de registres vectoriels utilisés (0 ici) : fais xor eax, eax avant');
        }
        this.emit(1, out);
        res = BigInt(out.length);
        this.say('call ' + name + ' affiche ' + U.quote(out, 40) + ' (arguments : rdi, rsi, rdx, rcx, r8, r9)', 'io');
        break;
      }
      default: throw new RtError('fonction externe « ' + name + ' » non disponible ici', 'type');
    }
    this.regs[0] = toU(res, 8);
  };

  /* ---------------------------------------------------------------- vues */
  M.regView = function () {
    var order = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'], self = this;
    return order.map(function (n) {
      var i = REG[n].i;
      return { name: n, v: self.regs[i], prev: self.prevRegs[i], changed: self.regs[i] !== self.prevRegs[i], sym: self.symAt(Number(self.regs[i])) };
    });
  };
  M.cellsFor = function (s) {
    var r = this.regionOf(s.addr), unit = s.unit || 1, cells = [], n = Math.max(0, s.size), self = this;
    if (!r) return cells;
    var lim = Math.min(n, 256);
    for (var off = 0; off < lim; off += unit) {
      var u = Math.min(unit, n - off), a = s.addr + off, o = a - r.base;
      var v = 0n;
      for (var k = u - 1; k >= 0; k--) v = (v << 8n) | BigInt(r.buf[o + k]);
      var c = { a: a, n: u, lbl: unit === 1 ? '[' + off + ']' : '+' + off, ty: unit === 1 ? 'octet' : unit * 8 + ' bits' };
      if (unit === 1) { c.val = U.glyph(Number(v)); c.sub = String(v); c.kind = 'char'; if (v === 0n) c.cls = 'nul'; }
      else {
        var sym = self.symAt(Number(v));
        if (sym && unit === 8) { c.val = U.hex(v); c.ref = Number(v); c.kind = 'ptr'; }
        else { c.val = toSigned(v, u).toString(); c.kind = 'num'; }
      }
      if (r.kind === 'heap' && !r.ini[o]) c.cls = 'garbage';
      cells.push(c);
    }
    if (n > lim) cells.push({ a: s.addr + lim, n: n - lim, lbl: '…', val: '+' + (n - lim) + ' o', cls: 'more' });
    return cells;
  };
  M.view = function () {
    var self = this, regions = [], rsp = Number(this.regs[4]), rbp = Number(this.regs[5]);
    // pile : de rsp jusqu'au haut utilisé
    var top = this.entry === 'main' || this.entry === 'ft_main' ? this.spTop - 8 : this.spTop;
    var start = Math.min(rsp, top), slots = [];
    if (start < this.stack.base) start = this.stack.base;
    var from = Math.max(start, top - 8 * 48);
    for (var a = from; a < top + 8 && slots.length < 64; a += 8) {
      var v = this.peek(a, 8), mark = [];
      if (a === rsp) mark.push('rsp');
      if (a === rbp) mark.push('rbp');
      var rel = 'rsp' + (a - rsp >= 0 ? '+' : '−') + Math.abs(a - rsp);
      var note = this.retMarks.get(a) || (a >= this.spTop ? (a === this.spTop ? 'argc (posé par le noyau)' : '') : '');
      var sym = this.symAt(Number(v));
      var cell = { a: a, n: 8, lbl: a < rsp ? 'libre' : rel, val: Number(v) === EXIT_MAGIC ? '↩ libc' : v === 0n ? '0' : (sym || this.prog.addrIndex.get(Number(v)) !== undefined) ? U.hex(v) : (toSigned(v, 8) > -1000000n && toSigned(v, 8) < 1000000n ? toSigned(v, 8).toString() : U.hex(v)), kind: 'num' };
      if (a < rsp) cell.cls = 'garbage';
      if (sym || (Number(v) >= HEAP_BASE && Number(v) < HEAP_BASE + HEAP_SIZE) || (Number(v) >= this.stack.base && Number(v) < STACK_TOP)) { cell.ref = Number(v); cell.kind = 'ptr'; }
      if (this.prog.addrIndex.get(Number(v)) !== undefined) { cell.kind = 'code'; cell.val = U.hex(v); }
      slots.push({ key: 's' + a, name: mark.join(' ') || (a === rbp ? 'rbp' : ''), type: note, a: a, n: 8, cells: [cell], region: 'stack', marks: mark, note: note });
    }
    slots.reverse();
    regions.push({ kind: 'stack', title: 'Pile (stack)', info: 'Grandit vers le bas : push fait descendre rsp, pop le fait remonter. call y range l’adresse de retour.', groups: [{ title: 'rsp = ' + U.hex(rsp), sub: rbp ? 'rbp = ' + U.hex(rbp) : '', objs: slots, slots: true }] });
    ['rodata', 'data', 'bss'].forEach(function (sn) {
      var syms = self.prog.syms.filter(function (s) { return s.sect === sn; });
      if (!syms.length) return;
      regions.push({ kind: sn === 'rodata' ? 'rodata' : 'data', title: '.' + sn, info: sn === 'data' ? 'Données initialisées, modifiables.' : sn === 'bss' ? 'Réservées (resb…), mises à 0 au démarrage.' : 'Données en lecture seule.',
        groups: [{ title: '', objs: syms.map(function (s) { return { key: 'd' + s.addr, name: s.name, type: (s.unit ? ['', 'db', 'dw', '', 'dd', '', '', '', 'dq'][s.unit] : 'db') + ' · ' + s.size + ' o', a: s.addr, n: s.size, cells: self.cellsFor(s), region: sn === 'rodata' ? 'rodata' : 'data', note: 'ligne ' + s.line }; }) }] });
    });
    var hb = this.heap.blocks.slice(-30).map(function (b) {
      var cells = self.cellsFor({ addr: b.a, size: b.n, unit: 1 });
      if (b.freed) cells.forEach(function (c) { c.cls = 'freed'; });
      return { key: 'h' + b.a, name: 'bloc #' + b.id, type: b.n + ' octets', a: b.a, n: b.n, cap: b.cap, cells: cells, region: 'heap', status: b.freed ? 'freed' : self.done ? 'leak' : 'live', note: b.who + ' ligne ' + b.line + (b.freed ? ' · libéré' : self.done ? ' · FUITE' : '') };
    });
    if (hb.length) regions.push({ kind: 'heap', title: 'Tas (heap)', info: 'Blocs obtenus avec call malloc.', groups: [{ title: '', objs: hb }] });
    return { regions: regions, acc: this.acc };
  };
  M.peekVar = function (name) {
    var s = this.prog.labels[name];
    if (s && s.sect !== 'text') {
      var sym = this.prog.syms.filter(function (x) { return x.name === name; })[0];
      var r = this.regionOf(s.addr), o = s.addr - r.base, n = sym ? sym.size : 16;
      return { k: 'arr', bytes: Array.prototype.slice.call(r.buf, o, o + n), n: n };
    }
    if (REG[name]) return { k: 'num', v: Number(BigInt.asIntN(64, this.getReg(REG[name]))) };
    return null;
  };
  M.peekStr = function (a) { var r = this.regionOf(a); if (!r) return null; var out = []; for (var i = 0; i < 200; i++) { var o = a - r.base + i; if (o >= r.size || !r.buf[o]) break; out.push(r.buf[o]); } return out; };
  /* pour les tests de missions : modifier une donnée avant l'exécution */
  M.poke = function (label, bytes) {
    var s = this.prog.labels[label];
    if (!s) return false;
    var r = this.regionOf(s.addr);
    for (var i = 0; i < bytes.length; i++) r.buf[s.addr - r.base + i] = bytes[i];
    return true;
  };

  O42.engines.asm = {
    name: 'Assembleur x86-64',
    create: function (src, opts) {
      var prog;
      try { prog = assemble(src); }
      catch (e) { if (e instanceof CompileError) return { compileError: { msg: e.msg, line: e.line, hint: e.hint } }; throw e; }
      var m = new Machine(prog, opts);
      if (opts && opts.poke) for (var k in opts.poke) m.poke(k, opts.poke[k]);
      return m;
    },
    REG: REG, MNEMO_FR: MNEMO_FR
  };
})(typeof window !== 'undefined' ? window : globalThis);
