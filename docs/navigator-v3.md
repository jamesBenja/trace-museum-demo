# TRACE museum navigator v3 | October 30, 2026

## Released improvements

The existing three-museum gallery navigator now distinguishes **research-only map connections** from **museum-approved routes**. It preserves the published artworks and administrator room assignments, adds intermediate galleries for MoMA, and presents a connected-gallery wayfinder in the visitor MAP screen.

### Research network loaded into the shared manifest

| Museum | Registered rooms | Research links | Provenance |
| --- | ---: | ---: | --- |
| MoMA | 25 | 14 | MoMA's publicly published 2026 Brancusi walk and gallery materials |
| PAMM | 26 | 3 | Official December 2025 museum floor plan |
| MMFA | 17 | 3 | Published pavilion and passage map |

Research data is retained as `status: "research"`. It is **not** automatically approved, and it must never generate definitive visitor directions. The visitor's Mica room finder can preview connected research routes while explicitly labelling them as unverified. If the map does not establish an entire path, visitors get floor/pavilion guidance and a link to the official plan, not invented turns or walking times.

### Routing

`trace-routing.js` uses a weighted shortest-path calculation over the room graph. Visitor directions include only open, approved links. Research previews are calculated separately with `route(from, to, true)`. Step-free mode removes stairs, including research-only stair edges. A link's cost is a relative routing weight, **not metres or minutes**.

The map UI keeps Quick 3, Full visit, and chosen-artwork modes, a selectable current room, and a step-free choice. Selecting an artwork highlights its room-finder message and, where a full connected path is supported, a sequence of gallery nodes.

### Administration

The administrator MUSEUM screen lists every proposed passage with its source link and provides **Approve link**, **Mark for review**, **Close / Reopen**, and **Remove** controls. Approved/closed state is saved to the usual local draft and reaches all visitors only after publication.

The manifest cleaner preserves `status`, `closed`, `cost`, `source`, `confidence` and `note` on route links. Connections are unique by unordered endpoints **plus travel type**, so stairs and elevator alternatives can coexist. Existing legacy staff-configured edges that lack a `status` field remain approved for backward compatibility.

### Limitations that must not be hidden

- This is **not** floor-plan image georeferencing or pixel-perfect turn-by-turn navigation.
- The network diagram is schematic and not to scale.
- Neither work placement nor temporary gallery access has been checked onsite.
- No precise walking distances, directions through unverified doors, or ETA are asserted.
- Accessible travel to PAMM's Sculpture Garden may require contacting PAMM Visitor Services.
- Staff should field-test all physical doorways, lift landings, temporary closures, and artwork positions before commercial museum deployment.

### Tests performed

- Source files parse as JavaScript.
- Graph test: research-only paths are excluded from approved directions but visible for labelled preview.
- Graph test: stair edges are excluded under step-free preference.
- Graph test: an approved parallel elevator path can be used in step-free mode.
- Manifest test: research status and confidence survive cleaning.
- Admin test: approve, close, and reopen operations persist in exported JSON, while leaving a parallel elevator link intact.
- Rendering test: all three visitor maps and corresponding curator review panels render from the shared published manifest without exceptions.

A browser regression test is included at `scripts/test_wayfinder.py`; GitHub Actions needs to include it in the workflow before it will run automatically.

## Official sources

- [PAMM 2025 gallery plan](https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf)
- [PAMM accessibility](https://www.pamm.org/en/accessibility/)
- [MMFA gallery and pavilion map](https://www.mbam.qc.ca/en/mmfa-museum-map/)
- [MoMA floor guide](https://www.moma.org/visit/guide/map)
- [MoMA Brancusi itinerary (19 Oct 2026)](https://www.moma.org/magazine/articles/1461)
