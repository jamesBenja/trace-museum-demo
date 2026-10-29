# TRACE v0.8 | Museum discovery adventures

**Live demo:** https://jamesbenja.github.io/trace-museum-demo/?v=8

**Artwork test sheet:** https://jamesbenja.github.io/trace-museum-demo/artwork-test-sheet.html?v=8

**90-second pitch walkthrough:** [PITCH_WALKTHROUGH.md](PITCH_WALKTHROUGH.md)

TRACE is an independent proof of concept for family-friendly art discovery, with sample adventures for the Montréal Museum of Fine Arts (MMFA) and Pérez Art Museum Miami (PAMM). This work has **not** been commissioned, approved or endorsed by either museum.

## Playable features

- Distinct three-chapter museum adventures, visual detail clues and an overarching mystery.
- Camera/photo-upload matching against six collection reference images (five are locally hosted). The experimental matcher performs on-device processing.
- Chapter-specific matching designed to avoid falsely labelling a photograph of one artwork as a different artwork. Uncertain photos stay **unverified**, with an explicit visitor-confirmation option.
- Museum **MAP** tab with the institutions' official floor-map links, collection-section guidance where available, and an unverified-room notice. The **Museum** preview can assign illustrative room labels locally; it does not publish verified floor locations.
- Animated artwork reveals, illustrated learning puzzles and progress unlocking.
- Collectible stamps, a private passport and a downloadable keepsake certificate. The certificate does **not** export copyrighted artwork or visitor photos.
- English, French and Spanish story previews and an opt-in browser speech narration control. Full localization and accessibility validation remain future work.
- A clearly labeled institutional **Museum** panel showing **illustrative** artwork selection and prospective pilot evaluation questions. It is a mockup, not an operational CMS or live analytics.

## How to present

1. Choose MMFA or PAMM on the opening screen and begin the adventure.
2. Find a clue, scan its artwork using your device camera or upload a photograph.
3. In an office, expand **Demo testing tools** to match the reference image, or display the [artwork test sheet](artwork-test-sheet.html) on a second screen.
4. Continue from recognition to animated reveal, story, puzzle, collectible reward and the next chapter.
5. Open **My Finds** for the passport, then **Museum** to discuss institutional value.

## Validation

The GitHub Actions workflow [Validate live TRACE recognition](.github/workflows/validate-scanner.yml) executes a real Chromium browser test against the public HTTPS website. Tests cover both museum quests through all three artworks, visual puzzles, simulated phone-like image matching, downloadable passports, localized opening screens and sample institutional dashboard interactions.

These automated tests do **not** establish reliable onsite recognition under museum lighting or on all iOS devices. Those need field testing.

## Rights, privacy and status

- Collection works have **not** been confirmed to be physically on view.
- Artwork/image rights differ by work; rights-holder clearance and museum agreements remain necessary before commercial operation.
- Actual artwork-to-room locations and display status are not known; room labels shown in the museum mockup are only illustrative. The official MMFA and PAMM floor maps do not establish that any featured artwork is currently displayed.
- The public prototype stores progress and optional photos in the visitor's own browser. It has no account system or cloud photo storage.
- Institutional analytics, consent workflows for minors, curatorial publishing tools, route availability and full localization are not implemented.
- The source code is visible because this demo is hosted from a public GitHub repository. The product's production code should move into a private repository.

© 2026 TRACE prototype contributors. All rights reserved. No open-source license is granted for this repository. Underlying artwork rights remain with their respective rights holders.
