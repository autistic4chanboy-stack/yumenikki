/* =========================================================================
 *  42 ORIGINS — éditeur de code
 *  Un <textarea> transparent au-dessus d'un <pre> coloré, synchronisés au
 *  défilement. Gouttière : numéros, points d'arrêt (clic), ligne courante.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;

  var C_KW = 'if else while for do return break continue switch case default sizeof typedef struct union enum static const extern goto volatile register inline';
  var C_TY = 'int char void long short unsigned signed float double size_t ssize_t bool t_list t_wagon uint8_t int32_t uint32_t int64_t uint64_t FILE';
  var C_BI = 'write read malloc free calloc realloc printf putchar puts strlen strcpy strdup strcmp strncmp strcat memset memcpy memmove get_next_line open close exit atoi NULL';
  var PY_KW = 'def return if elif else while for in not and or is None True False break continue pass import from as global nonlocal lambda try except finally raise with class del assert yield';
  var PY_BI = 'print input len range int str float list dict tuple set bool abs min max sum sorted reversed enumerate zip ord chr round type isinstance map filter any all';
  var ASM_REG = /^(r(?:[abcd]x|[sd]i|[sb]p|8|9|1[0-5])[dwb]?|e(?:[abcd]x|[sd]i|[sb]p)|[abcd][xlh]|[sd]il?|[sb]pl?|rip)$/i;
  var ASM_DIR = /^(section|segment|global|extern|bits|default|db|dw|dd|dq|resb|resw|resd|resq|equ|times|align|byte|word|dword|qword|ptr|rel)$/i;
  function set(s) { var o = {}; s.split(' ').forEach(function (w) { o[w] = 1; }); return o; }
  var COB_KW = 'IDENTIFICATION PROGRAM-ID ENVIRONMENT DATA PROCEDURE DIVISION SECTION WORKING-STORAGE FILE LINKAGE DISPLAY ACCEPT MOVE TO ADD SUBTRACT MULTIPLY DIVIDE COMPUTE GIVING FROM BY INTO REMAINDER IF ELSE END-IF EVALUATE WHEN OTHER END-EVALUATE PERFORM UNTIL VARYING TIMES END-PERFORM THRU THROUGH STOP RUN GOBACK CONTINUE EXIT STRING UNSTRING INSPECT INITIALIZE DELIMITED SIZE SPACE SPACES ZERO ZEROS ZEROES HIGH-VALUE LOW-VALUE AND OR NOT GREATER LESS EQUAL THAN REDEFINES OCCURS VALUE';
  var COB_TY = 'PIC PICTURE COMP COMP-3 BINARY PACKED-DECIMAL IS';
  var SETS = { ckw: set(C_KW), cty: set(C_TY), cbi: set(C_BI), pkw: set(PY_KW), pbi: set(PY_BI), cobkw: set(COB_KW), cobty: set(COB_TY) };

  /* découpe en jetons [type, texte] */
  function tokens(src, lang) {
    var out = [], re;
    if (lang === 'c') re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\.|[^"\\\n])*"?)|('(?:\\.|[^'\\\n])*'?)|(^[ \t]*#[^\n]*)|(\b0[xX][0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[uUlLfF]*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_0-9"']+)/gm;
    else if (lang === 'py') re = /(#[^\n]*)|([rRfFbB]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(@\w+)|(^\b$)|(\b0[xX][0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([A-Za-z_À-ɏ][\wÀ-ɏ]*)|(\s+)|([^\sA-Za-z_0-9"'#]+)/gm;
    else if (lang === 'cobol') re = /(^.{6}[*\/].*$|^\s*\*.*$)|("(?:[^"\n])*"?|'(?:[^'\n])*'?)|(^\b$)|(^\b$)|(\b\d+(?:\.\d+)?\b)|([A-Za-z][A-Za-z0-9-]*)|(\s+)|([^\sA-Za-z0-9"']+)/gm;
    else re = /(;[^\n]*)|("(?:[^"\n])*"?|'(?:[^'\n])*'?|`(?:\\.|[^`\n])*`?)|([A-Za-z_.?@$][\w.?@$]*:)|(^\b$)|(\b0[xX][0-9a-fA-F]+\b|\b[0-9][0-9a-fA-F]*[hH]\b|\b\d+\b)|([A-Za-z_.?@$][\w.?@$]*)|(\s+)|([^\sA-Za-z_0-9"'`;.]+|\.)/gm;
    var m, lineStart = true, prevWord = null, firstWordOfLine = true;
    while ((m = re.exec(src))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      var t = m[0], ty = 'tx';
      if (m[1]) ty = 'com';
      else if (m[2]) ty = 'str';
      else if (m[3]) ty = lang === 'c' ? 'chr' : lang === 'py' ? 'pp' : 'lab';
      else if (m[4]) ty = 'pp';
      else if (m[5]) ty = 'num';
      else if (m[6]) {
        if (lang === 'c') ty = SETS.ckw[t] ? 'kw' : SETS.cty[t] ? 'ty' : SETS.cbi[t] ? 'bi' : /^\s*\(/.test(src.slice(re.lastIndex, re.lastIndex + 3)) ? 'fn' : 'tx';
        else if (lang === 'py') ty = SETS.pkw[t] ? 'kw' : SETS.pbi[t] ? 'bi' : prevWord === 'def' ? 'fn' : /^\(/.test(src.slice(re.lastIndex, re.lastIndex + 1)) ? 'fn' : 'tx';
        else if (lang === 'cobol') { var U2 = t.toUpperCase(); ty = SETS.cobty[U2] ? 'ty' : SETS.cobkw[U2] ? 'kw' : /^\d+$/.test(t) ? 'num' : 'tx'; }
        else ty = ASM_REG.test(t) ? 'reg' : ASM_DIR.test(t) ? 'dir' : firstWordOfLine ? 'mn' : 'tx';
        prevWord = t;
      } else if (m[8]) ty = 'op';
      out.push([ty, t]);
      if (t.indexOf('\n') >= 0) firstWordOfLine = true;
      else if (m[6] || m[3]) firstWordOfLine = !!m[3];
      lineStart = false;
    }
    void lineStart;
    return out;
  }

  /* jetons → tableau de lignes HTML */
  function highlight(src, lang) {
    if (lang === 'cyber') return src.split('\n').map(function (l) { return U.esc(l); });
    var lines = [''], toks = tokens(src, lang);
    toks.forEach(function (tk) {
      var parts = tk[1].split('\n');
      parts.forEach(function (p, i) {
        if (i > 0) lines.push('');
        if (p) lines[lines.length - 1] += tk[0] === 'tx' ? U.esc(p) : '<span class="tk-' + tk[0] + '">' + U.esc(p) + '</span>';
      });
    });
    return lines;
  }

  function Editor(host, opts) {
    var self = this;
    this.opts = opts || {};
    this.lang = 'c';
    this.marks = { cur: 0, last: 0, err: 0, bps: new Set() };
    host.innerHTML = '<div class="ed"><div class="ed-gutter"><div class="ed-gutter-in"></div></div><div class="ed-main"><pre class="ed-hl" aria-hidden="true"></pre>' +
      '<textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Code source"></textarea></div></div>';
    this.ta = host.querySelector('.ed-ta');
    this.hl = host.querySelector('.ed-hl');
    this.gut = host.querySelector('.ed-gutter-in');
    this.ta.addEventListener('input', function () { self.refresh(); if (self.opts.onChange) self.opts.onChange(self.ta.value); });
    this.ta.addEventListener('scroll', function () { self.sync(); });
    this.ta.addEventListener('keydown', function (e) { self.key(e); });
    this.gut.addEventListener('click', function (e) {
      var el = e.target.closest('.ed-gl');
      if (el && self.opts.onGutter) self.opts.onGutter(+el.dataset.l);
    });
  }
  var E = Editor.prototype;
  E.value = function () { return this.ta.value; };
  E.set = function (v, lang) {
    if (lang) this.lang = lang;
    this.ta.value = v;
    this.ta.scrollTop = 0; this.ta.scrollLeft = 0;
    this.refresh();
  };
  E.setMarks = function (m) {
    for (var k in m) this.marks[k] = m[k];
    this.paint();
  };
  E.refresh = function () {
    this.lines = highlight(this.ta.value, this.lang);
    this.paint();
  };
  E.paint = function () {
    var mk = this.marks, html = '', g = '';
    for (var i = 0; i < this.lines.length; i++) {
      var n = i + 1, cls = n === mk.err ? ' err' : n === mk.cur ? ' cur' : n === mk.last ? ' last' : '';
      html += '<span class="ln' + cls + '">' + (n === mk.err ? '<span class="errline">' + (this.lines[i] || ' ') + '</span>' : this.lines[i] || ' ') + '</span>';
      g += '<div class="ed-gl' + (mk.bps.has(n) ? ' bp' : '') + (n === mk.cur ? ' cur' : '') + (n === mk.err ? ' err' : '') + '" data-l="' + n + '" title="Clic : point d’arrêt">' + n + '</div>';
    }
    this.hl.innerHTML = html;
    this.gut.innerHTML = g;
    this.sync();
  };
  E.sync = function () {
    this.hl.style.transform = 'translate(' + (-this.ta.scrollLeft) + 'px,' + (-this.ta.scrollTop) + 'px)';
    this.gut.style.transform = 'translateY(' + (-this.ta.scrollTop) + 'px)';
  };
  /* fait défiler pour rendre une ligne visible */
  E.reveal = function (line) {
    if (!line) return;
    var lh = parseFloat(getComputedStyle(this.ta).lineHeight) || 21, top = 10 + (line - 1) * lh, h = this.ta.clientHeight;
    if (top < this.ta.scrollTop + lh || top > this.ta.scrollTop + h - 3 * lh) {
      this.ta.scrollTop = Math.max(0, top - h / 3);
      this.sync();
    }
  };
  E.key = function (e) {
    var ta = this.ta, s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      var ind = this.lang === 'py' ? '    ' : this.lang === 'asm' ? '    ' : '\t';
      if (s !== en && v.slice(s, en).indexOf('\n') >= 0) {
        var ls = v.lastIndexOf('\n', s - 1) + 1, block = v.slice(ls, en);
        var nb = e.shiftKey ? block.replace(/^(\t| {1,4})/gm, '') : block.replace(/^/gm, ind);
        ta.value = v.slice(0, ls) + nb + v.slice(en);
        ta.selectionStart = ls; ta.selectionEnd = ls + nb.length;
      } else if (!e.shiftKey) {
        ta.value = v.slice(0, s) + ind + v.slice(en);
        ta.selectionStart = ta.selectionEnd = s + ind.length;
      }
      ta.dispatchEvent(new Event('input'));
      return;
    }
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      // garde l'indentation (et l'augmente après { ou :)
      var lineStart = v.lastIndexOf('\n', s - 1) + 1, cur = v.slice(lineStart, s), ind2 = /^[ \t]*/.exec(cur)[0];
      var before = cur.trim();
      if ((this.lang === 'c' && /\{$/.test(before)) || (this.lang === 'py' && /:$/.test(before))) ind2 += this.lang === 'py' ? '    ' : '\t';
      e.preventDefault();
      var ins = '\n' + ind2;
      if (this.lang === 'c' && /\{$/.test(before) && v[en] === '}') ins += '\n' + /^[ \t]*/.exec(cur)[0];
      ta.value = v.slice(0, s) + ins + v.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 1 + ind2.length;
      ta.dispatchEvent(new Event('input'));
      return;
    }
    if (e.key === '}' && this.lang === 'c') {
      var ls2 = v.lastIndexOf('\n', s - 1) + 1, pre = v.slice(ls2, s);
      if (/^[ \t]+$/.test(pre)) {
        e.preventDefault();
        var np = pre.replace(/(\t| {1,4})$/, '');
        ta.value = v.slice(0, ls2) + np + '}' + v.slice(en);
        ta.selectionStart = ta.selectionEnd = ls2 + np.length + 1;
        ta.dispatchEvent(new Event('input'));
      }
    }
  };
  E.focus = function () { this.ta.focus(); };

  O42.Editor = Editor;
  O42.highlight = highlight;
})(typeof window !== 'undefined' ? window : globalThis);
