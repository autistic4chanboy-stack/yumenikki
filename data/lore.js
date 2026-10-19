/* =========================================================================
 *  Objets, notes du journal, numéros de téléphone, fréquences radio,
 *  sorcières, glossaire et chronologie (pour l'encyclopédie).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;

  YN.data.items = {
    plank: { name: 'Plank', desc: 'For a garden still to come.' },
    apple: { name: 'Apple', desc: 'It is shaped like a heart, almost.' },
    carrot: { name: 'Carrot', desc: 'A nose waiting for a face.' },
    seed: { name: 'Pip’s Seed', desc: 'It seems to know where to go.' },
    spark: { name: 'Spark', desc: 'It warms your pocket.' },
    crane: { name: 'Paper Crane', desc: 'Folded by someone who didn’t want to stop.' },
    shoe: { name: 'Little Shoe', desc: 'A name embroidered inside: 옥순.' },
    photo: { name: 'Photograph', desc: 'A child. The face hasn’t been scratched out, here.' },
    toytrain: { name: 'Wooden Train', desc: 'The engine has a number on it: 23.' },
    letter: { name: 'Letter', desc: 'Dated tomorrow.' },
    word: { name: 'Word', desc: 'It fits in your hand.' },
    ticketstub: { name: 'Ticket Stub', desc: '23:71.' },
    badge: { name: 'Badge', desc: 'KIM M. — Night shift.' },
    key: { name: 'Key', desc: 'It opens something small.' },
    joke: { name: 'Joke Ticket', desc: '“Knock knock. — Who’s there? — …” The rest is torn off.' },
    drawing: { name: 'Drawing', desc: 'Two girls holding hands in front of a house.' }
  };

  /* les âmes : ce qu'on voit avant et après leur message */
  YN.data.soulOpen = ['A soul floats in front of you. It was waiting for someone.', 'A soul forms in the air, like breath on a bitterly cold day.', 'Something very light turns towards you. A soul.', 'A soul raises two soot-black eyes to you. It has something to say, just once.', 'A little soul, at a child’s height, tugs at your sleeve.',
    'A soul peels away from the wall, like a shadow that has learned to talk.',
    'The air blurs. A soul has been here a long time; it has only just seen you.',
    'A soul leans towards you, with the politeness of people who have waited a long time.',
    'A soul shivers close to the ground, then rises to your height.',
    'A soul appears, pale as a lit window seen from very far away.',
    'A soul comes closer without a sound, like someone coming home late who doesn’t want to wake anyone.',
    'A soul holds something close, a sentence perhaps. It holds it out to you.'];
  YN.data.soulClose = ['It comes undone like mist on a windowpane.', 'It goes out gently, like a nightlight someone is finally allowed to switch off.', 'It rises, thins out, is gone. The message stays.', 'All that is left of it is a little cold, and what it said.', 'It smiles, perhaps, and scatters.',
    'It unfolds like a paper crane, and there is nothing left inside.',
    'It draws back, fades, and the place is a little emptier than before.',
    'It leaves without a sound, like someone who doesn’t want to wake the house.',
    'It trembles one last time, then there is only air.',
    'It evaporates. Somewhere, a lamp goes out, then comes back on.',
    'It bows, very low, as if to apologise for having been there, and disappears.',
    'It comes undone from the bottom up, feet first. The left one goes first.'];

  YN.data.notes = {
    n_halmeoni: { t: 'In front of the statue, she said a word she no longer says. A blackbird answered.' },
    n_oksun_statue: { t: 'A name. The wind smelled of soap.' },
    n_mothersday: { t: 'A Sunday in May. Two beads were missing from the necklace.' }
  };

  /* numéros (Téléphone E11) — toujours trouvés quelque part dans les rêves */
  YN.data.phone = {
    '2371': { lines: [{ t: 'A station announcement, very far away.' }, { t: '… the twenty-three seventy-one train… now approaching… platform zero…', lang: 'en' }] },
    '119': { lines: [{ t: 'A calm voice.' }, { t: 'You can call this number when you’re awake, too. I’m staying on the line.', lang: 'en' }, { t: 'She says you can call when you’re awake, too. She won’t be the first to hang up.' }] },
    '3114': { lines: [{ t: 'A soft voice, listening.' }, { t: 'I’m here. You don’t have to say anything. I’ll wait with you.', lang: 'en' }, { t: 'You don’t have to say anything. She waits anyway, with you.' }] },
    '0': { lines: [{ t: 'Dial tone. Then, very quietly:' }, { t: '엄마 지금 일하는 중이야. 이따 전화할게.', lang: 'ko-s', tr: 'Mum’s at work right now. I’ll call you back later.' }] }
  };

  /* fréquences (Radio E20) valables partout ; les mondes en ajoutent */
  YN.data.radio = {
    '88.0': { line: { t: '… it’s three in the morning, you’re listening to the night…', lang: 'en' } },
    '101.1': { line: { t: '오늘도 수고하셨습니다. 내일도 힘내세요.', lang: 'ko-s', tr: 'Thank you for your hard work today. Keep going tomorrow too.' } },
    '105.7': { line: { t: '우리는 행복합니다. 우리는 행복합니다. 우리는…', lang: 'ko-n', tr: 'We are happy. We are happy. We…' } }
  };

  YN.data.witches = [
    { id: 'silent', name: 'The Silent One', num: 'I', unlock: 2, speed: 2.5, chase: 3.7, sight: 6, home: 'W005', sfx: 'witch_silent', affinity: ['mono', 'quiet', 'dark'],
      look: 'Tall, thin, black dress, long grey hair over her face, a chalk finger on a mouth that doesn’t exist.', sound: 'A shrill breath; above all, the sounds of the world going out one by one.',
      appear: 'Active once 2 effects are kept. More frequent in silent and monochrome worlds.', detect: 'Sees what moves (6 tiles, 3 in the dark). Standing still, you are invisible to her — unless a light you carry is on. Any change of light draws her.', escape: 'Stop dead; switch off; take a door out of her sight; Fireflies rather than Lantern.', lang: '“Shh’ma ja…”' },
    { id: 'bell', name: 'The Doorbell', num: 'IV', unlock: 5, speed: 2.8, chase: 4.1, sight: 3, home: 'W011', sfx: 'witch_bell', affinity: ['noisy', 'city', 'phones'],
      look: 'A dark body, a doorbell for a face, a telephone cord trailing behind.', sound: 'Distant ding-dongs, footsteps with no source, empty announcements.',
      appear: 'Active once 5 effects are kept.', detect: 'Hears: running, brown leaves, water, metal, bells, speech, repeated actions. Goes to the last noise.', escape: 'Walk, keep quiet, Feather, hold your breath; ring a decoy somewhere else (Telephone, Radio).', lang: '“Vrou-pa… dinn.”' },
    { id: 'copy', name: 'The Copycat', num: 'III', unlock: 8, speed: 2.2, chase: 5.6, sight: 5, home: 'W004', sfx: 'witch_copy', affinity: ['crowd', 'school'],
      look: 'A mannequin with a mirror for a face. In disguise, she looks like one of the world’s NPCs — a double.', sound: 'A music box playing backwards.',
      appear: 'Active once 8 effects are kept.', detect: 'Disguised near an inhabitant; reveals herself if you talk to her or stay next to her. Then she charges, very fast, for a short time.', escape: 'Spot the double; Pocket Mirror or Photo Booth unmask her from a distance; Mask confuses her.', lang: 'She repeats, backwards, the last sentence you said.' },
    { id: 'seam', name: 'The Seamstress', num: 'II', unlock: 12, speed: 2.7, chase: 3.9, sight: 5, home: 'W009', sfx: 'witch_seam', affinity: ['house', 'interior'],
      look: 'A pincushion for a head, scissors at the ends of her arms, a tape measure worn as a scarf.', sound: 'A sewing machine that never stops.',
      appear: 'Active once 12 effects are kept.', detect: 'Follows the trail of the doors you take. Re-stitches a door onto another world, closes a shortcut.', escape: 'Take a door she hasn’t re-stitched; Eraser or Handle on the seams.', lang: '“Nu-vé, nu-vé, ka-shé…”' },
    { id: 'voyager', name: 'The Traveller', num: 'V', unlock: 16, speed: 3.0, chase: 4.3, sight: 5, home: 'W002', sfx: 'witch_voyager', affinity: ['transport', 'hub'],
      look: 'Long coat, ticket inspector’s cap, no face, a suitcase marked “J.”.', sound: 'A train slowing down, a whistle very far away.',
      appear: 'Active once 16 effects are kept.', detect: 'Knows your usual routes and goes to wait for you at the door you take most often.', escape: 'Change your route, one-way passages, Thread, Suitcase.', lang: '“Rèv’yen’dra, ommar dess…”' }
  ];

  YN.data.glossary = [
    ['Biscuit', 'Protects you from a single fatal attack during the dream, then disappears.'],
    ['Blue Pill', 'In the chest of drawers. A 20-minute dream. One per night. Comes back without explanation.'],
    ['White Vial', 'In the chest of drawers. The following night is “flattened”. Never explained.'],
    ['Corruption', 'A reversible layer laid over a world by the witches (local) or the Priestess (persistent, 1 to 5).'],
    ['Anchor', 'An object in a world that can stabilise its corruption (statue, master clock…).'],
    ['Nest', 'In the room beneath the Nexus. Thirty nests for thirty effects.'],
    ['Depth', 'Dream layer (0 to 5). Deeper = more unstable, older, stranger.'],
    ['Pinch yourself', 'Hold P: wake up (1.5 s × depth).'],
    ['Carved signs', 'A script of 26 signs, on the walls. The game doesn’t say what it is.'],
    ['Vallonian', 'The language of the nameless people (W012), which is losing its words.'],
    ['23:71', 'An hour that overflowed.'],
    ['어버이', '“The Parent”. What the people of Happiness Station give thanks to.'],
    ['야근', 'The night hours at the office, in the Glass Tower.']
  ];

  YN.data.timeline = [
    ['1942', 'A birth, in the North.'], ['1951', 'A station platform. Two children. Only one train.'], ['1980', 'A birth in Seoul.'],
    ['1989', 'A child waits for her father every night.'], ['2008', 'A departure for France.'], ['2014', 'A birth.'],
    ['2020', 'A suitcase marked “J.”.'], ['2023', 'A statue, in a dream.'], ['2025', 'A school playground. A sleep study.'],
    ['2026', 'Now.'], ['2044', 'Letters dated from a possible future.']
  ];
})(typeof window !== 'undefined' ? window : globalThis);
