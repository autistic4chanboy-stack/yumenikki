/* Vérifie les missions contre les vrais outils (gcc, python3, nasm + ld) :
 *   - la solution passe le juge du visualiseur, le code de départ échoue ;
 *   - la sortie attendue de chaque test = sortie du vrai programme ;
 *   - le visualiseur produit la même sortie que le vrai programme.
 * Usage : node 42origins/tests/realcheck.js [langage] [id ou préfixe…]   (ex. c c3- ; py ; asm a7) */
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
var L = require('./load.js');
var O = L(['util.js', 'engine_c.js', 'engine_py.js', 'engine_asm.js', 'missions_c.js', 'missions_py.js', 'missions_asm.js']
  .concat(fs.readdirSync(path.join(__dirname, '..', 'js')).filter(function (f) { return /^missions_(c|py|asm)_\d+\.js$/.test(f); }).sort())
  .concat(['judge.js']));
var GNL = '#include <stdlib.h>\n#include <unistd.h>\nchar *get_next_line(int fd){char c;int n=0,cap=64;char *l=malloc(cap);while(read(fd,&c,1)==1){if(n+2>cap){cap*=2;char*t=malloc(cap);for(int i=0;i<n;i++)t[i]=l[i];free(l);l=t;}l[n++]=c;if(c==10)break;}if(!n){free(l);return 0;}l[n]=0;return l;}\n';
var DEFAULT_FILE = 'Bonjour depuis un fichier !\nDeuxième ligne.\n';
var tmp = fs.mkdtempSync(path.join(os.tmpdir(), '42o-'));
var langs = process.argv[2] ? [process.argv[2]] : ['c', 'py', 'asm'], only = process.argv.slice(3);
var bad = 0, good = 0;

function build(lang, mi, src) {
  var dir = path.join(tmp, mi.id); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'texte.txt'), (mi.files && mi.files['texte.txt']) || DEFAULT_FILE);
  try {
    if (lang === 'c') {
      var s = (/get_next_line/.test(src) ? GNL : '') + src;
      fs.writeFileSync(path.join(dir, 'm.c'), s);
      cp.execSync('gcc -std=gnu11 -w -O0 -o m m.c', { cwd: dir, stdio: 'pipe' });
      return { dir: dir, cmd: './m' };
    }
    if (lang === 'py') { fs.writeFileSync(path.join(dir, 'm.py'), src); return { dir: dir, cmd: 'python3 m.py' }; }
    fs.writeFileSync(path.join(dir, 'm.asm'), src);
    cp.execSync('nasm -felf64 m.asm -o m.o', { cwd: dir, stdio: 'pipe' });
    if (/^\s*main\s*:/m.test(src) && !/^\s*_start\s*:/m.test(src)) cp.execSync('gcc -no-pie -o m m.o', { cwd: dir, stdio: 'pipe' });
    else cp.execSync('ld -o m m.o', { cwd: dir, stdio: 'pipe' });
    return { dir: dir, cmd: './m' };
  } catch (e) { return { err: String(e.stderr || e.message).slice(0, 400) }; }
}
function runReal(b, stdin) {
  var r = cp.spawnSync('sh', ['-c', b.cmd], { cwd: b.dir, input: stdin || '', timeout: 5000 });
  return { out: r.stdout ? r.stdout.toString('utf8') : '', code: r.status };
}
function runEngine(lang, src, stdin, mi, poke) {
  var m = O.engines[lang].create(src, { stdin: stdin || '', files: mi.files || { 'texte.txt': DEFAULT_FILE }, poke: poke, maxSteps: 300000 });
  if (m.compileError) return { err: 'compilation : ' + m.compileError.msg + ' (ligne ' + m.compileError.line + ')' };
  while (!m.done) m.step();
  return { out: m.stdout, code: m.exitCode, error: m.error };
}
langs.forEach(function (lang) {
  O.missions[lang].forEach(function (mi) {
    if (only.length && !only.some(function (p) { return mi.id === p || mi.id.indexOf(p) === 0; })) return;
    var probs = [];
    var sol = O.judge(lang, mi, mi.solution), st = O.judge(lang, mi, mi.starter);
    if (!sol.ok) probs.push('solution refusée par le juge : ' + JSON.stringify(sol.statics.concat(sol.results.filter(function (r) { return !r.ok; }).map(function (r) { return 'test ' + r.n + ' ' + r.why.join(' / ') + ' obtenu=' + JSON.stringify(r.got).slice(0, 200); }))));
    if (st.ok) probs.push('le code de départ passe déjà le juge');
    var b = build(lang, mi, mi.solution);
    if (b.err) probs.push('le vrai compilateur refuse la solution : ' + b.err);
    mi.tests.forEach(function (t, i) {
      var stdin = t.stdin !== undefined ? t.stdin : (mi.stdin || '');
      var e = runEngine(lang, mi.solution, stdin, mi, t.poke);
      if (e.err) { probs.push('test ' + (i + 1) + ' visualiseur : ' + e.err); return; }
      if (e.error) probs.push('test ' + (i + 1) + ' visualiseur plante : ' + e.error.msg + ' ligne ' + e.error.line);
      if (b.err || t.poke) return;
      var r = runReal(b, stdin);
      if (t.expect !== undefined && r.out !== t.expect) probs.push('test ' + (i + 1) + ' : expect ' + JSON.stringify(t.expect).slice(0, 160) + ' ≠ vrai programme ' + JSON.stringify(r.out).slice(0, 160));
      if (t.exit !== undefined && r.code !== t.exit) probs.push('test ' + (i + 1) + ' : exit attendu ' + t.exit + ' ≠ vrai ' + r.code);
      if (r.out !== e.out) probs.push('test ' + (i + 1) + ' : visualiseur ' + JSON.stringify(e.out).slice(0, 160) + ' ≠ vrai ' + JSON.stringify(r.out).slice(0, 160));
      if (lang !== 'py' && e.code !== null && r.code !== e.code) probs.push('test ' + (i + 1) + ' : code de sortie visualiseur ' + e.code + ' ≠ vrai ' + r.code);
    });
    if (probs.length) { bad++; console.log('✖ ' + mi.id + ' ' + mi.title + '\n    ' + probs.join('\n    ')); }
    else good++;
  });
});
console.log(good + ' mission(s) ok, ' + bad + ' en échec');
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(bad ? 1 : 0);
