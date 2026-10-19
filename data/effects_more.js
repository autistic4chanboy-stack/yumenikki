/* =========================================================================
 *  ARTEFACTS — 90 effets de plus (E91–E180), posés par terre dans les
 *  mondes : à moitié cachés (recoins, culs-de-sac, coins sombres), mais
 *  trouvables sans énigme. Chacun a une fonction réelle : une action (F),
 *  une capacité, ou un changement de pas, de bruit, de lumière, de discrétion.
 *  Aucun n'est nécessaire pour finir (les 30 du cœur restent les mêmes).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var GIRL = (YN.spr && YN.spr.GIRL) || { hair: '#1e1a26', hairHi: '#4a4258', skin: '#f6d8c0', skinSh: '#e0b49a', blush: '#f0a0a8', eye: '#2a1822', sweater: '#a8c4e2', sweaterSh: '#7e9cc4', sweaterHi: '#d4e4f4', skirt: '#2c3458', sock: '#f2f0f6', shoe: '#5a2c2c', clip: '#f4c84a' };
  function pal(sw) { if (!sw) return null; var P = YN.paint; var o = Object.assign({}, GIRL); o.sweater = sw; o.sweaterSh = P && P.sh ? P.sh(sw, -0.22) : sw; o.sweaterHi = P && P.sh ? P.sh(sw, 0.3) : sw; return o; }

  /* [id, nom, famille, icône (glyphe|accessoire), couleur, accessoire porté, pull, action, réglages, capacités, description, usage, monde] */
  var T = [
    // ---- dans les quarante premiers rêves ----
    ['E91', 'Coat Button', 'keepsake', '●', '#6a4a3a', null, null, 'decoy', {}, [], 'Someone’s coat is missing it.', 'Throw it: it rolls, and whatever is listening goes to it for a few seconds.', 'W001'],
    ['E92', 'Slippers', 'home', 'ʊ', '#e8a0b0', null, '#e8c8d0', 'breath', { noise: 0.35, speed: 0.92 }, [], 'You walk like someone who doesn’t want to wake anyone.', 'Almost silent steps; hold your breath (F).', 'W009'],
    ['E93', 'Bobble Hat', 'winter', '◓', '#c04040', null, '#c86060', 'hop', {}, ['scarf'], 'Knitted too big, to last.', 'No more slipping on ice; small hop (F).', 'W025'],
    ['E94', 'Glass Marble', 'school', '◉', '#60a0e0', null, null, 'roll', {}, [], 'Inside, a storm that never gets out.', 'Roll it: a number from one to six.', 'W030'],
    ['E95', 'Playground Elastic', 'school', '∞', '#f0d040', null, null, 'hop', {}, [], 'Three, two, one, hop on one foot.', 'Jump over a low obstacle.', 'W004'],
    ['E96', 'Scented Eraser', 'school', '◪', '#f0a0c0', 'eraser', null, 'erase', {}, [], 'It smells of strawberry and of rubbed-out things.', 'Erase what is written in front of you.', 'W018'],
    ['E97', 'Blue Chalk', 'school', '/', '#80a8f0', 'chalk', null, 'draw', {}, [], 'It draws gentler doors.', 'Draw a door on certain blackboards.', 'W014'],
    ['E98', 'Firefly Jar', 'night', '⊡', '#d8f080', 'jar', null, 'glow', { light: 2.2 }, [], 'They blink all at once when you’re afraid.', 'A green glow you switch on and off (F).', 'W019'],
    ['E99', 'Blackbird Feather', 'garden', '⸙', '#2a2a30', 'feather', null, 'sense', { noise: 0.7 }, ['feather'], 'It always leans the same way.', 'Brown leaves fall silent; it shows where the nearest artefact is hiding (F).', 'W006'],
    ['E100', 'Sunflower Seeds', 'garden', '⁂', '#e0b030', 'sprout', null, 'plant', {}, [], 'An open packet. One is missing.', 'Plant in the earth.', 'W028'],
    ['E101', 'Party Streamer', 'party', '೫', '#e04060', 'ribbon', null, 'ribbon', {}, [], 'It once tied up a present that was never opened.', 'Go back to the Nexus (unless a witch is very close).', 'W020'],
    ['E102', 'Candyfloss', 'party', '☁', '#f0b0d0', null, '#f0c8e0', 'float', {}, [], 'It melts before you get hungry.', 'Float above the ground (F).', 'W026'],
    ['E103', 'Rabbit Mask', 'party', 'ᴥ', '#f0f0f0', 'bagmask', null, 'hide', { stealth: 0.25 }, ['mask'], 'The eyes are too big for you.', 'Harder to notice; hide (F).', 'W034'],
    ['E104', 'Teaspoon', 'home', 'ɿ', '#c8c8d0', null, null, 'ring', {}, [], 'For stirring medicine into warm milk.', 'Clink: whoever is near turns towards you.', 'W017'],
    ['E105', 'Flashlight', 'night', '▶', '#f0e0a0', 'lantern', null, 'lantern', { light: 3.2 }, [], 'It makes its rounds on its own.', 'A strong light (F).', 'W027'],
    ['E106', 'Night Watchman’s Badge', 'hospital', 'KM', '#e8e0d0', null, null, 'reveal', {}, [], 'KIM M. — 21:00 / 07:00.', 'For an instant, shows what is hidden nearby.', 'W038'],
    ['E107', 'Letterbox Key', 'home', '⚷', '#c8a040', 'keys', null, 'none', {}, ['keys'], 'It opens only a very small rectangle of the world.', 'Opens what the Keyring opens.', 'W003'],
    ['E108', 'Metro Ticket', 'transport', '▭', '#e8e0a0', 'ticket', null, 'none', {}, ['ticket'], 'Punched twice, to be sure.', 'Gets through turnstiles and onto platforms, like the Ticket.', 'W022'],
    ['E109', 'Goldfish in a Bag', 'water', '≈', '#f08040', null, '#f0a060', 'none', {}, ['swim'], 'It has never seen the sea. It is looking for it.', 'Swim in water.', 'W039'],
    ['E110', 'Clear Umbrella', 'city', '☂', '#c8e0f0', 'umbrella', null, 'none', {}, ['umbrella'], 'You can see the rain that doesn’t touch you.', 'Keeps the rain off.', 'W010'],
    ['E111', 'Earphones', 'language', '♫', '#3a3a4a', 'headphones', null, 'none', { noise: 0.85 }, ['translate'], 'Someone is talking inside them, very quietly, in your language.', 'Translates what the inhabitants say.', 'W015'],
    ['E112', 'Sunglasses', 'city', '⌐', '#2a2a2a', 'sunglasses', null, 'none', { stealth: 0.3 }, [], 'The world is darker, and looks less closely.', 'You are noticed less.', 'W013'],
    ['E113', 'Disposable Camera', 'keepsake', '◘', '#e0c040', 'camera', null, 'photo', {}, [], 'Only one shot left.', 'A flash that unmasks the Copycat.', 'W036'],
    ['E114', 'Walkie-Talkie', 'night', '⌸', '#4a4a4a', 'radio', null, 'radio', {}, [], 'The other one is somewhere in the Maze.', 'Search the airwaves for voices.', 'W031'],
    ['E115', 'Kite', 'garden', '◇', '#e04040', null, null, 'scout', {}, [], 'It pulls towards one particular place.', 'See far, for a few seconds.', 'W012'],
    ['E116', 'Jingle Bell', 'mono', '♪', '#d8d8d8', 'bell', null, 'ring', {}, [], 'It only rings in colours.', 'Jingle: whoever is near turns around.', 'W005'],
    ['E117', 'Birthday Candle', 'keepsake', '¦', '#f0c040', 'glow', null, 'glow', { light: 1.8 }, [], 'Six years old. Blown out alone.', 'A small glow you light (F).', 'W023'],
    ['E118', 'Swimming Medal', 'water', '◎', '#e0c040', null, null, 'none', { speed: 1.12 }, [], '25 metres. No one was there to see.', 'You move a little faster.', 'W016'],
    ['E119', 'Roller Skates', 'city', '◫', '#e05050', 'skates', '#e0a0a0', 'none', { speed: 1.28, noise: 1.4 }, [], 'They roll on their own downhill.', 'Fast, but noisy.', 'W008'],
    ['E120', 'Peppermint', 'keepsake', '◍', '#a0f0d0', null, null, 'breath', { noise: 0.85 }, [], 'Halmeoni always had one, in her apron pocket.', 'Hold your breath (F).', 'W011'],
    ['E121', 'Postcard from Seoul', 'language', '✉', '#e8d0a0', 'letter', null, 'none', {}, ['map'], '“It’s hot here. I’m thinking of you.” No signature.', 'A map of the surroundings (M key).', 'W033'],
    ['E122', 'Coffee Thermos', 'night', 'ʘ', '#8a5a3a', null, null, 'none', { speed: 1.1 }, ['caffeine'], 'Still lukewarm. For a night shift.', 'Keeps your eyes open: you move faster.', 'W029'],
    ['E123', 'Red Thread', 'keepsake', '〰', '#c02020', null, null, 'thread', {}, [], 'It ties together two places that don’t know each other.', 'Tie the thread, then find your way back to the knot.', 'W037'],
    ['E124', 'Singing Shell', 'water', '@', '#f0d8c0', null, null, 'echo', {}, [], 'It repeats the last thing it was told.', 'An echo that draws the walls around you.', 'W024'],
    ['E125', 'Doorbell Button', 'home', '◉', '#c03030', null, null, 'decoy', {}, [], 'Ding. Dong. Don’t open.', 'A sound lure, for a few seconds.', 'W007'],
    // ---- dans les rêves secrets ----
    ['E126', 'Letter Never Sent', 'keepsake', '✉', '#f0e8d0', 'letter', null, 'write', {}, [], 'Addressed to “later”. No stamp.', 'Write a word.', 'W138'],
    ['E127', 'Folded Crane', 'paper', '⌃', '#f0ece0', 'crane', null, 'hop', {}, [], 'Unfolded, it becomes a letter; folded, it jumps.', 'Jump over a low obstacle.', 'W041'],
    ['E128', 'Honeycomb', 'garden', '⬡', '#e0a020', null, '#e8c060', 'none', { noise: 0.7 }, ['bee'], 'The workers take you for one of their own.', 'Softer steps; the bees let you through.', 'W042'],
    ['E129', 'Gown Button', 'hospital', '+', '#e0e8f0', null, '#e8eef0', 'reveal', {}, [], 'Fallen from a gown that runs.', 'For an instant, shows what is hidden nearby.', 'W043'],
    ['E130', 'Straw Hat', 'fields', '◠', '#d8b860', null, null, 'statue', { stealth: 0.2 }, ['camo'], 'The scarecrows recognise it.', 'Freeze like a scarecrow (F).', 'W044'],
    ['E131', 'Pitchfork', 'fields', 'Ψ', '#8a6a4a', null, null, 'shout', {}, [], 'Too heavy for a child. She carries it anyway.', 'A shout heard from far away.', 'W045'],
    ['E132', 'Dried Flower', 'garden', '❀', '#c080c0', 'flowercrown', null, 'smell', {}, [], 'Pressed on the day someone left.', 'Smell out trails, for a few seconds.', 'W046'],
    ['E133', 'Cork', 'water', '▮', '#c8a070', null, null, 'float', {}, [], 'It never sinks. It boasts about it.', 'Float (F).', 'W047'],
    ['E134', 'Clothes Peg', 'home', 'ʌ', '#e0d0a0', null, null, 'fold', {}, [], 'It holds two moments together.', 'Mark a fold, then snap back to it (F twice).', 'W048'],
    ['E135', 'Parking Ticket', 'city', '▭', '#f0f0e0', 'ticket', null, 'thread', {}, [], 'Level minus forty. Time of entry: never.', 'Tie a thread and find your way back.', 'W049'],
    ['E136', 'Key to Room 404', 'hotel', '⚿', '#c8a040', 'keys', null, 'none', {}, ['keycard'], 'The room doesn’t exist. The key does.', 'Opens what the Keycard opens.', 'W050'],
    ['E137', 'Raindrop', 'city', '◖', '#80b0e0', 'tear', null, 'cry', {}, ['umbrella'], 'It doesn’t fall. It waits.', 'Keeps the rain off; cry (F).', 'W051'],
    ['E138', 'Bent Antenna', 'city', 'Y', '#a0a0b0', 'radio', null, 'radio', {}, [], 'It picks up a station that no longer broadcasts.', 'Search the airwaves for voices.', 'W052'],
    ['E139', 'Lift Button', 'office', '▲', '#e0c040', null, null, 'rewind', {}, [], 'It always takes you back a little.', 'Go back a few steps.', 'W053'],
    ['E140', 'Queue Number', 'office', '77', '#e04040', null, null, 'stopTime', {}, [], 'It isn’t your turn yet. It is never your turn.', 'Stop time for a few seconds.', 'W054'],
    ['E141', 'Broken Remote', 'screens', '▤', '#3a3a3a', null, null, 'tv', {}, [], 'The red button still works.', 'Switch screens off, or back on.', 'W055'],
    ['E142', 'Photo Booth Strip', 'keepsake', '▥', '#e8e8e8', 'camera', null, 'photo', {}, [], 'Four smiles. Only one is real.', 'A flash that unmasks.', 'W056'],
    ['E143', 'Rubber Duck', 'water', '◒', '#f0d040', null, '#f0e080', 'none', {}, ['swim'], 'Squeak.', 'Swim in water.', 'W057'],
    ['E144', 'One Step Too Many', 'stairs', '⌐', '#8a8a9a', null, null, 'gravity', {}, [], 'The one you miss in the dark.', 'Reverse gravity, where it can be done.', 'W058'],
    ['E145', 'Grandma’s Stool', 'keepsake', 'π', '#8a6a4a', null, null, 'statue', {}, [], 'High enough to see out of the window.', 'Sit down and stay still (F).', 'W059'],
    ['E146', 'Film Reel', 'keepsake', '⊚', '#3a3a3a', null, null, 'rewind', {}, [], 'The film where a little girl waits for her mother.', 'Go back a few steps.', 'W060'],
    ['E147', 'Four-Colour Pen', 'school', '✎', '#e04040', null, null, 'write', {}, [], 'The green has run out. The red, almost.', 'Write a word.', 'W061'],
    ['E148', 'PC방 Headset', 'screens', '♫', '#2a2a3a', 'headphones', null, 'none', { noise: 0.7 }, ['translate'], 'Someone translates inside it, all night long.', 'Translates what the inhabitants say; quieter steps.', 'W062'],
    ['E149', 'Rice Triangle', 'night', '△', '#f0f0e0', null, null, 'none', { speed: 1.1 }, ['caffeine'], 'Dinner at three in the morning.', 'You move a little faster.', 'W063'],
    ['E150', 'Scratched Metro Card', 'transport', '▭', '#40a0e0', null, null, 'none', {}, ['transit', 'ticket'], 'Balance: 0. It still gets through.', 'Gets through turnstiles and onto platforms.', 'W064'],
    ['E151', 'Apartment Key', 'home', '⚷', '#c0c0c0', 'keys', null, 'knob', {}, [], 'It opens all the identical apartments. None of them is yours.', 'Open a door shut with a lock (not the passages the dream refuses).', 'W065'],
    ['E152', 'Thermal Bag', 'city', '▣', '#e08020', null, '#e0a040', 'none', { speed: 1.22, noise: 1.3 }, [], 'Delivered in thirty minutes, or it’s one star.', 'Very fast, a little noisy.', 'W066'],
    ['E153', 'Karaoke Mic', 'screens', '♬', '#c040c0', 'mic', null, 'sing', {}, [], 'At karaoke, nobody cries.', 'Sing.', 'W067'],
    ['E154', 'Phosphor Note', 'city', '힘', '#f0e080', 'glow', null, 'glow', { light: 2.4 }, [], '힘내세요.', 'A glow you light (F).', 'W068'],
    ['E155', 'Dead Pixel', 'screens', '■', '#ff40ff', null, null, 'reveal', {}, [], 'It stays lit when everything goes dark.', 'For an instant, shows what is hidden.', 'W069'],
    ['E156', 'Drone Propeller', 'city', '✣', '#a0a0a0', null, null, 'scout', {}, [], 'It filmed everything. It saw nothing.', 'See far, for a few seconds.', 'W070'],
    ['E157', 'Parade Insignia', 'North', '★', '#c02020', null, null, 'none', { stealth: 0.2 }, ['smile'], '우리는 행복합니다.', 'The guards of the North let you through; you are noticed less.', 'W071'],
    ['E158', 'Model Village Brick', 'North', '▦', '#c8c0b0', null, null, 'hide', {}, [], 'There is nothing behind it. There never was.', 'Hide behind it (F).', 'W072'],
    ['E159', 'Whalebone', 'water', '⌇', '#e8e0d0', null, null, 'echo', {}, [], 'It sings when you blow into it.', 'An echo that draws the walls.', 'W101'],
    ['E160', 'Forbidden Tear', 'North', '◖', '#a0c0ff', 'tear', null, 'cry', { stealth: 0.15 }, [], 'Displayed under glass. Someone stole it.', 'Cry (F); you are noticed a little less.', 'W103'],
    ['E161', 'Pocket Reflection', 'mirror', '◑', '#c8d8e8', 'pocketmirror', null, 'mirror', {}, ['mirrorwalk'], 'It keeps your left side on the right.', 'Walk through some mirrors; unmask the Copycat.', 'W104'],
    ['E162', 'Paper Rat', 'maze', 'ɛ', '#8a8a8a', null, null, 'sense', {}, [], 'It knows every map, even the false ones.', 'Shows where the nearest artefact is hiding.', 'W105'],
    ['E163', 'Doorless Handle', 'doors', 'ɔ', '#c8a040', null, null, 'knob', {}, [], 'It is looking for its door. It tries a great many.', 'Open a door shut with a lock.', 'W106'],
    ['E164', 'Pebble from the Ceiling', 'upside-down', '·', '#8a8a9a', null, null, 'gravity', {}, [], 'It fell upwards.', 'Reverse gravity, where it can be done.', 'W107'],
    ['E165', 'Voice in a Jar', 'voices', '⊡', '#c8e8ff', 'jar', null, 'shout', {}, [], 'Open the lid: someone is calling.', 'A shout heard from far away.', 'W108'],
    ['E166', 'Returning Pine Cone', 'forest', '♣', '#6a8a4a', null, null, 'plant', {}, [], 'Throw it away and it comes back.', 'Plant in the earth.', 'W109'],
    ['E167', 'Black Marker', 'censorship', '▬', '#101010', 'inkhands', null, 'erase', {}, [], 'It blacked out names. It would like to give them back.', 'Erase what is written.', 'W110'],
    ['E168', 'Puppet String', 'theatre', '⫶', '#f0f0e0', null, null, 'puppet', {}, [], 'It is looking for hands to move.', 'An inhabitant follows you with its eyes and its steps.', 'W111'],
    ['E169', 'Ticket from 1989', 'keepsake', '▭', '#e0c8a0', 'ticket', null, 'rewind', {}, [], 'Bus 47, Seoul, one rainy evening.', 'Go back a few steps.', 'W116'],
    ['E170', 'Ball of Wool', 'keepsake', '◍', '#c06080', null, '#d08098', 'thread', {}, [], 'A scarf begun in 1989.', 'Tie a thread and find your way back.', 'W117'],
    ['E171', 'Electrode', 'laboratory', '⌁', '#c0c0c0', null, null, 'reveal', {}, ['reveal'], 'Stuck to a temple that was dreaming.', 'See what is hidden nearby.', 'W121'],
    ['E172', 'Subject 6 Wristband', 'laboratory', '6', '#e8e0d0', null, null, 'none', { stealth: 0.35, noise: 0.8 }, [], 'The name is written on the inside, backwards.', 'Far less noticed by whatever hunts.', 'W124'],
    ['E173', 'Big Laugh’s Badge', 'office', '☺', '#f0d040', 'smile', null, 'clap', {}, [], 'It forces the corners of the mouth up.', 'Laugh: those who laugh with you remember it.', 'W131'],
    ['E174', 'Canteen Tray', 'office', '▭', '#a0a8b0', null, null, 'decoy', {}, [], 'Drop it: everyone turns around.', 'A sound lure.', 'W132'],
    ['E175', 'Stapler', 'office', '⫟', '#3a3a3a', null, null, 'stamp', {}, [], 'It holds together pages that don’t belong together.', 'Stamp, approve.', 'W134'],
    ['E176', 'Nameless Pot', 'garden', 'Ʊ', '#a06030', null, null, 'water', {}, [], 'It waters what you thought was dead.', 'Water the earth.', 'W137'],
    ['E177', 'Desk Photo', 'keepsake', '◘', '#e8e0d0', 'camera', null, 'photo', {}, [], 'A little girl, a badge: 미란.', 'A flash that unmasks.', 'W139'],
    ['E178', 'Nour’s Blue Marker', 'keepsake', '✎', '#3a5aa0', null, '#5a7ab0', 'none', {}, ['map'], 'She draws the maps on her arm with it.', 'A map of the surroundings (M key).', 'W140'],
    ['E179', 'Stained-Glass Shard', 'cathedral', '◈', '#c040a0', 'glow', null, 'glow', { light: 2.6 }, [], 'A sorrow, when the light shines through.', 'A coloured glow you light (F).', 'W161'],
    ['E180', 'Nameless Colour', 'before words', '✺', '#40e0c0', 'halo', null, 'glow', { light: 2 }, [], '—', 'A glow no one has ever seen (F).', 'W184']
  ];

  var GET_HINTS = ['On the ground, in a nook, something barely glints.', 'Half hidden, deep in a corner, something is waiting to be picked up.', 'In a dead end, under the dust, a tiny glint.', 'Where no one goes, on the ground: something.'];
  T.forEach(function (r, i) {
    if (YN.effectById(r[0])) return;
    var icon = { glyph: r[3], c: r[4] };
    var e = { id: r[0], name: r[1], fam: r[2], world: r[12], icon: icon, desc: r[10], use: r[11], get: GET_HINTS[i % GET_HINTS.length].replace('.', '') + ' (' + ((YN.data.worlds[r[12]] || {}).name || r[12]) + ').', ground: true, core: false };
    if (r[5]) e.acc = r[5];
    if (r[6]) e.pal = pal(r[6]);
    e.action = r[7] || 'none';
    U.keys(r[8] || {}).forEach(function (k) { e[k] = r[8][k]; });
    if (r[9] && r[9].length) e.caps = r[9].slice();
    YN.data.effects.push(e);
    // posé par terre, dans un recoin du monde
    var w = YN.data.worlds[r[12]]; if (!w) { YN.warn('artefact without a world: ' + r[0]); return; }
    // plus rien ne traîne simplement par terre : chaque artefact a sa façon d'apparaître (src/world/finds.js)
    YN.finds.plan(w, e, i);
  });
  YN._effIndex = null;
  YN.finds.hook();
})(typeof window !== 'undefined' ? window : globalThis);
