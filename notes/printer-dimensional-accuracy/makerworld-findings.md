# MakerWorld print profile research, 2026-08-30

## Samples

1. **Public metadata.** 318 established models seeded from search pages
   (gridfinity, bracket, tool holder, hinge, vase, organizer, fidget, phone
   stand) via `/api/v1/design-service/design/{id}`. 1,614 profiles, 178,884
   ratings. Public fields: layerHeight, wallLoops, sparseInfillDensity, rating
   total and count, downloads, prints, filament, AMS flag, nozzle.
2. **Full slicer settings.** 100 profiles with 20 or more ratings, ranked by
   star average, downloaded as 3mf through `/api/v1/design-service/instance/
   {id}/f3mf` while logged in, then `Metadata/project_settings.config` parsed.
   Stars 3.92 to 5.00. Between 338 and 570 keys per profile.

Rate limiting: a burst of downloads trips a captcha on the f3mf endpoint. One
download every 3 seconds ran 94 profiles without tripping it again.

## Rating channel

- Mean 4.82 stars, ratings-weighted 4.84. 92% of rated profiles at 4.5 or
  above, 388 at exactly 5.00, 25 below 4.0 in the whole sample.
- New models carry no signal at all: median 1 rating, 178 of 204 rated profiles
  at exactly 5.00.
- Profiles sort Class A (designer) > Class B (MakerWorld official) > Class C
  (other users), and rating only sorts within a class. In models with two or
  more rated profiles, **71% have a better rated profile below the top one**.
  Mean gap 0.10 stars, worst 0.39.
- Ratings barely separate settings. By layer height: 0.24 -> 4.85, 0.20 ->
  4.84, 0.16 -> 4.81, 0.12 -> 4.67, 0.08 -> 4.43. Stock combination (0.2 / 2
  walls / 15%) averages 4.843 against 4.818 for everything else.

## What the top rated 100 actually set

Base preset: 70 of 100 are 0.20mm Standard, 10 are 0.20mm Strength, 6 Gyroid,
4 0.24mm Draft, the rest scattered. Only one profile carries a custom preset
name.

| Setting | Value in the 100 | Bambu stock |
|---|---|---|
| Layer height | 0.2 in 82 | 0.2 |
| Initial layer height | 0.2 in 99 | 0.2 |
| Wall loops | 2 in 67, 3 in 15 | 2 |
| Infill | 15% in 51, 10% in 12, 20% in 10 | 15% |
| Infill pattern | grid 44, gyroid 38 | grid |
| Wall generator | classic 88, arachne 12 | classic |
| Seam position | aligned 89, back 10 | aligned |
| Ironing | off in 98 | off |
| Outer wall speed | 200 in 79, 60 in 12 | 200 Standard, 60 Strength |
| Supports | off in 87 | off |
| Support style | default 97, snug 2, tree slim 1 | default |
| Support top Z | 0.2 in 94 | 0.2 |
| Elephant foot | 0.15 in 65, 0 in 20, 0.075 in 14, 0.26 in 1 | printer preset |
| X-Y hole compensation | **0 in 100** | 0 |
| X-Y contour compensation | **0 in 100** | 0 |

Reading: a top rated profile is a stock Bambu preset with layer height, wall
count and infill density touched, and nothing else. The 12 profiles at 60mm/s
outer wall did not choose that speed, they chose the Strength preset. One
profile in 100 edited elephant foot compensation away from its preset value.
None edited either dimensional compensation.

## For the post

The "what do the best profiles set" question has no answer worth publishing:
they set the defaults. The publishable finding is the mechanism, a rating that
nominally measures the profile, attached to a list sorted by author class
first, filled in by people who click 5 stars when the print survives. Hook:
the profile at the top of the list is the worse one 71% of the time.

## Rebuilding the data

- `makerworld-profile-scrape.js` collects public metadata from the console.
- `parse-3mf-settings.py` parses a folder of downloaded 3mf files.
- The 100 parsed rows remain in `localStorage.__cfg` on makerworld.com until
  cleared, and the public sample in `localStorage.__prof`.

## Flexi dragons, the tolerance-critical case

84 print-in-place dragon models (searches: flexi dragon, articulated dragon,
print in place dragon), 409 profiles, 79,578 ratings. The 30 most rated
profiles downloaded in full: 46,023 ratings between them, 4.73 to 4.94 stars.

| Setting | Dragons (30) |
|---|---|
| X-Y hole compensation | 0 in 30/30 |
| X-Y contour compensation | 0 in 30/30 |
| Precise Z height | off in 30/30 |
| Base preset | 0.20mm Standard in 29/30 |
| Layer height | 0.2 in 28/30 |
| Wall loops | 2 in 25, 3 in 5 |
| Elephant foot | preset value in 29/30 |
| Flow ratio | 0.98 stock in 28/30 |
| Seam | aligned 30/30, supports off 30/30 |

Only deltas: infill down to 10% or 5% for time and weight, and first layer
speed down to 20mm/s in two profiles.

Conclusion: articulated joint clearance lives in the mesh, roughly 0.3 to
0.4mm baked into the geometry, never in the slicer profile. The models whose
function depends most on fit are the ones least likely to touch a compensation,
because a profile that assumed a compensated printer would fail for most
downloaders. Every printer's own hole and wall error then lands on top of the
designed gap, uncorrected, which is why the same dragon prints fused for one
person and loose for another.
