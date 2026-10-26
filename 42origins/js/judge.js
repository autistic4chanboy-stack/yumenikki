/* =========================================================================
 *  42 ORIGINS — juge des missions
 *  Exécute le code sur tous les tests (sans affichage) et vérifie sortie,
 *  code de sortie, fuites, fonctions imposées ou interdites.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;

  function stripComments(src, lang) {
    if (lang === 'c') return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    if (lang === 'py') return src.replace(/(^|[^"'])#[^\n]*/g, '$1');
    return src.replace(/;[^\n]*/g, '');
  }

  O42.judge = function (lang, mission, code, opts) {
    opts = opts || {};
    var eng = O42.engines[lang], rules = mission.rules || {}, src = stripComments(code, lang), out = { ok: true, statics: [], results: [] };
    (rules.forbidSrc || []).forEach(function (r) { if (new RegExp(r.re, 'm').test(src)) out.statics.push(r.msg); });
    (rules.mustSrc || []).forEach(function (r) { if (!new RegExp(r.re, 'mi').test(src)) out.statics.push(r.msg); });
    if (out.statics.length) out.ok = false;
    var timedOut = false;
    mission.tests.forEach(function (t, i) {
      if (timedOut) { out.results.push({ n: i + 1, ok: false, why: ['Non exécuté (le test précédent ne s’est jamais arrêté).'], skipped: true }); return; }
      var stdin = t.stdin !== undefined ? t.stdin : (mission.stdin || '');
      var res = { n: i + 1, ok: true, why: [], stdin: stdin, expect: t.expect, exitExp: t.exit, got: '', exit: null };
      var m = eng.create(code, { stdin: stdin, files: mission.files || { 'texte.txt': 'Bonjour depuis un fichier !\nDeuxième ligne.\n' }, poke: t.poke, maxSteps: opts.maxSteps || (lang === 'asm' ? 100000 : 200000) });
      if (m.compileError) {
        res.ok = false; res.why.push('Erreur de compilation ligne ' + m.compileError.line + ' : ' + m.compileError.msg);
        out.results.push(res); out.ok = false; return;
      }
      while (!m.done) m.step();
      res.got = m.stdout; res.exit = m.exitCode;
      if (m.error) res.why.push((m.error.kind === 'timeout' ? 'Le programme ne s’arrête pas (ligne ' + m.error.line + ') : ' : 'Le programme a planté ligne ' + m.error.line + ' : ') + m.error.msg);
      if (m.error && m.error.kind === 'timeout') timedOut = true;
      if (t.expect !== undefined && m.stdout !== t.expect) res.why.push('La sortie ne correspond pas.');
      if (t.exit !== undefined && m.exitCode !== t.exit && !m.error) res.why.push('Code de sortie ' + m.exitCode + ' au lieu de ' + t.exit + '.');
      if (rules.noLeaks && m.summary && !m.error) {
        var s = m.summary();
        if (s && s.leaks.length) res.why.push('Fuite mémoire : ' + U.plural(s.leakBytes, 'octet') + ' jamais libéré' + (s.leakBytes > 1 ? 's' : '') + ' (bloc alloué ligne ' + s.leaks[0].line + ').');
      }
      if (rules.noWarnings && m.warnings.some(function (w) { return rules.noWarnings.test(w.msg); })) res.why.push('Avertissement : ' + m.warnings.filter(function (w) { return rules.noWarnings.test(w.msg); })[0].msg + ' (ligne ' + m.warnings[0].line + ').');
      if (i === 0) {
        (rules.mustCall || []).forEach(function (f) { if (!m.used[f]) res.why.push('Il faut utiliser ' + f + '.'); });
      }
      (rules.forbidCall || []).forEach(function (f) { if (m.used[f]) res.why.push(f + ' est interdite pour ce contrat.'); });
      res.ok = !res.why.length;
      if (!res.ok) out.ok = false;
      out.results.push(res);
    });
    return out;
  };
  O42.judge.strip = stripComments;
})(typeof window !== 'undefined' ? window : globalThis);
