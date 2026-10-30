# TRACE v2.3: Three-museum art adventures, including MoMA New York

**Live pilot:** https://jamesbenja.github.io/trace-museum-demo/?v=23

**Official MMFA map:** https://www.mbam.qc.ca/en/mmfa-museum-map/

**Official PAMM map:** https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf

**Institutional pitch walkthrough:** [PITCH_WALKTHROUGH.md](PITCH_WALKTHROUGH.md)

TRACE is an independent pilot concept with **eight real collection artworks from MMFA** and **eight from PAMM**, including paintings, photography, sculpture and mixed media. Neither museum has commissioned, endorsed or approved this app. A work belonging to a museum **does not imply that it is physically on view**.

## Recognition and accessible visual confirmation

For paintings and photographs with calibrated image references, the camera scan remains the primary matching method. After requesting a hint, **Compare visually with museum reference** becomes available for every artwork. The same option appears if an automatic scan fails or the camera is unavailable. Sculptures and newer works without validated reference images use **visitor self-confirmation** from the beginning. This is always labelled clearly and never presented as automatic verification.

On the visual comparison screen, visitors can **take or select one photo (optional)** and compare it alongside the museum's collection image. They may also visually confirm without taking a photo, including when museum photography is not permitted. Only explicit visitor confirmation advances the story. This is a visitor-assisted comparison, **not automatic recognition or a 3D scan**. Uploaded photos stay on the device and may be saved in the visitor's local discovery album once confirmed. A future multi-angle recognition feature would require curated reference photography and validation, not extra photo steps for visitors.

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
