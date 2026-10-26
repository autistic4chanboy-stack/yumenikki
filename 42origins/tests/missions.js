/* Vérifie que chaque solution de mission passe le juge et que chaque code de départ échoue. */
'use strict';
var L = require('./load.js');
var O = L(['util.js', 'engine_c.js', 'engine_py.js', 'engine_asm.js', 'engine_cobol.js', 'engine_cyber.js', 'missions_c.js', 'missions_py.js', 'missions_asm.js', 'missions_c_1.js', 'missions_c_2.js', 'missions_py_1.js', 'missions_py_2.js', 'missions_asm_1.js', 'missions_asm_2.js', 'missions_cobol.js', 'missions_cyber.js', 'chapters.js', 'judge.js', 'examples.js']);
O.finalizeMissions();
var fail = 0, pass = 0;
['c', 'py', 'asm', 'cobol', 'cyber'].forEach(function (lang) {
  O.missions[lang].forEach(function (mi) {
    var t0 = Date.now();
    var sol = O.judge(lang, mi, mi.solution), st = O.judge(lang, mi, mi.starter);
    var ok = sol.ok && !st.ok;
    if (ok) pass++; else fail++;
    console.log((ok ? '  ✔ ' : '  ✖ ') + mi.id + ' ' + mi.title + ' (' + (Date.now() - t0) + ' ms)' + (sol.ok ? '' : ' — SOLUTION KO : ' + JSON.stringify(sol.statics.concat(sol.results.filter(function (r) { return !r.ok; }).map(function (r) { return r.why.join(' / ') + ' got=' + JSON.stringify(r.got) + ' exit=' + r.exit; })))) + (st.ok ? ' — le code de départ passe déjà !' : ''));
  });
  (O.examples[lang] || []).forEach(function (ex, i) {
    var m = L.run(O, lang, ex.code, { stdin: ex.stdin, files: { 'texte.txt': 'Bonjour depuis un fichier !\nDeuxième ligne.\n' } });
    var bug = /🐞/.test(ex.t);
    var ok = !m.compileError && (bug ? !!m.error : !m.error);
    if (ok) pass++; else fail++;
    console.log((ok ? '  ✔ ' : '  ✖ ') + 'exemple ' + lang + ' « ' + ex.t + ' » ' + JSON.stringify(m.compileError ? m.compileError : m.stdout) + (m.error ? ' [' + m.error.msg + ']' : ''));
  });
});
console.log(pass + ' ok, ' + fail + ' échec(s)');
process.exit(fail ? 1 : 0);
