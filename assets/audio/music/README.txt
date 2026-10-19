MUSIC — two slots ready

  perso1.ogg (or .mp3 .wav .m4a)  → the Nexus and the dream bedroom
  perso2.ogg (or .mp3 .wav .m4a)  → the Garden and the Garden at night

Drop the file here and start the game with "node tools/serve.js": it is found automatically.
The places can be changed in data/audio_plan.js (MC.custom). Only use tracks you have the rights to.

MUSIC — how to replace another track

1. Drop an .ogg (recommended), .wav or .mp3 file here.
2. In src/audio/music_config.js, fill in the track's "file" field:
     garden: { file: 'assets/audio/music/garden.ogg', loopStart: 2.0, loopEnd: 94.5, gain: 0.8, proc: { ... } }
3. If the file is missing, the procedural version plays. The game never breaks.

Each world's track id is its "music" field (data/worlds/*.js).

—

A station is waiting for a train that arrives at 23:71.
Your clock will never know. Hers will: between eleven and midnight.
