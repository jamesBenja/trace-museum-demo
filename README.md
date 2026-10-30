# TRACE v2.8: Three-museum art adventures, including MoMA New York

**Live pilot:** https://jamesbenja.github.io/trace-museum-demo/?v=28

**Official MMFA map:** https://www.mbam.qc.ca/en/mmfa-museum-map/

**Official PAMM map:** https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf

**Institutional pitch walkthrough:** [PITCH_WALKTHROUGH.md](PITCH_WALKTHROUGH.md)

TRACE is an independent pilot concept with **eight real collection artworks each from MMFA, PAMM and MoMA**, including paintings, photography, sculpture and mixed media. Neither museum has commissioned, endorsed or approved this app. A work belonging to a museum **does not imply that it is physically on view**.

## Recognition and accessible visual confirmation

For paintings and photographs with calibrated image references, the camera scan remains the primary matching method. After requesting a hint, **Compare visually with museum reference** becomes available for every artwork. The same option appears if an automatic scan fails or the camera is unavailable. Sculptures and newer works without validated reference images use **visitor self-confirmation** from the beginning. This is always labelled clearly and never presented as automatic verification.

On the visual comparison screen, visitors can **take or select one photo (optional)** and compare it alongside the museum's collection image. They may also visually confirm without taking a photo, including when museum photography is not permitted. Only explicit visitor confirmation advances the story. This is a visitor-assisted comparison, **not automatic recognition or a 3D scan**. Uploaded photos stay on the device and may be saved in the visitor's local discovery album once confirmed. A future multi-angle recognition feature would require curated reference photography and validation, not extra photo steps for visitors.

## v2.8: All eight Montréal Museum of Fine Arts games upgraded

All eight MMFA artworks have rebuilt, individual educational activities with art-specific Mica conclusions in English, French and Spanish. Every game maintains mystery-first discovery, optional detail reveal, photographic matching where available, administrator-set on-display status and the visitor's room route.

- **Jacob Marrel:** rub a copper-toned painted garden and find five tiny creatures hidden among flower petals.
- **Emanuel de Witte:** drag a vanishing point through three successive doorways while the floor's perspective lines respond.
- **Marc-Aurèle Fortin:** paint three luminous cloud strokes and position the storm's sky light above dark Montréal buildings.
- **The Eye:** scale a giant illustrated eye against a city and explore two different viewpoints.
- **Elisabeth Frink:** place two guardians around a courtyard and turn them toward one another, revealing their spatial connection.
- **Jean-Paul Riopelle:** make an assemblage from a wooden foundation and three different found materials, then choose an anchor.
- **Auguste Rodin:** shape an expressive seated pose in three distinct steps, exploring how a figure communicates thought.
- **Tony Cragg:** rotate a sculptural silhouette to find three possible hidden facial profiles.

Each game features custom animated SVG scenery, meaningful creative milestones, a new art-historical Mica educational conclusion both inside the activity and on the discovery-complete screen, localized EN/FR/ES copy, and accessible non-drag controls. A new end-to-end browser suite performs gesture-based gameplay and checks all eight conclusions and language switching.

## v2.8: MoMA browser-based camera matching and PAMM interactive lab overhaul

All eight MoMA works now enter the real reference-loading workflow instead of being universally excluded as uncalibrated. The matching library can only activate the camera scan for an artwork if its collection reference image loads, can be decoded and can be read in a canvas. The chapter-specific geometric / colour matcher still requires confidence and never substitutes a guessed match. There is a strict browser test that verifies all eight reference images against their own source and a different artwork before an all-eight-scannable release can be claimed. Image matching is still an experimental prototype and should be tested on visitors' physical camera photographs and gallery lighting before museum use. No visitor photo leaves the device.

PAMM now has eight distinct rebuilt educational labs, with animated original illustrations and a substantial Mica interpretation on both the completion screen and the finished artwork screen:

- *Construction with Two Masks*: build and fill all four grid compartments with distinct symbolic signs, including the previously broken last slot.
- *Federal Housing Project near Yauco*: investigate road, houses and sky, compare changing light and reflect on documentary photography.
- *Construction*: compose a six-room graphite alphabet with multiple symbols.
- *Chaos SAS*: manipulate open-cube positioning, rotation and wobble in an animated balance study.
- *Column with Objects*: carve and furnish at least four niches in a detailed marble column.
- *wild wild country*: construct an actual five-part interconnected sculpture with a base, steel sheet, pneumatic hose, dried paint skin and support.
- *Surrounded Islands*: wrap both islands with moving pink fabric around a sparkling Biscayne Bay.
- *The Bull Is Out and My Foot Is in My Mouth*: paint layered acrylic, gouache and glitter on an expressive nine-cell canvas.

