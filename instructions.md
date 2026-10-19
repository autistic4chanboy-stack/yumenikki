# INFINITE DREAMS — ULTIMATE GAME DEVELOPMENT SPECIFICATION

## Role and mission

You are an autonomous senior game development team operating through Claude Code. You possess expertise in browser game engineering, procedural generation, surrealist art direction, psychological horror, atmospheric sound design, AI behavior, level design, narrative design, performance optimization, and software testing.

Your mission is to inspect the current repository, read `instructions.md` in its entirety, obey its requirements, and develop the actual playable game described in this specification.

**IMPORTANT: `instructions.md` IS THE FIRST SOURCE OF PROJECT-SPECIFIC REQUIREMENTS.**

Before changing any files:

1. Inspect the current working directory.
2. Read `instructions.md` completely.
3. Inspect the existing source code, assets, configuration files, and project structure.
4. Identify existing functionality that must be preserved.
5. Combine the requirements of `instructions.md` with every requirement in this prompt.
6. Create an implementation plan that fits the actual project.
7. Begin implementing the game immediately after the inspection.

Do not merely return a plan or recommendations. Modify the project files, implement the game, run it, test it, and fix problems.

If an instruction conflicts with an existing architectural decision, investigate the conflict and select the most coherent solution. Do not silently discard explicit requirements.

If the repository already contains a partially implemented game, improve and extend it rather than replacing everything unnecessarily.

Do not ask for confirmation for ordinary implementation decisions. Make reasonable decisions independently.

---

# 1. THE GAME: A LIVING UNIVERSE OF DREAMS

Create an original surreal psychological exploration game inspired by the atmosphere, exploration, ambiguity, and dreamlike structure of Yume Nikki.

The game must be an original spiritual successor. Do not copy copyrighted characters, maps, sprites, music, or other protected assets from existing games.

The player controls a young girl who falls asleep in her bedroom and enters a vast universe of dreams.

This universe contains impossible architecture, enormous empty spaces, disturbing figures, strange languages, forgotten places, recursive environments, psychedelic dimensions, monochrome landscapes, realistic locations, hand-drawn worlds, and spaces that cannot be explained by conventional logic.

The game is not a conventional RPG, combat game, or linear horror adventure.

Its central experience is exploration.

The player should feel that every door might lead somewhere beautiful, disturbing, incomprehensible, or fundamentally different from anything encountered before.

The game must evoke several contrasting emotions:

* Loneliness.
* Melancholy.
* Dread.
* Curiosity.
* Wonder.
* Confusion.
* Nostalgia.
* Unease.
* Psychedelic fascination.
* Occasional beauty.
* Sudden terror.
* The feeling of being somewhere that should not exist.

Some worlds should appear meaningful. Others should seem completely meaningless.

Some encounters should feel carefully staged. Others should seem like accidental glimpses into an enormous universe that exists independently of the player.

Never explain everything.

Never turn the entire experience into a sequence of obvious horror tropes.

The atmosphere must remain oppressive and dreamlike, even in worlds that initially appear cheerful or peaceful.

# 2. TECHNICAL TARGET: A GAME PLAYABLE IN THE BROWSER

The finished game must be playable directly in a modern web browser.

The player must be able to open the game, start a new session, explore the worlds, interact with NPCs, collect Effects, encounter enemies, save progression, and return to the game without needing to install a native desktop application.

Inspect the existing project before selecting or changing the technology.

If the project already uses a suitable web game engine or framework, preserve and extend it.

If starting from scratch, prefer an architecture suitable for a substantial browser-based game, such as:

* TypeScript.
* Vite.
* HTML5.
* Canvas or WebGL rendering.
* A suitable 2D/3D game framework.
* Web Audio API for procedural sound and audio playback.
* IndexedDB or another appropriate persistent browser storage mechanism.

A hybrid rendering architecture may be used if it genuinely improves the game.

Do not add unnecessary frameworks or dependencies.

## Browser requirements

Implement:

* A functional main menu.
* New game and continue.
* Keyboard controls.
* Optional gamepad support where practical.
* Fullscreen support.
* Responsive rendering.
* Audio settings.
* Graphics settings appropriate to the engine.
* Accessibility options.
* Persistent save data.
* Loading indicators when needed.
* Reliable transitions between environments.
* Proper handling of browser focus and visibility changes.

The game must remain playable at different screen resolutions.

Use pixel-perfect rendering in pixel-art environments where appropriate, while allowing high-resolution rendering for realistic and experimental worlds.

The game must not require an internet connection for its core gameplay after its assets have been loaded.

Do not depend on external image URLs that may disappear or introduce privacy or availability problems.

Use original assets, locally stored assets, procedural graphics, or appropriately licensed materials.

When external real-world photographs are used, store local copies in the project and respect their licenses.

If the project must be served through a local development server, provide clear startup instructions in the README.

The final result must be an actual game, not a website that merely describes a game.

# 3. VISUAL EXPERIENCE IS A PRIMARY OBJECTIVE

Exploring the dream universe must be a genuinely memorable visual experience.

Do not settle for a few tiled backgrounds, basic rectangles, repetitive rooms, or generic procedural maps.

Treat every major world as an opportunity to create a distinct visual experience.

The player should frequently encounter environments that make them stop, look around, and wonder how the environment was created.

Use visual composition, silhouettes, lighting, scale, motion, depth, environmental animation, perspective changes, and carefully controlled color palettes.

Every world must have a deliberate artistic direction.

The universe must support radically different visual styles without losing its identity as a coherent dream world.

## Required visual styles

Implement a substantial range of distinct styles, including the following.

