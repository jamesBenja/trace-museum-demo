# TRACE Wayfinder v5

## Visitor purpose
Find the pavilion, floor and artwork from a single destination. All map copy must be purposeful. A visitor should never need to learn a room-graph data model, configure a multi-stop visit or interpret research edges before locating one artwork.

## Screens
- **MMFA**: tappable, original simplified pavilion diagram informed by the museum's official pavilion map. The five pavilions preserve their relative arrangement and distinctive colors; the diagram is not a to-scale floor plan or a validated walking path. Selecting a building chooses one of the active mysteries inside it. The next section shows only relevant floors and works.
- **PAMM/MoMA**: floor overview instead of a fabricated pavilion layout. Floor detail and artwork destination use the same shared rendering code.
- **Start**: optional current gallery selector, defaulting to the museum entrance. Outdoor geolocation is opt-in, one-shot, not stored and never used to claim room-level accuracy.
- **Visit planning**: collapsed by default. Existing Three/All/Choose modes and local itinerary persistence remain available but never compete with the primary destination.

## Integrity contract
- `display-status.json` alone publishes per-work activation, room assignment, display verification and graph connections for all visitors. An artwork off display must not appear as a map destination. Progress remains saved separately.
- `trace-routing.js` retains the routing engine, curator-approved edge status, step-free filter, room/connection admin editor and date checks. It offers `route(start,destination,false)` for approved/accessible directions only.
- **Never draw invented dotted paths or walking lines.** The legacy research graph may be inspected by curators but is not visitor guidance. If no approved path exists, show pavilion/floor plus a direct link to the official museum map.
- `trace-wayfinder.js` renders the visitor map, minimalist floor/destination picker, private GPS proximity and trilingual labels. `trace-wayfinder.css` styles these; no external map SDK, key, tracking, dependencies or build system.
- `index.html` loads the versioned CSS and JS after the routing module. A cache-version bump is required for public updates.

## Changes to museum locations
Change the artwork's `room` value or active/verified status in the shared manifest, add the room in `rooms[museum]` if required, and publish. The map recalculates floors and work counts automatically; do not hardcode artworks in the layout. For brand-new MMFA buildings, update the pavilion layout deliberately. If a route edge is only inferred from the published diagram, keep it `status: "research"`.

## Known limitations
MMFA pavilion shapes are an **orientation illustration**, not an exact architectural floor plan. Rodin's floor is currently unconfirmed. The outdoor sculptures are situated by area only. Indoor navigation beyond pavilion/floor needs museum-authorized measured geometry, on-site verified entrances and connections, and ideally room-position anchor points/QR codes. Standard GPS alone cannot solve indoor positioning.

## Quality gate
`python scripts/test_wayfinder_v5.py` is part of the main GitHub Actions validation workflow. It checks a 390px phone layout, seven active MMFA works, no off-display Cragg route, accurate pavilion/floor destinations, no fabricated corridors, visit planner, location privacy, step-free preference, EN/FR/ES, all three museums and the unchanged admin editor. Re-run the complete gameplay/portal regression before release.
