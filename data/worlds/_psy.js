/* =========================================================================
 *  PSYCHÉDÉLIQUE VOULU — certains mondes se tordent exprès, chacun à sa
 *  façon (src/render/renderer.js, psyPost) : ondes, respiration, tunnel
 *  d'échos, symétrie fantôme, double image, couleurs qui coulent, taches.
 *  Les réglages « Reduce distortion / flashes / motion » calment tout.
 *  recette = { hue (degrés/s), sat, contrast, wave, vwave, freq, breathe,
 *              tunnel, mirror, ghost, bands, blobs, speed }
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, W = YN.data.worlds;
  var R = {
    // déjà psychédéliques : chacun reçoit enfin sa propre manière de se tordre
    W101: { wave: 1.2, freq: 0.007, blobs: 0.5, hue: 6, sat: 1.4, art: 'The belly breathes in slow red waves; warm stains drift across it.' },
    W102: { vwave: 1, ghost: 0.7, hue: 8, sat: 1.4, art: 'The throat ripples up and down; everything is seen twice, slightly apart.' },
    W119: { breathe: 1, mirror: 0.8, hue: 14, art: 'The patient’s dream swells and shrinks; a mirrored ghost of the room floats over it.' },
    W163: { wave: 0.8, freq: 0.02, blobs: 0.4, hue: 10, sat: 1.6, art: 'Walls pulse like skin; pink light pools and moves.' },
    W164: { ghost: 1, breathe: 0.7, hue: 20, art: 'The forest blinks: every shape has a second, offset outline, watching.' },
    W166: { tunnel: 1.4, hue: 40, sat: 1.7, art: 'Every step leaves an echo that spirals outwards for ever.' },
    W167: { blobs: 1, bands: 0.6, hue: 35, sat: 1.8, art: 'Colours that have no names wash over the garden in slow tides.' },
    W175: { vwave: 1.3, freq: 0.006, hue: 6, sat: 1.5, art: 'The stairs undulate like a throat swallowing.' },
    W176: { ghost: 0.9, wave: 0.6, freq: 0.05, hue: 0, sat: 1.2, contrast: 1.2, art: 'A sea of screens: scanlines roll, the picture doubles and tears.' },
    W183: { tunnel: 0.8, mirror: 0.6, hue: 18, art: 'The sixth layer folds over itself; what you leave behind stays a moment longer.' },
    W294: { breathe: 1.6, speed: 1.6, bands: 0.4, hue: 20, art: 'Inside the drum, the whole world thumps in time.' },
    W375: { vwave: 0.9, tunnel: 0.9, hue: 12, art: 'The eye of the typhoon: everything is sucked slowly round the edges.' },
    W390: { mirror: 0.9, blobs: 0.5, hue: 16, art: 'Seen from above, the bed and the room are perfectly, wrongly symmetrical.' },
    W391: { breathe: 1.2, speed: 2, ghost: 0.6, hue: 10, art: 'The night drum beats, and the dark jumps with it.' },
    // nouveaux mondes psychédéliques, choisis pour leur sujet
    W067: { bands: 0.8, blobs: 0.7, hue: 50, sat: 1.7, art: 'Karaoke lights sweep the room in rainbow bands; the colours never stop.' },
    W069: { ghost: 0.8, hue: 0, contrast: 1.15, art: 'The screen room shows everything twice, a little to the side.' },
    W084: { breathe: 0.6, blobs: 0.5, hue: 8, sat: 1.3, art: 'The clouds breathe; pastel lights drift under them.' },
    W086: { mirror: 1.2, ghost: 0.5, hue: 12, art: 'The hall of mirrors leaks: a reflected room floats over the real one.' },
    W107: { mirror: 1, vwave: 0.6, hue: 0, art: 'Upside-down and inside-out: the world is mirrored onto itself.' },
    W124: { tunnel: 1, ghost: 0.6, hue: 22, art: 'The dream machine runs hot: images trail behind and split in two.' },
    W125: { breathe: 0.9, ghost: 0.7, hue: 10, art: 'The city replaces itself: buildings swell and double before they change.' },
    W127: { tunnel: 1.3, hue: 0, sat: 1.1, contrast: 1.2, art: 'Corridor 0 repeats behind you, a tunnel of echoes.' },
    W148: { bands: 0.5, blobs: 0.4, hue: 30, art: 'Party lights. Too many colours for a party with nobody at it.' },
    W153: { breathe: 1, mirror: 0.5, hue: 14, art: 'The house unfolds and folds back, breathing, symmetrical.' },
    W155: { mirror: 0.8, tunnel: 0.8, hue: 16, art: 'The room that connects to itself shows itself inside itself.' },
    W161: { bands: 0.6, hue: 0, art: 'Light through stained glass sweeps across the floor in slow colours.' },
    W170: { blobs: 0.9, wave: 0.6, hue: 20, sat: 1.8, art: 'Inside the watermelon, pink and green light sloshes about.' },
    W174: { mirror: 1.4, bands: 0.7, hue: 60, sat: 1.9, art: 'A kaleidoscope: the world is folded into symmetry, colours turning fast.' },
    W177: { vwave: 0.8, blobs: 0.6, hue: 12, art: 'The sky below sways like water seen from underneath.' },
    W178: { ghost: 0.9, breathe: 0.6, hue: 0, contrast: 1.2, art: 'The room of smiles: every smile has a second one, slightly behind.' },
    W184: { blobs: 1.2, breathe: 0.8, hue: 30, sat: 1.9, art: 'The nameless colours, pouring over each other.' },
    W186: { breathe: 0.5, blobs: 0.5, hue: 6, sat: 1.2, speed: 0.6, art: 'The lullaby rocks the whole world, very slowly.' },
    W191: { ghost: 1.2, vwave: 0.8, hue: 0, sat: 0.6, contrast: 1.4, art: 'Something that should not be read: it tears, doubles and slides.' },
    W199: { breathe: 0.8, blobs: 0.6, hue: 10, art: 'The nest is warm and breathing, lit from inside.' },
    W342: { mirror: 1, bands: 0.5, hue: 24, art: 'Inside the music box everything turns and mirrors, in time.' },
    W345: { mirror: 1.3, wave: 0.6, hue: 18, art: 'The dancer’s mirror bends; her reflection dances half a beat late.' },
    W346: { tunnel: 1.5, hue: 30, art: 'On spin: the world whirls and smears into long trails.' },
    W348: { ghost: 0.8, vwave: 0.5, hue: 0, contrast: 1.25, art: 'Inside the old television the picture rolls and ghosts.' },
    W354: { blobs: 0.8, bands: 0.4, hue: 8, sat: 1.4, art: 'Inside the bulb: warm filament light pours round and round.' },
    W357: { bands: 0.9, ghost: 0.5, hue: 45, art: 'The test card at 23:59 bleeds its colours into everything.' },
    W364: { ghost: 0.9, breathe: 0.7, hue: 0, contrast: 1.3, art: 'Kept thunder: each flash leaves the room printed twice.' },
    W373: { bands: 1, vwave: 0.6, hue: 40, sat: 1.8, art: 'Every step of the rainbow staircase is a colour that keeps moving.' },
    W374: { breathe: 0.9, blobs: 0.5, hue: 6, sat: 1.2, art: 'The eclipse plaza swells with dark light.' },
    W385: { ghost: 0.9, wave: 0.9, freq: 0.03, hue: 0, art: 'The static tide: the picture doubles, rolls and comes back.' },
    W387: { bands: 0.7, blobs: 0.7, hue: 26, art: 'Every birthday at once: candle colours wash up and down the stairs.' }
  };
  YN.data.psyWorlds = Object.keys(R);
  Object.keys(R).forEach(function (id) {
    var d = W[id]; if (!d) { YN.warn('psy: unknown world ' + id); return; }
    var r = Object.assign({}, R[id]), art = r.art; delete r.art;
    d.style = Object.assign({}, d.style || {}, { psy: r });
    d.info = d.info || {};
    if (art) d.info.art = (d.info.art ? d.info.art + ' ' : '') + art;
  });
})(typeof window !== 'undefined' ? window : globalThis);
