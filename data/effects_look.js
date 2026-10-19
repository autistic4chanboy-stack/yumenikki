/* =========================================================================
 *  APPARENCE DES EFFETS — certains effets la transforment en quelque chose
 *  de terrifiant ou de psychédélique (src/render/art_horror.js) ; ceux qui
 *  ne changeaient rien à son allure reçoivent enfin un objet visible.
 *  acc = accessoire, form = transformation, pal = couleurs, fx = déformation
 *  à l'affichage (traînée, glitch, couleurs qui tournent).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  // terrifiants et psychédéliques
  var STRONG = {
    E42: { acc: 'grin' }, E237: { acc: 'censorbar' }, E238: { acc: 'whiteout' }, E168: { acc: 'strings' }, E89: { acc: 'puppethand' },
    E83: { acc: 'shadowhands' }, E68: { acc: 'eyecloak' }, E256: { acc: 'tvhead', fx: { glitch: 1 } }, E243: { acc: 'windkey' },
    E171: { acc: 'electrodes' }, E155: { acc: 'thirdeye' }, E160: { acc: 'blacktears' }, E62: { acc: 'longhair', fx: { flicker: 1 } },
    E75: { acc: 'twin' }, E240: { acc: 'dollchain' }, E255: { acc: 'eggeye' }, E69: { acc: 'facade' },
    E55: { form: 'reversed' }, E87: { form: 'longneck' }, E70: { form: 'umbra' }, E85: { form: 'void', fx: { trail: 'psy' } },
    E180: { acc: 'kaleido', fx: { hue: 0.6 } }, E245: { acc: 'prism', fx: { trail: 'psy' } }, E205: { acc: 'static', fx: { glitch: 1 } },
    E164: { acc: 'orbits' }, E260: { acc: 'soundrings' }, E251: { acc: 'fog' }, E259: { acc: 'cranes' }, E57: { acc: 'filmstrip' }
  };
  // un objet visible pour ceux qui n'en avaient pas
  var PLAIN = {
    E41: 'chalk', E49: 'ticket', E53: 'remote', E141: 'remote', E58: 'pen', E147: 'pen', E242: 'pen', E178: 'pen',
    E60: 'cup', E122: 'cup', E246: 'cup', E61: 'ticket', E150: 'ticket', E216: 'ticket', E229: 'ticket', E140: 'ticket',
    E65: 'phone', E230: 'phone', E67: 'drone', E156: 'drone', E73: 'watch', E172: 'watch', E78: 'compass', E82: 'compass', E144: 'compass',
    E239: 'letter', E218: 'letter', E215: 'letter', E182: 'letter', E80: 'rope', E95: 'rope', E86: 'handle', E163: 'handle',
    E88: 'thread', E123: 'thread', E170: 'thread', E204: 'whistle', E214: 'whistle', E206: 'stamp', E241: 'stamp', E175: 'stamp',
    E207: 'glasses', E208: 'mic', E217: 'mic', E131: 'pitchfork', E209: 'blanket', E210: 'bell', E227: 'bell', E212: 'bell', E125: 'bell', E104: 'bell',
    E211: 'shoe', E213: 'chalk', E226: 'gloves', E228: 'bundle', E149: 'bundle', E244: 'bundle', E166: 'bundle', E145: 'bundle', E258: 'apron',
    E235: 'token', E91: 'token', E106: 'token', E118: 'token', E120: 'token', E129: 'token', E133: 'token', E139: 'token', E181: 'token', E157: 'token', E134: 'token',
    E247: 'snowflake', E252: 'snowflake', E248: 'keys', E253: 'dustmask', E93: 'bobble', E94: 'marble', E102: 'candyfloss', E109: 'jar', E128: 'jar',
    E115: 'kite', E124: 'shell', E159: 'shell', E130: 'strawhat', E143: 'duck', E146: 'camera', E183: 'camera', E152: 'suitcase', E158: 'brick',
    E162: 'crane', E174: 'tray', E176: 'can', E223: 'pocketmirror'
  };
  var PAL = {
    E225: { sweater: '#f0e6ea', sweaterSh: '#cfc0c8', sweaterHi: '#ffffff', skirt: '#e0d6dc' }, // la tunique de nuit de sa mère
    E257: { shoe: '#f4f4f0' }, E92: { shoe: '#e8a0b0', sock: '#f8e0e8' }
  };
  var byId = {}; YN.data.effects.forEach(function (e) { byId[e.id] = e; });
  Object.keys(STRONG).forEach(function (id) { var e = byId[id]; if (!e) return; var s = STRONG[id]; if (s.form) { e.form = s.form; delete e.acc; } if (s.acc) { e.acc = s.acc; delete e.form; } if (s.fx) e.fx = s.fx; e.strongLook = true; });
  Object.keys(PLAIN).forEach(function (id) { var e = byId[id]; if (e && !e.acc && !e.form) e.acc = PLAIN[id]; });
  Object.keys(PAL).forEach(function (id) { var e = byId[id]; if (!e) return; var base = YN.spr ? YN.spr.GIRL : {}; e.pal = Object.assign({}, base, PAL[id]); });
  YN.data.strongLooks = Object.keys(STRONG);
})(typeof window !== 'undefined' ? window : globalThis);