All games use English, French and Spanish interpretive copy, preserve original visitor discovery/photo checks, and include reduced-motion styling. These are original educational abstractions rather than copies of the physical artworks.

## v2.6: Oppenheim tea-set visual reconstruction

Following a user review, the *Object* game no longer uses a teacup emoji or geometric squiggles. **All three objects are individually drawn SVG illustrations**: a rounded teacup with a hollow rim and dimensional handle, a shallow elliptical saucer with a recessed centre and raised lip, and a recognizable spoon with an elongated handle and shaped bowl. Each shape is shaded and carries an independent material coating.

The selected textures now **fill the cup, saucer, and spoon themselves**, including cup handles, saucer faces, spoon bowls and stems. Fur also generates numerous fibres **outside the object's silhouette**, instead of changing its background. Other materials, including velvet, feathers, metal, ice, grass and spikes, use custom procedural SVG patterns, shading and edge effects. Users still drag a swatch onto any object or tap a swatch then an object. The emotional-response conclusion and full trilingual lesson remain intact.

A dedicated screenshot-based browser regression test checks that each of the eight materials changes the actual illustrated SVG, and that applying a material to one object does not alter the others, at both 320 px and 390 px phone widths.

## v2.5: Eight redesigned MoMA art games

The initial eight MoMA placeholder games have been rebuilt with direct touch interactions and specific art-learning outcomes. The complete [production design brief](docs/moma-game-redesign-v25.md) documents individual interactions, visual treatments, win conditions, curriculum connections and accessibility acceptance tests.

- **Van Gogh:** drag to paint large luminous sky currents.
- **Matisse:** drag five pairs of hand points to connect a dancing circle.
- **Monet:** place lilies and directly drag the sun to change a reflective animated pond.
- **Warhol:** play an illustrated soup-can slot machine with five different varieties, holdable and nudgable reels and a repeated pop-art jackpot grid.
- **Oppenheim:** apply eight procedurally illustrated textures to cup, saucer and spoon, then identify an emotional reaction.
- **Tinguely:** connect five machine components and physically turn a wheel to trigger a fishing-rod / paint-can chain reaction.
- **Brancusi:** stretch and reshape a cherry-wood sculptural form using four SVG handles and hear an optional original synthesized response. Headphones are encouraged.
- **Lamelas:** compare three animated communication channels (newspaper, radio, television) carrying the same fictional museum message and reflect on how each medium changes its reach.

Each activity has localized English, French and Spanish text, Mica educational feedback, reduced-motion safeguards and non-drag interaction alternatives. These are original artistic interpretations, not faithful physical simulations or licensed museum reproductions.

## v2.5 Mica's progressive visual clue reveal

Each artwork, in **all three museum collections and languages**, now begins with an educational **word-only clue from Mica**. Visitors can look for the artwork immediately without seeing its image. An optional **“Ask Mica to reveal a zoomed-in detail”** button plays a short original CSS character-and-stardust reveal animation, then shows a **3.2× magnified, tightly clipped crop** from the real collection image. The same written clue appears beneath the close-up. The full museum photograph remains hidden until the visitor's own photo scan succeeds or they explicitly request a comparison fallback.

The state of the optional image clue is remembered per artwork, regardless of language or museum switching; it can be hidden again. No camera, museum location or copyrighted artwork image is uploaded by this reveal. All reveal controls are keyboard accessible, labeled for assistive technologies and honor reduced-motion settings. Focal crop positions are editorial defaults subject to institution review; they should be fine-tuned per artwork before a museum deployment.

## v2.5 mystery-first photograph flow

TRACE now keeps the artwork image **hidden during the discovery clue and the photograph screen**, preserving the fun of finding the artwork from Mica's hints without seeing the solution. Optional family games also use original illustration rather than revealing a reference photograph. The discovery passport displays a concealed mystery tile until the work has been found.

