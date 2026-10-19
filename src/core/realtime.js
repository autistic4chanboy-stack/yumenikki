/* =========================================================================
 *  Temps réel : heures, dates particulières, lune.
 *  Le jeu ne dit jamais qu'un événement dépend de l'heure réelle :
 *  un indice dissimulé le suggère toujours (voir docs/bible.md §6).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;

  function easter(y) { // algorithme anonyme grégorien
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451), month = Math.floor((h + l - 7 * m + 114) / 31),
        day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  var R = YN.realtime = {
    offsetMs: 0, // décalage (debug uniquement)
    fixed: null, // date figée (tests)
    now: function () {
      if (R.fixed) return new Date(R.fixed.getTime());
      return new Date(Date.now() + R.offsetMs);
    },
    /* Fête des mères française : dernier dimanche de mai, sauf si c'est la Pentecôte → premier dimanche de juin */
    feteDesMeres: function (y) {
      var d = new Date(y, 4, 31);
      while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
      var pent = easter(y); pent.setDate(pent.getDate() + 49);
      if (sameDay(d, pent)) { d = new Date(y, 5, 1); while (d.getDay() !== 0) d.setDate(d.getDate() + 1); }
      return d;
    },
    isFeteDesMeres: function (d) { d = d || R.now(); return sameDay(d, R.feteDesMeres(d.getFullYear())); },
    isParentsDay: function (d) { d = d || R.now(); return d.getMonth() === 4 && d.getDate() === 8; },
    moonAge: function (d) { // jours depuis la nouvelle lune
      d = d || R.now();
      var ref = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
      var days = d.getTime() / 86400000 - ref;
      var syn = 29.530588853;
      return ((days % syn) + syn) % syn;
    },
    isFullMoon: function (d) { var a = R.moonAge(d); return Math.abs(a - 14.765) < 1.2; },
    isTwinMinute: function (d) { d = d || R.now(); return d.getHours() === d.getMinutes(); },
    hourIn: function (a, b, d) { // a <= h < b, avec passage de minuit
      d = d || R.now();
      var h = d.getHours() + d.getMinutes() / 60;
      return a <= b ? (h >= a && h < b) : (h >= a || h < b);
    },
    timeIn: function (from, to, d) { // 'HH:MM'
      d = d || R.now();
      function m(s) { var p = s.split(':'); return (+p[0]) * 60 + (+p[1]); }
      var x = d.getHours() * 60 + d.getMinutes(), a = m(from), b = m(to);
      return a <= b ? (x >= a && x <= b) : (x >= a || x <= b);
    },
    isSunday: function (d) { return (d || R.now()).getDay() === 0; },
    isFriday13: function (d) { d = d || R.now(); return d.getDay() === 5 && d.getDate() === 13; },
    named: function (key, d) {
      switch (key) {
        case 'feteDesMeres': return R.isFeteDesMeres(d);
        case 'parentsDay': return R.isParentsDay(d);
        case 'fullMoon': return R.isFullMoon(d);
        case 'twinMinute': return R.isTwinMinute(d);
        case 'sunday': return R.isSunday(d);
        case 'friday13': return R.isFriday13(d);
        case 'night': return R.hourIn(22, 6, d);
        case 'lunch': return R.hourIn(12, 13, d);
        case 'wolf': return R.hourIn(3, 4, d);
        case 'h2371': return R.timeIn('00:11', '00:20', d);
        case 'h23': return R.hourIn(23, 24, d);
        case 'christmas': d = d || R.now(); return d.getMonth() === 11 && (d.getDate() === 24 || d.getDate() === 25);
      }
      YN.warn('unknown real date: ' + key);
      return false;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
