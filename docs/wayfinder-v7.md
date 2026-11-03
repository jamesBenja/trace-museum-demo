# TRACE Wayfinder v7: MoMA and PAMM

## Visitor contract

TRACE shows only currently active artworks. Unsolved pieces are labeled **Mystery Work N**. After discovery, the actual artwork title replaces the mystery label in the map, route card and itinerary. One selected destination, current starting gallery and a visual floor plan are the primary controls. Optional multi-stop planning is collapsed by default.

## Sources of truth

- `display-status.json`: shared visitor-active flag, on-view verification, per-artwork assigned room, room catalogue, graph edges, closures, source and confidence notes.
- `trace-routing.js`: existing single graph that prefers curator-approved connections and uses research/map-derived connections for suggested routes; respects stair avoidance and closure status.
- `trace-wayfinder.js`: only visitor-facing map presentation. Contains *approximate visual positions* of real published gallery labels (`INDOOR`) and the simplified MMFA pavilion diagram, but **does not** store independent artwork assignments or walkability edges.
- `trace-wayfinder.css`: visual style and phone/desktop sizing.
- `scripts/test_wayfinder_v7.py`: browser-level visitor, privacy and admin integration coverage.

## Museum-specific evidence and configuration

### MoMA
Official current artwork records: https://www.moma.org/collection and numbered visitor floor plans: https://www.moma.org/visit/guide/map . The 2025 Kids Guide also illustrates Gallery 4/5 locations.

On November 3, 2026, seven selected TRACE works were publicly listed as on view:

- The Starry Night 501 (Floor 5)
- Dance (I) 506 (Floor 5)
- Campbell's Soup Cans 412 (Floor 4)
- Object 517 (Floor 5)
- Fragment from Homage to New York 405 (Floor 4)
- The Cock Floor 6 (no exact numbered gallery given)
- Analysis of the Elements by which the Massive Consumption of Information Takes Place 414 (Floor 4)

The eighth authored piece, *Water Lilies*, was listed as **Not on view**, so its active flag was set false. Historical Gallery 515 is kept only for later reactivation after re-verification. The game and previous visitor discoveries are not deleted.

The MoMA map provides selectable Floors 1, 4, 5 and 6, numbered destination pins, and suggested routes through an approximate visitor-circulation graph. Paths are drawn between conceptual nodes on the matching floor; they are not claimed as surveyed physical door geometry.

### PAMM
Official room-numbered public floor plans: https://www.pamm.org/wp-content/uploads/2025/02/PAMM-Digital-Map-2025.pdf .

The actual current published map includes numbered rooms 1–8 on Floor 1 and 1–17 on Floor 2 (with other numbered service/visitor spaces). TRACE's older Floor 2 demo Gallery 20–34 locations were **not valid** public room IDs and were removed from navigation.

The seven selected indoor collection pieces still **lack current gallery/display confirmation**. Their records point to `pamm-gallery-unconfirmed` and display a succinct “Gallery location pending.” Do not silently guess locations, and do not change `onViewVerified` to true without new evidence.

*Chaos SAS* is documented by PAMM as a large **outdoor** sculpture; its location is currently associated with the outdoor Sculpture Garden area `pamm-18` for navigation, with no claim of independently verified exact placement or that the work is presently on public display.

A request for exact current display/room assignments was emailed to PAMM on November 3, 2026. After museum response, update **only** the shared work records and enable confirmed status. Existing Floor 1, Floor 2 and outdoor map pins will automatically reflect the assignment. Do not make new hardcoded, work-specific room data in the view.

### MMFA
Previous v6 routing preserved. See `docs/wayfinder-v6.md`.

## Route integrity

The graph carries museum-map-derived research edges and curator-approved edges. An unverified **suggested route** can still provide a usable pavilion/floor sequence. Closed routes are excluded, and stair avoidance removes stair edges. Do not invent precision: no indoor real-time GPS, measured walking time or guaranteed single-door link unless genuinely supplied.

When a museum has not given the active artwork's gallery, do not claim a real gallery route. This state is separate from *having a graph route*; a valid path to a fictional assignment is still false guidance.

## Tests and maintenance

Main GitHub Actions workflow runs the dedicated wayfinder v7 browser test, MoMA scan reference tests, all eight authored MoMA/PAMM/MMFA game tests (with test-only activation for deliberately off-view works), and the shared portal/admin publication tests. Keep off-view artwork **inactive in the real published catalogue** regardless of unit-test fixtures.

When updating a `.js` or `.css` asset, increment the referenced `?v=N` query version in `index.html` to avoid stale cache on visitors' phones.
