/* =========================================================================
 *  42 ORIGINS — utilitaires communs
 *  Formatage d'adresses et d'octets, printf partagé (C et assembleur),
 *  erreurs d'exécution. Aucun accès au DOM (utilisable sous Node).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.engines = O42.engines || {};
  var U = O42.util = {};

  U.hex = function (n, w) {
    var s;
    if (typeof n === 'bigint') s = BigInt.asUintN(64, n).toString(16);
    else if (n < 0) s = BigInt.asUintN(64, BigInt(Math.trunc(n))).toString(16);
    else s = Math.trunc(n).toString(16);
    while (s.length < (w || 0)) s = '0' + s;
    return '0x' + s;
  };

  /* représentation lisible d'un octet (case mémoire d'un char) */
  U.glyph = function (c) {
    c &= 255;
    if (c === 0) return '\\0';
    if (c === 10) return '\\n';
    if (c === 9) return '\\t';
    if (c === 13) return '\\r';
    if (c === 32) return '␣';
    if (c > 32 && c < 127) return String.fromCharCode(c);
    return '\\x' + (c < 16 ? '0' : '') + c.toString(16);
  };

  /* chaîne JS (octets) → représentation entre guillemets façon C */
  U.quote = function (bytes, max) {
    var s = '"', n = Math.min(bytes.length, max || 60);
    for (var i = 0; i < n; i++) {
      var c = bytes[i];
      if (c === 10) s += '\\n'; else if (c === 9) s += '\\t'; else if (c === 0) s += '\\0';
      else if (c === 34) s += '\\"'; else if (c === 92) s += '\\\\';
      else if (c < 32 || c === 127) s += '\\x' + (c < 16 ? '0' : '') + c.toString(16);
      else s += String.fromCharCode(c);
    }
    if (bytes.length > n) s += '…';
    return s + '"';
  };

  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* texte → octets UTF-8, et inverse */
  U.utf8 = function (s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var c = s.codePointAt(i);
      if (c > 0xffff) i++;
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  };
  U.decode = function (bytes) {
    var s = '', i = 0, n = bytes.length;
    while (i < n) {
      var c = bytes[i];
      if (c < 0x80) { s += String.fromCharCode(c); i++; continue; }
      var need = c >= 0xf0 ? 3 : c >= 0xe0 ? 2 : c >= 0xc0 ? 1 : -1, cp = c & (0x3f >> need);
      if (need < 0 || i + need >= n + (need ? 0 : 1)) { s += '\ufffd'; i++; continue; }
      var okk = true;
      for (var k = 1; k <= need; k++) { var d = bytes[i + k]; if (d === undefined || (d & 0xc0) !== 0x80) { okk = false; break; } cp = (cp << 6) | (d & 63); }
      if (!okk) { s += '\ufffd'; i++; continue; }
      s += String.fromCodePoint(cp); i += need + 1;
    }
    return s;
  };

  /* générateur pseudo-aléatoire déterministe (valeurs « résiduelles » de la mémoire) */
  U.rng = function (seed) {
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s; };
  };

  /* erreur à l'exécution (segfault, double free…) ; kind sert au style */
  U.RtError = function (msg, kind, hint) { this.msg = msg; this.kind = kind || 'runtime'; this.hint = hint || ''; };
  U.CompileError = function (msg, line, hint) { this.msg = msg; this.line = line; this.hint = hint || ''; };

  /* printf partagé.
   *  fmt     : tableau d'octets du format
   *  arg(k)  : renvoie l'argument suivant ; k = 'int' | 'uint' | 'long' | 'ulong' | 'double' | 'ptr'
   *  str(a)  : lit la chaîne C à l'adresse a (tableau d'octets) */
  U.cformat = function (fmt, arg, str) {
    var out = [], i = 0, n = fmt.length;
    function push(s) { for (var k = 0; k < s.length; k++) out.push(s.charCodeAt(k) & 255); }
    function pushBytes(b) { for (var k = 0; k < b.length; k++) out.push(b[k]); }
    while (i < n) {
      var c = fmt[i++];
      if (c !== 37) { out.push(c); continue; }
      var flags = '', width = '', prec = null, len = '';
      while (i < n && '-+ 0#'.indexOf(String.fromCharCode(fmt[i])) >= 0) flags += String.fromCharCode(fmt[i++]);
      if (fmt[i] === 42) { width = String(arg('int')); i++; }
      while (i < n && fmt[i] >= 48 && fmt[i] <= 57) width += String.fromCharCode(fmt[i++]);
      if (fmt[i] === 46) {
        i++; prec = '';
        if (fmt[i] === 42) { prec = String(arg('int')); i++; }
        while (i < n && fmt[i] >= 48 && fmt[i] <= 57) prec += String.fromCharCode(fmt[i++]);
        prec = +prec || 0;
      }
      while (i < n && 'hlLzjt'.indexOf(String.fromCharCode(fmt[i])) >= 0) len += String.fromCharCode(fmt[i++]);
      var conv = String.fromCharCode(fmt[i++] || 0), body = '', big = len === 'l' || len === 'll' || len === 'z' || len === 'j' || len === 't';
      var w = +width || 0, left = flags.indexOf('-') >= 0, zero = flags.indexOf('0') >= 0 && !left;
      var raw = null;
      switch (conv) {
        case 'd': case 'i': {
          var v = arg(big ? 'long' : 'int');
          if (len === 'hh') v = (v << 24) >> 24; else if (len === 'h') v = (v << 16) >> 16;
          body = String(Math.abs(v));
          if (prec !== null) while (body.length < prec) body = '0' + body;
          if (v < 0) body = '-' + body; else if (flags.indexOf('+') >= 0) body = '+' + body; else if (flags.indexOf(' ') >= 0) body = ' ' + body;
          break;
        }
        case 'u': case 'x': case 'X': case 'o': {
          var u = arg(big ? 'ulong' : 'uint');
          if (len === 'hh') u &= 255; else if (len === 'h') u &= 0xffff;
          var b = BigInt.asUintN(64, BigInt(Math.trunc(u)));
          body = conv === 'u' ? b.toString(10) : conv === 'o' ? b.toString(8) : b.toString(16);
          if (conv === 'X') body = body.toUpperCase();
          if (prec !== null) while (body.length < prec) body = '0' + body;
          if (flags.indexOf('#') >= 0 && b !== 0n && conv !== 'u') body = (conv === 'o' ? '0' : conv === 'X' ? '0X' : '0x') + body;
          break;
        }
        case 'c': raw = [arg('int') & 255]; break;
        case 's': {
          var a = arg('ptr');
          raw = a === 0 ? U.utf8('(null)') : str(a);
          if (prec !== null) raw = raw.slice(0, prec);
          zero = false;
          break;
        }
        case 'p': {
          var p = arg('ptr');
          body = p === 0 ? '(nil)' : U.hex(p);
          zero = false;
          break;
        }
        case 'f': case 'F': case 'e': case 'g': {
          var f = arg('double'), pr = prec === null ? 6 : prec;
          body = conv === 'e' ? f.toExponential(pr) : conv === 'g' ? String(+f.toPrecision(pr || 1)) : f.toFixed(pr);
          if (f >= 0 && flags.indexOf('+') >= 0) body = '+' + body;
          break;
        }
        case '%': out.push(37); continue;
        default: push('%' + flags + width + len + conv); continue;
      }
      var blen = raw ? raw.length : body.length;
      var pad = w > blen ? w - blen : 0;
      if (raw) {
        if (!left) push(' '.repeat(pad));
        pushBytes(raw);
        if (left) push(' '.repeat(pad));
      } else if (zero && pad) {
        var sign = /^[+\- ]/.test(body) ? body[0] : '';
        var pre = /^0[xX]/.test(body.slice(sign.length)) ? body.substr(sign.length, 2) : '';
        push(sign + pre + '0'.repeat(pad) + body.slice(sign.length + pre.length));
      } else {
        if (!left) push(' '.repeat(pad));
        pushBytes(U.utf8(body));
        if (left) push(' '.repeat(pad));
      }
    }
    return out;
  };

  /* allocateur commun (C et assembleur) : blocs alignés sur 16, en-tête de 16 octets
   * comme glibc, jamais réutilisés (pour que les blocs libérés restent visibles). */
  U.Heap = function (base, size) {
    this.base = base; this.size = size; this.end = base + size;
    this.next = base + 0x290; // glibc place d'abord sa structure tcache (0x290 octets)
    this.blocks = [];
    this.count = 0;
  };
  U.Heap.prototype.alloc = function (n, line, who) {
    // taille d'un « chunk » glibc : max(32, arrondi16(n + 8)) ; l'utilisateur reçoit chunk + 16
    var cs = Math.max(32, Math.ceil((n + 8) / 16) * 16), a = this.next + 16;
    if (this.next + cs + 16 > this.end) return null;
    // cap = distance jusqu'au bloc suivant (zone utilisable + en-tête du suivant)
    var b = { a: a, n: n, cap: cs, chunk: this.next, freed: false, line: line, who: who || 'malloc', id: ++this.count, hint: null, freedLine: 0 };
    this.blocks.push(b);
    this.next += cs;
    return b;
  };
  U.Heap.prototype.at = function (a) {
    for (var i = 0; i < this.blocks.length; i++) if (this.blocks[i].a === a) return this.blocks[i];
    return null;
  };
  /* bloc qui contient [a, a+n) ; renvoie {b, ok, reason} */
  U.Heap.prototype.find = function (a, n) {
    var bs = this.blocks, i;
    for (i = 0; i < bs.length; i++) {
      var b = bs[i];
      if (a >= b.a && a < b.a + Math.max(b.n, 1)) {
        if (b.freed) return { b: b, ok: false, reason: 'freed' };
        if (a + n > b.a + b.n) return { b: b, ok: false, reason: 'over' };
        return { b: b, ok: true };
      }
    }
    var prev = null, next = null;
    for (i = 0; i < bs.length; i++) { if (bs[i].a <= a) prev = bs[i]; else { next = bs[i]; break; } }
    if (next && a >= next.a - 16) return { b: next, ok: false, reason: next.freed ? 'freed' : 'under' };
    if (prev && a < prev.a + prev.cap) return { b: prev, ok: false, reason: prev.freed ? 'freed' : 'over' };
    return { b: prev, ok: false, reason: 'wild' };
  };
  U.Heap.prototype.leaks = function () {
    return this.blocks.filter(function (b) { return !b.freed; });
  };

  U.plural = function (n, w, ws) { return n + ' ' + (n > 1 ? (ws || w + 's') : w); };
})(typeof window !== 'undefined' ? window : globalThis);
