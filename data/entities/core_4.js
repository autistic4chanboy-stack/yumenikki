/* =========================================================================
 *  Habitants des Racines, du Wagon infini, de la Maison de poupée, du Ciel
 *  de linge, du Lac gelé, des Toits et de l'Hôpital de veille.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;

  YN.defEntities([
    /* ---- Racines ---- */
    { id: 'N014', name: 'Wick', world: 'W021', kind: 'animal', role: 'major', major: true, behavior: 'static', solid: true, light: 0.6,
      look: { t: 'worm', c: ['#e8e0a0'], h: 12, glow: '#f8f0a0' },
      lines: [
        { if: { item: { spark: 3 }, noEffect: 'E05' }, t: 'Wick swallows the three sparks one by one. Her tail lights up, brighter and brighter, until it burns without burning. She curls up into a little lantern and holds it out to you.', do: [{ item: { spark: -3 } }, { give: 'E05' }, { rel: { N014: 3 } }] },
        { if: { item: { spark: 1 }, noEffect: 'E05' }, seq: ['Wick looks at the spark in your hand.', { t: 'More… I’m missing some. Three. I had three.', lang: 'en' }, 'Three times she lifts her unlit tail towards the dark.'] },
        { if: { noEffect: 'E05' }, seq: ['A glow-worm that no longer glows. She whispers.', { t: 'I lost my sparks bumping into the roots. Three. They still shine, somewhere in the dark.', lang: 'en' }] },
        { t: 'Wick glows softly in your lantern when you pass close to her. She is less afraid.' }
      ],
      info: { personality: 'Shy; goes out when she is afraid.', wants: 'To find her light again.', role: 'Lantern puzzle (P005).' } },
    { id: 'N090', name: 'The Blind Mole', world: 'W021', kind: 'animal', behavior: 'wander', radius: 3, speed: 0.8,
      look: { t: 'rabbit', c: ['#3a3030'], h: 10 }, lines: [{ seq: ['She sees nothing and needs to see nothing.', { t: 'The sparks? They sing. Listen to them.', lang: 'en' }] }] },
    { id: 'N091', name: 'The Talking Root', world: 'W021', kind: 'creature', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'hollow', body: 'stick', c: ['#5a3e26', '#5a3e26', '#6a4e36', '#5a3e26'], h: 26 },
      lines: [{ t: 'She buried fruit stones here. To see. Nothing grew. Well — I did.', lang: 'en' }, { t: 'Under the hole, there’s further down. You need a light so you don’t get lost there.', lang: 'en' }] },

    /* ---- Wagon infini ---- */
    { id: 'N092', name: 'The Lady in the Seventh Carriage', world: 'W022', kind: 'human', behavior: 'static', solid: true, appear: { fn: function () { return 1 - (YN.save.temp('wagon') || 0) === 7; } },
      look: { t: 'old', head: 'round', hair: '#e0d8d0', hairStyle: 'bun', body: 'coat', c: ['#4a3a5a', '#3a2a4a', '#e0c8b0', '#e0d8d0'], eyes: 'closed', mouth: 'smile', acc: 'umbrella', h: 22 },
      lines: [{ if: { noEffect: 'E23' }, t: 'You came backwards. It’s the only way to get here. Here: when you go back up, you need something to make you stop.', lang: 'en', do: [{ give: 'E23' }] }, { t: 'The sand only falls if you let it fall.', lang: 'en' }, { t: 'I get off at the next stop. There isn’t one. So I stay.', lang: 'en' }],
      info: { role: 'Hourglass puzzle (P023): appears only in carriage 7 (towards the back).' } },
    { id: 'N093', name: 'The Sleeping Ticket Inspector', world: 'W022', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'cap', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#d8b898', '#2a3a5a'], eyes: 'closed', mouth: 'o', h: 23 },
      lines: [{ seq: [
        { t: function () { var n = 1 - (YN.save.temp('wagon') || 0); return n < 1 ? 'He opens one eye.' : 'He snores. Embroidered on his cap: “When in doubt, walk towards the back.”'; } },
        { t: function () { var n = 1 - (YN.save.temp('wagon') || 0); return n < 1 ? { t: 'Carriage ' + n + '? That doesn’t exist. Go back to the rear.', lang: 'en' } : { t: 'When in doubt… toward the back… zzz…', lang: 'en' }; } }
      ] }] },
    { id: 'N094', name: 'The Upside-Down Passenger', world: 'W022', kind: 'shadow', behavior: 'static', solid: true,
      look: { t: 'shadow', c: ['#2a2030'], h: 22 }, lines: [{ seq: ['He sits with his back to the way ahead.', { t: 'You see better what you’re leaving.', lang: 'en' }] }, { seq: [{ t: 'Seven cars back, there’s a lady who always has an hourglass. She gives it to those who come back.', lang: 'en' }, 'He holds up seven fingers, then points over his shoulder to the back of the train.'] }] },

    /* ---- Maison de poupée ---- */
    { id: 'N095', name: 'The Mother Doll', world: 'W023', kind: 'doll', behavior: 'static', solid: true,
      look: { t: 'doll', head: 'round', hair: '#4a2a1a', hairStyle: 'bun', body: 'dress', c: ['#8a6a9a', '#6a4a7a', '#f0d8c8', '#4a2a1a'], eyes: 'painted', mouth: 'painted', h: 22 },
      lines: ['She has a painted smile and eyes that watch the clock.', { seq: [{ t: '나 오늘 밤 일해. 애는 벌써 누웠어?', lang: 'ko-s', tr: 'I’m working tonight. Is the little one in bed already?' }, 'She does not turn her head to check.'] }] },
    { id: 'N096', name: 'The Father Doll', world: 'W023', kind: 'doll', behavior: 'static', solid: true, alpha: 0.4,
      look: { t: 'doll', head: 'round', hair: '#2a2a2a', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#f0d8c8', '#2a2a2a'], eyes: 'painted', mouth: 'line', acc: 'suitcase', h: 24 },
      lines: ['An almost transparent doll by the door, a suitcase in his hand.', { seq: [{ t: 'Knock knock.', lang: 'en' }, 'He does not say what comes next.'] }] },
    { id: 'N097', name: 'The Bedroom Bear', world: 'W023', kind: 'animal', behavior: 'static', solid: true,
      look: { t: 'rabbit', c: ['#b08060'], h: 12 }, lines: ['A teddy bear sitting on the edge of the parents’ bed. He is keeping the place.'] },

    /* ---- Ciel de linge ---- */
    { id: 'N098', name: 'The Clothesline Bird', world: 'W024', kind: 'animal', behavior: 'static', solid: false, talkable: true,
      look: { t: 'bird', c: ['#f0f0f0', 0, 0, '#e8a53a'], h: 12 }, lines: ['It hops from line to line. The nest is right at the top. It is not its own, but it guards it.'] },

    /* ---- Lac gelé ---- */
    { id: 'N099', name: 'The Ice Fisherman', world: 'W025', kind: 'human', behavior: 'static', solid: true, appear: { snow: true },
      look: { t: 'adult', head: 'hood', body: 'coat', c: ['#4a5a6a', '#3a4a5a', '#d8b898', '#202020'], h: 23 },
      lines: [{ seq: ['He fishes through a hole in the ice.', { t: 'The snowman lost his nose in the puddle, before the freeze. When the weather’s mild, you can see it.', lang: 'en' }, 'He points his rod at the far shore, where there is a puddle, then at the sky, where a window would be.'] }, { t: 'The hole by the island goes down a long way. Too far for me. Not for a fish.', lang: 'en' }] },
    { id: 'N100', name: 'The Shivering Doe', world: 'W025', kind: 'animal', behavior: 'wander', radius: 4, speed: 1.4, appear: { snow: false },
      look: { t: 'deer', c: ['#b08860', '#f0e8d8'], h: 20 }, lines: ['She drinks from the lake. When the window is open, she hides.'] },

    /* ---- Toits ---- */
    { id: 'N101', name: 'The Keeper of the Antennas', world: 'W026', kind: 'human', behavior: 'wander', radius: 3,
      look: { t: 'tall', head: 'helmet', body: 'uniform', c: ['#5a5a3a', '#3a3a2a', '#d8b898', '#e8d040'], h: 28 },
      lines: [{ t: 'I tune the antennas so the people down below get their dreams clearly.', lang: 'en' }, { t: 'The hatch over there goes up even higher. You need a lot of things in your pockets to push it open.', lang: 'en' }] },
    { id: 'N102', name: 'The Rooftop Cat', world: 'W026', kind: 'animal', behavior: 'wander', radius: 4, speed: 2,
      look: { t: 'cat', c: ['#a0a0a0', '#e8d040'], h: 12 }, lines: ['It watches the skylight. It is waiting for the light to go out down below.'] },

    /* ---- Hôpital ---- */
    { id: 'N103', name: 'The Night Watcher', world: 'W027', kind: 'human', behavior: 'patrol', path: [[26, 14], [34, 14], [34, 11], [26, 11]], speed: 0.9, pause: 3,
      look: { t: 'adult', head: 'round', hair: '#3a2a20', hairStyle: 'bun', body: 'uniform', c: ['#e8f0f0', '#c8d8d8', '#e0c0a0', '#3a2a20'], eyes: 'line', mouth: 'line', acc: 'clipboard', h: 23 },
      lines: [{ t: 'It’s late. Go back to bed.', lang: 'en' }, { t: 'Bed three is empty. That’s normal. Don’t ask.', lang: 'en' }, { t: 'Number twelve talks in his sleep. His radio turns itself on.', lang: 'en' }, { t: '괜찮아. 다 괜찮아.', lang: 'ko-s', tr: 'It’s all right. Everything’s all right.' }],
      info: { role: 'Blanket puzzle (P026): don’t be seen.' } },
    { id: 'N104', name: 'The Patient in 12', world: 'W027', kind: 'ghost', behavior: 'static', alpha: 0.4, solid: false, talkable: true,
      look: { t: 'ghost', c: ['rgba(220,240,240,0.4)'], h: 22 },
      lines: [{ seq: ['A voice, above the empty bed.', { t: '…ninety-six… six… my radio…', lang: 'en' }] }] },
    { id: 'N105', name: 'The Child in the Waiting Room', world: 'W027', kind: 'kid', behavior: 'static', solid: true,
      look: { t: 'kid', head: 'round', hair: '#1a1a1a', hairStyle: 'long', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1a1a1a'], eyes: 'down', mouth: 'line', h: 17 },
      lines: [{ seq: ['She swings her legs on the chair.', { t: 'I’m waiting for my mom. She finishes at seven.', lang: 'en' }] }, { t: 'They made me sleep with wires on my head, once. To watch my dreams. They didn’t see anything.', lang: 'en' }],
      info: { role: 'A possible double of the protagonist (sleep study, Laboratory 6).' } }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
