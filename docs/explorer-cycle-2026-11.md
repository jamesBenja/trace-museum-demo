# TRACE Explorer cycle (November 2026): MMFA child-first rebuild

Branch: `claude/trace-next-dev-cycle-6rxu7u`. Not deployed: GitHub Pages serves `main`, and this branch must be reviewed before it is merged.

Benchmark: *a six-year-old can lead their parents through the MMFA using TRACE.*

---

## 1. Audit summary

**Architecture.** TRACE is a static single-page app with no build step: `index.html` plus layered `trace-*.js` and `trace-*.css` modules. Each newer layer patches what is rendered:

- `trace-v1.js`: the hub, clue, game and success screens.
- `index.html` `v7Render`: the reveal and story screens, the passport and the scanner.
- `trace-routing.js` / `trace-wayfinder.js`: one room graph plus the map UI.
- `trace-display.js`: the shared manifest (`display-status.json`), which controls whether a work is active or on view, its room, and room connections.

Recognition runs on the device: colour/layout descriptors plus geometric features, with multi-view references and on-site iPhone colour signatures.

**Baseline before this cycle (local, 20 browser suites).**

| Result | Cause |
|---|---|
| `test_moma_recognition`, `test_moma`, `test_oppenheim_materials` failed | **Environment only.** Museum image hosts were blocked by the sandbox network. All passed once access was allowed. |
| `test_sculpture_scanner` failed | **Real regression.** The newest Altmejd on-site view (#8) scored 0.985 against itself but was rejected, because Fortin's dark-city/bright-sky signature scored 0.815. That margin (0.17) was under the 0.18 sculpture rule. |
| `test_tablet` failed intermittently | **Test race.** A reference rebuild after the museum switch re-rendered the scan screen between a locator lookup and `evaluate()`. |
| `test_navigation`, `test_admin_maps` failed | **Stale.** They expect 16 works and 8 admin rows. They are not in CI and were left untouched. |

**Limitations observed.** The UI was text-heavy, with several equally weighted buttons per screen and adult framing ("Demo testing tools", status strings). Little Explorer content barely existed: only a single generic instruction line. The adventure map was described as "not the real floor plan", and the real map was a separate adult tool. Nothing guided the child from one work to the next in the same room. The Fortin "sunrise/sunset" game only moved a sun handle over a static picture.

---

## 2. Prioritised plan (as executed)

1. Protect recognition: fix the Altmejd regression, and add a robustness matrix covering distance, angle, lighting and blur, with wrong-work rejection.
2. Content architecture for three audience tiers, with Little Explorers fully authored (EN/FR/ES).
3. A child-first shell for the MMFA, built as an enhancement layer so that scanning, games, admin, the map data and the other museums are untouched.
4. Navigation: a treasure trail generated from the room graph, plus confidence-weighted routing.
5. Rebuild the Fortin light game.
6. Stage artwork expansion behind staff verification.
7. Regression suite and report.

---

## 3. What changed

### Recognition (`index.html`, `scripts/test_recognition_robustness.py`)

- **Near-identical ratio test.** A layout score of at least 0.95, with an error at least 8× smaller than the runner-up's and a margin of at least 0.14, is now accepted. No other work comes close to 0.95, so wrong-work rejection is unchanged. This fixes Altmejd view #8.
- **Lighting retry tried and removed.** A grey-world white-balance retry raised warm-light sculpture recall slightly. It also made a copper-toned Marrel photo match Fortin, which `test_gallery_phone_references` caught, so it was removed.
- **New robustness matrix.** It covers straight on, 70% and 50% distance, ±5° tilt with a keystone squeeze, dim, warm and bright light, and hand-shake blur. Each variant is checked against its own chapter and, in rotation, against every other active work. Results are in section 5.
- Live camera, existing-photo upload, sculpture self-confirmation and the honest visual-comparison fallback are unchanged. The new clue dock *moves* the original scan, map and hint buttons rather than duplicating them, and the manual-review fallback stays visible after a hint.

### Age-tier content (`trace-explorer-content.js`)

- **Tiers:** Little Explorers 5–7 (the default on a first visit), Art Detectives 8–12 (the existing chapter copy), and Curious Minds 13+ / adults (new art-historical depth). The tiers map onto the existing `prefs.age` values `5-7`, `8-12` and `teen`.
- **Per MMFA work, in EN/FR/ES:**
  - a Mica clue that points at a visible detail without naming the work;
  - a three-item I-spy observation checklist;
  - a body-based "Try this!" task;
  - a wow fact after discovery;
  - a playful question;
  - for Curious Minds, a deeper paragraph and a looking prompt.
- **Themes and links.** Works carry themes (animals, feelings, movement, light and dark, colour, hidden details, materials, imaginary worlds, bronze, art outside). Nine authored pair links let Mica refer back to an earlier discovery. For example, "Remember the Thinker? He rested his chin on his hand. This giant hides its whole face with hands!" Every other pair falls back to a shared-theme sentence.
- **Fact discipline.** Facts come only from the MMFA collection records, the archive notes in `display-status.json` or the existing reviewed interpretation. Anything that could not be verified is phrased as something for the child to check with their own eyes. For example, Frink's faces are posed as "happy, sad or calm?", not described as calm.

### Child-first shell (`trace-explorer.js`, `trace-explorer.css`), MMFA only

| Screen | Before | Now |
|---|---|---|
| Start | Language, venue, mode, age, long text | Mica, three picture tiers, family or solo, one ▶ button, read-aloud toggle; museum switching and disclaimers under "For grown-ups" |
| Hub | List of chapters + disclaimers | Mica line, treasure gems, **one "Next treasure" button**, a treasure trail grouped into stops (rooms; the outdoor works form one sculpture walk) with mystery and discovered markers, room-complete stars, a "last treasure found here" marker, and floor/passage/outdoor chips taken from the room graph |
| Clue | Many paragraphs and buttons | Treasure *n of N*, room chip, Mica speaking the tier clue, I-spy, body task, **three big tiles (📷 I found it · 🧭 Where is it? · 💡 Help)**, picture directions from the previous treasure |
| Reveal | Image + label | Confetti, Mica's wow fact, Mica's memory of an earlier discovery |
| Story | Long story | Little Explorers: wow + question, with the full story kept under "For grown-ups"; Curious Minds: depth paragraph; one big ▶ Play button |
| Success | Return to hub | "Another treasure is hiding in this same room!" or picture directions to the next room; room-complete badge; ▶ Next treasure (same room first, then gallery order) |
| My Finds | Text passport | Framed treasure shelf (discovered = artwork, mystery = card with its room); passport kept below |
| Map | Adult wayfinder | Treasure map at the top (same trail and directions) and an explicit statement that it does not know where the visitor is; full wayfinder below |

Touch targets are at least 44 px everywhere and 56–96 px for primary actions. Every Mica line has a 🔊 button. Narration uses on-device `speechSynthesis` with `en-CA`, `fr-CA` or `es-ES` voices, and auto-read is on by default for Little Explorers. Reduced motion is honoured. PAMM and MoMA keep their existing experience, as this cycle prioritises the MMFA.

### Navigation (`trace-routing.js`, explorer trail)

- **Confidence-weighted routing.** Research edges with low confidence add 2 to the route cost, and moderate ones add 0.5. Example: Bourgie L1 → outdoor sculptures previously used a provisional Stewart exit (low confidence). It now follows the passage, Desmarais and the main entrance (high or moderate confidence). No edges were added or invented.
- **Same-room progression.** `next()` now prefers an unfound work in the same room, then the curated gallery order (Rodin → Marrel → de Witte → Fortin → Altmejd → Frink), which avoids backtracking.
- **Optional location help** remains the existing outdoor-only, one-shot GPS distance. No live indoor positioning is shown or implied.

### Sunrise and sunset game: Fortin, "Paint the light over Hochelaga" (`trace-mmfa-games.js/.css`)

- **One continuous time-of-day value** drives:
  - a three-stop sky gradient through nine keyframes;
  - sun and moon arcs;
  - gradient-lit storm clouds;
  - a star field;
  - per-house colours lit by the sun (grey at night, warm at dusk);
  - the stone church;
  - building shadows whose length and direction follow the sun;
  - river reflections of the town;
  - a sun or moon glint on the water;
  - birds in daylight;
  - glowing windows and street lamps at night.
- **Live, framed interaction.** Attributes update live during the drag, with no re-render, inside a gilded frame. It feels like repainting the canvas.
- **Goal and alternatives.** The goal is to find all four moments (sunrise, midday, sunset, night). Moment buttons and arrow keys are the non-drag alternatives.
- **Mica's conclusion:** the houses never moved; only the light changed. It ties back to Fortin painting the dark town first and the glowing sky last.

---

## 4. Artwork expansion: verification gate (requirement 3)

The target is at least two works per stop. The current status against that target:

| Stop | Active, staff-verified works | Status |
|---|---|---|
| Pavilion for Peace, L1 | Rodin, *The Thinker* | **Needs one or more companions** |
| Pavilion for Peace, L3 | Marrel, de Witte | ✅ 2 |
| Bourgie, L1 | Fortin | **Needs one or more companions** |
| Outdoor sculpture walk (Bourgie front + Avenue du Musée) | Altmejd, Frink | ✅ 2 |

**Why nothing new was activated.** MMFA collection pages (`/en/works/{id}/`) give the title, artist, date, materials and image, but **not on-view status or location**. The museum's search runs client-side on Algolia. TRACE's rule, and this brief, is to verify that a work is on display before activating it. So no new work was activated.

**Staged candidate: Jim Dine, *Twin 6' Hearts*.** On-site iPhone colour signatures from the team's November visit already exist (`mmfa-hearts` in `trace-gallery-signatures.js`, two views), and EN/FR/ES Little Explorer content is written. **Before activating it, the following are required:**

1. The MMFA collection record URL and catalogue image (for the reveal and the reference view).
2. Staff confirmation of its current placement: outdoor location, side of Sherbrooke St., and the date.
3. A room in `display-status.json`. If it is in front of Desmarais, add an outdoor room such as `mmfa-desmarais-front` with an outdoor edge to `mmfa-entrance` (staff-approved).
4. At least three more reference views (front, ¾ left, ¾ right) at child height, by day and at dusk.
5. A catalogue entry in `index.html` (`mmfa` array) plus a game (or the generic observation activity).

**For each new companion work in Pavilion for Peace L1 and Bourgie L1, provide:**

1. The collection record URL.
2. Written staff confirmation of the room and floor, and that the work is on view now. Record the name, date and source in the work's `note`.
3. Two or more reference photos for a painting, or four or more angles for a sculpture, taken on-site in gallery lighting.
4. Reproduction and rights status.

Content can then be written in the established format in about 30 minutes per work. Child-appeal criteria for choosing companions are animals, faces and feelings, strong light/dark contrast, hidden details, and unusual materials.

**Riopelle and Cragg stay inactive,** with content kept ready. The Riopelle note records that on 2026-11-26 the work could not be located on-site, and Cragg is in storage.

---

## 5. Test results (local Chromium, this branch)

| Suite | Result |
|---|---|
| See the final run in the PR / session report | — |

---

## 6. Outstanding issues

- **Sculpture tilt and warm-light recall.** Sculptures reach 80% in the synthetic matrix: 13–14 of 18 on tilt and 11 of 18 in warm light. The real fix is more on-site reference angles. A flat matcher is not a 3D scanner, and the README says so.
- **MMFA route data is still all "research" edges,** with no staff-approved connections. The kid trail labels these as "suggested route from the museum map". Staff should approve or correct the Level 1 Desmarais → Peace passage, the S2 passage endpoints and the elevator stops.
- **Bourgie L1 exits are unknown.** If Bourgie has a usable public exit toward Avenue du Musée, the Fortin → Altmejd leg would shrink dramatically. Ask the MMFA.
- **Rodin's floor** is confirmed by an on-site visitor (2026-11-26, first room on the left) but has not yet been re-confirmed by the archives.
- **Little Explorer copy** has not been reviewed by a museum educator, and FR/ES need a native-speaker pass.
- **Narration** depends on the voices installed on the device. iOS has good `fr-CA` and `en-CA` voices. Speech needs a user gesture before the first utterance, and the tap that triggers each screen covers that.
- **`test_mmfa_rebuild` Marrel sweep** is intermittently flaky in headless Chromium (pointer moves are dropped after capture, as the test itself already notes).
- **`test_navigation` and `test_admin_maps`** are stale (not in CI) and should be updated or retired.

---

## 7. Recommendations for the next physical museum test

1. Hand the iPad or phone to the child on the **start screen**, with **Little Explorers** selected and read-aloud on. Use one child earbud or low volume, as galleries are quiet spaces.
2. Observe without helping. Note every moment the child looks up at a parent for help, which screen it was, and why.
3. Route: Rodin → Floor 3 (Marrel, de Witte) → Bourgie L1 (Fortin) → outside (Altmejd, Frink). Time each leg, and record whether the picture directions were enough at every floor change and passage.
4. For each work, record:
   - whether the I-spy checklist made the child look at the work;
   - whether the body challenge happened;
   - whether the child answered Mica's question aloud;
   - which recognition method was used (live camera, upload or visual confirmation);
   - how many attempts it took.
5. **Capture reference photos** (artwork only, no people) for Rodin and the Eye from three or more more angles at child height, and for Twin 6' Hearts.
6. Ask staff to confirm the connections listed in section 6, and to propose companion works for Peace L1 and Bourgie L1.
7. Try the Fortin game before and after seeing the painting: does the child connect "dark town first, glowing sky last" to the real work?
