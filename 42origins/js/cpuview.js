/* =========================================================================
 *  42 ORIGINS — vue du processeur (assembleur)
 *  Pipeline FETCH → DECODE → EXECUTE → WRITE-BACK animé, RIP, ALU,
 *  drapeaux, registres (avec zoom sur les sous-registres) et bus mémoire.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;

  function CpuView(host) {
    var self = this;
    this.host = host;
    this.sel = 'rax';
    this.timers = [];
    host.addEventListener('click', function (e) {
      var r = e.target.closest('.rg');
      if (r) { self.sel = r.dataset.r; if (self.last) self.render(self.last.m, self.last.opts); }
    });
  }
  var P = CpuView.prototype;

  function grp(v) { var h = BigInt.asUintN(64, v).toString(16).padStart(16, '0'); return h.slice(0, 8) + '<b>' + h.slice(8) + '</b>'; }
  function dec(v) { var s = BigInt.asIntN(64, v); return s.toString(); }
  function colorIns(t) {
    return U.esc(t).replace(/^(\w+)/, '<span class="mn">$1</span>').replace(/\b(r[a-d]x|r[sd]i|r[sb]p|r\d+[dwb]?|e[a-d]x|e[sd]i|[a-d][xlh]|[sd]il|[sb]pl)\b/g, '<span class="rg">$1</span>');
  }

  P.render = function (m, opts) {
    opts = opts || {};
    this.last = { m: m, opts: opts };
    this.timers.forEach(clearTimeout); this.timers = [];
    var last = m.cpu.last, nextIns = m.prog.ins[m.rip], regs = m.regView(), self = this;
    var ms = Math.max(120, Math.min(900, opts.anim || 500));
    var execIns = last ? last.ins : null;
    var html = '<div class="cpu">';
    // pipeline
    var dsc = execIns ? (O42.engines.asm.MNEMO_FR[execIns.mn] || (execIns.mn[0] === 'j' ? 'saut conditionnel' : execIns.mn.indexOf('set') === 0 ? 'met un octet à 0 ou 1 selon les drapeaux' : execIns.mn.indexOf('cmov') === 0 ? 'copie conditionnelle' : '')) : '';
    var opsD = execIns ? execIns.ops.map(function (o) { return o.k === 'reg' ? 'registre ' + o.r.name : o.k === 'mem' ? 'mémoire ' + o.txt : 'valeur ' + o.txt; }).join(', ') : '';
    var wb = '';
    if (last) {
      var chg = regs.filter(function (r) { return r.changed; }).map(function (r) { return r.name; });
      var memw = (last.mem || []).filter(function (a) { return a.w; });
      wb = chg.length ? chg.join(', ') + ' modifié' + (chg.length > 1 ? 's' : '') : '';
      if (memw.length) wb += (wb ? ' · ' : '') + 'mémoire ' + U.hex(memw[0].a);
      if (last.jump && last.jump.taken && !last.jump.ext) wb += (wb ? ' · ' : '') + 'rip ← ' + U.hex(last.jump.to);
      if (!wb) wb = last.sys ? 'rax = résultat' : 'drapeaux';
    }
    html += '<div class="pipe">' +
      '<div class="stage" data-s="0"><h4>1 · FETCH</h4><p>' + (execIns ? 'lit l’instruction à ' + U.hex(execIns.addr) : '—') + '</p></div>' +
      '<div class="stage" data-s="1"><h4>2 · DECODE</h4><p>' + (execIns ? U.esc(execIns.mn) + (opsD ? ' · ' + U.esc(opsD) : '') : '—') + '</p></div>' +
      '<div class="stage" data-s="2"><h4>3 · EXECUTE</h4><p>' + (execIns ? U.esc(dsc || execIns.mn) : '—') + '</p></div>' +
      '<div class="stage" data-s="3"><h4>4 · WRITE-BACK</h4><p>' + U.esc(wb || '—') + '</p></div></div>';
    // RIP et instruction suivante
    html += '<div class="cpu-row"><div class="rip"><div class="k">RIP → PROCHAINE INSTRUCTION</div>' +
      (nextIns && !m.done ? '<div class="ins">' + colorIns(nextIns.text) + '</div><div class="d">ligne ' + nextIns.line + ' · adresse ' + U.hex(nextIns.addr) + '</div>' :
        '<div class="ins">' + (m.error ? '✖ arrêt (erreur)' : m.done ? '■ programme terminé' : '—') + '</div><div class="d">' + (m.done && m.exitCode !== null ? 'code de sortie ' + m.exitCode : '') + '</div>') +
      (execIns ? '<div class="d">dernière exécutée : <code>' + U.esc(execIns.text) + '</code></div>' : '') + '</div>';
    // ALU
    var alu = last && last.alu;
    html += '<div class="alu' + (alu ? ' fire' : '') + '"><div class="k">ALU · UNITÉ DE CALCUL</div>';
    if (alu) {
      var sz = alu.size || 8, sd = function (v) { return v === null || v === undefined ? '' : BigInt.asIntN(sz * 8, BigInt(v)).toString(); };
      if (alu.op === 'lea') html += '<div class="alu-box"><span class="in">base + index×échelle + déplacement</span><span class="opr">=</span><span class="out">' + U.hex(alu.r) + '</span></div>';
      else if (alu.b === null) html += '<div class="alu-box"><span class="opr">' + U.esc(alu.sym) + '</span><span class="in">' + sd(alu.a) + '</span><span class="opr">=</span><span class="out">' + sd(alu.r) + '</span></div>';
      else html += '<div class="alu-box"><span class="in">' + sd(alu.a) + '</span><span class="opr">' + U.esc(alu.sym) + '</span><span class="in">' + sd(alu.b) + '</span><span class="opr">=</span><span class="out">' + sd(alu.r) + '</span></div>' +
        (alu.op === 'cmp' || alu.op === 'test' ? '<div class="cpu-legend">résultat non stocké : seuls les drapeaux changent</div>' : '');
    } else html += '<div class="cpu-legend" style="margin-top:6px">au repos (pas de calcul à ce pas)</div>';
    html += '</div>';
    // drapeaux
    var F = m.flags, PF = m.prevFlags, fd = [['ZF', 'zéro'], ['SF', 'signe −'], ['CF', 'retenue'], ['OF', 'débord.']];
    html += '<div class="flags">' + fd.map(function (f) {
      return '<div class="flag' + (F[f[0]] ? ' on' : '') + (last && F[f[0]] !== PF[f[0]] ? ' chg' : '') + '" title="' + f[0] + ' = ' + F[f[0]] + '"><b>' + f[0] + '</b><div class="led"></div><span>' + f[1] + '</span></div>';
    }).join('') + '</div></div>';
    // appel système
    if (last && last.sys) html += '<div class="sysbox">⚙ <b>syscall n°' + last.sys.nr + ' (' + last.sys.name + ')</b> : le processeur passe la main au noyau Linux, qui lit rax (numéro), rdi, rsi, rdx (arguments) et renvoie le résultat dans rax.</div>';
    if (last && last.jump && last.jump.ext) html += '<div class="sysbox">📞 <b>call ' + U.esc(last.jump.ext) + '</b> : fonction de la libc. Arguments dans rdi, rsi, rdx, rcx, r8, r9 ; résultat dans rax.</div>';
    // registres
    html += '<div class="regs">' + regs.map(function (r) {
      var cls = 'rg' + (r.changed && last ? ' chg' : '') + (r.name === self.sel ? ' sel' : '') + (r.name === 'rsp' ? ' sp' : r.name === 'rbp' ? ' bp' : '');
      var hint = { rax: 'retour / n° syscall', rdi: '1er argument', rsi: '2e argument', rdx: '3e argument', rcx: '4e arg · compteur', rsp: 'sommet de pile', rbp: 'base du cadre', r8: '5e argument', r9: '6e argument', rbx: 'à préserver', r12: 'à préserver', r13: 'à préserver', r14: 'à préserver', r15: 'à préserver', r10: 'temporaire', r11: 'écrasé par syscall' }[r.name] || '';
      return '<div class="' + cls + '" data-r="' + r.name + '" title="' + r.name + ' : ' + hint + '"><div class="n">' + r.name + '<small>' + hint + '</small></div><div class="x">' + grp(r.v) + '</div><div class="dv">' + U.esc(r.sym ? '→ ' + r.sym : dec(r.v) + charOf(r.v)) + '</div></div>';
    }).join('') + '</div>';
    // zoom sur un registre
    var sr = regs.filter(function (r) { return r.name === self.sel; })[0] || regs[0];
    var bytes = [], v = BigInt.asUintN(64, sr.v);
    for (var i = 7; i >= 0; i--) bytes.push(Number((v >> BigInt(i * 8)) & 255n));
    var names = subNames(sr.name);
    html += '<div class="zoom"><div class="k">ZOOM · ' + sr.name.toUpperCase() + ' = ' + U.hex(sr.v) + ' = ' + dec(sr.v) + ' (clique un registre pour changer)</div><div class="bytes">' +
      bytes.map(function (b, k) { return '<div>' + (b < 16 ? '0' : '') + b.toString(16) + '<small>octet ' + (7 - k) + '</small></div>'; }).join('') + '</div>' +
      '<div class="bands"><span class="b64">' + names[0] + ' · 64 bits</span></div><div class="bands"><span class="b32">' + names[1] + ' · 32</span></div><div class="bands"><span class="b16">' + names[2] + ' · 16</span></div>' +
      '<div class="bands">' + (names[3] ? '<span class="bh">' + names[3] + '</span>' : '') + '<span class="bl">' + names[4] + '</span></div></div>';
    // bus mémoire
    var macc = last && last.mem ? last.mem.filter(function (a) { return a.v !== undefined || a.w; }) : [];
    if (macc.length) {
      var a0 = macc[macc.length - 1];
      html += '<div class="bus ' + (a0.w ? 'w' : 'r') + '" style="--bus:' + ms + 'ms"><span class="chip">CPU</span><span class="wire"><i></i></span><span class="chip">RAM</span><span class="msg">' +
        (a0.w ? 'écriture ' : 'lecture ') + a0.n + ' o @ ' + U.hex(a0.a) + (a0.v !== undefined ? ' = ' + U.esc(m.fmtV(a0.v, a0.n)) : '') + (macc.length > 1 ? ' (+' + (macc.length - 1) + ')' : '') + '</span></div>';
    } else html += '<div class="bus"><span class="chip">CPU</span><span class="wire"></span><span class="chip">RAM</span><span class="msg" style="color:var(--dimmer)">pas d’accès mémoire à ce pas (tout s’est passé dans les registres)</span></div>';
    html += '</div>';
    this.host.innerHTML = html;
    // animation du pipeline
    if (last && opts.animate !== false) {
      var st = this.host.querySelectorAll('.stage'), step = ms / 4;
      st.forEach(function (el, k) {
        self.timers.push(setTimeout(function () { st.forEach(function (x) { x.classList.remove('lit'); }); el.classList.add('lit'); }, k * step));
      });
      this.timers.push(setTimeout(function () { st.forEach(function (x) { x.classList.remove('lit'); }); st[3].classList.add('lit'); }, ms));
    } else if (last) this.host.querySelectorAll('.stage')[3].classList.add('lit');
  };
  function charOf(v) { var n = Number(BigInt.asUintN(64, v)); return n >= 32 && n < 127 ? " '" + String.fromCharCode(n) + "'" : ''; }
  function subNames(n) {
    var map = { rax: ['rax', 'eax', 'ax', 'ah', 'al'], rbx: ['rbx', 'ebx', 'bx', 'bh', 'bl'], rcx: ['rcx', 'ecx', 'cx', 'ch', 'cl'], rdx: ['rdx', 'edx', 'dx', 'dh', 'dl'],
      rsi: ['rsi', 'esi', 'si', '', 'sil'], rdi: ['rdi', 'edi', 'di', '', 'dil'], rbp: ['rbp', 'ebp', 'bp', '', 'bpl'], rsp: ['rsp', 'esp', 'sp', '', 'spl'] };
    return map[n] || [n, n + 'd', n + 'w', '', n + 'b'];
  }

  O42.CpuView = CpuView;
})(typeof window !== 'undefined' ? window : globalThis);