### A. Detailed pixel art

Use expressive original pixel art, distinctive silhouettes, environmental animation, unusual proportions, and atmospheric composition.

Avoid generic RPG Maker-looking rooms unless that style is intentionally appropriate to a specific world.

### B. Charcoal and fusain drawings

Create worlds that resemble charcoal drawings on paper.

Use:

* Rough black strokes.
* Smudged surfaces.
* Grainy textures.
* Incomplete outlines.
* Erased figures.
* Charcoal fingerprints.
* Uneven shading.
* White paper backgrounds.
* Figures emerging from darkness.

Some charcoal worlds should look like unfinished sketches.

Others should resemble disturbing drawings found in an abandoned notebook.

The player should feel as if they are walking through an illustration that was never intended to become a real place.

### C. Pure black and white

Create monochrome worlds with no conventional color.

Use strong contrast, white silhouettes, black voids, gray gradients, dithering, stippling, and visual noise.

Some worlds should resemble old photographs.

Others should look like illustrations, surveillance footage, or corrupted monochrome film.

Use subtle animation to make static compositions feel alive.

### D. Impossible geometry

Create environments whose architecture violates ordinary spatial intuition.

Examples include:

* Staircases that return to themselves.
* Corridors that are longer inside than outside.
* Rooms with several incompatible horizons.
* Buildings that fold through themselves.
* Doors suspended in empty space.
* Buildings that appear to be viewed from several angles simultaneously.
* Streets that meet themselves from impossible directions.
* Towers that become smaller as the player approaches.
* Rooms with contradictory gravity.
* Architecture that appears to contain more interior space than its exterior dimensions permit.
* Infinite arrangements of identical rooms with subtle changes.
* Structures that rotate around axes that do not appear to exist.

These must be more than unusual decorations. Implement actual spatial tricks where practical.

Use camera manipulation, forced perspective, looping level connections, recursive geometry, shader effects, and controlled transitions.

### E. Realistic photographs and realistic environments

Some worlds must use real photographic imagery or convincing realistic 3D environments.

Possible sources of visual inspiration include:

* Empty office buildings.
* Concrete stairwells.
* Abandoned residential corridors.
* Underground parking structures.
* Rainy streets.
* Empty shopping centers.
* Old apartment interiors.
* Industrial environments.
* Realistic forests.
* Nighttime residential neighborhoods.
* Hospitals.
* Hotels.
* Ordinary rooms photographed under unusual lighting.

Use original or appropriately licensed photographic assets.

Photographic backgrounds must be integrated into gameplay rather than displayed as unrelated images.

Implement interactions, parallax where appropriate, animated lighting, environmental effects, transitions, and spatial depth.

Some worlds should initially look completely ordinary before the player notices an impossible detail.

### F. Full darkness

Create worlds that are almost entirely black.

Some must be so dark that the player cannot immediately determine the shape of the environment.

Do not simply use a dark background.

Use layered darkness, subtle silhouettes, directional sound, extremely faint environmental details, and occasional minimal sources of light.

Possible light sources include:

* A distant window.
* A barely visible silhouette.
* A small glowing object.
* A flickering light.
* A brief environmental flash.
* The player's own limited light source.
* A shape that becomes visible only when the player stops moving.

Some full-darkness worlds should have no usable light source at all.

Navigation in those worlds may rely on sound, memory, environmental patterns, or particular Effects.

Darkness must be designed intentionally rather than making the game impossible to play.

Offer accessibility settings for players who need improved visibility.

### G. Psychedelic environments

Create environments featuring:

* Surreal color combinations.
* Impossible gradients.
* Animated geometric patterns.
* Slowly transforming architecture.
* Strange repeating structures.
* Unusual particle effects.
* Distorted perspectives.
* Abstract organic shapes.
* Unnatural skies.
* Floating objects.
* Dreamlike motion.
* Environments that change their color palette according to the player's position.

The visual effects should create fascination and unease rather than merely overwhelming the screen.

Avoid excessive flashing or rapidly alternating high-contrast patterns.

Provide accessibility settings to reduce motion, distortion, and intense visual effects.

### H. Hand-drawn and illustrated environments

Create worlds resembling:

* Children's drawings.
* Watercolor illustrations.
* Ink sketches.
* Pencil drawings.
* Painted landscapes.
* Illustrated notebooks.
* Unfinished animation frames.
* Paper collages.
* Surreal storybook illustrations.

Some worlds should appear incomplete.

Characters may have missing facial features, unfinished outlines, or animations that look as though they were drawn frame by frame.

### I. Side-view 2D platforming

Some dream entrances must transport the player into actual side-view platforming environments.

Implement proper side-view movement, collision, jumping where appropriate, platforms, hazards, secret passages, and camera behavior.

The platforming sections must feel like genuine alternate dimensions rather than ordinary top-down maps viewed from another angle.

### J. Realistic 3D and experimental rendering

Where technically feasible, create environments with realistic 3D geometry, materials, lighting, reflections, fog, and environmental depth.

Also experiment with:

* Low-poly dreamscapes.
* Wireframe environments.
* Dithered 3D.
* Distorted perspective.
* Flat-shaded geometry.
* Surreal collage environments.
* Hybrid 2D/3D scenes.
* Animated textures.
* Environments that transform between 2D and 3D.

Transitions between visual styles must be part of the experience.

# 4. DISTINCT MOODS FOR EVERY WORLD

Every world must have its own emotional identity.

Create worlds that are:

* Deeply melancholic.
* Oppressively silent.
* Psychologically disturbing.
* Psychedelic and hypnotic.
* Strangely comforting.
* Nostalgic.
* Sterile and artificial.
* Unnaturally cheerful.
* Alien and incomprehensible.
* Beautiful but lonely.
* Mechanically oppressive.
* Dreamlike and peaceful.
* Nightmarish.
* Entirely absurd.

Do not make every world equally frightening.

The strongest horror often emerges from contrast.

A peaceful environment should occasionally contain a disturbing detail.

A terrifying world may contain a beautiful, quiet area.

A cheerful world may become unsettling without changing its apparent visual style.

Some worlds should contain almost nothing.

Others should be visually dense and overwhelming.

Some should feel as though the player has arrived in the middle of an event that started long before they entered.

The player should not always know whether a world is safe, dangerous, meaningful, or merely strange.

# 5. WORLD SCALE AND REQUIRED CONTENT

The completed game must contain at least:

* 200 distinct dream worlds.
* 450 unique NPCs, creatures, figures, or dream entities.
* 80 unique Effects.
* Five unique Witches.
* One Great Priestess.
* Five initial doors in the Nexus.
* Up to five nested dream levels below the initial world layer.
* Three dedicated random-level templates or generation systems.
* Ten designated randomly spawning worlds.
* At least 15 infinite, looping, recursive, or spatially impossible worlds.
* Numerous large handcrafted environments.
* Procedurally generated environments.
* Multiple secrets and endings.
* Time-dependent events.
* Several distinct visual rendering styles.

These numbers represent actual implemented content.

Do not count empty placeholders, duplicate NPCs, inaccessible maps, nonfunctional Effects, or renamed copies toward the totals.

Maintain a content registry that distinguishes between registered, implemented, playable, and tested content.

# 6. THE BEDROOM AND THE NEXUS

The player begins in a small bedroom.

Include a bed, subtle environmental details, original sound design, and optional interactive objects.

Sleeping starts a new dream session.

The player enters the Nexus, a central dream hub containing exactly five initial doors.

Each initial door leads to a different world and has a distinctive appearance, animation, and sound.

Suggested initial destinations:

1. An empty residential neighborhood.
2. A vast industrial nightmare.
3. A melancholic city beneath perpetual rain.
4. A psychedelic forest.
5. An apparently ordinary interior containing impossible architecture.

These are examples, not restrictions.

The Nexus is the primary navigation and saving location.

As the player explores, additional doors, corridors, and entrances may appear.

The Nexus contains an Awakening Door.

Entering it ends the current dream session and saves eligible progression.

The Nexus should feel like an unusual place rather than a conventional RPG hub.

It may change subtly as the player discovers more of the dream universe.

# 7. FIVE NESTED LEVELS OF DREAMS

Implement a hierarchical world structure supporting up to five nested dream levels below the initial world layer.

The hierarchy must be genuine, not merely a numerical label.

Example:

Nexus → Abandoned Hospital → Restricted Elevator → Hospital Beneath Reality → The Patient's Dream → The Room Without a Patient.

Each entrance must have explicit connection rules.

The player must discover each subdoor before accessing the corresponding subworld.

Most worlds should contain one or two additional levels.

Only a minority should extend to levels three, four, or five.

Use a starting distribution target:

* 45% standalone worlds.
* 35% worlds with one additional sublevel.
* 15% worlds with two additional sublevels.
* 5% worlds with three to five additional sublevels.

Some entrances should be accessible only during particular timer phases.

Others require specific Effects, interactions, or discoveries.

Deep worlds should generally feel more obscure, isolated, or unusual, but not necessarily more hostile.

# 8. THREE RANDOM LEVELS

Create three dedicated random-level generation systems.

These are three distinct types of generated level, not three total rooms.

Each generator must produce coherent, playable environments while preserving its own identity.

## Random Level Type 1: The Unstable Maze

Generate a large labyrinth of corridors, rooms, dead ends, impossible intersections, and unusual landmarks.

Features:

* Procedurally generated layouts.
* Optional hidden doors.
* Loops and shortcuts.
* Rare NPC encounters.
* Rare Witch encounters.
* Multiple possible exits.
* Distinct visual themes.
* Variable lighting.
* Secret areas.
* Conditional paths.

Some layouts should contain subtle structural clues.

Others should be deliberately disorienting.

## Random Level Type 2: The Infinite Landscape

Generate a world that expands or loops as the player explores.

Features:

* Chunk-based generation.
* Deterministic world seeds.
* Seamless transitions.
* Repeating environmental structures.
* Gradually changing landmarks.
* Procedural ambient events.
* Rare discoveries.
* Spatial anomalies.
* Optional hidden boundaries.
* Efficient memory management.

The player must not see the same trivial pattern repeated indefinitely.

Use controlled procedural variation to create the impression of an enormous environment.

## Random Level Type 3: The Shifting Dream

Generate a world whose layout, visual style, and environmental rules can change during a dream session.

Features:

* Rooms that rearrange themselves.
* Doors that lead to altered versions of previous locations.
* Changes in artistic style.
* Variable NPC placement.
* Time-dependent architecture.
* Temporary paths.
* Impossible geometry.
* Rare environmental events.
* Unusual sound transitions.
* Hidden progression conditions.

The world should remain internally consistent enough to be navigable, even when its rules are strange.

All three random-level systems must support multiple themes, not just one fixed visual style.

# 9. TEN RANDOMLY SPAWNING WORLDS

Create ten designated worlds that may spawn dynamically into the dream universe.

These worlds are separate from the three random-level generation systems.

They must have individually designed identities and meaningful content.

Their appearance should be governed by explicit spawning rules.

Possible conditions include:

* The current timer phase.
* The player's previous discoveries.
* The current world.
* The number of dream sessions completed.
* Previously encountered NPCs.
* A particular Effect.
* A rare event.
* A world-generation seed.
* Whether a Witch is currently pursuing the player.
* Whether the Great Priestess has corrupted the current dream.

A randomly spawning world may appear as:

* A door that did not exist previously.
* A staircase extending into darkness.
* A building appearing in the distance.
* A new passage in an otherwise familiar environment.
* An elevator that stops at an impossible floor.
* A portal visible only from a certain location.
* A newly accessible room.
* A path that appears only when the player stops moving.

The ten worlds must have distinct identities, rather than simply being random variants of the same room.

Some should be rare and difficult to encounter.

Others may appear relatively frequently under specific conditions.

Store appropriate discovery information so that the player can record encounters and return to known worlds when the world rules permit it.

Do not allow random spawning to make mandatory progression impossible.

# 10. INFINITE WORLDS AND IMPOSSIBLE GEOGRAPHY

At least 15 worlds must contain infinite, looping, recursive, or spatially impossible navigation.

Implement multiple forms:

1. Perfect loops that return the player to the starting point.
2. Expanding environments.
3. Recursive buildings.
4. Spatial paradoxes.
5. False infinities containing hidden exits.
6. Memory loops with gradual changes.
7. Time-dependent loops.
8. Repeating landscapes that slowly reveal a pattern.
9. Distant landmarks that never appear closer.
10. Environments that transform when the player returns to the beginning.
11. Worlds with contradictory gravity.
12. Rooms that connect to themselves.
13. Corridors whose apparent length differs from their actual topology.
14. Worlds that gradually replace themselves with earlier locations.
15. Environments in which the concept of returning to the beginning becomes ambiguous.

Implement actual looping and spatial behavior rather than relying only on visual decoration.

Use deterministic generation, chunk streaming, bounded caches, and object pooling where appropriate.

Infinite worlds must not consume unlimited memory.

# 11. THE EIGHTY EFFECTS

Create exactly 80 unique collectible Effects.

The player must discover 30 Effects to complete the primary collection objective.

Effects may alter the player's appearance, movement, perception, interactions, or relationship with particular dream entities.

Categories include:

* Movement.
* Perception.
* Transformation.
* World interaction.
* Environmental manipulation.
* Puzzle solving.
* Survival.
* Unusual NPC interactions.

Every Effect must have a unique identifier, visual representation, functional implementation, acquisition conditions, and discovery state.

Examples include:

* Revealing invisible doors.
* Detecting Witch traces.
* Interacting with hidden symbols.
* Moving through unusual passages.
* Changing the player's size.
* Altering gravity.
* Revealing hidden NPCs.
* Temporarily distracting certain entities.
* Changing how the environment is rendered.
* Interacting with particular machinery.
* Unlocking alternate routes.
* Perceiving invisible environmental geometry.

These examples are not the complete collection.

Create all 80 Effects and implement their actual functionality.

Some should be easy to discover.

Others require puzzles, unusual interactions, rare events, particular timer phases, or multi-world exploration.

Some should be extraordinarily obscure.

Do not rely exclusively on random chance for secret Effect acquisition.

The Effects collection must clearly distinguish permanent discoveries from Effects acquired during the current unsaved session.

# 12. FIVE WITCHES

Create five unique supernatural entities called Witches.

They can travel between connected dream worlds and pursue the player.

Each Witch must have an original design, sound signature, animation, AI behavior, and pursuit style.

Possible identities:

* The Pale Visitor: a tall figure that watches from a distance.
* The Broken Doll: an unnaturally moving childlike entity.
* The Hollow Face: a faceless humanoid associated with distorted sound.
* The Red Wanderer: a fast pursuer capable of exploiting unusual routes.
* The Unfinished One: an entity that adapts its visual style to the current world.

These are starting concepts.

Implement genuine cross-world pursuit.

Track each Witch's current location, target, alert state, last known player position, pursuit state, and last observed entrance.

Witches may exploit supernatural shortcuts but should not teleport arbitrarily into view without a deliberate event.

The player may escape through hiding, breaking line of sight, using particular Effects, entering the Nexus, or discovering alternate routes.

Some Witches should be associated with specific world types.

Others should be more active during particular timer phases.

## Witch capture

When a Witch catches the player:

1. Trigger an original, carefully timed jumpscare.
2. Play a startling sound effect.
3. Apply a brief visual distortion.
4. Remove all Effects collected during the current unsaved dream session.
5. End the dream.
6. Return the player to the bedroom.
7. Restore the last valid committed progression.
8. Reset the timer for the next session.

Previously saved Effects and permanent discoveries must remain intact.

The capture mechanic must work consistently across top-down, platforming, realistic 3D, and experimental worlds.

Provide options to reduce sudden audio intensity and visual flashes.

# 13. THE GREAT PRIESTESS

Create a unique entity called **The Great Priestess**.

She is significantly more dangerous than any individual Witch.

She is not simply a stronger enemy with more health. Her danger comes from her ability to corrupt the rules of the world around her.

The Great Priestess must have an original visual identity, an unsettling sound signature, unique animations, and a presence that fundamentally changes the player's experience.

Her appearance should be rare, memorable, and consequential.

Do not reveal her entire nature through explanatory dialogue.

## Presence and manifestation

The Great Priestess may appear in selected worlds, including worlds that initially seem safe.

Her arrival may be suggested by:

* NPCs becoming motionless.
* Ambient music subtly changing.
* Doors appearing in the wrong locations.
* Unusual symbols appearing in the environment.
* Sudden silence.
* Distant chanting.
* Changes in world geometry.
* A visual anomaly that does not immediately reveal her location.

