# TRACE Wayfinder v4

## One purpose
Help a visitor choose an artwork and reach its gallery. The visitor map contains only **From**, **Find**, a pannable schematic, a destination/route, and a short stop list. The official museum plan remains one tap away.

## Source of truth
- `display-status.json`: shared room registry, artwork assignments, active/on-display status, and research/approved walking connections.
- `trace-display.js`: manifest load, curator draft, publication, and active-work filtering. No visitor map-specific copy of this data.
- `trace-routing.js`: unchanged shortest-path logic, accessible stair filtering, and curator link approval/closures. Exposes `route(from, to, preview)`, `plannedOrder()`, `saveRoute()`, and `state`.
- `trace-wayfinder.js` and `trace-wayfinder.css`: one visitor presentation, translation strings, schematic zone/floor placement, and optional one-shot geolocation. No framework, build pipeline, or location service subscription.

## Routing integrity
- **Approved/open edges**: usable route. Never assume other corridor links are real.
- **Research/open edges**: dashed preview, explicitly unverified. These do not become live directions until curator approval.
- **No path / unconfirmed floor**: show the confirmed pavilion/floor if known, never invent a corridor or instruction.
- **Inactive works**: excluded from the visitor map. Completed prior discoveries persist elsewhere in TRACE.
- **Accessibility**: stair avoidance is on by default, reuses the existing route solver, and persists locally per museum.
- **Schematic geometry**: generated from pavilion/floor metadata only. This diagram does not claim actual distances, corridor geometry, or a surveyed floor plan.

## Optional location
A visitor must tap the location control to invoke `navigator.geolocation.getCurrentPosition`. The temporary coordinates are compared locally to the museum's public OpenStreetMap location to provide outdoor proximity, **never** room-level positioning. Latitude and longitude are not saved, transmitted to TRACE, or included in the Google Maps link. The museum entrance directions link lets the user's navigation app request its own permission. Inside, visitors explicitly choose their current room. Do not silently begin continuous tracking or imply indoor GPS accuracy.

## Maintenance
To move an artwork, update its `room` in `display-status.json` (or publish a curator draft). Add new room IDs in that same manifest when necessary. To define an actual route, update the relevant `connections` entry with an evidence-backed status. Do **not** hardcode artworks, display status, or route connections in the renderer.

## Regression
Run `node --check trace-wayfinder.js` and `python scripts/test_wayfinder_v4.py` against the local Pages-compatible server. The validation workflow runs this test along with the three-museum gameplay and admin suites. Check in the visitor map at 390px and desktop widths, in EN/FR/ES, after changes to museum displays or route graph logic.
