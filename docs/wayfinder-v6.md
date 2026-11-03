# TRACE Wayfinder v6: routes from the museum map

## Visitor contract
The visitor chooses a **Mystery Work N**, sees its pavilion and floor, and gets a visual suggested path and concise directions from their selected starting point. The artwork title stays hidden until it is discovered, at which point its actual title replaces the mystery label. Curator deactivation removes the work from all new visitor routes but does not erase previous discoveries.

## One graph, two provenance levels
`display-status.json` owns the artwork locations, room names, active status and connections. Edges have `status: "approved"` or `status: "research"`, plus their source, confidence and closure state.

`trace-routing.js` implements one shortest-path engine. Calling `route(start,end,false)` checks approved edges; calling `route(start,end,true)` also uses map-derived research links. The visitor renderer uses **approved first, map-derived when needed**. `stepFree` excludes all stair edges at both confidence levels. Closed connections are always excluded. Do not make a second navigation database or graph inside the renderer.

Map-derived routes are **shown**, not suppressed. "Suggested route" identifies that the geometry and some individual doors/landings are inferred from the official map; the steps may indicate the correct pavilion, floor, elevator/stairs and map-marked passages without claiming measured walking times, exact doorway positions or live indoor GPS precision.

## MMFA map evidence
Official map: https://www.mbam.qc.ca/en/mmfa-museum-map/

- Jean-Noël Desmarais main entrance: Level 1 on Sherbrooke St. West.
- Level 1 passage from Desmarais to the Pavilion for Peace.
- S2 underground passage toward Bourgie.
- Bourgie art levels include S2, S1, 1, 2, 3, 4.
- Avenue du Musée has outdoor sculpture locations; the map identifies its relationship to Bourgie and the main museum.
- **No direct Bourgie Level 1 gallery-to-sculpture-garden visitor door is indicated.** That former shortcut is closed in the graph, rather than telling visitors to use an imagined door.
- MMFA Archives verified seven active TRACE works on 2026-11-03. Tony Cragg is in storage. Rodin's pavilion is confirmed but his exact floor is not; a route to the Pavilion for Peace can be shown without inventing his floor.

## Visual guide
`trace-wayfinder.js` draws an abstract path over the colored pavilion illustration, with start and end markers. A summarized step list tells the visitor to use the Level 1 passage, S2 underground passage, elevators/stairs or Avenue du Musée as indicated by the graph. Nearby repeated vertical edges are combined into one "take elevator to [floor]" step. Changes to access preference rerun the same graph. Actual architectural floor geometry will be a future enhancement, not a prerequisite to giving useful directions now.

## Privacy and access
The start room is chosen manually. One-shot geolocation is optional and estimates distance to museum outdoors only. GPS coordinates are neither saved nor sent to TRACE, and they never select a visitor's indoor room. User state is browser-local; admin status/room/route publication is shared.

## Verification
`scripts/test_wayfinder_v6.py` verifies main entrance to the Pavilion for Peace and Bourgie, S2 passages, elevators and stairs with accessible-mode switching, outdoor sculptures, mystery naming and discovered work titles, Rodin's unknown floor, cross-museum routing, GPS privacy and admin controls. The full validation workflow runs this alongside MMFA/PAMM/MoMA gameplay and connected publishing.