Some worlds should show evidence of her influence before she appears.

She must be capable of moving between connected worlds according to explicit AI rules.

Her movement should feel deliberate rather than random.

## Temporary world corruption

When the player and the Great Priestess are in the same world, she can temporarily corrupt that world's systems.

**Corruption must never be permanent.**

The original world state must be restored after the corruption ends.

Examples of temporary corruption:

* The world changes from color to monochrome.
* Pixel art becomes distorted or hand-drawn.
* A realistic environment acquires impossible geometry.
* Doors move to different locations.
* NPCs temporarily disappear or change behavior.
* NPCs speak unfamiliar languages.
* Environmental textures become corrupted.
* The camera perspective becomes unusual.
* The world appears mirrored.
* Gravity or movement rules temporarily change.
* The audio becomes distorted.
* Music reverses or becomes muffled where technically appropriate.
* The map appears to contain impossible additional rooms.
* The environment becomes almost completely black.
* Previously familiar landmarks become unrecognizable.
* The current world's apparent scale changes.
* The world temporarily resembles a different dream.
* A normally accessible entrance becomes inaccessible while another appears.
* The player's Effects behave differently under clearly defined corruption rules.

These effects must be carefully controlled.

Do not randomly destroy the level or make progression permanently impossible.

## Corruption architecture

Implement corruption as a reversible overlay or state layer.

Maintain a reliable reference to the original world state.

When corruption begins, record the affected properties and their original values.

When corruption ends, restore the original values and clear temporary changes.

Use safe state restoration for:

* Lighting.
* Materials and textures.
* Camera settings.
* World geometry.
* Door connections.
* NPC behavior.
* Movement modifiers.
* Environmental audio.
* Temporary shader effects.
* World-specific gameplay rules.

Do not overwrite permanent save data with corrupted world states.

If the player leaves the affected world, the corruption should end according to the world's rules, or continue only when explicitly designed to persist across a short connected sequence.

A new visit must never inherit accidental permanent corruption.

## Great Priestess danger

The Great Priestess should be more difficult to escape than an ordinary Witch.

She may:

* Manipulate environmental routes.
* Temporarily remove familiar escape paths.
* Corrupt certain Effects.
* Reveal the player's position to other entities.
* Cause temporary false entrances.
* Alter the world's visual representation.
* Summon unusual manifestations.
* Increase the likelihood of encountering Witches.
* Distort the relationship between the player's location and the apparent geometry.

Her powers must have consistent rules that can be observed and eventually learned.

She must remain dangerous without making every encounter unavoidable.

When she captures the player, use a unique encounter sequence more disturbing than a standard Witch jumpscare.

Apply the appropriate unsaved progression loss and awakening rules unless a specific scripted encounter deliberately produces another outcome.

# 14. THE TEN-MINUTE DREAM TIMER

Each dream session lasts a maximum of ten real-time minutes.

The timer begins when the player enters the dream universe.

It continues across all world transitions, nested levels, and rendering styles.

At zero, the player automatically awakens.

Opening menus or changing worlds must not reset the timer.

## Timer phases

10:00–7:00: Opening phase.

Some worlds are accessible only at the beginning of a dream.

7:00–4:00: Middle phase.

New events, NPC behaviors, and entrances may appear.

4:00–1:00: Late phase.

Some worlds become accessible only now, and Witches may become more active.

1:00–0:00: Final phase.

The world may become unstable, and rare events may occur.

At zero, awakening is unavoidable.

The Great Priestess and other entities may manipulate the environment but must not permanently disable the timer.

Some entrances must exist only during the first part of a dream.

Others must appear only near the end.

Some events should occur at exact times.

Other events should depend on conditions rather than precise timing.

Use environmental signals such as bells, lighting changes, sound transitions, NPC behavior, and architectural changes.

Display the remaining time in a subtle, readable interface.

# 15. DREAM EVENTS

Implement a reusable event system supporting a large library of original events.

Events may depend on:

* Timer phase.
* Player position.
* World identity.
* Number of visits.
* Previously discovered Effects.
* NPC interactions.
* Witch proximity.
* Great Priestess presence.
* World-generation seed.
* Previous dream sessions.
* Current world corruption.
* Specific entrance sequences.

Examples:

* Every NPC disappears simultaneously.
* A train arrives exactly once.
* A building opens during the final minute.
* A world slowly loses its colors.
* Music stops when an entity enters.
* A door appears in a solid wall.
* A familiar world becomes subtly different after awakening.
* A Witch appears only in reflections.
* An infinite environment collapses into its starting room.
* An NPC changes its behavior after repeated visits.
* A world changes from pixel art to realistic 3D.
* The environment appears empty until the player turns around.
* A hidden entrance appears only when the player stops moving.
* The Great Priestess temporarily corrupts an entire region.
* A random world appears in an unexpected location.
* A previously inaccessible subdoor becomes visible for a few seconds.

Events must have explicit conditions, execution rules, and safeguards against unintended repetition.

Use controlled randomness rather than making every event completely unpredictable.

Rare events must remain rare.

# 16. 450 UNIQUE NPCS

Create at least 450 distinct NPCs, creatures, entities, or supernatural figures.

Every NPC must have an identifiable design, stable ID, world association, behavior, and interaction rules.

Include:

* Silent observers.
* Friendly figures.
* Neutral inhabitants.
* Strange creatures.
* Hostile entities.
* Wandering figures.
* Merchants or collectors where appropriate.
* Rare one-time encounters.
* NPCs that appear only during particular timer phases.
* NPCs associated with Effects.
* NPCs that react to Witches.
* NPCs affected by the Great Priestess.
* NPCs that appear in several connected worlds.
* NPCs that change after repeated visits.

