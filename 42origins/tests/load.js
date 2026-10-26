/* Charge les moteurs de 42 Origins sous Node (sans navigateur). */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var DIR = path.join(__dirname, '..', 'js');
module.exports = function (files) {
  var ctx = { console: console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  (files || ['util.js', 'engine_c.js', 'engine_py.js', 'engine_asm.js']).forEach(function (f) {
    var p = path.join(DIR, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  });
  return ctx.O42;
};
/* exécute un programme jusqu'au bout et renvoie la machine */
module.exports.run = function (O42, lang, src, opts) {
  var m = O42.engines[lang].create(src, opts || {});
  if (m.compileError) return m;
  var n = 0;
  while (!m.done && n++ < 1e6) m.step();
  return m;
};
