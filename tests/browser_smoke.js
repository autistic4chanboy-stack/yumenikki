/* Test d'exécution dans le navigateur : traverse les mondes un par un, fait
 * marcher la protagoniste, ouvre une conversation, et relève toute erreur.
 * À charger dans la page du jeu (console) après tests/dev_harness.js :
 *   await __smoke('W041', 'W060')   → résultats dans window.__smokeRes
 * Résumé : __smokeReport() */
(function () {
  window.__smokeRes = window.__smokeRes || {};
  var errs = [];
  window.addEventListener('error', function (e) { errs.push(String(e.message)); });
  var origWarn = YN.warn;
  YN.warn = function (m) { errs.push('warn: ' + m); if (origWarn) origWarn.apply(this, arguments); };
  window.__smoke = async function (from, to) {
    if (!YN.save.dream) YN.save.beginDream({});
    YN.game.state = 'dream';
    var ids = Object.keys(YN.data.worlds).filter(function (k) { return /^W\d{3}$/.test(k) && k >= from && k <= to; }).sort();
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i]; errs.length = 0;
      try {
        YN.game.warp(id); await __wait(350); __closeUI(); __step(8);
        __walk('right', 2); __walk('down', 2); __walk('upleft', 2);
        var rt = YN.game.rt, e = rt.ents.filter(function (x) { return x.present !== false && !x.def.invisible; })[0];
        if (e) { YN.entities.talk(e, YN.game); __closeUI(); }
        __step(10);
        window.__smokeRes[id] = { ok: rt.id === id && !errs.filter(function (m) { return !/piste inconnue|stockage|unknown track|storage/.test(m); }).length, errs: errs.slice(0, 4), ents: rt.ents.length, marks: rt.marks.length };
      } catch (ex) { window.__smokeRes[id] = { ok: false, errs: [String(ex.message || ex)].concat(errs.slice(0, 3)) }; }
    }
    return ids.length + ' mondes';
  };
  window.__smokeReport = function () {
    var ks = Object.keys(window.__smokeRes).sort(), bad = ks.filter(function (k) { return !window.__smokeRes[k].ok; });
    return { tested: ks.length, failed: bad.length, failures: bad.map(function (k) { return k + ' : ' + window.__smokeRes[k].errs.join(' / '); }) };
  };
})();
