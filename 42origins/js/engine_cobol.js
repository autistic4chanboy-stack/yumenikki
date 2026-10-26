/* =========================================================================
 *  42 ORIGINS — moteur COBOL
 *  Sous-ensemble de COBOL (format libre toléré) exécuté pas à pas : les
 *  divisions IDENTIFICATION / DATA (WORKING-STORAGE) / PROCEDURE, les
 *  clauses PIC (9, X, S, V, OCCURS), MOVE, DISPLAY, ACCEPT, COMPUTE,
 *  ADD/SUBTRACT/MULTIPLY/DIVIDE, IF, PERFORM (TIMES, UNTIL, VARYING),
 *  les paragraphes. La WORKING-STORAGE est montrée case par case.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var CompileError = U.CompileError, RtError = U.RtError;

  var DATA_BASE = 0x1000;

  /* ---------------------------------------------------------------- découpage */
  /* COBOL a des « phrases » séparées par des points. On garde la ligne source. */
  function lines(src) { return src.replace(/\r\n?/g, '\n').split('\n'); }

  /* un petit tokeniseur : mots, nombres, chaînes 'xxx' / "xxx", opérateurs */
  function lex(text, line) {
    var toks = [], i = 0, n = text.length;
    while (i < n) {
      var c = text[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
      if (c === "'" || c === '"') {
        var q = c, j = i + 1, s = '';
        while (j < n && text[j] !== q) { s += text[j]; j++; }
        if (j >= n) throw new CompileError('chaîne de caractères non fermée (il manque le ' + q + ')', line);
        toks.push({ t: 'str', v: s, line: line }); i = j + 1; continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(text[i + 1] || '')) || ((c === '-' || c === '+') && /[0-9]/.test(text[i + 1] || '') && (!toks.length || toks[toks.length - 1].t === 'op' || toks[toks.length - 1].t === 'kw'))) {
        var m = /^[+-]?[0-9]*\.?[0-9]+/.exec(text.slice(i))[0];
        toks.push({ t: 'num', v: parseFloat(m), raw: m, line: line }); i += m.length; continue;
      }
      if (/[A-Za-z0-9]/.test(c)) {
        var w = /^[A-Za-z0-9][A-Za-z0-9-]*/.exec(text.slice(i))[0];
        toks.push({ t: 'word', v: w, up: w.toUpperCase(), line: line }); i += w.length; continue;
      }
      var two = text.substr(i, 2);
      if (two === '>=' || two === '<=' || two === '<>' || two === '**') { toks.push({ t: 'op', v: two, line: line }); i += 2; continue; }
      if ('+-*/=<>()&.$'.indexOf(c) >= 0) { toks.push({ t: 'op', v: c, line: line }); i++; continue; }
      if (c === ',' || c === ';') { i++; continue; } // séparateurs décoratifs
      throw new CompileError('caractère inattendu « ' + c + ' »', line);
    }
    return toks;
  }

  /* ---------------------------------------------------------------- PIC */
  /* renvoie { kind:'num'|'alpha', len, dec, signed, display, edited } */
  function parsePic(pic, line) {
    pic = pic.toUpperCase();
    var i = 0, kind = null, intLen = 0, dec = 0, signed = false, afterV = false, edited = null, len = 0;
    function count() { var m = /^\((\d+)\)/.exec(pic.slice(i)); if (m) { i += m[0].length; return +m[1]; } return 1; }
    while (i < pic.length) {
      var c = pic[i++];
      if (c === 'S') { signed = true; continue; }
      if (c === 'V') { afterV = true; kind = 'num'; continue; }
      if (c === '9') { var k9 = count(); kind = kind || 'num'; if (afterV) dec += k9; else intLen += k9; continue; }
      if (c === 'X') { var kx = count(); kind = 'alpha'; len += kx; continue; }
      if (c === 'A') { var ka = count(); kind = 'alpha'; len += ka; continue; }
      if (c === 'Z' || c === '*') { var kz = count(); kind = 'num'; edited = edited || {}; edited.zero = c; intLen += kz; continue; }
      if (c === '$') { kind = 'num'; edited = edited || {}; edited.cur = true; intLen += count(); continue; }
      if (c === ',') { edited = edited || {}; edited.comma = true; continue; }
      if (c === '.') { if (/[0-9Z*]/.test(pic.slice(i))) { afterV = true; edited = edited || {}; edited.dot = true; kind = 'num'; } continue; }
      if (c === '-' || c === '+') { signed = true; edited = edited || {}; edited.sign = c; count(); continue; }
      if (c === 'B' || c === '/' || c === '0') { continue; }
      throw new CompileError('clause PICTURE non gérée : « ' + c + ' » dans ' + pic, line);
    }
    if (kind === 'num') len = intLen + dec;
    if (!kind) throw new CompileError('clause PICTURE vide ou invalide : ' + pic, line);
    return { kind: kind, len: len, intLen: intLen, dec: dec, signed: signed, edited: edited, disp: edited ? dispLen(pic) : (kind === 'num' ? intLen + dec + (signed && !edited ? 0 : 0) : len), raw: pic };
  }
  function dispLen(pic) {
    // longueur affichée d'un champ édité : compte les positions réelles
    var n = 0, i = 0;
    while (i < pic.length) {
      var c = pic[i++];
      if (c === '(') { var m = /^(\d+)\)/.exec(pic.slice(i)); if (m) { n += (+m[1]) - 1; i += m[0].length; } continue; }
      if ('9XAZ*$,.-+B/0'.indexOf(c) >= 0) n++;
      if (c === 'V' || c === 'S') { /* pas de position affichée pour V ; S implicite */ if (c === 'S') n++; }
    }
    return n;
  }

  /* ---------------------------------------------------------------- analyse DATA */
  var M_isVerb;
  function Program(src) {
    this.src = src;
    this.lines = lines(src);
    this.fields = [];        // { name, level, pic, size, off, parent, occurs, kind, dec, signed, value, children }
    this.byName = Object.create(null);
    this.paras = [];         // { name, start, end }  (index de phrases)
    this.sentences = [];     // { toks, line }
    this.parse();
  }
  var PR = Program.prototype;

  PR.stripLine = function (raw) {
    // format libre + tolérance au format fixe (zone colonnes 7 commentaire, 8-72 code)
    var s = raw;
    if (/^.{6}[*/]/.test(s)) return ''; // colonne 7 = commentaire
    if (/^\s*\*/.test(s)) return '';    // * en début
    // enlève un éventuel numéro de séquence (6 chiffres) au début
    s = s.replace(/^\d{6}/, '      ');
    return s;
  };

  PR.parse = function () {
    var self = this, joined = [], curLine = 0;
    // on recolle le texte en gardant la ligne d'origine de chaque caractère
    var text = '', map = [];
    this.lines.forEach(function (raw, idx) {
      var s = self.stripLine(raw);
      for (var k = 0; k < s.length; k++) { text += s[k]; map.push(idx + 1); }
      text += '\n'; map.push(idx + 1);
    });
    // on découpe en divisions
    var upper = text.toUpperCase();
    var pPos = upper.indexOf('PROCEDURE DIVISION');
    var dPos = upper.indexOf('DATA DIVISION');
    var wPos = upper.indexOf('WORKING-STORAGE SECTION');
    if (pPos < 0) throw new CompileError('il manque la PROCEDURE DIVISION (c’est là que va le code exécuté).', 1);
    // --- WORKING-STORAGE ---
    if (wPos >= 0) {
      var wEnd = pPos;
      var ws = text.slice(wPos, wEnd);
      // retire l'en-tête "WORKING-STORAGE SECTION."
      ws = ws.replace(/WORKING-STORAGE\s+SECTION\s*\./i, '');
      this.parseData(ws, map, wPos);
    } else if (dPos >= 0 && dPos < pPos) {
      // DATA DIVISION sans working-storage explicite : on tente quand même
    }
    this.layout();
    // --- PROCEDURE ---
    var procText = text.slice(pPos);
    procText = procText.replace(/PROCEDURE\s+DIVISION\s*\.?/i, function (m) { return ' '.repeat(m.length); });
    this.parseProc(procText, map, pPos);
  };

  PR.lineAt = function (map, basePos, localPos) { return map[basePos + localPos] || map[map.length - 1] || 1; };

  PR.parseData = function (ws, map, base) {
    // chaque entrée se termine par un point ; on lit les clauses dans le TEXTE brut
    // (plus robuste pour PIC $Z,ZZ9.99 où $ et , font partie de la clause)
    var entries = this.splitSentences(ws, map, base);
    var stack = []; // pile des groupes par niveau
    var self = this;
    entries.forEach(function (ent) {
      var txt = ent.text;
      var hm = /^\s*(\d\d?)\s+([A-Za-z0-9][A-Za-z0-9-]*|FILLER)?/i.exec(txt);
      if (!hm) throw new CompileError('chaque donnée commence par un numéro de niveau (ex. 01, 05).', ent.line);
      var level = parseInt(hm[1], 10);
      var name = hm[2] && hm[2].toUpperCase() !== 'FILLER' && !/^(PIC|PICTURE|VALUE|OCCURS|REDEFINES)$/i.test(hm[2]) ? hm[2] : 'FILLER';
      var f = { name: name, up: name.toUpperCase(), level: level, line: ent.line, occurs: 1, children: [], pic: null, value: null, kind: 'group', dec: 0, signed: false };
      var pm = /\bPIC(?:TURE)?\s+(?:IS\s+)?([0-9ASVXZ9()$*,.+\-BZ/]+(?:V[0-9()]+)?[0-9ASVXZ9()$*,.+\-BZ/]*)/i.exec(txt);
      if (pm) {
        var pp = parsePic(pm[1], ent.line);
        f.kind = pp.kind; f.picLen = pp.len; f.intLen = pp.intLen; f.dec = pp.dec; f.signed = pp.signed; f.edited = pp.edited; f.dispLen = pp.disp; f.pic = pm[1];
      }
      var vm = /\bVALUE\s+(?:IS\s+)?('[^']*'|"[^"]*"|[-+]?\d+(?:\.\d+)?|[A-Za-z][A-Za-z-]*)/i.exec(txt);
      if (vm) {
        var raw = vm[1], up = raw.toUpperCase();
        if (/^['"]/.test(raw)) f.value = raw.slice(1, -1);
        else if (/ZERO|ZEROS|ZEROES/.test(up)) f.value = '0';
        else if (/SPACE|SPACES/.test(up)) f.value = ' ';
        else if (/HIGH-VALUE/.test(up)) f.value = '￿';
        else if (/LOW-VALUE/.test(up)) f.value = '\0';
        else f.value = raw;
      }
      var om = /\bOCCURS\s+(\d+)/i.exec(txt);
      if (om) f.occurs = Math.max(1, parseInt(om[1], 10));
      if (/\b(COMP(?:UTATIONAL)?(?:-3)?|BINARY|PACKED-DECIMAL)\b/i.test(txt)) f.comp = true;
      var rm = /\bREDEFINES\s+([A-Za-z0-9-]+)/i.exec(txt);
      if (rm) f.redefines = rm[1];
      // rattache au bon parent
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      if (stack.length) { f.parent = stack[stack.length - 1]; f.parent.children.push(f); }
      else self.fields.push(f);
      if (level !== 88) stack.push(f);
      if (level === 88) f.cond = true;
      self.byName[f.up] = f;
    });
  };

  PR.splitSentences = function (text, map, base) {
    // découpe sur les points qui terminent une phrase (pas ceux d'une PIC ou d'un décimal)
    var out = [], buf = '', start = 0, i = 0, inStr = null;
    for (; i < text.length; i++) {
      var c = text[i];
      if (inStr) { buf += c; if (c === inStr) inStr = null; continue; }
      if (c === "'" || c === '"') { inStr = c; buf += c; continue; }
      if (c === '.') {
        // un point suivi d'espace/retour = fin de phrase
        var nx = text[i + 1];
        var prev = text[i - 1];
        var inNum = /[0-9]/.test(prev || '') && /[0-9]/.test(nx || '');
        var inPic = /[0-9Z*]/i.test(nx || '') && /[9XSVZ*$)]/i.test(prev || '');
        if (!inNum && !inPic && (nx === undefined || /\s/.test(nx))) {
          if (buf.trim()) out.push({ toks: lex(buf, map[base + start] || 1), line: map[base + start] || 1, text: buf.trim() });
          buf = ''; start = i + 1; continue;
        }
      }
      buf += c;
    }
    if (buf.trim()) out.push({ toks: lex(buf, map[base + start] || 1), line: map[base + start] || 1, text: buf.trim() });
    return out;
  };

  PR.layout = function () {
    var off = DATA_BASE, self = this;
    function size(f) {
      if (f.children.length) {
        var s = 0;
        f.children.forEach(function (c) { s += elemSize(c) * c.occurs; });
        f.elemSize = s;
        return s;
      }
      f.elemSize = self.fieldBytes(f);
      return f.elemSize;
    }
    function elemSize(f) { return size(f); }
    function place(f) {
      f.off = off;
      if (f.children.length) {
        for (var oc = 0; oc < f.occurs; oc++) {
          f.children.forEach(function (c) { place(c); });
        }
        // recalcule off en fonction d'une seule occurrence pour l'affichage
      } else {
        off += f.elemSize * f.occurs;
      }
    }
    // taille d'abord
    this.fields.forEach(function (f) { size(f); });
    // placement simple, linéaire (occurrences dépliées pour les feuilles)
    off = DATA_BASE;
    function placeLinear(f) {
      f.off = off;
      if (f.children.length) {
        var startOff = off;
        for (var oc = 0; oc < f.occurs; oc++) {
          f.children.forEach(function (c) { placeLinear(c); });
        }
        f.totalSize = off - startOff;
      } else {
        f.cells = f.elemSize;
        off += f.elemSize * f.occurs;
        f.totalSize = f.elemSize * f.occurs;
      }
    }
    this.fields.forEach(function (f) { placeLinear(f); });
    this.dataSize = off - DATA_BASE;
  };
  PR.fieldBytes = function (f) {
    if (f.kind === 'group') return 0;
    if (f.kind === 'alpha') return f.picLen;
    // numérique : on stocke la valeur en chiffres (longueur = intLen + dec), signe implicite
    return (f.intLen || 0) + (f.dec || 0);
  };

  PR.parseProc = function (text, map, base) {
    var sentences = this.splitSentences(text, map, base);
    var self = this;
    this.sentences = [];
    this.paras = [];
    var cur = { name: '(début)', start: 0 };
    this.paras.push(cur);
    sentences.forEach(function (sent) {
      var t = sent.toks;
      if (!t.length) return;
      // étiquette de paragraphe : un seul mot suivi de rien (le point l'a terminé)
      if (t.length === 1 && t[0].t === 'word' && !self.isVerb(t[0].up)) {
        cur.end = self.sentences.length;
        cur = { name: t[0].v, up: t[0].up, start: self.sentences.length };
        self.paras.push(cur);
        return;
      }
      self.sentences.push({ toks: t, line: sent.line, text: sent.text });
    });
    cur.end = this.sentences.length;
    // index des paragraphes par nom
    this.paraByName = Object.create(null);
    this.paras.forEach(function (p) { if (p.up) self.paraByName[p.up] = p; });
  };
  function isVerb(w) {
    return /^(DISPLAY|MOVE|ACCEPT|ADD|SUBTRACT|MULTIPLY|DIVIDE|COMPUTE|IF|ELSE|END-IF|PERFORM|END-PERFORM|STOP|GOBACK|GO|CONTINUE|EVALUATE|WHEN|END-EVALUATE|INITIALIZE|STRING|UNSTRING|INSPECT|SET|NEXT|EXIT|CALL)$/.test(w);
  }
  PR.isVerb = function (w) { return isVerb(w); };
  M_isVerb = isVerb;

  /* ---------------------------------------------------------------- machine */
  function Exit(code) { this.code = code; }

  function Machine(prog, opts) {
    opts = opts || {};
    this.prog = prog;
    this.src = prog.src;
    this.region = { name: 'working-storage', kind: 'data', base: DATA_BASE, size: Math.max(prog.dataSize, 16) + 16 };
    this.buf = new Uint8Array(this.region.size);
    this.ini = new Uint8Array(this.region.size);
    this.stdinLines = (opts.stdin || '').split('\n');
    if (this.stdinLines.length && this.stdinLines[this.stdinLines.length - 1] === '') this.stdinLines.pop();
    this.stdinPos = 0;
    this.outBytes = []; this.out = []; this._stdout = null;
    this.steps = 0; this.maxSteps = opts.maxSteps || 200000;
    this.done = false; this.error = null; this.exitCode = null; this.warnings = [];
    this.log = []; this.acc = []; this.line = 0; this.curLine = 0;
    this.used = {}; this.callStack = [];
    this.initStorage();
    this.gen = this.boot();
    this.advance();
  }
  var M = Machine.prototype;
  M.isVerb = function (w) { return isVerb(w); };
  Object.defineProperty(M, 'stdout', { get: function () { if (this._stdout === null) this._stdout = U.decode(this.outBytes); return this._stdout; } });
  Object.defineProperty(M, 'depth', { get: function () { return this.callStack.length; } });

  M.say = function (t, c) { if (this.log.length < 14) this.log.push({ t: t, c: c || '' }); };
  M.warn = function (t) { this.say('⚠ ' + t, 'warn'); if (this.warnings.length < 30 && !this.warnings.some(function (w) { return w.msg === t; })) this.warnings.push({ msg: t, line: this.curLine }); };
  M.chunks = function () { var out = [], cur = null; this.out.forEach(function (c) { if (cur && cur.fd === c.fd) cur.b = cur.b.concat(c.bytes); else out.push(cur = { fd: c.fd, b: c.bytes.slice() }); }); return out.map(function (c) { return { fd: c.fd, s: U.decode(c.b) }; }); };
  M.emit = function (s) { var b = U.utf8(s); this.out.push({ fd: 1, bytes: b }); for (var i = 0; i < b.length; i++) this.outBytes.push(b[i]); this._stdout = null; };
  M.summary = function () { return null; };

  /* --- stockage et champs --- */
  M.leaves = function () {
    if (this._leaves) return this._leaves;
    var out = [];
    function walk(f, idxPath) {
      if (f.children.length) {
        for (var oc = 0; oc < f.occurs; oc++) f.children.forEach(function (c) { walk(c, f.occurs > 1 ? idxPath.concat(oc + 1) : idxPath); });
      } else {
        for (var o = 0; o < f.occurs; o++) out.push({ f: f, idx: o, path: idxPath });
      }
    }
    // on se contente des feuilles ; les offsets ont été posés linéairement
    this.prog.fields.forEach(function (f) { collectLeaves(f, out); });
    this._leaves = out;
    return out;
  };
  function collectLeaves(f, out) {
    if (f.children.length) f.children.forEach(function (c) { collectLeaves(c, out); });
    else out.push(f);
  }

  M.initStorage = function () {
    var self = this;
    // valeur par défaut : espaces pour alpha, 0 pour num
    collectEach(this.prog.fields, function (f) {
      if (f.children.length || f.cond) return;
      for (var oc = 0; oc < f.occurs; oc++) {
        var a = f.off + oc * f.elemSize;
        for (var k = 0; k < f.elemSize; k++) { self.buf[a - DATA_BASE + k] = f.kind === 'alpha' ? 32 : 48; self.ini[a - DATA_BASE + k] = f.value != null ? 1 : 0; }
        if (f.value != null) self.storeField(f, a, f.value, true);
      }
    });
  };
  function collectEach(fields, fn) { fields.forEach(function (f) { fn(f); if (f.children.length) collectEach(f.children, fn); }); }

  /* lit la valeur d'un champ (string pour alpha, {int, dec, sign, num} pour num) */
  M.readRaw = function (f, a) {
    var o = a - DATA_BASE, s = '';
    for (var i = 0; i < f.elemSize; i++) s += String.fromCharCode(this.buf[o + i] || 0);
    return s;
  };
  M.readText = function (f, a) {
    this.touch(a, f.elemSize, false);
    if (f.kind === 'alpha') return this.readRaw(f, a).replace(/\0/g, '');
    // numérique : chiffres -> nombre
    var raw = this.readRaw(f, a), digits = raw.replace(/[^0-9]/g, '');
    if (!digits) digits = '0';
    var sign = this.signOf(f, a);
    var num = parseInt(digits, 10) * (sign < 0 ? -1 : 1);
    return { digits: digits, intLen: f.intLen, dec: f.dec, sign: sign, num: f.dec ? num / Math.pow(10, f.dec) : num, raw: raw };
  };
  M.signOf = function (f, a) { return f.__sign && f.__sign[a] ? f.__sign[a] : 1; };
  M.setSign = function (f, a, s) { if (!f.__sign) f.__sign = {}; f.__sign[a] = s; };

  M.numValue = function (f, a) {
    if (f.kind === 'alpha') { var t = this.readText(f, a).trim(); var n = parseFloat(t); return isNaN(n) ? 0 : n; }
    var r = this.readText(f, a);
    return r.num;
  };

  M.storeField = function (f, a, value, silent) {
    var o = a - DATA_BASE, i, self = this;
    if (f.kind === 'alpha') {
      var s = typeof value === 'string' ? value : this.formatNum(f, +value);
      for (i = 0; i < f.elemSize; i++) { this.buf[o + i] = i < s.length ? s.charCodeAt(i) & 255 : 32; this.ini[o + i] = 1; }
    } else {
      // numérique : on range les chiffres, cadrés à droite, complétés par des 0
      var num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.+-]/g, '')) || 0;
      var sign = num < 0 ? -1 : 1;
      var scaled = Math.round(Math.abs(num) * Math.pow(10, f.dec || 0));
      var ds = String(scaled);
      var total = (f.intLen || 0) + (f.dec || 0);
      if (ds.length > total) { ds = ds.slice(ds.length - total); if (!silent) this.warn(f.name + ' tronqué : la valeur ne tient pas dans PIC ' + f.pic); }
      while (ds.length < total) ds = '0' + ds;
      for (i = 0; i < total; i++) { this.buf[o + i] = ds.charCodeAt(i); this.ini[o + i] = 1; }
      if (f.signed) this.setSign(f, a, sign);
    }
    if (!silent) this.touch(a, f.elemSize, true);
  };

  /* valeur affichée par DISPLAY (applique l'édition PIC) */
  M.display = function (f, a) {
    if (f.kind === 'alpha') return this.readRaw(f, a).replace(/\0/g, '');
    var r = this.readText(f, a);
    if (f.edited) return this.formatEdited(f, r);
    // numérique simple : chiffres bruts (avec signe si demandé via FLOAT? non), zéros inclus
    var s = r.digits;
    var total = (f.intLen || 0) + (f.dec || 0);
    while (s.length < total) s = '0' + s;
    return s;
  };
  M.formatNum = function (f, num) {
    var scaled = Math.round(Math.abs(num) * Math.pow(10, f.dec || 0)), ds = String(scaled), total = (f.intLen || 0) + (f.dec || 0);
    while (ds.length < total) ds = '0' + ds;
    return ds;
  };
  M.formatEdited = function (f, r) {
    var ed = f.edited, intPart = r.digits.slice(0, f.intLen).replace(/^0+(?=\d)/, ''), decPart = f.dec ? r.digits.slice(f.intLen) : '';
    var out = '';
    if (ed.zero) {
      // suppression des zéros de tête, remplis par espace ou *
      var fill = ed.zero === '*' ? '*' : ' ';
      var intNum = String(parseInt(intPart || '0', 10));
      var pad = f.intLen - intNum.length;
      out = (pad > 0 ? fill.repeat(pad) : '') + intNum;
    } else {
      out = intPart || '0';
      while (out.length < f.intLen) out = '0' + out;
    }
    if (ed.comma) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (ed.cur) out = '$' + out;
    if (f.dec && (ed.dot || true)) out += '.' + decPart;
    if (ed.sign) { out = (r.sign < 0 ? '-' : (ed.sign === '+' ? '+' : ' ')) + out; }
    else if (f.signed && r.sign < 0) out = '-' + out;
    return out;
  };

  /* --- accès mémoire pour la vue --- */
  M.touch = function (a, n, w, tag) { this.acc.push({ a: a, n: n, w: !!w, tag: tag || null }); };

  M.step = function () {
    if (this.done) return false;
    this.steps++; this.log = []; this.acc = [];
    if (this.steps > this.maxSteps) { this.done = true; this.error = { msg: 'Plus de ' + this.maxSteps + ' étapes : boucle sans fin ?', kind: 'timeout', line: this.line, hint: 'Un PERFORM UNTIL doit finir par rendre sa condition vraie.' }; return false; }
    this.advance();
    return !this.done;
  };
  M.advance = function () {
    try {
      var r = this.gen.next();
      if (r.done) { if (!this.done) this.finish(0); }
      else this.line = r.value;
    } catch (e) {
      if (e instanceof Exit) { this.finish(e.code); return; }
      if (e instanceof RtError || e instanceof CompileError) { this.done = true; this.error = { msg: e.msg, kind: e.kind || 'compile', line: e.line || this.curLine, hint: e.hint }; this.line = this.error.line; this.say('✖ ' + e.msg, 'err'); return; }
      throw e;
    }
  };
  M.finish = function (code) { if (this.done) return; this.done = true; this.exitCode = code & 255; this.say('STOP RUN : le programme se termine.', 'ok'); };
  M.at = function (l) { this.curLine = l; return l; };

  M.boot = function* () {
    if (this.prog.fields.length) this.say('WORKING-STORAGE : les zones de données sont réservées et initialisées.');
    this.say('La PROCEDURE DIVISION démarre : les phrases s’exécutent dans l’ordre.', 'call');
    yield* this.run(0, this.prog.sentences.length);
    throw new Exit(0);
  };

  /* exécute les phrases [from, to) — une phrase peut contenir des blocs
   * (IF…END-IF, PERFORM…END-PERFORM) ; on marche dans ses tokens. */
  M.run = function* (from, to) {
    for (var i = from; i < to; i++) {
      var s = this.prog.sentences[i];
      yield* this.runStmts(s.toks, 0, s.toks.length, s);
    }
  };

  /* est-ce un PERFORM « en ligne » (avec END-PERFORM) et non PERFORM paragraphe ? */
  M.isInlinePerform = function (t, i) {
    var nx = t[i + 1];
    return !(nx && nx.t === 'word' && this.prog.paraByName[nx.up]);
  };
  function kindOf(w) { return w === 'IF' ? 'I' : w === 'EVALUATE' ? 'E' : 'P'; }
  /* index du END-xx qui ferme le bloc ouvert en t[a], ou `to` s'il n'y en a pas */
  M.blockEnd = function (t, a, to) {
    var st = [kindOf(t[a].up)];
    for (var i = a + 1; i < to; i++) {
      var w = t[i].up;
      if (w === 'IF') st.push('I');
      else if (w === 'EVALUATE') st.push('E');
      else if (w === 'PERFORM' && this.isInlinePerform(t, i)) st.push('P');
      else if (w === 'END-IF') { if (st[st.length - 1] === 'I') { st.pop(); if (!st.length) return i; } }
      else if (w === 'END-EVALUATE') { if (st[st.length - 1] === 'E') { st.pop(); if (!st.length) return i; } }
      else if (w === 'END-PERFORM') { if (st[st.length - 1] === 'P') { st.pop(); if (!st.length) return i; } }
    }
    return to;
  };
  /* première ELSE de l'IF ouvert en t[from-1], dans [from, to), hors blocs imbriqués */
  M.findElse = function (t, from, to) {
    var depth = 0;
    for (var i = from; i < to; i++) {
      var w = t[i].up;
      if (w === 'IF' || w === 'EVALUATE' || (w === 'PERFORM' && this.isInlinePerform(t, i))) depth++;
      else if (w === 'END-IF' || w === 'END-EVALUATE' || w === 'END-PERFORM') depth--;
      else if (depth === 0 && w === 'ELSE') return i;
    }
    return -1;
  };
  M.firstVerb = function (t, from, to) {
    for (var i = from; i < to; i++) if (isVerb(t[i].up)) return i;
    return to;
  };

  M.runStmts = function* (t, from, to, s) {
    var i = from;
    while (i < to) {
      var w = t[i].up;
      if (w === 'END-IF' || w === 'END-PERFORM' || w === 'END-EVALUATE' || w === 'ELSE' || w === 'WHEN' || w === 'THEN') { i++; continue; }
      if (!isVerb(w)) { i++; continue; }
      if (w === 'IF') { i = yield* this.doIf(t, i, to, s); continue; }
      if (w === 'PERFORM') { i = yield* this.doPerform(t, i, to, s); continue; }
      if (w === 'EVALUATE') { i = yield* this.doEvaluate(t, i, to, s); continue; }
      var j = this.firstVerb(t, i + 1, to);
      yield this.at(s.line);
      this.used[w] = (this.used[w] || 0) + 1;
      yield* this.execSimple(w, t.slice(i, j), s);
      i = j;
    }
  };

  M.execSimple = function* (v, t, s) {
    switch (v) {
      case 'DISPLAY': return yield* this.doDisplay(t, s);
      case 'MOVE': return yield* this.doMove(t, s);
      case 'SET': return yield* this.doMove(this.setToMove(t), s);
      case 'ACCEPT': return this.doAccept(t, s);
      case 'ADD': case 'SUBTRACT': case 'MULTIPLY': case 'DIVIDE': return this.doArith(v, t, s);
      case 'COMPUTE': return this.doCompute(t, s);
      case 'INITIALIZE': return this.doInitialize(t, s);
      case 'STOP': this.say('STOP RUN : fin du programme.', 'ok'); throw new Exit(0);
      case 'GOBACK': throw new Exit(0);
      case 'CONTINUE': case 'EXIT': case 'NEXT': this.say(v + ' : ne fait rien ici.'); return;
      case 'STRING': return this.doString(t, s);
      case 'INSPECT': return this.doInspect(t, s);
      case 'GO': this.fail('GO TO n’est pas géré par ce visualiseur (utilise PERFORM).', s.line); break;
      default: this.fail('instruction COBOL « ' + (t[0].v || v) + ' » inconnue.', s.line);
    }
  };
  /* SET x TO y  →  traité comme MOVE y TO x */
  M.setToMove = function (t) {
    var toIdx = t.findIndex(function (x) { return x.up === 'TO'; });
    if (toIdx < 0) return t;
    var dest = t.slice(1, toIdx), src = t.slice(toIdx + 1);
    return [{ t: 'word', up: 'MOVE', v: 'MOVE' }].concat(src, [{ t: 'word', up: 'TO', v: 'TO' }], dest);
  };
  M.fail = function (msg, line, hint) { throw new CompileError(msg, line, hint); };

  /* --- résolution d'un nom de champ (avec indice OCCURS) --- */
  M.resolve = function (t, i, s) {
    var tk = t[i];
    if (!tk || tk.t !== 'word') this.fail('nom de donnée attendu.', s.line);
    var f = this.prog.byName[tk.up];
    if (!f) this.fail('« ' + tk.v + ' » n’est pas déclaré dans la WORKING-STORAGE.', s.line);
    var consumed = 1, idx = 0;
    if (t[i + 1] && t[i + 1].t === 'op' && t[i + 1].v === '(') {
      var e = this.evalExprToks(t, i + 2, s);
      idx = Math.round(e.val) - 1;
      consumed = e.next - i;
      if (t[e.next] && t[e.next].v === ')') consumed++;
    }
    if (idx < 0 || idx >= f.occurs) this.fail('indice ' + (idx + 1) + ' hors de ' + f.name + ' (OCCURS ' + f.occurs + ').', s.line);
    return { f: f, a: f.off + idx * f.elemSize, consumed: consumed, idx: idx };
  };

  M.doDisplay = function* (t, s) {
    var self = this, parts = [], i = 1, noAdvance = false;
    while (i < t.length) {
      var tk = t[i];
      if (tk.up === 'WITH' || tk.up === 'NO') { if (tk.up === 'NO' && t[i + 1] && t[i + 1].up === 'ADVANCING') { noAdvance = true; i += 2; continue; } i++; continue; }
      if (tk.up === 'ADVANCING') { i++; continue; }
      if (tk.t === 'str') { parts.push(tk.v); i++; continue; }
      if (tk.t === 'num') { parts.push(tk.raw); i++; continue; }
      if (tk.up === 'SPACE' || tk.up === 'SPACES') { parts.push(' '); i++; continue; }
      if (tk.up === 'ZERO' || tk.up === 'ZEROS' || tk.up === 'ZEROES') { parts.push('0'); i++; continue; }
      if (tk.t === 'word') { var r = this.resolve(t, i, s); parts.push(this.display(r.f, r.a)); this.touch(r.a, r.f.elemSize, false, r.f.name); i += r.consumed; continue; }
      i++;
    }
    var text = parts.join('');
    this.emit(text + (noAdvance ? '' : '\n'));
    this.say('DISPLAY affiche ' + JSON.stringify(text.length > 50 ? text.slice(0, 49) + '…' : text) + (noAdvance ? ' (sans passer à la ligne)' : ' puis passe à la ligne'), 'io');
  };

  M.doMove = function* (t, s) {
    // MOVE source TO dest [dest...]
    var toIdx = t.findIndex(function (x) { return x.up === 'TO'; });
    if (toIdx < 0) this.fail('MOVE … TO … : il manque le mot TO.', s.line);
    var src = this.readOperand(t, 1, s, toIdx);
    var i = toIdx + 1;
    while (i < t.length) {
      var r = this.resolve(t, i, s);
      this.moveInto(src, r.f, r.a, s);
      this.say('MOVE ' + this.operandLabel(src) + ' → ' + r.f.name + (r.idx ? '(' + (r.idx + 1) + ')' : '') + ' = ' + JSON.stringify(this.display(r.f, r.a)), 'write');
      i += r.consumed;
      if (t[i] && t[i].v === ',') i++;
    }
    if (false) yield 0;
  };
  M.readOperand = function (t, i, s, stop) {
    var tk = t[i];
    if (tk.t === 'str') return { kind: 'str', v: tk.v };
    if (tk.t === 'num') return { kind: 'num', v: tk.v, raw: tk.raw };
    if (tk.up === 'SPACE' || tk.up === 'SPACES') return { kind: 'str', v: ' ', fill: true };
    if (tk.up === 'ZERO' || tk.up === 'ZEROS' || tk.up === 'ZEROES') return { kind: 'num', v: 0 };
    if (tk.up === 'HIGH-VALUE' || tk.up === 'HIGH-VALUES') return { kind: 'str', v: '￿', fill: true };
    if (tk.up === 'LOW-VALUE' || tk.up === 'LOW-VALUES') return { kind: 'str', v: '\0', fill: true };
    var r = this.resolve(t, i, s);
    return { kind: 'field', f: r.f, a: r.a };
  };
  M.operandLabel = function (o) {
    if (o.kind === 'str') return JSON.stringify(o.v);
    if (o.kind === 'num') return o.raw || String(o.v);
    return o.f.name;
  };
  M.moveInto = function (src, f, a, s) {
    if (f.kind === 'alpha') {
      var str;
      if (src.kind === 'str') str = src.fill ? src.v.repeat(f.elemSize) : src.v;
      else if (src.kind === 'num') str = String(src.v);
      else str = this.display(src.f, src.a);
      this.storeField(f, a, str.slice(0, f.elemSize).padEnd ? str : str);
      // cadrage à gauche pour alpha
      var o = a - DATA_BASE;
      for (var k = 0; k < f.elemSize; k++) { this.buf[o + k] = k < str.length ? str.charCodeAt(k) & 255 : 32; this.ini[o + k] = 1; }
      this.touch(a, f.elemSize, true);
    } else {
      var num;
      if (src.kind === 'num') num = src.v;
      else if (src.kind === 'str') num = parseFloat(src.v.replace(/[^0-9.+-]/g, '')) || 0;
      else num = this.numValue(src.f, src.a);
      this.storeField(f, a, num);
    }
  };

  M.doAccept = function (t, s) {
    var r = this.resolve(t, 1, s);
    var val = this.stdinPos < this.stdinLines.length ? this.stdinLines[this.stdinPos++] : '';
    if (this.stdinPos > this.stdinLines.length) { /* rien */ }
    this.moveInto({ kind: 'str', v: val }, r.f, r.a, s);
    this.say('ACCEPT ' + r.f.name + ' : lit « ' + val + ' » sur l’entrée → ' + JSON.stringify(this.display(r.f, r.a)), 'io');
  };

  M.doArith = function (v, t, s) {
    // ADD a [b...] TO dest [GIVING g] ; SUBTRACT a FROM dest ; MULTIPLY a BY dest [GIVING g] ; DIVIDE a INTO/BY dest [GIVING g] [REMAINDER r]
    var self = this, giving = t.findIndex(function (x) { return x.up === 'GIVING'; });
    var remIdx = t.findIndex(function (x) { return x.up === 'REMAINDER'; });
    if (v === 'ADD') {
      var toIdx = t.findIndex(function (x) { return x.up === 'TO'; });
      var sum = 0, i = 1, end = toIdx >= 0 ? toIdx : (giving >= 0 ? giving : t.length);
      while (i < end) { var op = this.readOperand(t, i, s); sum += this.operandNum(op); i += this.opTokLen(t, i); }
      if (giving >= 0) {
        if (toIdx >= 0) { var base = 0; var j = toIdx + 1; while (j < giving) { base += this.operandNum(this.readOperand(t, j, s)); j += this.opTokLen(t, j); } sum += base; }
        this.assignTargets(t, giving + 1, s, function () { return sum; }, v);
      } else {
        this.assignTargets(t, toIdx + 1, s, function (cur) { return cur + sum; }, v);
      }
    } else if (v === 'SUBTRACT') {
      var fromIdx = t.findIndex(function (x) { return x.up === 'FROM'; });
      var amt = 0, i2 = 1; while (i2 < fromIdx) { amt += this.operandNum(this.readOperand(t, i2, s)); i2 += this.opTokLen(t, i2); }
      if (giving >= 0) { var minuend = this.operandNum(this.readOperand(t, fromIdx + 1, s)); this.assignTargets(t, giving + 1, s, function () { return minuend - amt; }, v); }
      else this.assignTargets(t, fromIdx + 1, s, function (cur) { return cur - amt; }, v);
    } else if (v === 'MULTIPLY') {
      var byIdx = t.findIndex(function (x) { return x.up === 'BY'; });
      var factor = this.operandNum(this.readOperand(t, 1, s));
      if (giving >= 0) { var m2 = this.operandNum(this.readOperand(t, byIdx + 1, s)); this.assignTargets(t, giving + 1, s, function () { return factor * m2; }, v); }
      else this.assignTargets(t, byIdx + 1, s, function (cur) { return cur * factor; }, v);
    } else if (v === 'DIVIDE') {
      var intoIdx = t.findIndex(function (x) { return x.up === 'INTO'; });
      var byIdx2 = t.findIndex(function (x) { return x.up === 'BY'; });
      var divisor, dividend, resFn, targetStart;
      if (intoIdx >= 0) {
        divisor = this.operandNum(this.readOperand(t, 1, s));
        if (divisor === 0) this.fail('division par zéro.', s.line, 'Vérifie le diviseur avant un DIVIDE.');
        if (giving >= 0) { dividend = this.operandNum(this.readOperand(t, intoIdx + 1, s)); this.assignTargets(t, giving + 1, s, function () { return dividend / divisor; }, v, remIdx >= 0 ? dividend % divisor : null, t, remIdx, s); }
        else this.assignTargets(t, intoIdx + 1, s, function (cur) { return cur / divisor; }, v);
      } else if (byIdx2 >= 0) {
        dividend = this.operandNum(this.readOperand(t, 1, s));
        divisor = this.operandNum(this.readOperand(t, byIdx2 + 1, s));
        if (divisor === 0) this.fail('division par zéro.', s.line, 'Vérifie le diviseur avant un DIVIDE.');
        this.assignTargets(t, (giving >= 0 ? giving : byIdx2) + 1, s, function () { return dividend / divisor; }, v, remIdx >= 0 ? dividend % divisor : null, t, remIdx, s);
      }
    }
  };
  M.opTokLen = function (t, i) {
    // longueur en tokens d'un opérande (champ avec éventuel indice)
    var tk = t[i];
    if (tk.t === 'word' && t[i + 1] && t[i + 1].v === '(') { var d = 2; while (t[i + d] && t[i + d].v !== ')') d++; return d + 1; }
    return 1;
  };
  M.operandNum = function (op) {
    if (op.kind === 'num') return op.v;
    if (op.kind === 'str') return parseFloat(op.v) || 0;
    return this.numValue(op.f, op.a);
  };
  M.assignTargets = function (t, start, s, fn, verb, rem, tt, remIdx, ss) {
    var i = start, self = this, done = false, parts = [];
    while (i < t.length) {
      if (t[i].up === 'REMAINDER' || t[i].up === 'GIVING' || t[i].up === 'ROUNDED') { if (t[i].up === 'REMAINDER') break; i++; continue; }
      var r = this.resolve(t, i, s);
      var cur = this.numValue(r.f, r.a);
      var val = fn(cur);
      var rounded = t.some(function (x) { return x.up === 'ROUNDED'; });
      if (!rounded && r.f.dec !== undefined) { /* la troncature se fait au stockage */ }
      this.storeField(r.f, r.a, val);
      parts.push(r.f.name + ' = ' + this.display(r.f, r.a));
      i += r.consumed;
      done = true;
      if (t[i] && t[i].v === ',') i++;
    }
    if (rem != null && remIdx >= 0) {
      var rr = this.resolve(tt, remIdx + 1, ss);
      this.storeField(rr.f, rr.a, rem);
      parts.push('reste ' + rr.f.name + ' = ' + this.display(rr.f, rr.a));
    }
    if (!done) this.fail(verb + ' : aucune destination trouvée.', s.line);
    this.say(verb + ' → ' + parts.join(', '), 'write');
  };

  M.doCompute = function (t, s) {
    var eqIdx = t.findIndex(function (x) { return x.v === '='; });
    if (eqIdx < 0) this.fail('COMPUTE cible = expression : il manque le signe =.', s.line);
    var e = this.evalExprToks(t, eqIdx + 1, s);
    var parts = [], i = 1;
    while (i < eqIdx) {
      if (t[i].up === 'ROUNDED') { i++; continue; }
      var r = this.resolve(t, i, s);
      this.storeField(r.f, r.a, e.val);
      parts.push(r.f.name + ' = ' + this.display(r.f, r.a));
      i += r.consumed;
    }
    this.say('COMPUTE : ' + this.src.slice(0).split('\n')[s.line - 1].trim() + ' → ' + parts.join(', '), 'write');
  };

  /* évaluation d'expression arithmétique sur tokens (à partir de i) */
  M.evalExprToks = function (t, i, s) {
    var self = this, p = i;
    function peek() { return t[p]; }
    function prim() {
      var tk = t[p];
      if (!tk) self.fail('expression incomplète.', s.line);
      if (tk.t === 'op' && tk.v === '(') { p++; var e = addsub(); if (t[p] && t[p].v === ')') p++; return e; }
      if (tk.t === 'op' && tk.v === '-') { p++; return -prim(); }
      if (tk.t === 'op' && tk.v === '+') { p++; return prim(); }
      if (tk.t === 'num') { p++; return tk.v; }
      if (tk.t === 'word') {
        if (tk.up === 'ZERO' || tk.up === 'ZEROS') { p++; return 0; }
        var r = self.resolve(t, p, s); p += r.consumed; self.touch(r.a, r.f.elemSize, false, r.f.name); return self.numValue(r.f, r.a);
      }
      self.fail('terme d’expression inattendu : « ' + (tk.v !== undefined ? tk.v : tk.raw) + ' ».', s.line);
    }
    function power() { var a = prim(); while (t[p] && t[p].v === '**') { p++; a = Math.pow(a, prim()); } return a; }
    function muldiv() { var a = power(); while (t[p] && (t[p].v === '*' || t[p].v === '/')) { var op = t[p].v; p++; var b = power(); if (op === '/' && b === 0) self.fail('division par zéro dans l’expression.', s.line); a = op === '*' ? a * b : a / b; } return a; }
    function addsub() { var a = muldiv(); while (t[p] && (t[p].v === '+' || t[p].v === '-') && t[p].t === 'op') { var op = t[p].v; p++; var b = muldiv(); a = op === '+' ? a + b : a - b; } return a; }
    var val = addsub();
    return { val: val, next: p };
  };

  /* --- conditions --- */
  M.evalCond = function (t, i, s) {
    // forme simple : operande relop operande  [AND/OR ...]
    var self = this, p = i;
    function operand() {
      var tk = t[p];
      if (tk.t === 'str') { p++; return { kind: 'str', v: tk.v }; }
      if (tk.t === 'num') { p++; return { kind: 'num', v: tk.v }; }
      if (tk.up === 'ZERO' || tk.up === 'ZEROS') { p++; return { kind: 'num', v: 0 }; }
      if (tk.up === 'SPACE' || tk.up === 'SPACES') { p++; return { kind: 'str', v: ' ' }; }
      var r = self.resolve(t, p, s); p += r.consumed; return { kind: 'field', f: r.f, a: r.a };
    }
    function val(o, other) {
      if (o.kind === 'num') return o.v;
      if (o.kind === 'str') return o.v;
      if (o.f.kind === 'alpha' || (other && other.kind === 'str')) return self.readText(o.f, o.a).replace(/\s+$/, '');
      return self.numValue(o.f, o.a);
    }
    function simple() {
      if (t[p] && (t[p].v === '(')) { p++; var e = expr(); if (t[p] && t[p].v === ')') p++; return e; }
      if (t[p] && t[p].up === 'NOT') { p++; return !simple(); }
      var a = operand();
      // relation
      var relToks = { '=': '=', '<': '<', '>': '>', '<=': '<=', '>=': '>=', '<>': '<>' };
      var rel = null, neg = false;
      if (t[p] && t[p].up === 'IS') p++;
      if (t[p] && t[p].up === 'NOT') { neg = true; p++; }
      if (t[p] && t[p].t === 'op' && relToks[t[p].v]) { rel = t[p].v; p++; }
      else if (t[p] && t[p].up === 'EQUAL') { rel = '='; p++; if (t[p] && t[p].up === 'TO') p++; }
      else if (t[p] && t[p].up === 'GREATER') { rel = '>'; p++; if (t[p] && t[p].up === 'THAN') p++; if (t[p] && t[p].up === 'OR') { p++; if (t[p] && t[p].up === 'EQUAL') { rel = '>='; p++; if (t[p] && t[p].up === 'TO') p++; } } }
      else if (t[p] && t[p].up === 'LESS') { rel = '<'; p++; if (t[p] && t[p].up === 'THAN') p++; if (t[p] && t[p].up === 'OR') { p++; if (t[p] && t[p].up === 'EQUAL') { rel = '<='; p++; if (t[p] && t[p].up === 'TO') p++; } } }
      else if (t[p] && (t[p].up === 'ZERO' || t[p].up === 'POSITIVE' || t[p].up === 'NEGATIVE')) {
        var cls = t[p].up; p++;
        var n = val(a); var res = cls === 'ZERO' ? n === 0 : cls === 'POSITIVE' ? n > 0 : n < 0;
        return neg ? !res : res;
      } else {
        // champ booléen 88 ou valeur seule : vrai si non nul / non vide
        var raw = a.kind === 'field' ? val(a) : a.v;
        return !!raw;
      }
      var b = operand();
      var av = val(a, b), bv = val(b, a);
      if (typeof av === 'string' || typeof bv === 'string') { av = String(av); bv = String(bv); }
      var r;
      switch (rel) { case '=': r = av === bv; break; case '<': r = av < bv; break; case '>': r = av > bv; break; case '<=': r = av <= bv; break; case '>=': r = av >= bv; break; case '<>': r = av !== bv; break; default: r = false; }
      return neg ? !r : r;
    }
    function andTerm() { var a = simple(); while (t[p] && t[p].up === 'AND') { p++; var b = simple(); a = a && b; } return a; }
    function expr() { var a = andTerm(); while (t[p] && t[p].up === 'OR') { p++; var b = andTerm(); a = a || b; } return a; }
    var result = expr();
    return { val: result, next: p };
  };

  /* IF à t[from] ; exécute la bonne branche ; renvoie l'index après END-IF */
  M.doIf = function* (t, from, to, s) {
    yield this.at(s.line);
    this.used.IF = (this.used.IF || 0) + 1;
    var endIf = this.blockEnd(t, from, to);
    var c = this.evalCond(t, from + 1, s);
    var p = c.next;
    if (t[p] && t[p].up === 'THEN') p++;
    var elseIdx = this.findElse(t, p, endIf);
    this.say('IF : condition ' + (c.val ? 'vraie → branche THEN' : 'fausse → branche ELSE (ou on saute)'), c.val ? 'yes' : 'no');
    if (c.val) yield* this.runStmts(t, p, elseIdx >= 0 ? elseIdx : endIf, s);
    else if (elseIdx >= 0) yield* this.runStmts(t, elseIdx + 1, endIf, s);
    return endIf < to ? endIf + 1 : to;
  };

  /* PERFORM à t[from] ; renvoie l'index où continuer */
  M.doPerform = function* (t, from, to, s) {
    yield this.at(s.line);
    this.used.PERFORM = (this.used.PERFORM || 0) + 1;
    var self = this;
    // PERFORM nom-paragraphe (pas de END-PERFORM)
    if (t[from + 1] && t[from + 1].t === 'word' && this.prog.paraByName[t[from + 1].up]) {
      var para = this.prog.paraByName[t[from + 1].up], thru = null, i = from + 2;
      if (t[i] && (t[i].up === 'THRU' || t[i].up === 'THROUGH')) { thru = this.prog.paraByName[t[i + 1].up]; i += 2; }
      var pe = this.firstVerb(t, i, to); // fin de la clause PERFORM (jamais de bloc)
      // en pratique les options ne contiennent pas de verbe : pe = fin de phrase
      pe = to;
      var body = function* () { yield* self.runPara(para, thru); };
      yield* this.performClause(t, i, pe, s, body, para.name);
      return pe;
    }
    // PERFORM … END-PERFORM (en ligne)
    var endP = this.blockEnd(t, from, to);
    var bodyStart = this.firstVerb(t, from + 1, endP);
    var inline = function* () { yield* self.runStmts(t, bodyStart, endP, s); };
    yield* this.performClause(t, from + 1, bodyStart, s, inline, 'bloc');
    return endP < to ? endP + 1 : to;
  };
  /* exécute la boucle d'un PERFORM d'après ses options dans t[optFrom, optTo) */
  M.performClause = function* (t, optFrom, optTo, s, body, label) {
    var findIn = function (kw) { for (var i = optFrom; i < optTo; i++) if (t[i].up === kw) return i; return -1; };
    var timesI = findIn('TIMES'), untilI = findIn('UNTIL'), varyI = findIn('VARYING');
    if (varyI >= 0) { yield* this.performVarying(t, varyI, optTo, s, body); return; }
    if (timesI >= 0) {
      var n = this.operandNum(this.readOperand(t, optFrom, s));
      this.say('PERFORM ' + label + ' ' + n + ' fois', 'call');
      for (var k = 0; k < n; k++) yield* body();
      return;
    }
    if (untilI >= 0) {
      var after = t[untilI - 1] && t[untilI - 1].up === 'AFTER' || (t[untilI - 2] && t[untilI - 2].up === 'TEST' && t[untilI - 1] && t[untilI - 1].up === 'AFTER');
      this.say('PERFORM ' + label + ' UNTIL …', 'call');
      var g = 0;
      if (after) { do { yield* body(); } while (!this.evalCond(t, untilI + 1, s).val && ++g < 1e6); }
      else { while (!this.evalCond(t, untilI + 1, s).val) { yield* body(); if (++g > 1e6) this.fail('PERFORM UNTIL sans fin : la condition ne devient jamais vraie.', s.line); } }
      return;
    }
    this.say('PERFORM ' + label + ' (une fois)', 'call');
    yield* body();
  };
  M.runPara = function* (para, thru) {
    var end = thru ? thru.end : para.end;
    this.callStack.push(para.name);
    yield* this.run(para.start, end);
    this.callStack.pop();
  };
  M.performVarying = function* (t, varyIdx, optTo, s, body) {
    var self = this, find = function (kw) { for (var i = varyIdx; i < optTo; i++) if (t[i].up === kw) return i; return -1; };
    var vr = this.resolve(t, varyIdx + 1, s);
    var fromIdx = find('FROM'), byIdx = find('BY'), untilIdx = find('UNTIL');
    var from = this.operandNum(this.readOperand(t, fromIdx + 1, s));
    var by = byIdx >= 0 ? this.operandNum(this.readOperand(t, byIdx + 1, s)) : 1;
    this.storeField(vr.f, vr.a, from);
    this.say('PERFORM VARYING ' + vr.f.name + ' FROM ' + from + ' BY ' + by, 'call');
    var guard = 0;
    while (!this.evalCond(t, untilIdx + 1, s).val) {
      yield* body();
      this.storeField(vr.f, vr.a, this.numValue(vr.f, vr.a) + by);
      if (++guard > 1e6) this.fail('PERFORM VARYING sans fin.', s.line);
    }
  };

  M.doInitialize = function (t, s) {
    for (var i = 1; i < t.length; i++) {
      if (t[i].t !== 'word') continue;
      var f = this.prog.byName[t[i].up];
      if (!f) continue;
      var self = this;
      collectEach([f], function (x) {
        if (x.children.length || x.cond) return;
        for (var oc = 0; oc < x.occurs; oc++) { var a = x.off + oc * x.elemSize; self.storeField(x, a, x.kind === 'alpha' ? ' '.repeat(x.elemSize) : 0); }
      });
      this.say('INITIALIZE ' + f.name + ' : remis à ' + (f.kind === 'alpha' ? 'espaces' : '0'), 'write');
    }
  };

  M.doString = function (t, s) {
    // STRING a b ... DELIMITED BY ... INTO dest
    var intoIdx = t.findIndex(function (x) { return x.up === 'INTO'; });
    if (intoIdx < 0) this.fail('STRING … INTO cible : il manque INTO.', s.line);
    var parts = [], i = 1;
    while (i < intoIdx) {
      if (t[i].up === 'DELIMITED') { i++; if (t[i] && t[i].up === 'BY') i++; if (t[i] && (t[i].up === 'SIZE')) { i++; } else { i += this.opTokLen(t, i); } continue; }
      var op = this.readOperand(t, i, s);
      parts.push(op.kind === 'field' ? this.display(op.f, op.a).replace(/\s+$/, '') : (op.kind === 'str' ? op.v : String(op.v)));
      i += this.opTokLen(t, i);
    }
    var r = this.resolve(t, intoIdx + 1, s);
    this.moveInto({ kind: 'str', v: parts.join('') }, r.f, r.a, s);
    this.say('STRING → ' + r.f.name + ' = ' + JSON.stringify(this.display(r.f, r.a)), 'write');
  };

  M.doInspect = function (t, s) {
    // INSPECT champ REPLACING ALL 'x' BY 'y'  / TALLYING cnt FOR ALL 'x'
    var r = this.resolve(t, 1, s);
    var text = this.readText(r.f, r.a);
    var replIdx = t.findIndex(function (x) { return x.up === 'REPLACING'; });
    var tallyIdx = t.findIndex(function (x) { return x.up === 'TALLYING'; });
    if (replIdx >= 0) {
      // ALL 'x' BY 'y'
      var fromTok = t.find(function (x, i) { return i > replIdx && x.t === 'str'; });
      var byIdx = t.findIndex(function (x) { return x.up === 'BY'; });
      var toTok = t[byIdx + 1];
      if (fromTok && toTok) { text = text.split(fromTok.v).join(toTok.t === 'str' ? toTok.v : toTok.v); this.storeField(r.f, r.a, text); this.say('INSPECT REPLACING → ' + JSON.stringify(this.display(r.f, r.a)), 'write'); }
    } else if (tallyIdx >= 0) {
      var cnt = this.resolve(t, tallyIdx + 1, s);
      var forStr = t.find(function (x, i) { return i > tallyIdx && x.t === 'str'; });
      if (forStr) { var c = text.split(forStr.v).length - 1; this.storeField(cnt.f, cnt.a, this.numValue(cnt.f, cnt.a) + c); this.say('INSPECT TALLYING ' + cnt.f.name + ' = ' + this.display(cnt.f, cnt.a), 'write'); }
    }
  };

  /* EVALUATE à t[from] ; renvoie l'index après END-EVALUATE */
  M.doEvaluate = function* (t, from, to, s) {
    yield this.at(s.line);
    this.used.EVALUATE = (this.used.EVALUATE || 0) + 1;
    var endEv = this.blockEnd(t, from, to);
    // sujet : tokens entre from+1 et le premier WHEN de niveau 0
    var firstWhen = -1, depth = 0;
    for (var i = from + 1; i < endEv; i++) {
      var w = t[i].up;
      if (w === 'IF' || w === 'EVALUATE' || (w === 'PERFORM' && this.isInlinePerform(t, i))) depth++;
      else if (w === 'END-IF' || w === 'END-EVALUATE' || w === 'END-PERFORM') depth--;
      else if (depth === 0 && w === 'WHEN') { firstWhen = i; break; }
    }
    if (firstWhen < 0) { this.say('EVALUATE sans WHEN.'); return endEv < to ? endEv + 1 : to; }
    var subj;
    if (t[from + 1] && t[from + 1].up === 'TRUE') subj = { kind: 'bool', v: true };
    else subj = this.readOperand(t, from + 1, s);
    // découpe les branches WHEN
    var branches = [], cur = null;
    depth = 0;
    for (i = firstWhen; i < endEv; i++) {
      var ww = t[i].up;
      if (ww === 'IF' || ww === 'EVALUATE' || (ww === 'PERFORM' && this.isInlinePerform(t, i))) depth++;
      else if (ww === 'END-IF' || ww === 'END-EVALUATE' || ww === 'END-PERFORM') depth--;
      if (depth === 0 && ww === 'WHEN') { cur = { from: i, bodyStart: -1, end: endEv }; if (branches.length) branches[branches.length - 1].end = i; branches.push(cur); }
    }
    for (var b = 0; b < branches.length; b++) {
      var wStart = branches[b].from, bodyStart = this.firstVerb(t, wStart + 1, branches[b].end);
      var isOther = t[wStart + 1] && t[wStart + 1].up === 'OTHER';
      var match = false;
      if (isOther) match = true;
      else if (subj.kind === 'bool') match = this.evalCond(t, wStart + 1, s).val;
      else {
        var wop = this.readOperand(t, wStart + 1, s);
        if (subj.kind === 'field' && subj.f.kind === 'alpha') {
          var av = this.display(subj.f, subj.a).replace(/\s+$/, ''), bv = wop.kind === 'str' ? wop.v : (wop.kind === 'field' ? this.display(wop.f, wop.a).replace(/\s+$/, '') : String(wop.v));
          match = av === bv;
        } else {
          var an = subj.kind === 'field' ? this.numValue(subj.f, subj.a) : subj.v;
          var bn = this.operandNum(wop);
          match = an === bn;
        }
      }
      if (match) {
        this.say('EVALUATE : branche WHEN ' + (isOther ? 'OTHER' : this.operandLabel(this.readOperand(t, wStart + 1, s))) + ' retenue', 'yes');
        yield* this.runStmts(t, bodyStart, branches[b].end, s);
        return endEv < to ? endEv + 1 : to;
      }
    }
    this.say('EVALUATE : aucune branche WHEN ne correspond', 'no');
    return endEv < to ? endEv + 1 : to;
  };

  /* ---------------------------------------------------------------- vue mémoire */
  M.view = function () {
    var self = this, objs = [];
    this.prog.fields.forEach(function (f) { buildObj(f, objs, self); });
    var region = { kind: 'data', title: 'WORKING-STORAGE', info: 'Les zones de données du programme. Chaque champ a une taille fixe définie par sa clause PIC (9 = un chiffre, X = un caractère).', groups: [{ title: '', objs: objs }], empty: 'Aucune donnée déclarée.' };
    return { regions: [region], acc: this.acc };
  };
  function buildObj(f, objs, self) {
    if (f.children.length) {
      // groupe : on affiche ses enfants (une occurrence) comme objets séparés avec préfixe
      f.children.forEach(function (c) { buildObj(c, objs, self); });
      return;
    }
    if (f.cond) return;
    for (var oc = 0; oc < f.occurs; oc++) {
      var a = f.off + oc * f.elemSize, cells = [], o = a - DATA_BASE;
      for (var i = 0; i < f.elemSize; i++) {
        var b = self.buf[o + i], ch = f.kind === 'alpha' ? U.glyph(b) : String.fromCharCode(b);
        cells.push({ a: a + i, n: 1, lbl: '', val: ch, kind: f.kind === 'alpha' ? 'char' : 'num', bytes: [b], cls: self.ini[o + i] ? '' : 'garbage', sub: f.kind === 'alpha' ? String(b) : undefined });
      }
      var name = f.name + (f.occurs > 1 ? '(' + (oc + 1) + ')' : '');
      var disp = '';
      try { disp = self.display(f, a); } catch (e) { disp = ''; }
      objs.push({ key: 'w' + a, name: name, type: 'PIC ' + (f.pic || '') + (f.signed ? ' S' : ''), a: a, n: f.elemSize, cells: cells, region: 'data', isArr: true, note: f.kind === 'num' ? '= ' + disp : '' });
    }
  }
  M.peekVar = function (name) {
    var f = this.prog.byName[(name || '').toUpperCase()];
    if (!f || f.children.length) return null;
    var a = f.off;
    if (f.kind === 'alpha') return { k: 'str', s: this.readText(f, a) };
    return { k: 'num', v: this.numValue(f, a) };
  };

  /* ---------------------------------------------------------------- API */
  O42.engines.cobol = {
    name: 'COBOL',
    create: function (src, opts) {
      var prog;
      try { prog = new Program(src); }
      catch (e) { if (e instanceof CompileError) return { compileError: { msg: e.msg, line: e.line, hint: e.hint } }; throw e; }
      return new Machine(prog, opts);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