- **Calibrated works:** the visitor photographs or uploads their own image. Local matching runs against the enabled collection without displaying its reference. A confident match unlocks the artwork. If matching fails or the camera cannot be used, a clearly labeled visual-comparison fallback reveals the museum image only when the visitor deliberately chooses it.
- **Uncalibrated sculpture, mixed media and newer MoMA works:** the primary route is "Photograph my guess." The first screen shows only the visitor's own picture (if provided). Once a picture exists, a **separate "Reveal match to check my photo"** action displays the museum reference alongside the visitor picture for honest self-confirmation. If photography is unavailable or prohibited, a prominent fallback **"Camera not working? Compare without a photo"** permits visual-only comparison. Automatic recognition is never falsely claimed for these works.
- All screens remain switchable between English, French and Spanish; photo data stays local to the visitor's device. An official artwork record can still be opened by an intentional action in the fallback and demo test tools. Reproduction permissions and onsite exhibition verification remain separate institutional requirements.

## MoMA NYC third museum prototype

MoMA New York now joins the Montréal Museum of Fine Arts and Pérez Art Museum Miami as a separately administered institution. Visitors select the museum from the persistent header switcher, and each museum retains independent progress, hints, photos, routes and comparative-art connections.

**Eight MoMA artworks**: Van Gogh's *The Starry Night*, Matisse's *Dance (I)*, Monet's *Water Lilies*, Warhol's *Campbell's Soup Cans*, Meret Oppenheim's fur-covered *Object*, Tinguely's *Fragment from Homage to New York*, Brancusi's *The Cock*, and David Lamelas's *Analysis of the Elements by which the Massive Consumption of Information Takes Place*. Each has an original age-appropriate clue, art-history narrative, reference, quiz and unique interactive lab. The eight labs explore swirling brushwork, movement, reflections, repetition, tactile imagination, kinetic sculpture, abstract form and the language of mass media. All interpretive text, game controls and the complete five-scene Mica museum introduction are translated into English, French and Spanish.

The museum navigator links to the **official MoMA visitor guide and floor map**: https://www.moma.org/visit/guide/map . Gallery labels are staff-editable and derived from MoMA's published online collection at the prototype research date. **Every MoMA display confirmation is initially false**: collection-website "On view" descriptions are not museum staff confirmation. Room-to-room walking edges are unset until a museum administrator approves them; therefore no step-by-step directions are fabricated. An authenticated administrator can modify on-view state, room, availability windows and galleries, and publish a single manifest covering all three museums.

MoMA's official introductory museum history can be reviewed at https://www.moma.org/about/ and https://www.moma.org/visit . TRACE is independent and unaffiliated with these museums. Artwork photography copyright has **not** been licensed; collection images in the prototype are attributed to original sources and must be cleared before formal institutional use. All MoMA works use the visitor-confirmed one-photo-or-no-photo visual comparison mode. No automatic 3D or image recognition is claimed for these newly added references.

## Whole-app language switching (English, French, Spanish)

The always-visible **EN / FR / ES** control works on every visitor and administrator screen, including **before administrator sign-in**. Language preference persists in the browser while visitors move between MMFA and PAMM. Switching language re-renders the current chapter, map, game or editor without resetting the visitor's discoveries or unpublished administrator draft.

TRACE v2.1 includes offline editorial translations for the artwork clues, gallery stories, interpretation questions and answer choices for all 16 works, plus animated welcome scripts, family activities, ten art-making labs, their controls and feedback, artwork-connection puzzles and stories, the private passport, camera and manual matching, map and route planning, curator editing, publishing instructions and administrator sign-in. The static app does not send visitor content to online translation APIs.

Artwork and artist names as officially recorded in museum catalogues, room IDs, source URLs and data identifiers retain their original names. These should not be machine-translated. Device text-to-speech narration is optional and uses the chosen language if that voice is available. Regional accessibility and editorial review are still advisable before a museum-run launch.

## Animated Mica museum welcomes (English, French, Spanish)

Visitors select **EN / FR / ES** when entering either museum, then meet an animated Mica. Five short, skippable captioned scenes introduce the institution's real history, the building, what to look for, how to use the quest and the museum MAP, and respectful visitor behavior (do not touch artworks, keep voices low, respect photo rules and other visitors). The experience has **Next / Back / Skip**, optional autoplay, optional device text-to-speech on explicit request, reduced-motion support, and **Replay Mica's welcome** from the adventure map. Switching museums opens a museum-specific introduction; returning visitors retain their own progress. Language choices persist, and the welcome/cube activity are provided in all three languages. Other legacy adventure surfaces are not yet fully translated.

Historical facts were checked against the institutions' published history and building pages:
* MMFA: https://www.mbam.qc.ca/en/the-museum/about-the-museum/ and https://www.mbam.qc.ca/en/the-museum/museum-complex/
* PAMM: https://www.pamm.org/en/about/ and https://www.pamm.org/en/about-the-building/

