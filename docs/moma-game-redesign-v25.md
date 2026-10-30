# TRACE MoMA: Eight interactive games, production design and acceptance criteria

Version 2.5, October 2026. These are original educational interpretations of collection works, not digital replicas. All experiences must preserve the optional zoom-detail clue, visitor-first photograph/visual comparison, per-museum progress and EN/FR/ES switching. No game requires contact with real museum objects.

## Interaction principles

**Manipulate the artwork principle, not a form input.** Drag on the canvas, connect actual points, pull an object, turn a wheel, reshape a silhouette, or route a message. Do not rely on repeatedly rerendered HTML range controls. State updates must reflect actual gestures.

**A recognisable reaction to each gesture.** Every game has visible progress, a demonstrable transformation and an original animated completion state with Mica explaining the art principle.

**Accessible alternatives.** Connect buttons, tap-to-place targets, spin/reel-nudge buttons, a wheel-turn button, keyboard keys on shapes, and the existing guided-assist option are kept alongside pointer interaction. Sound is supplemental, not the sole success signal. Animation respects reduced-motion settings.

**Artistic integrity.** Avoid suggesting the interactive scene is a licensed simulation or a faithful 3D reconstruction. Keep explanatory material distinct from the work's actual medium and context. Original procedural textures and symbolic graphics are used; no third-party media or external gameplay service. Touching the real artwork is never part of gameplay.

## Artworks and acceptance criteria

### 1. Vincent van Gogh, *The Starry Night*

**Objective:** understand visible energy in brushwork. **Visual:** layered indigo sky, gold and pale-blue starlight, original stylized hills/village and cypress. **Interaction:** finger/mouse drag on the sky; each gesture deposits a large spiral with layered paint and animated stroke accents. **Success:** three separate drawing gestures. **Payoff:** stars shimmer, painted currents accumulate and Mica connects movement and brushstroke. **Test:** drawing three distinct drags produces three SVG swirl paths and unlocks collection.

### 2. Henri Matisse, *Dance (I)*

**Objective:** investigate rhythm and relationships created by simplified figures. **Visual:** blue and green landscape with five illustrated figures and glowing hand endpoints. **Interaction:** draw a connection from each hand to the next figure's dotted endpoint; completed links become visible arcs. **Success:** close all five hand connections. **Payoff:** gentle collective movement and Mica's observation about the circular composition. **Accessibility:** numbered connect buttons. **Test:** a real pointer drag to each target causes five joined endpoints.

### 3. Claude Monet, *Water Lilies*

**Objective:** understand light and changing reflections. **Visual:** layered pond, floating pink lilies, distorted clouds, pastel light, thin animated ripple lines. **Interaction:** touch four lily positions; move a directly draggable sun handle horizontally. Reflected sky immediately brightens and shifts (no sticky range slider). **Success:** at least four lilies and 70% reflected light. **Payoff:** luminous atmosphere and Mica's explanation of light, pond and sky. **Test:** the SVG reflection layer's opacity increases as the sun is dragged.

### 4. Andy Warhol, *Campbell's Soup Cans*

**Objective:** see repetition and slight variation in commercial imagery. **Visual:** original illustrative pop-art slot machine with differently drawn, color-coded flavours and readable labels, not identical tomato emoji cans. **Interaction:** spin three reels, optionally lock individual reels, then nudge individual flavours until three match. **Success:** spin at least once and align three cans. **Payoff:** jackpot and a nine-panel pop-art grid. **Mica:** repetition can change ordinary images into art. **Test:** a spin plus three matched reel values triggers the jackpot.

### 5. Meret Oppenheim, *Object*

**Objective:** experiment with Surrealist juxtaposition and imagined texture. **Visual:** distinct teacup, saucer, spoon; original procedural fur, velvet, ice, spikes, grass, metal, feathers and ceramic treatments. **Interaction:** select or drag a material onto any object component, then choose an emotional reaction. **Success:** transform all three objects, using at least two different non-default textures, and name a reaction. **Payoff:** assembled uncanny tea service and Mica's interpretation of the familiar made strange. **Test:** all three materials visibly differ.

### 6. Jean Tinguely, *Fragment from Homage to New York*

**Objective:** explore movement, assemblage and chance in kinetic art. **Visual:** interconnected illustrated drive wheel, belt, fishing rod, hook and paint can, with numbered connection points and a mechanical background. **Interaction:** drag each salvage component to the corresponding socket; turn the physical wheel with circular pointer movement (no fader). **Success:** all five connected plus a substantial wheel rotation. **Payoff:** fishing rod drops, paint can tips, paint splashes, and a flag appears in a sequential chain-reaction animation. **Accessibility:** select a component then tap a socket, and an optional wheel-turn button. **Test:** five drags plus a circular wheel gesture sets `fired` and completes the lab. **Note:** an original interpretive chain-reaction toy, *not* a claim that this exact sequence happened in the historical artwork.

### 7. Constantin Brancusi, *The Cock*

**Objective:** understand abstraction through distilled silhouette and suggested sound. **Visual:** wood-gradient sculpture with wood-grain strokes and four glowing SVG handles. **Interaction:** drag the crest, body width, bend and base in two dimensions. Each movement redraws the outline directly (no HTML range control). **Audio:** an optional short original synthesized chirp responds to form; headphones are advised. **Success:** reshape two separate handles and preview the sound. **Payoff:** Mica explains form as essence rather than literal imitation. **Test:** two drags visibly change the SVG path; sound preview registers independently of audio-device support.

### 8. David Lamelas, *Analysis of the Elements by which the Massive Consumption of Information Takes Place*

**Objective:** compare how one message changes when it travels through different media. **Visual:** three independent animated vignettes for newspaper circulation, radio broadcast and television transmission. **Interaction:** launch each channel to see a fictional museum announcement move through readers, listeners or viewers; then make a reasoned comparison. **Success:** examine all three formats and select the observation that the medium affects communication. **Payoff:** a Mica explanation of how information is packaged, delivered and consumed. **Test:** each channel has a distinct animated visual state and the closing comparison records the choice.

## QA and rollout

The automated browser suite checks all eight complete interaction flows, all three museums' adventures, translated interfaces, Mica welcomes, visitor discovery progress, picture-first identification and the admin publish model. The eight MoMA games use no user photo uploads or API services. Before a museum demonstration, manually test Safari on iPhone and an Android touch browser, inspect canvas sizing at 320px and 390px widths, check assistive keyboard paths, evaluate language typography and pronunciation and ask an art educator to review the distinction between factual artwork history and original game metaphors.

## Future refinement priorities

Use real-device usability sessions to adjust dance hand hitboxes, the tactile material quality of the teacup, and the wheel-rotation threshold. Institutional curators should verify interpretation and reproduction rights before release. Add telemetry only with explicit privacy design; the current games do not transmit children's interactions.