Not every NPC needs dialogue.

Movement, gestures, silence, sound, and environmental changes are valid forms of communication.

Use efficient behavior systems, distance-based activation, pooling, and simplified simulation to maintain performance.

The 450 NPCs must be genuinely distinct definitions, not duplicates with different names.

# 17. NPCS THAT SPEAK UNKNOWN LANGUAGES

Implement a dedicated system for NPCs that communicate in unfamiliar languages.

Some NPCs must speak languages that the player cannot understand.

**Do not explain these languages through a tutorial, exposition, translation screen, or convenient narrative explanation.**

Their incomprehensibility is part of the atmosphere.

Create several original language systems with distinct phonetics, rhythms, visual symbols, and linguistic structures.

Possible approaches include:

* Strange phonetic syllables.
* Repeated sounds with subtle variations.
* Unfamiliar written symbols.
* Unusual sentence structures.
* Languages that appear to have no relationship to human grammar.
* Speech that changes slightly each time it is repeated.
* Characters that use several languages in the same conversation.
* Languages that sound familiar but remain incomprehensible.
* Written inscriptions that do not correspond directly to spoken language.

Do not simply generate random keyboard characters.

Create consistent fictional language rules, even if those rules are never revealed to the player.

Some NPCs should speak to the player as though they understand everything about her.

Others should ignore her.

Some should argue with invisible entities.

Some should repeat the same phrase for hours.

Others should stop speaking when the player approaches.

A small number may react differently to particular Effects without explaining why.

Occasionally, a repeated phrase may appear to correspond with an environmental event, but do not automatically confirm whether the connection is meaningful.

Some NPCs should speak languages that sound completely different in different worlds.

The Great Priestess may temporarily alter how NPCs speak when she corrupts a world.

Maintain original language behavior across visits where appropriate.

# 18. CRYPTIC LORE AND ENVIRONMENTAL STORYTELLING

Create a deeply cryptic lore system.

The game should suggest the existence of a larger story without directly explaining it.

Do not provide a conventional linear narrative that resolves every mystery.

Use:

* Repeated symbols.
* Contradictory inscriptions.
* Unexplained names.
* Familiar objects in impossible places.
* NPCs that seem to recognize the player.
* Buildings that appear in several worlds.
* Strange references to events that never happened.
* Visual motifs that recur in unrelated locations.
* Objects whose significance changes between visits.
* Inconsistent environmental details.
* Apparent references to other dreams.
* NPCs that seem to remember different versions of the world.
* Strange rituals.
* Impossible family photographs.
* Rooms that contain objects from other environments.
* Repeated phrases spoken by unrelated NPCs.
* Maps that do not correspond to the world they depict.

Some clues should suggest a connection between the bedroom, the Nexus, the Witches, and the Great Priestess.

Other clues should appear to contradict those connections.

Do not establish that every clue belongs to one single explanation.

Create several plausible interpretations.

The player should be able to develop their own theories.

Some discoveries should provide genuine clues.

Others should remain unresolved forever.

The game must not force the player to understand the lore in order to enjoy exploration.

# 19. MUSIC: SEAMLESS LOOPS AND REPLACEABLE TRACKS

Music is a critical part of the atmosphere.

Every major world should have its own sound identity.

Create a system that allows the developer to replace all music with original tracks later without changing gameplay code.

Use a dedicated audio manager.

All music references must be centralized in a configuration file or data-driven world definitions.

Do not hardcode audio paths throughout gameplay scripts.

## Seamless looping

Music tracks must loop seamlessly.

Avoid audible gaps, clicks, abrupt restarts, or obvious transitions from the end of a track to its beginning.

Design looping tracks so that the ending naturally resolves into the beginning.

When possible, use:

* Compatible opening and ending harmonies.
* Sustained ambient textures.
* Repeating rhythmic structures.
* Matching reverb tails.
* Seamless audio loops.
* Short overlapping crossfades.
* Properly normalized audio.
* Consistent volume levels.
* Optional loop-point metadata.

For audio files that do not loop perfectly, implement a controlled transition between the ending and beginning.

The transition should feel musical and natural, not like a generic fade to silence.

Support configurable loop start and loop end points where practical.

## Music transitions between worlds

When the player moves between worlds, transition between their soundtracks smoothly.

Do not abruptly stop one soundtrack and start another unless that discontinuity is an intentional event.

Use configurable crossfade durations, equal-power crossfades where appropriate, and volume automation.

Some transitions should take several seconds.

Others should be almost imperceptible.

A few should deliberately interrupt the music to create tension.

The Great Priestess and Witches may affect the audio temporarily.

Such effects must not permanently alter the original music assets.

## Replaceable music library

Create a dedicated folder structure, for example:

`public/assets/audio/music/`

`public/assets/audio/ambience/`

`public/assets/audio/sfx/`

`public/assets/audio/entities/`

`public/assets/audio/transitions/`

The actual structure should follow the existing repository where possible.

Provide a configuration file mapping world IDs and events to audio assets.

Use clear filenames and document supported formats.

Support standard browser-compatible audio formats, preferably OGG and WAV where appropriate, with MP3 or other formats as fallback when necessary.

If a track is missing, log a useful development warning and fall back gracefully.

Do not crash the game because a replaceable music file is missing.

## Original placeholder music

Create a substantial set of original placeholder soundscapes where possible.

Use original procedural audio, generated ambient tones, or appropriately licensed audio.

Possible moods:

* Melancholic piano.
* Distant industrial drones.
* Soft detuned music-box sounds.
* Sparse ambient pads.
* Unsettling rhythmic pulses.
* Empty-room ambience.
* Dreamlike electronic textures.
* Psychedelic layers.
* Almost inaudible environmental tones.
* Dark, low-frequency atmospheres.
* Strange melodies with unresolved endings.
* Music that slowly changes as the timer approaches zero.

Do not copy melodies from Yume Nikki or other copyrighted games.

Some worlds must contain no music at all.

Silence should be treated as a deliberate audio design choice.

## Dynamic sound design

Use positional audio where supported.

Distant sounds should create a sense of space.

Some NPCs should be audible before they become visible.

Witches should have distinctive audio cues.

The Great Priestess should have an unmistakable sound identity that may be heard before her appearance.

Use subtle changes in ambience to communicate environmental danger without relying exclusively on interface indicators.

# 20. SAVE SYSTEM AND AWAKENING

Implement two progression layers.

## Permanent progression

Includes:

* Saved Effects.
* Discovered worlds.
* NPC discoveries.
* Permanent clues.
* Puzzle progress.
* Unlocked content.
* Collection statistics.
* Permanent secrets.

## Temporary session progression

Includes:

* Effects collected during the current unsaved dream.
* Temporary objects.
* Current pursuit states.
* Temporary environmental changes.
* Session-specific discoveries not yet committed.

The player can save in two ways.

First, return to the Nexus and enter the Awakening Door.

Second, remain in the dream until the timer reaches zero.

Both methods end the dream and commit eligible progression.

If a Witch catches the player before a save, the player loses the Effects acquired during the current unsaved session.

Previously saved progression remains intact.

Implement reliable persistent browser storage using IndexedDB or another appropriate mechanism.

Provide save validation, versioning, safe writes, and recovery from corrupted data.

Never allow a temporary world corruption caused by the Great Priestess to overwrite permanent world data.

Never save a transient visual glitch as a permanent world modification.

Clearly distinguish between committed and uncommitted discoveries.

# 21. INTERACTION AND GAMEPLAY

Implement actual player movement and interactions.

The player must be able to:

* Walk through environments.
* Enter doors.
* Discover hidden entrances.
* Interact with objects.
* Speak or gesture to NPCs where appropriate.
* Collect Effects.
* Use Effects.
* Observe environmental clues.
* Enter platforming worlds.
* Escape pursuing entities.
* Return to the Nexus.
* Save by awakening.
* Start another dream session.

Interactions should be consistent enough to learn without turning the game into a conventional tutorial-driven experience.

Use minimal interface prompts.

Some interactions should be discoverable through experimentation.

Some doors should require particular Effects.

Others should react to the time, player location, or NPC presence.

# 22. USER INTERFACE AND ACCESSIBILITY

Implement a minimal interface that supports:

* Main menu.
* Continue.
* New game.
* Settings.
* Save management.
* Effects collection.
* World journal.
* NPC discoveries.
* Dream timer.
* Pause menu.
* Audio controls.
* Fullscreen.
* Keyboard configuration.
* Optional gamepad configuration.
* Accessibility options.

Do not display constant quest markers or conventional RPG objective lists.

Accessibility options should include, where practical:

* Reduced screen distortion.
* Reduced visual movement.
* Reduced flashes.
* Adjustable audio intensity.
* Adjustable ambient audio.
* Timer visibility options.
* Readable interface scaling.
* Alternative controls.

Accessibility settings should not silently disable essential gameplay systems.

# 23. CONTENT AND WORLD ARCHITECTURE

Create modular systems for:

* World management.
* World transitions.
* Nested entrances.
* Procedural generation.
* Infinite-world streaming.
* NPC management.
* NPC behavior.
* Witch AI.
* Great Priestess AI.
* Temporary world corruption.
* Effect acquisition and use.
* Puzzle conditions.
* Event scheduling.
* Dream timer.
* Audio playback and transitions.
* Save/load.
* Discovery tracking.
* UI.
* Content validation.

Use structured data files or engine-native resources.

Every world, NPC, Effect, Witch, and major event must have a stable unique identifier.

World definitions should be data-driven.

Adding a new world should not require rewriting the core engine.

Validate references, door connections, required progression, Effect conditions, and event dependencies.

# 24. PERFORMANCE AND BROWSER RELIABILITY

The game must be designed for browser performance.

Do not load all worlds and NPCs simultaneously.

Use:

* Lazy asset loading.
* World streaming.
* Object pooling.
* Distance-based NPC updates.
* Efficient collision systems.
* Texture reuse.
* Bounded procedural caches.
* Appropriate rendering resolution.
* Audio asset management.
* Controlled particle counts.
* Cleanup of unused resources.

Avoid memory leaks during repeated world transitions.

Test the game after extended exploration sessions.

Handle browser focus changes and background tabs carefully.

The dream timer should follow a clearly defined real-time policy and must not accidentally reset when the player changes worlds.

If the browser suspends the game, reconcile the timer with elapsed time when gameplay resumes.

Do not let browser tab suspension create accidental permanent immunity from the timer.

If audio playback is blocked by browser autoplay restrictions, initialize audio after the first legitimate user interaction.

Provide clear error messages for failed asset loading.

# 25. DEVELOPER DEBUG TOOLS

Create a developer-only debug interface that allows:

* Teleporting to any world.
* Navigating between nested levels.
* Setting the dream timer.
* Granting Effects.
* Spawning Witches.
* Spawning the Great Priestess.
* Starting and ending corruption.
* Testing music transitions.
* Inspecting NPC states.
* Triggering world events.
* Testing procedural generation seeds.
* Inspecting entrance connections.
* Validating the world graph.
* Testing save/load.
* Viewing registered and implemented content totals.
* Identifying missing assets.
* Viewing performance metrics.

