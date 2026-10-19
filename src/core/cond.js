/* =========================================================================
 *  Conditions — un seul évaluateur pour les portes, PNJ, objets, énigmes,
 *  événements et dialogues. Toutes les clés d'un objet sont combinées (ET).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var U = YN.util;

  /* Le fournisseur de contexte est remplacé par le jeu (ou par les tests). */
  var P = {
    depth: function () { return YN.game && YN.game.rt ? (YN.game.rt.depth || 0) : 0; },
    worldId: function () { return YN.game && YN.game.rt ? YN.game.rt.id : null; },
    remaining: function () { return YN.save.dream ? YN.save.dream.remaining : 0; },
    duration: function () { return YN.save.dream ? YN.save.dream.duration : 600; },
    equipped: function () { return YN.game ? YN.game.equipped() : null; },
    witchHere: function () { return YN.witches ? YN.witches.anyIn(P.worldId()) : false; },
    priestessHere: function () { return YN.priestess ? YN.priestess.isIn(P.worldId()) : false; },
    corruption: function () { return YN.game && YN.game.rt ? (YN.game.rt.corrLevel || 0) : 0; },
    room: function () {
      var r = (YN.save.dream && YN.save.dream.room) || (YN.save.perm && YN.save.perm.room) || {};
      return r;
    },
    worldNight: function () { return !!(YN.game && YN.game.rt && YN.game.rt.def && YN.game.rt.def.night); },
    debug: function () { return !!(YN.debug && YN.debug.on); }
  };

  var C = YN.cond = {
    provider: P,
    phaseOf: function (remaining, duration) {
      var f = duration > 0 ? remaining / duration : 0;
      if (f > 0.7) return 'opening';
      if (f > 0.4) return 'middle';
      if (f > 0.1) return 'late';
      return 'final';
    },
    /* état de la chambre tel qu'il est ressenti à la profondeur courante */
    roomFelt: function (depth) {
      var r = P.room();
      if (depth === undefined) depth = P.depth();
      var felt = { dark: false, snow: false, wind: false, doorAjar: false, murmur: false, dim: 0 };
      if (depth === 0) { felt.dark = !r.light; felt.snow = false; felt.wind = !!r.window; felt.doorAjar = !!r.door; return felt; }
      if (depth <= 2) {
        felt.dark = !r.light;
        felt.dim = !r.light ? (depth === 1 ? 1 : 0.6) : 0;
        felt.snow = !!r.window && depth === 1;
        felt.wind = !!r.window;
        felt.doorAjar = !!r.door;
        felt.murmur = !!r.door;
      }
      if (P.worldNight()) { felt.dark = true; felt.dim = Math.max(felt.dim, 1); }
      return felt;
    },

    check: function (c, extra) {
      if (!c) return true;
      if (typeof c === 'function') { try { return !!c(extra); } catch (e) { YN.warn('condition-fonction : ' + e); return false; } }
      if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) if (!C.check(c[i], extra)) return false; return true; }
      var S = YN.save;
      for (var k in c) {
        if (!Object.prototype.hasOwnProperty.call(c, k)) continue;
        var v = c[k], ok = true, felt, rem, dur, a;
        switch (k) {
          case 'effect': ok = (Array.isArray(v) ? v : [v]).every(function (e) { return S.hasEffect(e); }); break;
          case 'anyEffect': ok = v.some(function (e) { return S.hasEffect(e); }); break;
          case 'noEffect': ok = !S.hasEffect(v); break;
          case 'equipped': a = P.equipped(); ok = Array.isArray(v) ? v.indexOf(a) >= 0 : a === v; break;
          case 'notEquipped': ok = P.equipped() !== v; break;
          case 'flag': ok = (Array.isArray(v) ? v : [v]).every(function (f) { return !!S.flag(f); }); break;
          case 'notFlag': ok = (Array.isArray(v) ? v : [v]).every(function (f) { return !S.flag(f); }); break;
          case 'flagIs': ok = U.keys(v).every(function (f) { return S.flag(f) === v[f]; }); break;
          case 'flagGte': ok = U.keys(v).every(function (f) { return (S.flag(f) || 0) >= v[f]; }); break;
          case 'dark': felt = C.roomFelt(); ok = felt.dark === !!v; break;
          case 'snow': felt = C.roomFelt(); ok = felt.snow === !!v; break;
          case 'wind': felt = C.roomFelt(); ok = felt.wind === !!v; break;
          case 'doorAjar': felt = C.roomFelt(); ok = felt.doorAjar === !!v; break;
          case 'roomLight': ok = !!P.room().light === !!v; break;
          case 'roomWindow': ok = !!P.room().window === !!v; break;
          case 'roomDoor': ok = !!P.room().door === !!v; break;
          case 'remainingLt': ok = S.dream ? P.remaining() < v : false; break;
          case 'remainingGt': ok = S.dream ? P.remaining() > v : false; break;
          case 'elapsedGt': ok = S.dream ? (P.duration() - P.remaining()) > v : false; break;
          case 'elapsedLt': ok = S.dream ? (P.duration() - P.remaining()) < v : false; break;
          case 'phase':
            rem = P.remaining(); dur = P.duration();
            ok = (Array.isArray(v) ? v : [v]).indexOf(C.phaseOf(rem, dur)) >= 0; break;
          case 'remainingMod': // { every: 60, under: 10 } : vrai pendant les 10 dernières secondes de chaque minute
            rem = Math.floor(P.remaining()); ok = (rem % v.every) < v.under; break;
          case 'realHour': ok = YN.realtime.hourIn(v[0], v[1]); break;
          case 'realTime': ok = YN.realtime.timeIn(v[0], v[1]); break;
          case 'realDate': ok = (Array.isArray(v) ? v : [v]).some(function (n) { return YN.realtime.named(n); }); break;
          case 'notRealDate': ok = !(Array.isArray(v) ? v : [v]).some(function (n) { return YN.realtime.named(n); }); break;
          case 'weekday': ok = (Array.isArray(v) ? v : [v]).indexOf(YN.realtime.now().getDay()) >= 0; break;
          case 'visits': ok = U.keys(v).every(function (w) { return S.visits(w) >= v[w]; }); break;
          case 'visited': ok = (Array.isArray(v) ? v : [v]).every(function (w) { return S.visits(w) > 0; }); break;
          case 'dreams': ok = (S.perm ? S.perm.stats.dreams : 0) >= v; break;
          case 'effectsCount': ok = S.ownedEffects().length >= v; break;
          case 'savedEffects': ok = (S.perm ? S.perm.effects.length : 0) >= v; break;
          case 'eggs': ok = (S.perm ? S.perm.eggs.length : 0) + (S.dream ? S.dream.eggs.length : 0) >= v; break;
          case 'corruptionGte': ok = P.corruption() >= v; break;
          case 'corruptionLt': ok = P.corruption() < v; break;
          case 'witchHere': ok = P.witchHere() === !!v; break;
          case 'priestessHere': ok = P.priestessHere() === !!v; break;
          case 'quest': ok = U.keys(v).every(function (q) {
            var st = S.questStage(q), want = v[q];
            if (want === null) return st === null;
            if (want === '*') return st !== null;
            return Array.isArray(want) ? want.indexOf(st) >= 0 : st === want;
          }); break;
          case 'questLog': ok = U.keys(v).every(function (q) {
            var r = S.quest(q); return !!(r && r.log && r.log.indexOf(v[q]) >= 0);
          }); break;
          case 'notQuestLog': ok = U.keys(v).every(function (q) {
            var r = S.quest(q); return !(r && r.log && r.log.indexOf(v[q]) >= 0);
          }); break;
          case 'rel': ok = U.keys(v).every(function (n) { return S.rel(n) >= v[n]; }); break;
          case 'relLt': ok = U.keys(v).every(function (n) { return S.rel(n) < v[n]; }); break;
          case 'met': ok = (Array.isArray(v) ? v : [v]).every(function (n) { return S.metNpc(n); }); break;
          case 'talks': ok = U.keys(v).every(function (n) { return S.talks(n) >= v[n]; }); break;
          case 'said':
            ok = !!(S.dream && S.dream.said.some(function (s) { return s.indexOf(U.norm(v)) >= 0; })); break;
          case 'pill': ok = !!(S.dream && S.dream.pill) === !!v; break;
          case 'white': ok = !!(S.dream && S.dream.white) === !!v; break;
          case 'depth': ok = Array.isArray(v) ? (P.depth() >= v[0] && P.depth() <= v[1]) : P.depth() === v; break;
          case 'depthGte': ok = P.depth() >= v; break;
          case 'item': ok = U.keys(v).every(function (i) { return S.items(i) >= v[i]; }); break;
          case 'noItem': ok = S.items(v) <= 0; break;
          case 'note': ok = S.hasNote(v); break;
          case 'secret': ok = !!S.secret(v); break;
          case 'notSecret': ok = !S.secret(v); break;
          case 'motherVisits': ok = (S.perm ? S.perm.mother.visits : 0) >= v; break;
          case 'captures': ok = (S.perm ? S.perm.stats.captures : 0) >= v; break;
          case 'deepVisited': ok = !!(S.perm && S.perm.flags['deep_visited']) === !!v; break;
          case 'dreamChance': { // tirage stable pour toute la nuit
            var seed = (S.dream ? S.dream.no : 0) + ':' + (v.key || '');
            ok = YN.rng.make(seed).next() < v.p; break;
          }
          case 'temp': ok = U.keys(v).every(function (t) { return S.temp(t) === v[t]; }); break;
          case 'tempGte': ok = U.keys(v).every(function (t) { return (S.temp(t) || 0) >= v[t]; }); break;
          case 'inDream': ok = !!S.dream === !!v; break;
          case 'debug': ok = P.debug() === !!v; break;
          case 'any': ok = v.some(function (x) { return C.check(x, extra); }); break;
          case 'all': ok = v.every(function (x) { return C.check(x, extra); }); break;
          case 'not': ok = !C.check(v, extra); break;
          case 'fn': try { ok = !!v(extra); } catch (e) { ok = false; YN.warn('cond.fn : ' + e); } break;
          case 'hint': case 'why': ok = true; break; // documentation seule
          default: YN.warn('unknown condition key: ' + k); ok = false;
        }
        if (!ok) return false;
      }
      return true;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
