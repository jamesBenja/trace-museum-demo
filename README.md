# TRACE v1.0 | A museum you can play

**Live mobile demo:** https://jamesbenja.github.io/trace-museum-demo/?v=10

**Artwork test sheet:** https://jamesbenja.github.io/trace-museum-demo/artwork-test-sheet.html

**Institutional pitch notes:** [PITCH_WALKTHROUGH.md](PITCH_WALKTHROUGH.md)

TRACE is an independent, experimental visitor discovery experience with three sample collection artworks from the Montréal Museum of Fine Arts and three from the Pérez Art Museum Miami. Neither museum has endorsed, commissioned or approved the prototype.

## Visitor experience

1. Select Montréal (The Lost Colours) or Miami (The Hidden Signals).
2. Choose Family Team or Solo Explorer. There are optional 5–7, 8–12 and teen guidance settings. *Only the introductory guidance changes by age today; separate age-calibrated gameplay remains to be developed.*
3. Meet **Mica**, an original animated paint-spark companion. Choose between the first two open mysteries on the **fantasy adventure map**. Completing either unlocks the third.
4. Search for the matching artwork; scan it via camera or upload, or use the clearly labelled Demo testing tools for a reference-image test.
5. After recognition or visibly labelled visitor confirmation, enjoy the animated reveal and artist story, then complete a hands-on game:

   - **MMFA, Jacob Marrel:** Rub a simulated painting surface to reveal a copper-toned ground.
   - **MMFA, Emanuel de Witte:** Move a vanishing-point marker to create the illusion of perspective.
   - **MMFA, Marc-Aurèle Fortin:** Adjust light contrast between a dark landscape and bright sky.
   - **PAMM, Joaquín Torres-García, Two Masks:** Build a simple symbol code in sequence.
   - **PAMM, Jack Delano:** Move a viewfinder and identify what connects the buildings.
   - **PAMM, Joaquín Torres-García, Construction (graphite):** Compose an original three-symbol alphabet.

6. Collect the artistic power and choose a new mystery. A bonus observation prompt unlocks after two finds. Progress, optional photos and the art-passport certificate remain local to the browser.

The fantasy adventure map is **not** a factual museum floor plan. The separate **MAP** navigation tab links to official museum wayfinding, with exact artwork rooms explicitly marked unverified. Works in these collections may not currently be exhibited.

## Family and accessibility

Family Team gives optional Spotter and Storyteller prompts so visitors share observations instead of all looking at one phone. The guided puzzle alternative prevents a difficult drag or gesture from blocking progress. No player names, accounts, location tracking or photo uploads to TRACE servers are used in this prototype. The experience is designed to be usable without audio. Full accessibility and multilingual reviews are still needed; newer game controls are English-only for now.

## Museum-facing demonstration

The **MUSEUM** tab shows illustrative artwork inclusion toggles, sample room assignments and pilot-evaluation topics. It is **not** an operational curator CMS, room database or analytics system.

## Testing

- `.github/workflows/validate-v1.yml` launches the exact committed static website locally and uses Chromium to test both branching three-artwork adventures, six different puzzles, family roles, camera-reference matching, replay and the downloadable passport.
- `.github/workflows/validate-scanner.yml` is the original scanner check and is retained as a legacy test. It may not reflect v1's branching visitor UI.
- Automated phone-like image simulations are not substitutes for camera testing on actual phones inside galleries.

## Rights and business precautions

Artwork imagery is credited in the experience, but institutional commercial-image and gallery access permissions remain pending. The MMFA and PAMM artworks are used only for an independent pitch demonstration. The current repository is **public**; proprietary production development should migrate to a private repository and be deployed separately. No open-source licence is granted for this demo's code.

© 2026 TRACE prototype contributors. All rights reserved. External artwork copyrights remain with their respective owners.