Debug tools must not be accessible during normal gameplay unless explicitly enabled.

# 26. DEVELOPMENT PHASES

Work incrementally and test each phase.

## Phase 1: Inspect the project

Read `instructions.md` in its entirety.

Inspect the repository and identify existing systems, assets, dependencies, and constraints.

Do not delete existing functionality without a good reason.

## Phase 2: Establish the playable foundation

Implement:

* The bedroom.
* The Nexus.
* Five initial doors.
* Several connected worlds.
* Player movement.
* Basic interactions.
* A functioning ten-minute timer.
* A first collection of Effects.
* One working Witch.
* The Awakening Door.
* Persistent saving.
* A working browser launch process.

The initial version must be genuinely playable.

## Phase 3: Build the world architecture

Implement the world graph, nested dream levels, world registry, world transitions, procedural generation, and world validation.

## Phase 4: Establish the artistic pipeline

Create reusable rendering systems and assets for pixel art, charcoal, monochrome, realistic environments, full darkness, psychedelic environments, hand-drawn worlds, and platforming.

Implement transitions between visual styles.

## Phase 5: Build the audio system

Implement the centralized music registry, seamless looping, configurable crossfades, ambience, sound effects, and replaceable music assets.

Test the beginning-to-end transition of every placeholder music loop.

## Phase 6: Implement procedural worlds

Build the three random-level generators and ten designated randomly spawning worlds.

Test seeds, navigation, transitions, and progression.

## Phase 7: Implement the supernatural entities

Complete all five Witches and the Great Priestess.

Test cross-world pursuit, temporary corruption, restoration, capture, and awakening.

## Phase 8: Expand content

Develop the 200+ worlds, 450+ NPCs, and 80 Effects.

Prioritize distinct artistic identities, interesting navigation, meaningful interactions, and a wide range of emotional experiences.

## Phase 9: Add lore and secrets

Implement cryptic inscriptions, incomprehensible languages, rare events, multi-world puzzles, and optional discoveries.

## Phase 10: Polish and test

Test complete dream sessions, repeated awakenings, browser persistence, music transitions, visual transitions, random generation, Witch capture, Priestess corruption, and performance.

Fix the most important bugs before expanding the content further.

# 27. AUTOMATED VALIDATION

Create a validation tool that reports:

* Number of registered worlds.
* Number of playable worlds.
* Number of nested worlds.
* Number of unique NPCs.
* Number of implemented Effects.
* Number of functioning Witches.
* Great Priestess implementation status.
* Number of random-level generators.
* Number of random-spawn worlds.
* Number of infinite worlds.
* Number of working entrance connections.
* Number of unreachable worlds.
* Missing assets.
* Broken references.
* Failed tests.
* Incomplete implementations.

The validation tool must distinguish between registered, implemented, playable, and tested content.

Do not claim a feature is complete merely because its identifier exists in a data file.

# 28. FINAL QUALITY REQUIREMENTS

The game must be genuinely playable in the browser.

The worlds must be visually varied, atmospheric, and interesting to explore.

The soundtracks must loop cleanly and transition smoothly.

The music system must make replacing tracks straightforward.

The Witches must be capable of cross-world pursuit.

The Great Priestess must temporarily corrupt the world and restore it afterward without permanent damage.

The timer must function across all world transitions.

Saving must preserve permanent progression and respect the loss of unsaved Effects.

The three random-level systems must produce playable environments.

The ten random-spawn worlds must have meaningful identities and spawning conditions.

NPCs must have distinct identities and functional behaviors.

Unknown languages must remain genuinely unexplained.

The lore must remain cryptic and open to interpretation.

Do not use fake content counts.

Do not leave critical buttons disconnected.

Do not create doors that lead nowhere unless that is a deliberate, implemented world mechanic.

Do not leave important Effects without actual functionality.

Do not claim tests passed unless they were executed.

Do not claim the game is finished while critical features remain placeholders.

If a feature is incomplete, document its real status and continue working on it.

# 29. FINAL MISSION

Create a dream universe that feels enormous, alien, melancholy, oppressive, psychedelic, beautiful, and occasionally terrifying.

Exploration must be the main attraction.

The player should feel that every world has its own visual language, soundscape, rules, and emotional identity.

Some worlds should resemble real places.

Others should look like charcoal drawings, black-and-white photographs, impossible geometry, unfinished sketches, or complete darkness.

Some should be enormous and empty.

Others should be dense with strange figures, incomprehensible language, and disturbing events.

The five Witches should create tension through pursuit.

The Great Priestess should create a deeper form of fear by temporarily rewriting the rules of the world.

The three random-level generators and ten randomly spawning worlds should make exploration unpredictable without destroying meaningful progression.

The 80 Effects should reward curiosity.

The 450 NPCs should make the dream universe feel inhabited, even when those inhabitants are incomprehensible.

The 200+ worlds should form an interconnected universe that rewards repeated exploration.

The music should create continuous, seamless atmospheres that can later be replaced with custom tracks.

**Start by reading `instructions.md` and inspecting the repository. Then implement the actual game, run it, test it, and keep improving the existing project. Do not stop after writing a plan.**

At the end of each development phase, report briefly:

* What you implemented.
* Which files you changed.
* Which tests you ran.
* What works.
* What remains incomplete.

Continue implementing until the available development scope has been exhausted, prioritizing a functional, visually compelling game over unsupported claims of completion.