The introduction uses original CSS/SVG drawings of Mica and a simplified facade, not official architectural images. It is an independent demonstration, not an authorized museum tour or official visitor instruction.

## Improved Chaos SAS activity

Instead of tapping repetitive tilt buttons, visitors manipulate three open-cube forms inspired by Jedd Novatt's sculpture. They can **drag the middle/top frames sideways**, use keyboard-friendly movement buttons and turn the selected frame with a slider. The live **wobble meter** reacts to changes; visitors finish by changing two cubes, turning at least one and retaining balance. The visual is a playful simplification, not a structural physics simulation or exact sculpture reproduction.

## Visitor experience

Choose Montréal or Miami from the always-visible museum switcher. Play the branching art adventure with Mica, including original tactile puzzles, optional family challenges, cross-artwork comparisons and a private discovery passport. Three established image-tested works per institution are enabled in the default office demo. The ten additional works now have individual visual, stateful experiments rather than three-button descriptions. Ten additional sculpture/mixed-media candidates can be enabled after review; these use explicitly labelled visual confirmation, **not untested automatic 3D recognition**.

The fantasy quest world and the physical **MAP** screen are separate. The MAP screen now includes:

- The relevant museum's actual, externally hosted PDF floor plan, opened in TRACE with a direct PDF fallback link.
- Quick, full or custom visitor itineraries, selected from works the museum currently includes.
- Artist names, room assignments, pavilion/floor labels and completed-discovery indicators.
- Starting-point selection and a step-free preference. Stair connections are excluded when step-free is selected.
- Suggested order based on galleries if a route graph has not been entered. **No invented corridors or travel times.**
- Room-to-room step descriptions and nearest-neighbour ordering only when staff have entered the actual room connections.

### Floor-plan distinction

MMFA publishes pavilions, collection sections and levels, rather than all individual room numbers. PAMM publishes numbered galleries on Floors 1 and 2, plus elevators, stairs and visitor facilities. Museum staff still need to confirm each artwork's on-view status and exact placement; a floor plan alone cannot establish this. A PDF is **not** a verified navigation graph.

## Museum administrator preview

After signing in to the admin portal, open **MUSEUM** in the bottom navigation. At the top of **Manage works on display**, use the large **MMFA · Montréal** / **PAMM · Miami** buttons to switch institutions without leaving the editor. The active museum is highlighted. The small museum switcher in the header also works, and your unpublished edits for either museum stay in the same draft.

1. Mark a work in or out of the visitor route.
2. Confirm its on-display status, and assign a room from the official map's gallery list (or add a custom room).
3. Optionally set start/end dates so an artwork can automatically become available or unavailable for a specific exhibition period.
4. Under **Connect walkable rooms**, link actual adjacent rooms and designate each connection as corridor, elevator, outdoor passage or stairs. Only enter connections physically confirmed by staff.
5. Switch to the other museum to edit its independent artworks and rooms, then open **MAP** to preview how the visitor's route changes. Taking a work off the route automatically removes it from route choices without deleting discoveries from the visitor's passport.
6. Select **Publish changes for all visitors** to commit both museums' changes together to the shared GitHub catalogue. Alternatively, export a JSON backup. A visitor refresh will reflect the newly published catalogue.

**Important publication limitation:** The administrator interface is a **local draft editor** on a public GitHub Pages site, not a secure multi-device CMS. Changes affect only the current browser until the museum-approved JSON is committed to this GitHub repository and Pages redeploys. Museum-grade production requires account authentication, role permissions, audit logs, server-side publishing, versioned floor plans, and onsite route validation. Do not share the current public editing controls as secure administrative access.

## Tests

The GitHub Actions workflow [Validate TRACE eight-work routes and museum administration](.github/workflows/validate-v1.yml) runs browser tests covering the six original scanner-backed chapters, ten playable sculpture and mixed-media experiments with visible state changes, comparison bonus, on/off status, room assignments, route links and accessibility filters. These are simulated/browser checks, not a substitute for iPhone and onsite visitor studies.

## Rights and privacy

Use of collection artworks in the independent demo does not grant commercial reproduction rights. Confirm rights, display status, gallery access, and any security/privacy requirements directly with the museums before launch. Original visitor progress and selected itineraries remain in local browser storage. Commercial use will need a rights-cleared production version in a private repository.

© 2026 TRACE prototype contributors. All rights reserved. Artwork rights remain with their respective holders.
