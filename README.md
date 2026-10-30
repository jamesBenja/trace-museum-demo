# TRACE v1.6: Playable museum adventures with institutional routing

**Live pilot:** https://jamesbenja.github.io/trace-museum-demo/?v=16

**Official MMFA map:** https://www.mbam.qc.ca/en/mmfa-museum-map/

**Official PAMM map:** https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf

**Institutional pitch walkthrough:** [PITCH_WALKTHROUGH.md](PITCH_WALKTHROUGH.md)

TRACE is an independent pilot concept with **eight real collection artworks from MMFA** and **eight from PAMM**, including paintings, photography, sculpture and mixed media. Neither museum has commissioned, endorsed or approved this app. A work belonging to a museum **does not imply that it is physically on view**.

## Visitor experience

Choose Montréal or Miami from the always-visible museum switcher. Play the branching art adventure with Mica, including original tactile puzzles, optional family challenges, cross-artwork comparisons and a private discovery passport. Three established image-tested works per institution are enabled in the default office demo. Ten additional sculpture/mixed-media candidates can be enabled after review; these use explicitly labelled visual confirmation, **not untested automatic 3D recognition**.

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

Tap **MUSEUM** in the bottom navigation. Use the museum switcher to choose which institution you are editing.

1. Mark a work in or out of the visitor route.
2. Confirm its on-display status, and assign a room from the official map's gallery list (or add a custom room).
3. Optionally set start/end dates so an artwork can automatically become available or unavailable for a specific exhibition period.
4. Under **Connect walkable rooms**, link actual adjacent rooms and designate each connection as corridor, elevator, outdoor passage or stairs. Only enter connections physically confirmed by staff.
5. Open **MAP** to preview how the visitor's route changes. Taking a work off the route automatically removes it from route choices without deleting discoveries from the visitor's passport.
6. Export or copy the generated **display-status.json** configuration for publication.

**Important publication limitation:** The administrator interface is a **local draft editor** on a public GitHub Pages site, not a secure multi-device CMS. Changes affect only the current browser until the museum-approved JSON is committed to this GitHub repository and Pages redeploys. Museum-grade production requires account authentication, role permissions, audit logs, server-side publishing, versioned floor plans, and onsite route validation. Do not share the current public editing controls as secure administrative access.

## Tests

The GitHub Actions workflow [Validate TRACE eight-work routes and museum administration](.github/workflows/validate-v1.yml) runs browser tests covering the six original scanner-backed chapters, new sculpture and mixed-media preview activities, comparison bonus, on/off status, room assignments, route links and accessibility filters. These are simulated/browser checks, not a substitute for iPhone and onsite visitor studies.

## Rights and privacy

Use of collection artworks in the independent demo does not grant commercial reproduction rights. Confirm rights, display status, gallery access, and any security/privacy requirements directly with the museums before launch. Original visitor progress and selected itineraries remain in local browser storage. Commercial use will need a rights-cleared production version in a private repository.

© 2026 TRACE prototype contributors. All rights reserved. Artwork rights remain with their respective holders.
